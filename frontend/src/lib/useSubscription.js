"use client";

import { useUser, useSession } from "@descope/nextjs-sdk/client";
import { useState, useEffect, useCallback } from "react";

/**
 * Hook to check if user has Pro subscription.
 * Stores plan info in localStorage (activated after VNPay callback).
 * In production, this would check Descope user attributes or a database.
 */
export function useSubscription() {
  const { user } = useUser();
  const { isAuthenticated } = useSession();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = user?.userId;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setIsPro(false);
      setLoading(false);
      return;
    }

    // Check localStorage for subscription
    const stored = localStorage.getItem(`finsight_pro_${userId}`);
    if (stored) {
      const data = JSON.parse(stored);
      const isActive = new Date(data.expiry) > new Date();
      setIsPro(isActive);
      if (!isActive) {
        localStorage.removeItem(`finsight_pro_${userId}`);
      }
    }

    setLoading(false);
  }, [isAuthenticated, userId]);

  const activatePro = useCallback(() => {
    if (!userId) return;
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem(
      `finsight_pro_${userId}`,
      JSON.stringify({ plan: "pro", expiry, activatedAt: new Date().toISOString() })
    );
    setIsPro(true);
  }, [userId]);

  return { isPro, loading, activatePro, isAuthenticated };
}

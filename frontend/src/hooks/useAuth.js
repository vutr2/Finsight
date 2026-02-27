"use client";

import { useState, useEffect } from "react";
import { useSession, useUser, useDescope } from "@descope/nextjs-sdk/client";

export function useAuth() {
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();
  const [isPro, setIsPro] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    setIsProLoading(true);
    fetch(`/api/user/pro-status?userId=${user.userId}`)
      .then((r) => r.json())
      .then((data) => setIsPro(data.isPro ?? false))
      .catch(() => setIsPro(false))
      .finally(() => setIsProLoading(false));
  }, [user?.userId]);

  return {
    isAuthenticated,
    isLoading: isSessionLoading || isUserLoading || isProLoading,
    sessionToken,
    user,
    isPro,
    logout,
  };
}

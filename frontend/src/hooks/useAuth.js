"use client";

import { useSession, useUser, useDescope } from "@descope/nextjs-sdk/client";

export function useAuth() {
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  // isPro: true if user has 'pro' role OR customAttributes.plan === 'pro'
  const isPro =
    user?.roleNames?.includes('pro') ||
    user?.customAttributes?.plan === 'pro' ||
    false;

  return {
    isAuthenticated,
    isLoading: isSessionLoading || isUserLoading,
    sessionToken,
    user,
    isPro,
    logout,
  };
}

"use client";

import { useSession, useUser, useDescope } from "@descope/nextjs-sdk/client";

export function useAuth() {
  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  return {
    isAuthenticated,
    isLoading: isSessionLoading || isUserLoading,
    sessionToken,
    user,
    logout,
  };
}

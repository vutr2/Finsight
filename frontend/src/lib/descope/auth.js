import DescopeClient from "@descope/nextjs-sdk/server";

export const descopeClient = DescopeClient({
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
});

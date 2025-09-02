import { getCurrentUser } from "@/lib/auth";

interface UseCurrentUserReturn {
  authUser: any;
}

export async function getCurrentUserData(): Promise<UseCurrentUserReturn> {
  const authUser = await getCurrentUser();

  return {
    authUser,
  };
}

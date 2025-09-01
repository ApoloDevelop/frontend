import { getCurrentUser } from "@/lib/auth";
import { mockUser } from "@/mocks/mockSongstats";

interface UseCurrentUserReturn {
  authUser: any;
  mockUser: any;
}

export async function getCurrentUserData(): Promise<UseCurrentUserReturn> {
  const authUser = await getCurrentUser();
  const user = mockUser;

  return {
    authUser,
    mockUser: user,
  };
}

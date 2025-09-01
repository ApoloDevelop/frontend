import { getCurrentUser, TOKEN_COOKIE } from "@/lib/auth";

interface UseRatingAuthReturn {
  user: any;
  isVerifiedUser: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export async function getRatingAuth(): Promise<UseRatingAuthReturn> {
  const user = await getCurrentUser();
  const isVerifiedUser = !!user && Number(user.role_id) === 4;
  const isAuthenticated = !!user;

  let token: string | null = null;
  if (user) {
    const { cookies } = await import("next/headers");
    token = (await cookies()).get(TOKEN_COOKIE)?.value ?? null;
  }

  return {
    user,
    isVerifiedUser,
    isAuthenticated,
    token,
  };
}

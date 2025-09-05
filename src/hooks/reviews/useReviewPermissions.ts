import { getCurrentUser } from "@/lib/auth";

export async function useReviewPermissions() {
  const user = await getCurrentUser();

  const canRate = !!user;
  const canVote = !!user;
  const isVerifiedUser = user?.role_id === 4;

  return { user, canRate, canVote, isVerifiedUser };
}

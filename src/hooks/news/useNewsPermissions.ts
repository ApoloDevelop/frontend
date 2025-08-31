import { getCurrentUser } from "@/lib/auth";

export async function useNewsPermissions() {
  const user = await getCurrentUser();
  const canWrite = !!user && [1, 2, 3].includes(Number(user.role_id));

  return {
    user,
    canWrite,
  };
}

import { getCurrentUser } from "@/lib/auth";

export async function useArticleDetailPermissions() {
  const user = await getCurrentUser();

  const getEditPermissions = (authorId: number) => {
    const canEdit =
      !!user &&
      (user.role_id === 1 || // Admin
        user.role_id === 2 || // Editor
        (user.role_id === 3 && user.id === authorId)); // Writer (solo sus artículos)

    return {
      user,
      canEdit,
      isAdmin: user?.role_id === 1,
      isEditor: user?.role_id === 2,
      isAuthor: user?.id === authorId,
    };
  };

  return {
    getEditPermissions,
  };
}

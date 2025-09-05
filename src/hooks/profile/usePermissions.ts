import { ActivityPost } from "@/types/activity";

export function usePermissions() {
  // Función para verificar si el usuario actual puede borrar un post específico
  const canDeletePost = (
    post: ActivityPost,
    currentUser: { id: number; role_id: number; username: string } | null
  ): boolean => {
    if (!currentUser) return false;

    // El usuario puede borrar si:
    // 1. Es el autor del post
    // 2. Es admin (role_id = 1)
    // 3. Es moderador (role_id = 2)
    return (
      post.author.id === currentUser.id ||
      currentUser.role_id === 1 ||
      currentUser.role_id === 2
    );
  };

  return {
    canDeletePost,
  };
}

interface User {
  id: number;
  role_id: string | number;
}

interface UseModerationPermissionsProps {
  user: User | null;
  allowedRoles?: number[];
}

export function useModerationPermissions({
  user,
  allowedRoles = [1, 2],
}: UseModerationPermissionsProps) {
  const canModerate = !!user && allowedRoles.includes(Number(user.role_id));

  return {
    canModerate,
    isAuthenticated: !!user,
    userId: user?.id ?? null,
  };
}

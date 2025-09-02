interface User {
  id: number;
  role_id: string | number;
}

export function checkModerationPermissions(
  user: User | null,
  allowedRoles: number[] = [1, 2]
): {
  canModerate: boolean;
  isAuthenticated: boolean;
  userId: number | null;
} {
  const canModerate = !!user && allowedRoles.includes(Number(user.role_id));

  return {
    canModerate,
    isAuthenticated: !!user,
    userId: user?.id ?? null,
  };
}

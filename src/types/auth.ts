export type ApiUser = {
  id: number | string;
  role_id: number | string;
  fullname?: string;
  username?: string;
};

export type AuthUser = {
  id: number;
  role_id: number;
  username: string;
  fullname?: string | null;
  name: string;
};

export type SessionUser = AuthUser;

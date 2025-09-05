export type ApiUser = {
  id: number | string;
  role_id: number | string;
  fullname?: string;
  username?: string;
  country?: string;
  city?: string;
};

export type AuthUser = {
  id: number;
  role_id: number;
  username: string;
  fullname?: string | null;
  name: string;
  country?: string | null | undefined;
  city?: string | null | undefined;
};

export type SessionUser = AuthUser;

import { useState } from "react";

export function useLocalUserProfile(initialUser: any) {
  const [localUser, setLocalUser] = useState<any>(initialUser);
  return { localUser, setLocalUser };
}

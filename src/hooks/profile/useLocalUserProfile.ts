import { useState, useEffect } from "react";

export function useLocalUserProfile(initialUser: any) {
  const [localUser, setLocalUser] = useState<any>(initialUser);
  
  // Sincronizar con cambios en initialUser
  useEffect(() => {
    if (initialUser) {
      setLocalUser((prev: any) => ({
        ...initialUser,
        ...prev // Preservar cambios locales si existen
      }));
    }
  }, [initialUser]);
  
  return { localUser, setLocalUser };
}

import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useProfilePermissions(profileUserId?: number) {
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermissions() {
      try {
        const currentUser = await getCurrentUser();
        setCanEdit(currentUser?.id === profileUserId);
      } catch (error) {
        setCanEdit(false);
      } finally {
        setLoading(false);
      }
    }

    if (profileUserId) {
      checkPermissions();
    } else {
      setLoading(false);
    }
  }, [profileUserId]);

  return { canEdit, loading };
}

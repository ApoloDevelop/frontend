"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface UseRatingModalReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOpen: (isAuthenticated: boolean) => void;
  handleClose: () => void;
}

export function useRatingModal(defaultOpen?: boolean): UseRatingModalReturn {
  const [open, setOpen] = useState(!!defaultOpen);
  const router = useRouter();
  const pathname = usePathname();

  const handleOpen = (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/");
      router.push(`/login?next=${next}`);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    open,
    setOpen,
    handleOpen,
    handleClose,
  };
}

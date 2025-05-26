"use client";

import { useEffect, useState } from "react";

export function useAlert() {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (alertMsg) {
      setShowAlert(true);
      const hide = setTimeout(() => setShowAlert(false), 4700);
      const clear = setTimeout(() => setAlertMsg(null), 5000);
      return () => {
        clearTimeout(hide);
        clearTimeout(clear);
      };
    }
  }, [alertMsg]);

  return { alertMsg, setAlertMsg, showAlert };
}

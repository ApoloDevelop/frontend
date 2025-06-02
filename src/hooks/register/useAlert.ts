"use client";

import { useEffect, useState } from "react";

export function useAlert() {
  const [alertMsgs, setAlertMsgs] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (alertMsgs.length > 0) {
      setShowAlert(true);
      const hide = setTimeout(() => setShowAlert(false), 4700);
      const clear = setTimeout(() => setAlertMsgs([]), 5000);
      return () => {
        clearTimeout(hide);
        clearTimeout(clear);
      };
    }
  }, [alertMsgs]);

  return { alertMsgs, setAlertMsgs, showAlert };
}

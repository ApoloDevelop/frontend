"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setSession } from "@/lib/auth";
import { LoginRepository } from "@/repositories/login.repository";

export default function OAuthSuccess() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const token = sp.get("token");
    if (!token) {
      router.replace("/login?oauth=error");
      return;
    }
    (async () => {
      try {
        const user = await LoginRepository.getProfile(token);
        setSession(token, user);
        window.location.href = "/";
      } catch {
        router.replace("/login?oauth=error");
      }
    })();
  }, [sp, router]);

  return (
    <div className="min-h-screen grid place-items-center bg-[#f3f3f3]">
      <div className="text-center text-zinc-700">
        Procesando inicio de sesión...
      </div>
    </div>
  );
}

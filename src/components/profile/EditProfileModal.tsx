"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEditProfileForm } from "@/hooks/profile/useEditProfileForm";
import clsx from "clsx";
import { useState } from "react";

type Section = "profile" | "email";

export function EditProfileModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  const [section, setSection] = useState<Section>("profile");
  const {
    email,
    setEmail,
    bio,
    setBio,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useEditProfileForm(user);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-35 bg-gray-100 rounded-2xl p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSection("profile")}
                  className={clsx(
                    "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
                    section === "profile" && "bg-gray-300 font-semibold"
                  )}
                >
                  Editar datos del usuario
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSection("email")}
                  className={clsx(
                    "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
                    section === "email" && "bg-gray-300 font-semibold"
                  )}
                >
                  Edit Email Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {section === "profile"
                  ? "Datos del usuario"
                  : "Preferencias de correo"}
              </DialogTitle>
            </DialogHeader>

            {section === "profile" && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-semibold">
                    Nombre de usuario
                  </label>
                  <Input value={user.username} disabled />
                </div>
                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Biografía</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">
                    Nueva contraseña
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">
                    Confirmar contraseña
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {section === "email" && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Aquí puedes configurar tus preferencias de correo electrónico.
                </p>
                {/* Aquí puedes añadir más campos en el futuro */}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button>Guardar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

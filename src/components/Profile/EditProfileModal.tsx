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
import { UserService } from "@/services/user.service";
import { useAlert } from "@/hooks/register/useAlert";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RegisterRepository } from "@/repositories/register.repository";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useRouter } from "next/navigation";

type Section = "profile" | "email";

export function EditProfileModal({
  open,
  onClose,
  user,
  onUserUpdated,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
  onUserUpdated?: (updatedUser: any) => void;
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
    username,
    setUsername,
    canEditUsername,
    daysSinceUpdate,
  } = useEditProfileForm(user);

  const { alertMsgs, setAlertMsgs, showAlert } = useAlert();

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setAlertMsgs([]);

    try {
      if (
        (email !== user.email && email) ||
        (username !== user.username && username)
      ) {
        const exists = await RegisterRepository.checkIfExists(
          email !== user.email ? email : "",
          username !== user.username ? username : "",
          ""
        );
        console.log("EXISTS", exists);
        if (exists.emailExists) {
          setAlertMsgs(["El correo electrónico ya está registrado."]);
          setLoading(false);
          return;
        }
        if (exists.usernameExists) {
          setAlertMsgs(["El nombre de usuario ya está registrado."]);
          setLoading(false);
          return;
        }
      }
      const dataToUpdate: any = {
        email,
        biography: bio,
      };
      console.log(canEditUsername);
      if (canEditUsername && username !== user.username) {
        dataToUpdate.username = username;
      }
      if (password) {
        if (password !== confirmPassword) {
          setAlertMsgs(["Las contraseñas no coinciden"]);
          setLoading(false);
          return;
        }
        dataToUpdate.password = password;
      }

      const updatedUser = await UserService.updateUser(user.id, dataToUpdate);
      if (onUserUpdated) onUserUpdated(updatedUser);

      if (dataToUpdate.username && dataToUpdate.username !== user.username) {
        onClose();
        router.replace(`/${dataToUpdate.username}`);
        return;
      }

      onClose();
    } catch (e: any) {
      setAlertMsgs([e.message || "Error al actualizar el usuario"]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <LoadingScreen />}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="p-0">
          {/* ALERTA */}
          {(alertMsgs.length > 0 || showAlert) && (
            <div
              className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md transition-opacity duration-300 ${
                showAlert ? "opacity-100" : "opacity-0"
              }`}
              style={{
                zIndex: 99999,
                position: "absolute",
                top: "-50px",
              }}
            >
              <Alert
                variant="destructive"
                className="bg-white to-red-700 text-red-500 relative border border-red-500 shadow-lg"
              >
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {alertMsgs.map((msg, index) => (
                    <p key={index}>{msg}</p>
                  ))}
                </AlertDescription>
              </Alert>
            </div>
          )}
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
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={!canEditUsername}
                    />
                    {!canEditUsername && (
                      <p className="text-xs text-gray-500 mt-1">
                        Solo puedes cambiar tu nombre de usuario una vez cada 30
                        días.
                      </p>
                    )}
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
                    Aquí puedes configurar tus preferencias de correo
                    electrónico.
                  </p>
                  {/* Aquí puedes añadir más campos en el futuro */}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
import { useEffect, useState } from "react";
import { UserService } from "@/services/user.service";
import { useAlert } from "@/hooks/register/useAlert";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RegisterRepository } from "@/repositories/register.repository";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { usePasswordToggle } from "@/hooks/register/usePasswordToggle";
import { EyeToggleIcon } from "../ui/EyeToggleIcon";
import { PasswordStrengthIndicator } from "../ui/PasswordStrengthIndicator";

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
  function isStrongPassword(password: string) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

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
  } = useEditProfileForm(user);

  const {
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
  } = usePasswordToggle();

  useEffect(() => {
    if (!open) {
      setEmail(user.email);
      setBio(user.biography || "");
      setPassword("");
      setConfirmPassword("");
      setUsername(user.username);
      setSection("profile");
      setUsernameError(false);
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
    }
  }, [open]);

  const { alertMsgs, setAlertMsgs, showAlert } = useAlert();

  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const isModified =
    username !== user.username ||
    email !== user.email ||
    bio !== (user.biography || "") ||
    password.length > 0 ||
    confirmPassword.length > 0;

  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setAlertMsgs([]);

    if (!username || username.trim() === "") {
      setAlertMsgs(["El nombre de usuario no puede estar vacío."]);
      setUsernameError(true);
      setLoading(false);
      return;
    } else {
      setUsernameError(false);
    }

    if (!email || email.trim() === "") {
      setAlertMsgs(["El correo electrónico no puede estar vacío."]);
      setEmailError(true);
      setLoading(false);
      return;
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      setAlertMsgs(["El correo electrónico no tiene un formato válido."]);
      setEmailError(true);
      setLoading(false);
      return;
    } else if (email.length > 245) {
      setAlertMsgs(["El correo electrónico es demasiado largo."]);
      setEmailError(true);
      setLoading(false);
      return;
    } else {
      setEmailError(false);
    }
    if (password) {
      if (password !== confirmPassword) {
        setAlertMsgs(["Las contraseñas no coinciden"]);
        setPasswordError(true);
        setConfirmPasswordError(true);
        setLoading(false);
        return;
      } else {
        setPasswordError(false);
        setConfirmPasswordError(false);
      }
      if (!isStrongPassword(password)) {
        setAlertMsgs([
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
        ]);
        setPasswordError(true);
        setLoading(false);
        return;
      }
    } else {
      setPasswordError(false);
      setConfirmPasswordError(false);
    }

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
                top: "-30px",
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={!canEditUsername}
                          tabIndex={0}
                          className={
                            usernameError ? "border-red-500 border-2" : ""
                          }
                        />
                      </TooltipTrigger>
                      {canEditUsername && (
                        <TooltipContent side="bottom">
                          Solo puedes cambiar tu nombre de usuario una vez cada
                          30 días.
                        </TooltipContent>
                      )}
                    </Tooltip>
                    {username && (
                      <p
                        className={`text-xs w-9/10 mt-2 ${
                          username.length > 30 ||
                          !/^[a-zA-Z0-9_]+$/.test(username)
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {username.length > 30 ? (
                          "El nombre de usuario no puede tener más de 30 caracteres."
                        ) : !/^[a-zA-Z0-9_]+$/.test(username) ? (
                          "El nombre de usuario solo puede contener letras, números y guion bajo (_)."
                        ) : (
                          <>
                            Tu nombre de usuario será:{" "}
                            <span>@{username.toLowerCase()}</span>
                          </>
                        )}
                      </p>
                    )}
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
                      className={emailError ? "border-red-500 border-2" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Biografía</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        La biografía no debe exceder los 1500 caracteres.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">
                      Nueva contraseña
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`pr-10 ${
                              passwordError ? "border-red-500 border-2" : ""
                            }`}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                            onClick={togglePassword}
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                          >
                            <EyeToggleIcon show={showPassword} />
                          </button>
                        </div>
                      </TooltipTrigger>

                      <TooltipContent side="bottom">
                        La contraseña debe tener al menos 8 caracteres, incluir
                        una letra mayúscula, una minúscula, un número y un
                        carácter especial.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pr-10 ${
                          confirmPasswordError ? "border-red-500 border-2" : ""
                        }`}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                        onClick={toggleConfirmPassword}
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        <EyeToggleIcon show={showConfirmPassword} />
                      </button>
                    </div>
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
                <Button
                  onClick={handleSave}
                  disabled={Boolean(
                    loading ||
                      !isModified ||
                      username.length > 30 ||
                      !/^[a-zA-Z0-9_]+$/.test(username) ||
                      email.length > 245 ||
                      !email.includes("@") ||
                      bio.length > 1500
                  )}
                >
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

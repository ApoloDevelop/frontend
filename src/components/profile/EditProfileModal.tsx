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
import { useEditProfileValidation } from "@/hooks/profile/useEditProfileValidation";
import { useEditProfileUpdate } from "@/hooks/profile/useEditProfileUpdate";
import { EditUserDataForm } from "./EditUserDataForm";
import { EditProfileModalSidebar } from "./EditProfileModalSidebar";
import { AlertMessage } from "../ui/AlertMessage";

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
    resetForm,
  } = useEditProfileForm(user);

  const {
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
  } = usePasswordToggle();

  const {
    updateProfile,
    loading,
    fieldErrors,
    messages,
    setMessages,
    setFieldErrors,
  } = useEditProfileUpdate();

  const { alertMsgs, setAlertMsgs, showAlert } = useAlert();

  const router = useRouter();

  const isModified =
    username !== user.username ||
    email !== user.email ||
    bio !== (user.biography || "") ||
    password.length > 0 ||
    confirmPassword.length > 0;

  useEffect(() => {
    if (!open) {
      resetForm();
      setSection("profile");
      setFieldErrors({});
      setMessages([]);
      setAlertMsgs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (messages.length > 0) setAlertMsgs(messages);
  }, [messages, setAlertMsgs]);

  const usernameError = !!fieldErrors.username;
  const emailError = !!fieldErrors.email;
  const passwordError = !!fieldErrors.password;
  const confirmPasswordError = !!fieldErrors.confirmPassword;
  const bioError = !!fieldErrors.bio;

  const handleSave = async () => {
    setAlertMsgs([]);
    setFieldErrors({});
    setMessages([]);

    const updatedUser = await updateProfile(
      user,
      {
        username,
        email,
        password,
        confirmPassword,
        bio,
      },
      canEditUsername
    );

    if (!updatedUser) return;

    if (onUserUpdated) onUserUpdated(updatedUser);

    // Si se cambia el username, redirige
    if (username !== user.username && canEditUsername) {
      onClose();
      router.replace(`/${username}`);
      return;
    }

    onClose();
  };
  return (
    <>
      {loading && <LoadingScreen />}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="p-0">
          <AlertMessage
            alertMsgs={alertMsgs}
            showAlert={showAlert}
            topSize="10px"
          />
          <div className="flex h-full">
            <EditProfileModalSidebar
              section={section}
              setSection={setSection}
            />

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
                <EditUserDataForm
                  username={username}
                  setUsername={setUsername}
                  canEditUsername={canEditUsername}
                  usernameError={usernameError}
                  email={email}
                  setEmail={setEmail}
                  emailError={emailError}
                  bio={bio}
                  setBio={setBio}
                  bioError={bioError}
                  password={password}
                  setPassword={setPassword}
                  passwordError={passwordError}
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  confirmPasswordError={confirmPasswordError}
                  showConfirmPassword={showConfirmPassword}
                  toggleConfirmPassword={toggleConfirmPassword}
                />
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

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditProfileForm } from "@/hooks/profile/useEditProfileForm";
import { useEffect, useState } from "react";
import { useAlert } from "@/hooks/register/useAlert";
import { LoadingScreen } from "../ui/LoadingScreen";
import { useRouter } from "next/navigation";
import { usePasswordToggle } from "@/hooks/register/usePasswordToggle";
import { useEditProfileUpdate } from "@/hooks/profile/useEditProfileUpdate";
import { EditUserDataForm } from "./EditUserDataForm";
import { EditProfileModalSidebar } from "./EditProfileModalSidebar";
import { AlertMessage } from "../ui/AlertMessage";
import { EditPersonalDataForm } from "./EditPersonalDataForm";
import { formatDate } from "@/utils/date";
import { normalize } from "@/utils/normalization";
import { EditSocialMediaForm } from "./EditSocialMediaForm";
import { DangerZoneForm } from "./DangerZoneForm";

type Section = "profile" | "personal" | "social" | "danger";

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
    fullname,
    setFullname,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    birthdate,
    setBirthdate,
    country,
    setCountry,
    city,
    setCity,
    genre,
    setGenre,
    spLink,
    setSpLink,
    ytLink,
    setYtLink,
    twLink,
    setTwLink,
    igLink,
    setIgLink,
    ttLink,
    setTtLink,
    extUrl,
    setExtUrl,
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
    fullname !== user.fullname ||
    username !== user.username ||
    email !== user.email ||
    bio !== (user.biography || "") ||
    password.length > 0 ||
    confirmPassword.length > 0 ||
    formatDate(birthdate) !== formatDate(user.birthdate) ||
    country !== user.country ||
    city !== user.city ||
    normalize(genre) !== normalize(user.social_genre) ||
    spLink !== (user.spotify_link || "") ||
    ytLink !== (user.youtube_link || "") ||
    twLink !== (user.twitter_link || "") ||
    igLink !== (user.instagram_link || "") ||
    ttLink !== (user.tiktok_link || "") ||
    extUrl !== (user.external_url || "");

  useEffect(() => {
    if (!open) {
      resetForm();
      setSection("profile");
      setFieldErrors({});
      setMessages([]);
      setAlertMsgs([]);
    }
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
        fullname,
        username,
        email,
        password,
        confirmPassword,
        bio,
        birthdate,
        country,
        city,
        genre,
        spLink,
        ytLink,
        twLink,
        igLink,
        ttLink,
        extUrl,
      },
      canEditUsername
    );

    if (!updatedUser) return;

    if (onUserUpdated) onUserUpdated(updatedUser);

    // Si se cambia el username, redirige
    if (username !== user.username && canEditUsername) {
      onClose();
      router.replace(`/users/${username}`);
      return;
    }

    onClose();
  };
  return (
    <>
      {loading && <LoadingScreen />}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className="p-0 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl w-full h-[85vh] max-h-[500px] sm:max-h-[600px]"
          style={{ pointerEvents: "auto" }}
        >
          <AlertMessage
            alertMsgs={alertMsgs}
            showAlert={showAlert}
            topSize="10px"
          />
          <div className="flex flex-col sm:flex-row h-full min-h-0">
            <EditProfileModalSidebar
              section={section}
              setSection={setSection}
            />

            {/* Content */}
            <div className="flex-1 min-w-0 p-3 sm:p-4 overflow-y-auto flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {section === "profile"
                    ? "Datos del usuario"
                    : section === "personal"
                    ? "Datos personales"
                    : section === "social"
                    ? "Redes sociales"
                    : "Zona de peligro"}
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

              {section === "personal" && (
                <EditPersonalDataForm
                  fullname={fullname}
                  setFullname={setFullname}
                  birthdate={birthdate}
                  setBirthdate={setBirthdate}
                  country={country}
                  setCountry={setCountry}
                  city={city}
                  setCity={setCity}
                  genre={genre}
                  setGenre={setGenre}
                  fieldErrors={fieldErrors}
                />
              )}

              {section === "social" && (
                <EditSocialMediaForm
                  spLink={spLink}
                  setSpLink={setSpLink}
                  ytLink={ytLink}
                  setYtLink={setYtLink}
                  twLink={twLink}
                  setTwLink={setTwLink}
                  igLink={igLink}
                  setIgLink={setIgLink}
                  ttLink={ttLink}
                  setTtLink={setTtLink}
                  extUrl={extUrl}
                  setExtUrl={setExtUrl}
                />
              )}

              {section === "danger" && (
                <DangerZoneForm user={user} onClose={onClose} />
              )}

              {section !== "danger" && (
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-auto pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full sm:w-auto text-sm"
                  >
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
                    className="w-full sm:w-auto text-sm"
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

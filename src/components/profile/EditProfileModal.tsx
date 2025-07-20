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
import { normalize } from "@/utils/normalize";
import { getFullPhone } from "@/utils/phone";
import { EditSocialMediaForm } from "./EditSocialMediaForm";

type Section = "profile" | "personal" | "social";

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
    birthdate,
    setBirthdate,
    country,
    setCountry,
    city,
    setCity,
    phonePrefix,
    setPhonePrefix,
    phone,
    setPhone,
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
    username !== user.username ||
    email !== user.email ||
    bio !== (user.biography || "") ||
    password.length > 0 ||
    confirmPassword.length > 0 ||
    formatDate(birthdate) !== formatDate(user.birthdate) ||
    country !== user.country ||
    city !== user.city ||
    getFullPhone(phone, phonePrefix) !== (user.phone || "") ||
    normalize(genre) !== normalize(user.social_genre) ||
    spLink !== (user.spotify_link || "") ||
    ytLink !== (user.youtube_link || "") ||
    twLink !== (user.twitter_link || "") ||
    igLink !== (user.instagram_link || "") ||
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
        username,
        email,
        password,
        confirmPassword,
        bio,
        birthdate,
        country,
        city,
        genre,
        phonePrefix,
        phone,
        spLink,
        ytLink,
        twLink,
        igLink,
        extUrl,
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
        <DialogContent className="p-0" style={{ pointerEvents: "auto" }}>
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
                    : section === "personal"
                    ? "Datos personales"
                    : "Redes sociales"}
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
                  birthdate={birthdate}
                  setBirthdate={setBirthdate}
                  country={country}
                  setCountry={setCountry}
                  city={city}
                  setCity={setCity}
                  phonePrefix={phonePrefix}
                  setPhonePrefix={setPhonePrefix}
                  phone={phone}
                  setPhone={setPhone}
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
                  extUrl={extUrl}
                  setExtUrl={setExtUrl}
                />
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

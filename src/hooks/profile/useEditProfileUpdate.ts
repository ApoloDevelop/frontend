import { useState } from "react";
import { UserService } from "@/services/user.service";
import { RegisterRepository } from "@/repositories/register.repository";
import { useEditProfileValidation } from "./useEditProfileValidation";

export function useEditProfileUpdate() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [messages, setMessages] = useState<string[]>([]);
  const { validate } = useEditProfileValidation();

  const updateProfile = async (
    user: any,
    dataToUpdate: {
      fullname: string;
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      bio: string;
      birthdate: string;
      country: string;
      city: string;
      genre: string | null;
      spLink: string;
      ytLink: string;
      twLink: string;
      igLink: string;
      extUrl: string;
    },
    canEditUsername: boolean
  ) => {
    setLoading(true);
    setFieldErrors({});
    setMessages([]);

    // Validación local
    const { errors, messages: validationMsgs } = validate({
      username: dataToUpdate.username,
      email: dataToUpdate.email,
      password: dataToUpdate.password,
      confirmPassword: dataToUpdate.confirmPassword,
      bio: dataToUpdate.bio,
      birthdate: dataToUpdate.birthdate,
      spLink: dataToUpdate.spLink,
      igLink: dataToUpdate.igLink,
      twLink: dataToUpdate.twLink,
      ytLink: dataToUpdate.ytLink,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessages(validationMsgs);
      setLoading(false);
      return null;
    }

    try {
      if (
        (dataToUpdate.email !== user.email && dataToUpdate.email) ||
        (dataToUpdate.username !== user.username && dataToUpdate.username)
      ) {
        const exists = await RegisterRepository.checkIfExists(
          dataToUpdate.email !== user.email ? dataToUpdate.email : "",
          dataToUpdate.username !== user.username ? dataToUpdate.username : ""
        );

        if (exists.emailExists) {
          setFieldErrors({ email: true });
          setMessages(["El correo electrónico ya está registrado."]);
          setLoading(false);
          return null;
        }
        if (exists.usernameExists) {
          setFieldErrors({ username: true });
          setMessages(["El nombre de usuario ya está registrado."]);
          setLoading(false);
          return null;
        }
      }

      const updateObj: any = {
        fullname: dataToUpdate.fullname,
        email: dataToUpdate.email,
        biography: dataToUpdate.bio,
        birthdate: dataToUpdate.birthdate
          ? new Date(dataToUpdate.birthdate).toISOString()
          : undefined,
        country: dataToUpdate.country || null,
        city: dataToUpdate.city || null,
        social_genre: dataToUpdate.genre || null,
        spotify_link: dataToUpdate.spLink || null,
        youtube_link: dataToUpdate.ytLink || null,
        twitter_link: dataToUpdate.twLink || null,
        instagram_link: dataToUpdate.igLink || null,
        external_url: dataToUpdate.extUrl || null,
      };
      if (canEditUsername && dataToUpdate.username !== user.username) {
        updateObj.username = dataToUpdate.username;
      }
      if (dataToUpdate.password) {
        updateObj.password = dataToUpdate.password;
      }

      const updatedUser = await UserService.updateUser(user.id, updateObj);
      setLoading(false);
      return updatedUser;
    } catch (e: any) {
      setMessages([e.message || "Error al actualizar el usuario"]);
      setLoading(false);
      return null;
    }
  };

  return {
    updateProfile,
    loading,
    fieldErrors,
    messages,
    setMessages,
    setFieldErrors,
  };
}

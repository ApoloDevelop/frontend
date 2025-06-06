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
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      bio: string;
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
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessages(validationMsgs);
      setLoading(false);
      return null;
    }

    // Comprobación de existencia en backend
    try {
      if (
        (dataToUpdate.email !== user.email && dataToUpdate.email) ||
        (dataToUpdate.username !== user.username && dataToUpdate.username)
      ) {
        const exists = await RegisterRepository.checkIfExists(
          dataToUpdate.email !== user.email ? dataToUpdate.email : "",
          dataToUpdate.username !== user.username ? dataToUpdate.username : "",
          ""
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

      // Construir objeto de actualización
      const updateObj: any = {
        email: dataToUpdate.email,
        biography: dataToUpdate.bio,
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

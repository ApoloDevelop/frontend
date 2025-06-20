import { isValidDate } from "@/lib/utils";

type EditProfileFields = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  birthdate: string;
};

type EditProfileErrors = {
  username?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  bio?: boolean;
  birthdate?: boolean;
};

export function useEditProfileValidation() {
  function isStrongPassword(password: string) {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  function validate({
    username,
    email,
    password,
    confirmPassword,
    bio,
    birthdate,
  }: EditProfileFields) {
    const errors: EditProfileErrors = {};
    const messages: string[] = [];

    if (!username || username.trim() === "") {
      errors.username = true;
      messages.push("El nombre de usuario no puede estar vacío.");
    } else if (username.length > 30) {
      errors.username = true;
      messages.push(
        "El nombre de usuario no puede tener más de 30 caracteres."
      );
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = true;
      messages.push(
        "El nombre de usuario solo puede contener letras, números y guion bajo (_)."
      );
    }

    if (!email || email.trim() === "") {
      errors.email = true;
      messages.push("El correo electrónico no puede estar vacío.");
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      errors.email = true;
      messages.push("El correo electrónico no tiene un formato válido.");
    } else if (email.length > 245) {
      errors.email = true;
      messages.push("El correo electrónico es demasiado largo.");
    }

    if (bio && bio.length > 1500) {
      errors.bio = true;
      messages.push("La biografía no debe exceder los 1500 caracteres.");
    }

    if (password) {
      if (!isStrongPassword(password)) {
        errors.password = true;
        messages.push(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        );
      }
      if (password !== confirmPassword) {
        errors.password = true;
        errors.confirmPassword = true;
        messages.push("Las contraseñas no coinciden.");
      }
    }

    if (!isValidDate(birthdate)) {
      errors.birthdate = true;
      messages.push("La fecha de nacimiento no es válida.");
    }

    return { errors, messages };
  }

  return { validate };
}

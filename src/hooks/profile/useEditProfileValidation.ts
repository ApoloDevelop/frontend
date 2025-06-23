import { isValidDate } from "@/utils/date";
import { isStrongPassword } from "@/utils/password";
import { isValidPhoneNumber } from "libphonenumber-js";

type EditProfileFields = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  birthdate: string;
  phone: string;
  spLink: string;
  igLink: string;
  twLink: string;
  ytLink: string;
};

type EditProfileErrors = {
  username?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  bio?: boolean;
  birthdate?: boolean;
  phone?: boolean;
  spLink?: boolean;
  igLink?: boolean;
  twLink?: boolean;
  ytLink?: boolean;
};

export function useEditProfileValidation() {
  function validate({
    username,
    email,
    password,
    confirmPassword,
    bio,
    birthdate,
    phone,
    spLink,
    igLink,
    twLink,
    ytLink,
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

    if (!isValidPhoneNumber(phone)) {
      errors.phone = true;
      messages.push("Por favor, introduce un número de teléfono válido.");
    }

    if (spLink && spLink.trim() !== "") {
      if (!spLink.includes("open.spotify.com")) {
        errors.spLink = true;
        messages.push("El enlace de Spotify no es válido.");
      }
    }

    if (igLink && igLink.trim() !== "") {
      if (!igLink.includes("instagram.com")) {
        errors.igLink = true;
        messages.push("El enlace de Instagram no es válido.");
      }
    }

    if (twLink && twLink.trim() !== "") {
      if (!twLink.includes("twitter.com") && !twLink.includes("x.com")) {
        errors.twLink = true;
        messages.push("El enlace de X no es válido.");
      }
    }

    if (ytLink && ytLink.trim() !== "") {
      if (!ytLink.includes("youtube.com")) {
        errors.ytLink = true;
        messages.push("El enlace de YouTube no es válido.");
      }
    }

    return { errors, messages };
  }

  return { validate };
}

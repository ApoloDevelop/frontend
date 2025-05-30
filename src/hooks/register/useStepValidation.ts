import { isValidPhoneNumber } from "libphonenumber-js";
import { RegisterService } from "@/services/register.service";

function isStrongPassword(password: string): boolean {
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSymbol;
}

export function useStepValidation(
  formData: any,
  setFieldErrors: any,
  setAlertMsg: any,
  setIsLoading: any
) {
  const validateStep = async (step: number) => {
    const errors: { [key: string]: boolean } = {};

    if (step === 1) {
      // Validar campos requeridos del primer paso
      if (!formData.fullname.trim()) {
        setAlertMsg("El nombre completo es obligatorio.");
        errors.fullname = true;
      }
      if (!formData.username.trim()) {
        setAlertMsg("El nombre de usuario es obligatorio.");
        errors.username = true;
      }
      if (!formData.email.trim()) {
        setAlertMsg("El correo electrónico es obligatorio.");
        errors.email = true;
      }
      if (!formData.password) {
        setAlertMsg("La contraseña es obligatoria.");
        errors.password = true;
      } else if (!isStrongPassword(formData.password)) {
        setAlertMsg(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
        );
        errors.password = true;
      }
      if (!formData.confirmPassword) {
        setAlertMsg("Debes confirmar la contraseña.");
        errors.confirmPassword = true;
      }
      if (formData.password !== formData.confirmPassword) {
        setAlertMsg("Las contraseñas no coinciden.");
        errors.password = true;
        errors.confirmPassword = true;
      }

      // Verificar si el correo o el nombre de usuario ya existen
      if (!errors.email && !errors.username) {
        setIsLoading(true);
        try {
          const { emailExists, usernameExists } =
            await RegisterService.validateAndCheckIfExists(
              formData.email,
              formData.username,
              ""
            );

          if (emailExists) {
            setAlertMsg("El correo electrónico ya está registrado.");
            errors.email = true;
          }
          if (usernameExists) {
            setAlertMsg("El nombre de usuario ya está registrado.");
            errors.username = true;
          }
        } catch (e: any) {
          setAlertMsg(e.message);
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (step === 2) {
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0];

      if (!formData.birthdate || formData.birthdate > today) {
        setAlertMsg("Por favor, introduce una fecha de nacimiento válida.");
        errors.birthdate = true;
      }

      if (
        formData.phonePrefix &&
        (!formData.phone || formData.phone.trim() === "")
      ) {
        setAlertMsg("Por favor, introduce un número de teléfono válido.");
        errors.phone = true;
      } else if (formData.phonePrefix && formData.phone) {
        const phoneNumber = `${formData.phonePrefix}${formData.phone}`;
        if (!isValidPhoneNumber(phoneNumber)) {
          setAlertMsg("Por favor, introduce un número de teléfono válido.");
          errors.phone = true;
        } else {
          const { phoneExists } =
            await RegisterService.validateAndCheckIfExists("", "", phoneNumber);
          if (phoneExists) {
            setAlertMsg("El número de teléfono ya está registrado.");
            errors.phone = true;
          }
        }
      }
      setIsLoading(false);
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return { validateStep };
}

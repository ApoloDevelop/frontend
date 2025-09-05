import React from "react";
import { FloatingInput } from "../FloatingInput";
import { PasswordInput } from "../PasswordInput";

interface RegisterFormStep1Props {
  formData: any;
  fieldErrors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePassword: () => void;
  showConfirmPassword: boolean;
  toggleConfirmPassword: () => void;
}

export const RegisterFormStep1: React.FC<RegisterFormStep1Props> = ({
  formData,
  fieldErrors,
  handleChange,
  showPassword,
  togglePassword,
  showConfirmPassword,
  toggleConfirmPassword,
}) => {
  return (
    <div className="w-full flex-shrink-0">
      <h3 className="text-lg mb-4 text-center">Háblanos de ti</h3>
      <form className="space-y-4 flex flex-col items-center" action="">
        <FloatingInput
          label="Nombre completo"
          name="fullname"
          autoComplete="name"
          value={formData.fullname}
          onChange={handleChange}
          required
          error={fieldErrors.fullname}
        />

        <FloatingInput
          label="Nombre de usuario"
          name="username"
          type="username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          required
          error={fieldErrors.username}
        />
        {formData.username && (
          <p
            className={`text-xs w-9/10 -mt-4 ${
              formData.username.length > 30 ||
              !/^[a-zA-Z0-9_]+$/.test(formData.username)
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {formData.username.length > 30 ? (
              "El nombre de usuario no puede tener más de 30 caracteres."
            ) : formData.username.length < 2 ? ( // Mensaje de error para longitud mínima
              "El nombre de usuario debe tener al menos 2 caracteres."
            ) : !/^[a-zA-Z0-9_]+$/.test(formData.username) ? (
              "El nombre de usuario solo puede contener letras, números y guion bajo (_)."
            ) : (
              <>
                Tu nombre de usuario será:{" "}
                <span>@{formData.username.toLowerCase()}</span>
              </>
            )}
          </p>
        )}

        <FloatingInput
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={fieldErrors.email}
        />

        <PasswordInput
          label="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          show={showPassword}
          toggleShow={togglePassword}
          required
          error={fieldErrors.password}
          showStrengthIndicator
        />

        <PasswordInput
          label="Repetir contraseña"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          show={showConfirmPassword}
          toggleShow={toggleConfirmPassword}
          required
          error={fieldErrors.confirmPassword}
        />
      </form>

      {formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-sm mb-4 -translate-y-6 text-center">
            Las contraseñas no coinciden
          </p>
        )}
    </div>
  );
};

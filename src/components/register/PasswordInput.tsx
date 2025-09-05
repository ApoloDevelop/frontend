import React from "react";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { EyeToggleIcon } from "../ui/EyeToggleIcon";

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  toggleShow: () => void;
  error?: boolean;
  required?: boolean;
  showStrengthIndicator?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  value,
  onChange,
  show,
  toggleShow,
  error = false,
  required = false,
  showStrengthIndicator = false,
}) => {
  return (
    <div className="floating-label relative w-9/10 mb-6">
      <input
        type={show ? "text" : "password"}
        name={name}
        id={name}
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="new-password"
        className={`peer w-full px-3 py-2 border focus:outline-none rounded-md focus-visible:border-ring focus-visible:ring-ring/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${
          error ? "border-red-500 border-2" : "focus-visible:ring-[4px]"
        }`}
      />
      <label
        htmlFor={name}
        className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
        style={{
          zIndex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "calc(100% - 24px)",
        }}
      >
        {label}
      </label>

      {/* Botón de mostrar/ocultar */}
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-3 top-4 text-gray-400 hover:text-black cursor-pointer"
        onClick={toggleShow}
        title={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <EyeToggleIcon show={show} />
      </button>

      {/* Indicador de fuerza */}
      {showStrengthIndicator && value && (
        <PasswordStrengthIndicator password={value} />
      )}
    </div>
  );
};

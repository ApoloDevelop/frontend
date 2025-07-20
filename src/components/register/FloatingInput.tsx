import { cn } from "@/lib/utils";
import React from "react";

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  max?: string;
  className?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  error = false,
  disabled = false,
  autoComplete = "off",
  max = undefined,
}) => {
  return (
    <div className="floating-label relative w-9/10 mb-6">
      <input
        type={type}
        name={name}
        id={name}
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        max={max}
        className={cn(
          `peer w-full px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/10 ria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${
            error ? "border-red-500 border-2" : "focus-visible:ring-[4px]"
          }`
        )}
      />
      <label
        htmlFor={name}
        className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "calc(100% - 24px)",
        }}
      >
        {label}
      </label>
    </div>
  );
};

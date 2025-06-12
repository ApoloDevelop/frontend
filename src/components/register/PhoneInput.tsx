// components/register/PhoneInput.tsx
import { countries } from "@/data/countries";
import React from "react";
import Select from "react-select";
import Flag from "react-world-flags";

interface DialCodeOption {
  value: string;
  label: string;
  flagCode: string;
}

interface PhoneInputProps {
  prefix: string;
  number: string;
  onChange: (newPrefix: string, newNumber: string) => void;
  fieldError?: boolean;
  hideFloatingLabel?: boolean;
  hidePlaceholder?: boolean;
  className?: string;
  height?: string | number;
  borderRadius?: string;
}

const dialCodeOptions = countries.map((country) => ({
  value: country.idd.root + (country.idd.suffixes?.[0] || ""),
  label: country.translations.spa.common,
  flagCode: country.cca2,
}));

export const PhoneInput: React.FC<PhoneInputProps> = ({
  prefix,
  number,
  onChange,
  fieldError = false,
  hideFloatingLabel = false,
  hidePlaceholder = false,
  className = "",
  height = "50px",
  borderRadius = "0.375rem",
}) => {
  const formatOptionLabel = (
    { label, flagCode }: DialCodeOption,
    { context }: { context: "menu" | "value" }
  ) => {
    if (context === "menu") {
      return (
        <div className="flex items-center">
          <Flag code={flagCode} className="w-5 h-5 mr-2" />
          {label}
        </div>
      );
    }
    return <Flag code={flagCode} className="w-5 h-5" />;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Prefijo */}
      <div className="w-4/9 sm:w-3/9">
        <Select
          options={dialCodeOptions}
          formatOptionLabel={formatOptionLabel}
          getOptionValue={(opt) => opt.value}
          isClearable
          onChange={
            (opt) => onChange(opt?.value || "", "") // reset número al cambiar prefijo
          }
          placeholder={hidePlaceholder ? "" : "Prefijo"}
          menuPlacement="top"
          maxMenuHeight={200}
          value={
            prefix ? dialCodeOptions.find((opt) => opt.value === prefix) : null
          }
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: "var(--border)",
              boxShadow: state.isFocused
                ? "0 0 0 1px var(--ring), 0 1px 2px 0 rgb(0 0 0 / 0.05)" // sombra + ring al enfocar
                : "0 1px 2px 0 rgb(0 0 0 / 0.05)", // solo sombra cuando no está enfocado
              borderRadius: borderRadius ? borderRadius : "0.375rem",
              "&:hover": { borderColor: "var(--border)" },
              height: height,
            }),
            menu: (base) => ({ ...base, width: "200px", zIndex: 9999 }),
            placeholder: (base) => ({
              ...base,
              fontSize: "13px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 24px)",
              "@media (max-width: 540px)": {
                fontSize: "10px",
              },
              rounded: "4px",
              ":focus-visible": {},
            }),
          }}
        />
      </div>

      {/* Teléfono */}

      <div className="floating-label w-5/9 sm:w-6/9 relative mb-6">
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder=" "
          value={`${prefix} ${number}`.trim()}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue.startsWith(prefix)) {
              onChange(prefix, inputValue.slice(prefix.length).trim());
            }
          }}
          required
          disabled={!prefix}
          className={`peer w-full px-3 py-2 border rounded-md focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ${
            fieldError ? "border-red-500 border-2" : "focus-visible:ring-[4px]"
          } ${!prefix ? "bg-gray-100 text-gray-500 border-gray-200" : ""}`}
        />
        {!hideFloatingLabel && (
          <label
            htmlFor="phone"
            className={`absolute left-3 top-2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black ${
              !prefix ? "bg-gray-100" : "bg-white"
            }`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 24px)", // Adjust for padding and icon
            }}
          >
            Teléfono (opcional)
          </label>
        )}
      </div>
    </div>
  );
};

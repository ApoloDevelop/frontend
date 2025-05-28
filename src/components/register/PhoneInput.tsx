// components/register/PhoneInput.tsx
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
  dialCodeOptions: DialCodeOption[];
  fieldError?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  prefix,
  number,
  onChange,
  dialCodeOptions,
  fieldError = false,
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
    <div className="flex w-9/10 mb-6 gap-2">
      {/* Prefijo */}
      <div className="w-3/9">
        <Select
          options={dialCodeOptions}
          formatOptionLabel={formatOptionLabel}
          getOptionValue={(opt) => opt.value}
          isClearable
          onChange={
            (opt) => onChange(opt?.value || "", "") // reset número al cambiar prefijo
          }
          placeholder="Prefijo"
          menuPlacement="top"
          value={
            prefix ? dialCodeOptions.find((opt) => opt.value === prefix) : null
          }
          styles={{
            control: (base, state) => ({
              ...base,
              borderColor: "black",
              boxShadow: state.isFocused ? "0 0 0 0px black" : "none",
              "&:hover": { borderColor: "black" },
              height: "50px",
            }),
            menu: (base) => ({ ...base, width: "200px", zIndex: 9999 }),
            placeholder: (base) => ({ ...base, fontSize: "13px" }),
          }}
        />
      </div>

      {/* Teléfono */}
      <div className="floating-label w-6/9 relative mb-6">
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
          className={`peer w-full px-3 py-2 border rounded focus:outline-none ${
            fieldError ? "border-red-500 border-2" : "border-black"
          }`}
        />
        <label
          htmlFor="phone"
          className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
          style={{ zIndex: 1 }}
        >
          Teléfono (opcional)
        </label>
      </div>
    </div>
  );
};

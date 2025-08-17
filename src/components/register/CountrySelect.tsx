import React from "react";
import Select from "react-select";
import { countries } from "@/data/countries";
import Flag from "react-world-flags";

interface CountryOption {
  value: string;
  label: React.ReactNode;
}

interface CountrySelectProps {
  value: string;
  onChange: (selected: CountryOption | null) => void;
  hideFloatingLabel?: boolean;
  hidePlaceholder?: boolean;
  className?: string;
  height?: string | number;
  borderRadius?: string;
}

const countryOptions = countries
  .sort((a, b) =>
    a.translations.spa.common.localeCompare(b.translations.spa.common, "es")
  )
  .map((country) => ({
    value: country.cca2,
    label: (
      <div className="flex items-center">
        <Flag code={country.cca2} className="w-5 h-5 mr-2" />
        {country.translations.spa.common}
      </div>
    ),
  }));

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  hideFloatingLabel = false,
  hidePlaceholder = false,
  className = "",
  height = "50px",
  borderRadius = "0.375rem",
}) => {
  const selected = countryOptions.find((opt) => opt.value === value) || null;

  return (
    <div className={`relative ${className}`}>
      {!hideFloatingLabel && (
        <p
          id="country-label"
          className="absolute z-10 translate-x-3 p-1 bg-white -mb-7"
          style={{
            display: value ? "block" : "none",
            top: "-15px",
            fontSize: "0.8rem",
            zIndex: 1,
          }}
        >
          Selecciona tu país (opcional)
        </p>
      )}
      <Select
        options={countryOptions}
        value={selected}
        isClearable
        onChange={(opt) => onChange(opt)}
        placeholder={hidePlaceholder ? "" : "Selecciona tu país (opcional)"}
        menuPlacement="bottom"
        // menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        maxMenuHeight={200}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: "var(--border)",
            borderWidth: "1.3px",
            boxShadow: state.isFocused
              ? "0 0 0 1px var(--ring), 0 1px 2px 0 rgb(0 0 0 / 0.05)" // sombra + ring al enfocar
              : "0 1px 2px 0 rgb(0 0 0 / 0.05)", // solo sombra cuando no está enfocado
            borderRadius: borderRadius ? borderRadius : "0.375rem",
            "&:hover": { borderColor: "var(--border)" },
            height: height,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 99999 }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#000000"
              : state.isFocused
              ? "#E6E6E6"
              : "white",
            color: state.isSelected ? "white" : "black",
            fontSize: "0.875rem",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#aaa",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "calc(100% - 24px)",
          }),
          singleValue: (base) => ({
            ...base,
            fontSize: "0.875rem",
          }),
        }}
      />
    </div>
  );
};

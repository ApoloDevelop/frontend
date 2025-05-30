// components/register/CountrySelect.tsx
import React from "react";
import Select from "react-select";
import Flag from "react-world-flags";

interface CountryOption {
  value: string;
  label: React.ReactNode;
  dialCode: string;
}

interface CountrySelectProps {
  options: CountryOption[];
  value: string;
  onChange: (selected: CountryOption | null) => void;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const selected = options.find((opt) => opt.value === value) || null;

  return (
    <div className="relative w-9/10 mb-6">
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
      <Select
        options={options}
        value={selected}
        isClearable
        onChange={(opt) => onChange(opt)}
        placeholder="Selecciona tu país (opcional)"
        menuPlacement="bottom"
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: "black",
            fontSize: "15px",
            boxShadow: state.isFocused ? "0 0 0 0px black" : "none",
            "&:hover": { borderColor: "black" },
            height: "50px",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#000000"
              : state.isFocused
              ? "#E6E6E6"
              : "white",
            color: state.isSelected ? "white" : "black",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#aaa",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "calc(100% - 24px)",
          }),
        }}
      />
    </div>
  );
};

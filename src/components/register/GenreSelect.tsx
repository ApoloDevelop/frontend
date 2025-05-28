// components/register/GenreSelect.tsx
import React from "react";
import Select from "react-select";
import { getGenreLabel } from "@/utils/registerFunctions";

interface GenreOption {
  value: string;
  label: string;
}

interface GenreSelectProps {
  value: string | null;
  onChange: (val: string | null) => void;
}

export const GenreSelect: React.FC<GenreSelectProps> = ({
  value,
  onChange,
}) => {
  const genreOptions: GenreOption[] = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" },
    { value: "non_binary", label: "No binario" },
    { value: "other", label: "Otro" },
    { value: "prefer_not_to_say", label: "Prefiero no decirlo" },
  ];

  return (
    <div className="relative w-9/10 mb-6">
      <p
        id="genre-label"
        className="absolute z-10 translate-x-3 p-1 bg-white -mb-7"
        style={{
          display: value ? "block" : "none",
          top: "-15px",
          fontSize: "0.8rem",
        }}
      >
        Selecciona tu género
      </p>
      <Select
        options={genreOptions}
        isClearable
        placeholder="Selecciona tu género"
        menuPlacement="top"
        value={value ? { value, label: getGenreLabel(value) } : null}
        onChange={(selected) =>
          onChange(
            selected?.value === "prefer_not_to_say"
              ? null
              : selected?.value || ""
          )
        }
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: "black",
            boxShadow: state.isFocused ? "0 0 0 0px black" : "none",
            "&:hover": { borderColor: "black" },
            height: "50px",
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
          }),
          placeholder: (base) => ({ ...base, color: "#aaa" }),
        }}
      />
    </div>
  );
};

import React from "react";
import Select from "react-select";
import { getGenreLabel } from "@/utils/genre";

interface GenreOption {
  value: string;
  label: string;
}

interface GenreSelectProps {
  value: string | null;
  onChange: (val: string | null) => void;
  hideFloatingLabel?: boolean;
  hidePlaceholder?: boolean;
  className?: string;
  height?: string | number;
  borderRadius?: string;
}

export const GenreSelect: React.FC<GenreSelectProps> = ({
  value,
  onChange,
  hideFloatingLabel = false,
  hidePlaceholder = false,
  className = "",
  height = "50px",
  borderRadius = "0.375rem",
}) => {
  const genreOptions: GenreOption[] = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Femenino" },
    { value: "non_binary", label: "No binario" },
    { value: "other", label: "Otro" },
    { value: "prefer_not_to_say", label: "Prefiero no decirlo" },
  ];

  return (
    <div className={`relative ${className}`}>
      {!hideFloatingLabel && (
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
      )}
      <Select
        options={genreOptions}
        isClearable
        placeholder={hidePlaceholder ? "" : "Selecciona tu género"}
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

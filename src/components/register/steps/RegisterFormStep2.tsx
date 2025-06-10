import React from "react";
import { FloatingInput } from "../FloatingInput";
import { CountrySelect } from "../CountrySelect";
import { GenreSelect } from "../GenreSelect";
import { PhoneInput } from "../PhoneInput";

interface RegisterFormStep2Props {
  formData: any;
  fieldErrors: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (selected: any) => void;
  onGenreChange: (val: string | null) => void;
  onPhoneChange: (prefix: string, number: string) => void;
  countryOptions: any[];
  dialCodeOptions: any[];
}

export const RegisterFormStep2: React.FC<RegisterFormStep2Props> = ({
  formData,
  fieldErrors,
  handleChange,
  onCountryChange,
  onGenreChange,
  onPhoneChange,
  countryOptions,
  dialCodeOptions,
}) => {
  return (
    <div className="w-full flex-shrink-0 h-auto">
      <h3 className="text-lg mb-4 text-center">¡Cuéntanos más!</h3>
      <form className="space-y-4 flex flex-col items-center">
        {/* Fecha de nacimiento */}
        <FloatingInput
          label="Fecha de nacimiento"
          name="birthdate"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={formData.birthdate || ""}
          onChange={handleChange}
          required
          error={fieldErrors.birthdate}
        />

        {/* País */}
        <CountrySelect
          options={countryOptions}
          value={formData.country}
          onChange={onCountryChange}
        />

        {/* Ciudad */}
        <FloatingInput
          label="Ciudad (opcional)"
          name="city"
          autoComplete="address-level2"
          value={formData.city || ""}
          onChange={handleChange}
        />

        {/* Género */}
        <GenreSelect
          value={formData.social_genre}
          onChange={onGenreChange}
          className="w-9/10 mb-6"
        />

        {/* Teléfono */}
        <PhoneInput
          prefix={formData.phonePrefix}
          number={formData.phone}
          onChange={onPhoneChange}
          dialCodeOptions={dialCodeOptions}
          fieldError={fieldErrors.phone}
        />
      </form>
    </div>
  );
};

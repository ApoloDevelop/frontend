import { CountrySelect } from "@/components/register/CountrySelect";
import { PhoneInput } from "@/components/register/PhoneInput";
import { Input } from "../ui/input";
import { countries } from "@/data/countries";
import Flag from "react-world-flags";
import { GenreSelect } from "../register/GenreSelect";

interface EditPersonalDataFormProps {
  birthdate: string;
  setBirthdate: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  phonePrefix: string;
  setPhonePrefix: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  genre: string | null;
  setGenre: (v: string | null) => void;
  fieldErrors: any;
}

export function EditPersonalDataForm({
  birthdate,
  setBirthdate,
  country,
  setCountry,
  city,
  setCity,
  phonePrefix,
  setPhonePrefix,
  phone,
  setPhone,
  genre,
  setGenre,
  fieldErrors,
}: EditPersonalDataFormProps) {
  const countryOptions = countries
    .sort((a, b) =>
      a.translations.spa.common.localeCompare(b.translations.spa.common, "es")
    )
    .map((country) => ({
      value: country.translations.spa.common,
      label: (
        <div className="flex items-center">
          <Flag code={country.cca2} className="w-5 h-5 mr-2" />
          {country.translations.spa.common}
        </div>
      ),
      dialCode: country.idd.root + (country.idd.suffixes?.[0] || ""),
    }));

  const dialCodeOptions = countries.map((country) => ({
    value: country.idd.root + (country.idd.suffixes?.[0] || ""),
    label: country.translations.spa.common,
    flagCode: country.cca2,
  }));

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-semibold mb-1 block">
          Fecha de nacimiento
        </label>
        <Input
          name="birthdate"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
          className={fieldErrors.birthdate ? "border-red-500 border-2" : ""}
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">País</label>
        <CountrySelect
          options={countryOptions}
          value={country}
          onChange={(opt) => setCountry(opt?.value || "")}
          className="w-full mb-0"
          hideFloatingLabel
          hidePlaceholder
          borderRadius="0.5rem"
          height={"30px"}
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Ciudad</label>
        <Input
          name="city"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={fieldErrors.city ? "border-red-500 border-2" : ""}
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Género</label>
        <GenreSelect
          value={genre}
          onChange={setGenre}
          hideFloatingLabel
          hidePlaceholder
          className="w-full mb-0"
          height={"30px"}
          borderRadius="0.5rem"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-1 block">Teléfono</label>
        <PhoneInput
          prefix={phonePrefix}
          number={phone}
          onChange={(newPrefix, newNumber) => {
            setPhonePrefix(newPrefix);
            setPhone(newNumber);
          }}
          dialCodeOptions={dialCodeOptions}
          fieldError={fieldErrors.phone}
        />
      </div>
    </div>
  );
}

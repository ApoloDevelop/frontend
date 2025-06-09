import { CountrySelect } from "@/components/register/CountrySelect";
import { PhoneInput } from "@/components/register/PhoneInput";
import { Input } from "../ui/input";
import { countries } from "@/data/countries";
import Flag from "react-world-flags";

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
    <form className="space-y-4 flex flex-col items-center">
      <label className="text-sm font-semibold">Fecha de nacimiento</label>
      <Input
        name="birthdate"
        type="date"
        max={new Date().toISOString().split("T")[0]}
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        required
        // error={fieldErrors.birthdate}
      />

      <label className="text-sm font-semibold">País</label>
      <CountrySelect
        options={countryOptions}
        value={country}
        onChange={(opt) => setCountry(opt?.value || "")}
      />

      <label className="text-sm font-semibold">Ciudad</label>
      <Input
        name="city"
        autoComplete="address-level2"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        // error={fieldErrors.city}
      />

      <label className="text-sm font-semibold">Teléfono</label>
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
    </form>
  );
}

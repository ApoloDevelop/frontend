import { CountrySelect } from "@/components/register/CountrySelect";
import { PhoneInput } from "@/components/register/PhoneInput";
import { Input } from "../ui/input";
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
  return (
    <div className="space-y-4 mt-4">
      <div id="birthdate-input">
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

      <div id="country-select">
        <label className="text-sm font-semibold mb-1 block">País</label>
        <CountrySelect
          value={country}
          onChange={(opt) => setCountry(opt?.value || "")}
          className="w-full mb-0"
          hideFloatingLabel
          hidePlaceholder
          borderRadius="0.5rem"
          height={"30px"}
        />
      </div>

      <div id="city-input">
        <label className="text-sm font-semibold mb-1 block">Ciudad</label>
        <Input
          name="city"
          autoComplete="address-level2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={fieldErrors.city ? "border-red-500 border-2" : ""}
        />
      </div>

      <div id="genre-select">
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
      <div id="phone-input">
        <label className="text-sm font-semibold mb-1 block">Teléfono</label>
        <PhoneInput
          prefix={phonePrefix}
          number={phone}
          onChange={(newPrefix, newNumber) => {
            setPhonePrefix(newPrefix);
            setPhone(newNumber);
          }}
          fieldError={fieldErrors.phone}
          className="flex w-full mb-6 gap-2"
          hidePlaceholder
          hideFloatingLabel
          height={"30px"}
          borderRadius="0.5rem"
          isEdit
        />
      </div>
    </div>
  );
}

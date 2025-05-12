"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { countries } from "@/data/countries";
import Flag from "react-world-flags";
import Select from "react-select";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // Controla el paso actual del slide
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    country: "",
    city: "",
    postalCode: "",
    phone: "",
    phonePrefix: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setFormData({ ...formData, country: e.target.value });
  // };

  const handleCountryChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      country: selectedOption?.value || "",
    });
  };

  const countryOptions = countries
    .sort((a, b) =>
      a.translations.spa.common.localeCompare(b.translations.spa.common, "es")
    ) // Ordena los países por su traducción al español
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

  const formatDialCodeLabel = (
    { label, flagCode }: any,
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
    <div
      className="min-h-screen flex items-center justify-center bg-gray-200 relative"
      style={{
        backgroundImage: "url('/register.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <div
        className="w-full h-full absolute top-0 left-0"
        style={{
          backdropFilter: "blur(5px)",
        }}
      ></div>
      <div
        className="p-3 rounded-xl w-1/3 max-w-md min-h-[500px] transform transition flex flex-col gap-y-px duration-300 opacity-95 animate-fade-in"
        style={{
          backgroundColor: "var(--container-background)",
          boxShadow: "0 4px 50px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2 className="text-2xl mb-4 text-center font-bold">
          ¡Bienvenido a Apolo!
        </h2>

        {/* Contenedor del slide */}
        <div className="overflow-hidden ">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* Página 1 */}
            <div className="w-full flex-shrink-0 ">
              <h3 className="text-lg mb-4 text-center">Háblanos de ti</h3>
              <form className="space-y-4 flex flex-col items-center" action="">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Nombre completo"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repetir contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                  autoComplete="new-password"
                />
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      Las contraseñas no coinciden
                    </p>
                  )}
              </form>
            </div>

            {/* Placeholder para futuras páginas */}
            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4 text-center">¡Cuéntanos más!</h3>
              <form className="space-y-4 flex flex-col items-center">
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]} // Limita la fecha a hoy
                  name="birthdate"
                  placeholder="Fecha de nacimiento"
                  value={formData.birthdate || ""}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                />
                <Select
                  options={countryOptions}
                  value={
                    countryOptions.find(
                      (option) => option.value === formData.country
                    ) || null
                  }
                  isClearable
                  onChange={handleCountryChange}
                  placeholder={"Selecciona tu país"}
                  className={"w-9/10 mb-8"}
                  menuPlacement="bottom"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: state.isFocused ? "black" : "black", // Color del borde
                      boxShadow: state.isFocused ? "0 0 0 0px black" : "none", // Sombra al enfocar
                      "&:hover": {
                        borderColor: "black", // Color del borde al pasar el mouse
                      },
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999, // Asegúrate de que el menú esté por encima de otros elementos
                    }),
                  }}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={formData.city || ""}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Código postal"
                  value={formData.postalCode || ""}
                  onChange={handleChange}
                  required
                  className="w-9/10 px-3 py-2 border rounded mb-8 border-black"
                />
                <div className="flex items-center gap-2 mb-8">
                  <Select
                    options={dialCodeOptions}
                    formatOptionLabel={formatDialCodeLabel}
                    // Si quieres que el valor almacenado sea solo el prefijo numérico
                    getOptionValue={(opt) => opt.value}
                    isClearable
                    onChange={(opt: any) => {
                      setFormData({
                        ...formData,
                        phonePrefix: opt?.value || "", // Actualiza solo el prefijo
                        phone: "", // Limpia el número si se cambia el prefijo
                      });
                    }}
                    placeholder="Prefijo"
                    className="w-1/2 mb-8"
                    menuPlacement="top"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? "black" : "black",
                        boxShadow: state.isFocused ? "0 0 0 0px black" : "none",
                        "&:hover": { borderColor: "black" },
                      }),
                      menu: (base) => ({ ...base, width: "200px" }),
                    }}
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Teléfono"
                    value={`${formData.phonePrefix} ${formData.phone}`.trim()} // Concatena el prefijo y el número
                    onChange={(e) => {
                      const prefix = formData.phonePrefix;
                      const inputValue = e.target.value;

                      // Asegúrate de que el prefijo no sea editable
                      if (inputValue.startsWith(prefix)) {
                        setFormData({
                          ...formData,
                          phone: inputValue.slice(prefix.length).trim(),
                        });
                      }
                    }}
                    required
                    disabled={!formData.phonePrefix} // Deshabilita el campo si no hay prefijo seleccionado
                    className="w-full px-8 py-1.5 border rounded mb-8 border-black"
                  />
                </div>
              </form>
            </div>

            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4">Página 3 (Placeholder)</h3>
              <p>Contenido de la tercera página.</p>
            </div>
          </div>
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((page) => (
            <div
              key={page}
              className={`w-2 h-2 rounded-full ${
                step === page
                  ? "bg-black w-3 h-3 relative -top-0.5"
                  : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-between mt-6">
          <Button onClick={handlePrev} disabled={step === 1}>
            Anterior
          </Button>
          <Button onClick={handleNext} disabled={step === 3}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

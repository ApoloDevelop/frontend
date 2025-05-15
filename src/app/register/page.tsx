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
    genre: "",
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

  const getGenreLabel = (value: string) => {
    switch (value) {
      case "male":
        return "Masculino";
      case "female":
        return "Femenino";
      case "non_binary":
        return "No binario";
      case "other":
        return "Otro";
      case "prefer_not_to_say":
        return "Prefiero no decirlo";
      default:
        return "";
    }
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
          backdropFilter: "blur(12px)",
        }}
      ></div>
      <div
        className="p-3 rounded-xl w-9/10 lg:w-full max-w-md min-h-[500px] transform transition flex flex-col gap-y-px duration-300 opacity-95 animate-fade-in"
        style={{
          backgroundColor: "var(--container-background)",
          boxShadow: "0 4px 50px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2 className="text-xl mb-4 text-center font-bold">
          ¡Bienvenido a Apolo!
        </h2>

        {/* Contenedor del slide */}
        <div className="overflow-x-hidden ">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* Página 1 */}
            <div className="w-full flex-shrink-0 ">
              <h3 className="text-lg mb-4 text-center">Háblanos de ti</h3>
              <form className="space-y-4 flex flex-col items-center" action="">
                {/* Input para nombre completo */}
                <div className="relative w-9/10 mb-6">
                  <style>
                    {`.relative {
                      position: relative;
                    }

                    input {
                      padding: 12px 8px;
                      border: 1px solid #000;
                      border-radius: 4px;
                      outline: none;
                    }

                    label {
                      position: absolute;
                      left: 12px;
                      top: 70%;
                      transform: translateY(-90%);
                      color: #aaa;
                      font-size: 16px;
                      transition: all 0.2s ease-in-out;
                      pointer-events: none;
                    }

                    input:focus + label,
                    input:not(:placeholder-shown) + label {
                      top: 8px;
                      font-size: 12px;
                      color: #000;
                    }
                  `}
                  </style>
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    placeholder=" "
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                  />
                  <label
                    htmlFor="fullname"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Nombre completo
                  </label>
                </div>
                {/* Input para nombre de usuario */}
                <div className="relative w-9/10 mb-6">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder=" "
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Nombre de usuario
                  </label>
                </div>
                {/* Input para el correo electrónico */}
                <div className="relative w-9/10 mb-6">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Correo electrónico
                  </label>
                </div>
                {/* Input para contraseña */}
                <div className="relative w-9/10 mb-6">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                    autoComplete="new-password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Contraseña
                  </label>
                </div>
                {/* Input para confirmar contraseña */}
                <div className="relative w-9/10 mb-6">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder=" "
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                    autoComplete="new-password"
                  />
                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Repetir contraseña
                  </label>
                </div>
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      Las contraseñas no coinciden
                    </p>
                  )}
              </form>
            </div>

            {/* Página 2*/}
            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4 text-center">¡Cuéntanos más!</h3>
              <form className="space-y-4 flex flex-col items-center">
                {/* Selector de fecha */}
                <div className="relative w-9/10 mb-6">
                  <input
                    type="date"
                    name="birthdate"
                    id="birthdate"
                    placeholder=" "
                    max={new Date().toISOString().split("T")[0]} // Limita la fecha a hoy
                    value={formData.birthdate || ""}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                  />
                  <label
                    htmlFor="birthdate"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Fecha de nacimiento
                  </label>
                </div>
                {/* Selector de país */}
                <div className="relative w-9/10 mb-6">
                  <p
                    id="country-label"
                    className="absolute z-10 translate-x-3 p-1 bg-white -mb-7"
                    style={{
                      display: "none",
                      top: "-15px",
                      fontSize: "0.8rem",
                      zIndex: 1,
                    }}
                  >
                    Selecciona tu país (opcional)
                  </p>
                  <Select
                    options={countryOptions}
                    value={
                      countryOptions.find(
                        (option) => option.value === formData.country
                      ) || null
                    }
                    isClearable
                    onChange={(e) => {
                      handleCountryChange(e);
                      if (e) {
                        document.getElementById(
                          "country-label"
                        )!.style.display = "block";
                      } else {
                        document.getElementById(
                          "country-label"
                        )!.style.display = "none";
                      }
                    }}
                    placeholder={"Selecciona tu país (opcional)"}
                    menuPlacement="bottom"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? "black" : "black", // Color del borde
                        fontSize: "15px", // Tamaño de la fuente
                        boxShadow: state.isFocused ? "0 0 0 0px black" : "none", // Sombra al enfocar
                        "&:hover": {
                          borderColor: "black", // Color del borde al pasar el mouse
                        },
                        height: "50px", // Altura del control
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999, // Asegúrate de que el menú esté por encima de otros elementos
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#000000"
                          : state.isFocused
                          ? "#E6E6E6"
                          : "white", // Cambia el color de fondo
                        color: state.isSelected ? "white" : "black", // Cambia el color del texto
                        "&:hover": {
                          backgroundColor: "#E6E6E6", // Color al pasar el mouse
                          color: "black",
                        },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#aaa",
                      }),
                    }}
                  />
                </div>
                {/* Input para Ciudad */}
                <div className="relative w-9/10 mb-6">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder=" "
                    value={formData.city || ""}
                    onChange={handleChange}
                    required
                    className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
                  />
                  <label
                    htmlFor="city"
                    className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                    style={{ zIndex: 1 }}
                  >
                    Ciudad (opcional)
                  </label>
                </div>
                {/* Input para género */}
                <div className="relative w-9/10 mb-6">
                  <p
                    id="genre-label"
                    className="absolute z-10 translate-x-3 p-1 bg-white -mb-7"
                    style={{
                      display: "none",
                      top: "-15px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Selecciona tu género
                  </p>
                  <Select
                    options={[
                      { value: "male", label: "Masculino" },
                      { value: "female", label: "Femenino" },
                      { value: "non_binary", label: "No binario" },
                      { value: "other", label: "Otro" },
                      {
                        value: "prefer_not_to_say",
                        label: "Prefiero no decirlo",
                      },
                    ]}
                    value={
                      formData.genre
                        ? {
                            value: formData.genre,
                            label: getGenreLabel(formData.genre),
                          }
                        : null
                    }
                    onChange={(selectedOption: any) => {
                      setFormData({
                        ...formData,
                        genre: selectedOption?.value || "",
                      });
                      if (selectedOption) {
                        document.getElementById("genre-label")!.style.display =
                          "block";
                      } else {
                        document.getElementById("genre-label")!.style.display =
                          "none";
                      }
                    }}
                    placeholder="Selecciona tu género"
                    menuPlacement="top"
                    isClearable
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? "black" : "black",
                        boxShadow: state.isFocused ? "0 0 0 0px black" : "none",
                        "&:hover": { borderColor: "black" },
                        height: "50px",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#000000"
                          : state.isFocused
                          ? "#E6E6E6"
                          : "white", // Cambia el color de fondo
                        color: state.isSelected ? "white" : "black", // Cambia el color del texto
                        "&:hover": {
                          backgroundColor: "#E6E6E6", // Color al pasar el mouse
                          color: "black",
                        },
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#aaa",
                      }),
                    }}
                  />
                </div>

                <div className="flex w-9/10 mb-6 gap-2">
                  {/* Selector de Prefijo */}
                  <div className="w-3/9">
                    <Select
                      options={dialCodeOptions}
                      formatOptionLabel={formatDialCodeLabel}
                      getOptionValue={(opt) => opt.value}
                      isClearable
                      onChange={(opt: any) => {
                        setFormData({
                          ...formData,
                          phonePrefix: opt?.value || "", // Actualiza solo el prefijo
                          phone: "", // Limpia el número si se cambia el prefijo
                        });
                        console.log(opt);
                      }}
                      placeholder="Prefijo"
                      className="peer"
                      menuPlacement="top"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderColor: state.isFocused ? "black" : "black",
                          boxShadow: state.isFocused
                            ? "0 0 0 0px black"
                            : "none",
                          "&:hover": { borderColor: "black" },
                          height: "50px",
                        }),
                        menu: (base) => ({
                          ...base,
                          width: "200px",
                          zIndex: 9999,
                        }),
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "13px",
                        }),
                      }}
                    />
                  </div>

                  {/* Input para Número de Teléfono */}
                  <div className="w-6/9 relative mb-6">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder=" "
                      value={`${formData.phonePrefix} ${formData.phone}`.trim()}
                      onChange={(e) => {
                        const prefix = formData.phonePrefix;
                        const inputValue = e.target.value;

                        if (inputValue.startsWith(prefix)) {
                          setFormData({
                            ...formData,
                            phone: inputValue.slice(prefix.length).trim(),
                          });
                        }
                      }}
                      required
                      disabled={!formData.phonePrefix} // Deshabilita el campo si no hay prefijo seleccionado
                      className="peer w-full px-3 py-2 border rounded border-black focus:outline-none"
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
              </form>
            </div>

            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4">Página 3 (Placeholder)</h3>
              <p>Contenido de la tercera página.</p>
            </div>
          </div>
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center -mt-8 space-x-2">
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

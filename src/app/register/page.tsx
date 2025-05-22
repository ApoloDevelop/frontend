"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { countries } from "@/data/countries";
import Flag from "react-world-flags";
import Select from "react-select";
import Image from "next/image";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import Modal from "react-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { PasswordStrengthIndicator } from "@/components/ui/PasswordStrengthIndicator";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function RegisterPage() {
  // Constants definition
  const DEFAULT_AVATAR_URL =
    "https://res.cloudinary.com/drolilqxl/image/upload/v1747395444/blank-profile-picture-973460_1280_x0gfs4.png";
  const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/jfif",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // States
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
    social_genre: "",
    phone: "",
    phonePrefix: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    DEFAULT_AVATAR_URL
  );
  const [originalImagePreview, setOriginalImagePreview] = useState<
    string | null
  >(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Options for select
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

  //Functions
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

  const isCurrentPageValid =
    (step === 1 &&
      formData.fullname.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword) ||
    (step === 2 && formData.birthdate);
  step === 3;

  const validatePhoneNumber = (phone: string, phonePrefix: string): boolean => {
    const fullPhoneNumber = `${phonePrefix}${phone}`.trim();
    return isValidPhoneNumber(fullPhoneNumber);
  };

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isStrongPassword(password: string) {
    // Al menos 8 caracteres, una mayúscula, una minúscula, un número
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  }

  async function checkIfExists(email: string, username: string, phone: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/exists?email=${email}&username=${username}&phone=${phone}`
      );
      if (!res.ok) throw new Error("Error al verificar los datos");
      return await res.json();
    } catch (error) {
      console.error(error);
      return { emailExists: false, usernameExists: false, phoneExists: false };
    }
  }

  // Handlers
  const handleNext = async () => {
    const errors: { [key: string]: boolean } = {};
    if (step === 1) {
      setIsLoading(true); // Activa la pantalla de carga

      if (!isValidEmail(formData.email)) {
        setAlertMsg("Por favor, introduce un correo electrónico válido.");
        errors.email = true;
      }
      if (!isStrongPassword(formData.password)) {
        setAlertMsg(
          "La contraseña no es suficientemente fuerte. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un carácter especial y un número."
        );
        errors.password = true;
      }
      if (formData.password !== formData.confirmPassword) {
        setAlertMsg("Las contraseñas no coinciden.");
        errors.password = true;
        errors.confirmPassword = true;
      }

      // Verificar si el correo o el nombre de usuario ya existen
      const { emailExists, usernameExists } = await checkIfExists(
        formData.email,
        formData.username,
        "" // No necesitamos teléfono aquí
      );
      if (emailExists) {
        setAlertMsg("El correo electrónico ya está registrado.");
        errors.email = true;
      }
      if (usernameExists) {
        setAlertMsg("El nombre de usuario ya está registrado.");
        errors.username = true;
      }

      setFieldErrors(errors);
      setIsLoading(false); // Desactiva la pantalla de carga

      if (Object.keys(errors).length > 0) return;

      setStep(2);
      return;
    }

    if (step === 2) {
      setIsLoading(true); // Activa la pantalla de carga
      // Validar fecha de nacimiento
      const today = new Date().toISOString().split("T")[0];
      if (!formData.birthdate || formData.birthdate > today) {
        setAlertMsg("Por favor, introduce una fecha de nacimiento válida.");
        errors.birthdate = true;
      }

      if (formData.phonePrefix && formData.phone) {
        const isPhoneValid = validatePhoneNumber(
          formData.phone,
          formData.phonePrefix
        );
        if (!isPhoneValid) {
          setAlertMsg("Por favor, introduce un número de teléfono válido.");
          errors.phone = true;
        } else {
          const phone = `${formData.phonePrefix.trim()}${formData.phone.trim()}`;
          const { phoneExists } = await checkIfExists(
            "", // No necesitamos email aquí
            "", // No necesitamos username aquí
            phone // Teléfono completo
          );

          if (phoneExists) {
            setAlertMsg("El número de teléfono ya está registrado.");
            errors.phone = true;
          }
        }
      }
      setFieldErrors(errors);
      setIsLoading(false); // Desactiva la pantalla de carga

      if (Object.keys(errors).length > 0) return;
      setStep(3);
      return;
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: false });
    }
  };

  const handleCountryChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      country: selectedOption?.value || "",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!acceptedTypes.includes(file.type)) {
        setAlertMsg(
          ` Esta página acepta los siguientes tipos de archivo: JPEG, PNG, GIF, WEBP.  "${file.name}" no se registra como un tipo de archivo aceptado.`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      setProfileImage(file);
      setOriginalImagePreview(url);
      setImagePreview(url);
      setShowCropper(true);
    }
  };

  const handleCropSave = async () => {
    if (!originalImagePreview || !croppedAreaPixels) return;

    // Obtén la imagen recortada como un Data URL
    const croppedImage = await getCroppedImg(
      originalImagePreview,
      croppedAreaPixels
    );

    // Convierte el Data URL en un archivo
    const croppedImageFile = await fetch(croppedImage)
      .then((res) => res.blob())
      .then(
        (blob) => new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
      );

    setImagePreview(croppedImage); // Actualiza la vista previa con la imagen recortada
    setProfileImage(croppedImageFile); // Actualiza el archivo de imagen a subir
    setShowCropper(false); // Cierra el cropper
  };

  const handleCreateAccount = async () => {
    setIsLoading(true); // Activa la pantalla de carga

    try {
      let profilePicUrl = DEFAULT_AVATAR_URL;

      // Subir la imagen a Cloudinary si existe
      if (profileImage) {
        const formData = new FormData();
        formData.append("file", profileImage);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Error al subir la imagen");
        const data = await res.json();
        profilePicUrl = data.url; // URL de la imagen subida
      }

      const { confirmPassword, phonePrefix, ...filteredFormData } = formData;
      // Crear el cuerpo del formulario
      const body = {
        ...filteredFormData,
        phone: formData.phonePrefix + formData.phone,
        profile_pic: profilePicUrl, // URL de la imagen subida
        social_genre: formData.social_genre || null, // Asigna null si no se selecciona género
      };

      console.log("Cuerpo del formulario:", body);

      // Enviar el formulario al backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Error al crear la cuenta");
      const data = await res.json();

      // Mostrar mensaje de éxito o redirigir
      setAlertMsg("¡Cuenta creada con éxito!");
      console.log("Usuario creado:", data);
    } catch (error: any) {
      console.error(error);
      setAlertMsg(error.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false); // Desactiva la pantalla de carga
    }
  };

  const handleUpload = async () => {
    if (!profileImage) return;
    const formData = new FormData();
    formData.append("file", profileImage);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded image URL:", data.url);
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  useEffect(() => {
    if (alertMsg) {
      setShowAlert(true);
      const hideTimeout = setTimeout(() => setShowAlert(false), 4700); // Empieza fade out antes de desmontar
      const removeTimeout = setTimeout(() => setAlertMsg(null), 5000); // Desmonta tras el fade
      return () => {
        clearTimeout(hideTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [alertMsg]);

  return (
    <div>
      {isLoading && <LoadingScreen />}
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
          paddingTop: "4rem", // Añade un padding superior para evitar la superposición
          paddingBottom: "4rem", // Añade un padding inferior para evitar la superposición
        }}
      >
        <div
          className="w-full h-full absolute top-0 left-0"
          style={{
            backdropFilter: "blur(12px)",
          }}
        ></div>
        {(alertMsg || showAlert) && (
          <div
            className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md transition-opacity duration-300 ${
              showAlert ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 9999 }}
          >
            <Alert
              variant="destructive"
              className="bg-white to-red-700 text-red-500 relative border border-red-500 shadow-lg"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{alertMsg}</AlertDescription>
            </Alert>
          </div>
        )}
        <div
          className="p-6 rounded-xl w-9/10 lg:w-full max-w-md min-h-[500px] transform transition flex flex-col gap-y-px duration-300 opacity-95 animate-fade-in"
          style={{
            backgroundColor: "var(--container-background)",
            boxShadow: "0 4px 50px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2 className="text-xl mb-4 text-center font-bold">
            ¡Bienvenid@ a Apolo!
          </h2>

          {/* Contenedor del slide */}
          <div className="overflow-x-hidden flex">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              {/* Página 1 */}
              <div className="w-full flex-shrink-0 ">
                <h3 className="text-lg mb-4 text-center">Háblanos de ti</h3>
                <form
                  className="space-y-4 flex flex-col items-center"
                  action=""
                >
                  {/* Input para nombre completo */}
                  <div className="floating-label relative w-9/10 mb-6">
                    <style>
                      {`.floating-label {
                        position: relative;
                      }

                      .floating-label input {
                        padding: 12px 8px;
                        border-radius: 4px;
                        outline: none;
                      }

                      .floating-label label {
                        position: absolute;
                        left: 12px;
                        top: 70%;
                        transform: translateY(-90%);
                        color: #aaa;
                        font-size: 16px;
                        transition: all 0.2s ease-in-out;
                        pointer-events: none;
                      }

                      .floating-label input:focus + label,
                      .floating-label input:not(:placeholder-shown) + label {
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
                      className={
                        "peer w-full px-3 py-2 border rounded focus:outline-none border-black"
                      }
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
                  <div className="floating-label relative w-9/10 mb-6">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder=" "
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className={`peer w-full px-3 py-2 border rounded focus:outline-none ${
                        fieldErrors.username
                          ? "border-red-500 border-2"
                          : "border-black"
                      }`}
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
                  <div className="floating-label relative w-9/10 mb-6">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`peer w-full px-3 py-2 border rounded focus:outline-none ${
                        fieldErrors.email
                          ? "border-red-500 border-2"
                          : "border-black"
                      }`}
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
                  <div className="floating-label relative w-9/10 mb-6">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder=" "
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`peer w-full px-3 py-2 border rounded focus:outline-none ${
                        fieldErrors.password
                          ? "border-red-500 border-2"
                          : "border-black"
                      }`}
                      autoComplete="new-password"
                      title="La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                      style={{ zIndex: 1 }}
                    >
                      Contraseña
                    </label>
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-4 text-gray-400 hover:text-black cursor-pointer"
                      onClick={() => setShowPassword((v) => !v)}
                      title={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        // Ojo abierto
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        // Ojo tachado
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      )}
                    </button>
                    {formData.password && (
                      <PasswordStrengthIndicator password={formData.password} />
                    )}
                  </div>
                  {/* Input para confirmar contraseña */}
                  <div className="floating-label relative w-9/10 mb-10">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder=" "
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`peer w-full px-3 py-2 border rounded focus:outline-none ${
                        fieldErrors.confirmPassword
                          ? "border-red-500 border-2"
                          : "border-black"
                      }`}
                      autoComplete="new-password"
                    />
                    <label
                      htmlFor="confirmPassword"
                      className="absolute left-3 top-2 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black"
                      style={{ zIndex: 1 }}
                    >
                      Repetir contraseña
                    </label>
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      title={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showConfirmPassword ? (
                        // Ojo abierto
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        // Ojo tachado
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.634A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3l18 18"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
                {formData.password &&
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mb-4 -translate-y-6 text-center">
                      Las contraseñas no coinciden
                    </p>
                  )}
              </div>

              {/* Página 2*/}
              <div className="w-full flex-shrink-0 h-auto">
                <h3 className="text-lg mb-4 text-center">¡Cuéntanos más!</h3>
                <form className="space-y-4 flex flex-col items-center">
                  {/* Selector de fecha */}
                  <div className="floating-label relative w-9/10 mb-6">
                    <input
                      type="date"
                      name="birthdate"
                      id="birthdate"
                      placeholder=" "
                      max={new Date().toISOString().split("T")[0]} // Limita la fecha a hoy
                      value={formData.birthdate || ""}
                      onChange={handleChange}
                      required
                      className={`peer w-full px-3 py-2 border rounded focus:outline-none ${
                        fieldErrors.birthdate
                          ? "border-red-500 border-2"
                          : "border-black"
                      }`}
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
                          boxShadow: state.isFocused
                            ? "0 0 0 0px black"
                            : "none", // Sombra al enfocar
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
                  <div className="floating-label relative w-9/10 mb-6">
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
                        formData.social_genre
                          ? {
                              value: formData.social_genre,
                              label: getGenreLabel(formData.social_genre),
                            }
                          : null
                      }
                      onChange={(selectedOption: any) => {
                        setFormData({
                          ...formData,
                          social_genre: selectedOption?.value || "",
                        });
                        if (selectedOption) {
                          document.getElementById(
                            "genre-label"
                          )!.style.display = "block";
                        } else {
                          document.getElementById(
                            "genre-label"
                          )!.style.display = "none";
                        }
                      }}
                      placeholder="Selecciona tu género"
                      menuPlacement="top"
                      isClearable
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
                    <div className="floating-label w-6/9 relative mb-6">
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
                        className={`peer w-full px-3 py-2 border rounded border-black focus:outline-none ${
                          fieldErrors.phone
                            ? "border-red-500 border-2"
                            : "border-black"
                        }`}
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
                <h3 className="text-lg mb-4 text-center">
                  ¡Estamos terminando!
                </h3>
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold">Sube tu foto de perfil</h3>
                  <p className="text-sm mb-4">(Si quieres)</p>
                  {imagePreview && (
                    <div
                      className="relative group mb-4"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <Image
                        width={120}
                        height={120}
                        src={imagePreview}
                        alt="Preview"
                        className={
                          `rounded-full object-cover w-[120px] h-[120px] transition-all duration-200` +
                          (profileImage
                            ? " border-2 border-gray-300 group hover:border-gray-400 hover:brightness-90 cursor-pointer"
                            : "")
                        }
                        style={{
                          width: "120px",
                          height: "120px",
                        }}
                        onClick={() => {
                          if (profileImage) setShowCropper(true);
                        }}
                        title={
                          profileImage
                            ? "Haz click para recortar la imagen"
                            : ""
                        }
                      />
                      {/* Overlay opcional para indicar acción */}
                      {profileImage && (
                        <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity duration-200 select-none">
                          <span className="text-xs text-white font-semibold select-none">
                            Recortar
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative w-3/4 mb-4 flex flex-row items-center">
                    <label
                      htmlFor="profile-image-input"
                      className="block w-full cursor-pointer border border-gray-300 rounded px-4 py-2 text-center bg-white hover:bg-gray-100 transition mb-4 text-gray-400 text-sm"
                    >
                      {profileImage
                        ? "¿No te convence? Selecciona otra"
                        : "Seleccionar imagen"}
                      <input
                        id="profile-image-input"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={acceptedTypes.join(",")}
                        onChange={handleImageChange}
                      />
                    </label>
                    {profileImage && (
                      <Button
                        type="button"
                        variant="hover"
                        title="Eliminar imagen"
                        aria-label="Remove image"
                        className="mb-4 text-xl text-gray-400 hover:text-red-500 px-2 py-0 h-auto"
                        style={{ marginBottom: "1rem" }}
                        onClick={() => {
                          setProfileImage(null);
                          setImagePreview(DEFAULT_AVATAR_URL);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                      >
                        x
                      </Button>
                    )}
                  </div>
                </div>
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
          <div className="flex justify-between mt-2">
            {step > 1 ? (
              <Button onClick={handlePrev}>Anterior</Button>
            ) : (
              <div /> // Ocupa el espacio para que el botón "Siguiente" no se mueva
            )}
            {step === 3 ? (
              <Button onClick={handleCreateAccount} disabled={isLoading}>
                Crear cuenta
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!isCurrentPageValid}>
                Siguiente
              </Button>
            )}
          </div>
          <Modal
            isOpen={showCropper}
            onRequestClose={() => setShowCropper(false)}
            ariaHideApp={false}
            overlayClassName="modal-blur-overlay"
            style={{
              content: {
                width: "auto",
                minWidth: 250,
                maxWidth: 400,
                height: "auto",
                minHeight: 0,
                margin: "auto",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          >
            <div style={{ position: "relative", width: "100%", height: 300 }}>
              <Cropper
                image={originalImagePreview!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            {/* Controlador de zoom */}
            <div className="w-full flex flex-col items-center mt-4">
              <label
                htmlFor="zoom-range"
                className="text-xs text-gray-600 mb-1"
              >
                Zoom
              </label>
              <Slider
                id="zoom-range"
                min={1}
                max={3}
                step={0.01}
                value={[zoom]}
                onValueChange={([val]) => setZoom(val)}
                className="w-3/4"
              />
            </div>
            <div className="flex flex-row gap-2 mt-4 justify-center">
              <Button onClick={() => setShowCropper(false)}>Cancelar</Button>
              <Button onClick={handleCropSave}>Recortar</Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

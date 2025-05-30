"use client";

import { Button } from "@/components/ui/button";
import { countries } from "@/data/countries";
import Flag from "react-world-flags";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { RegisterService } from "@/services/register.service";
import {
  DEFAULT_AVATAR_URL,
  acceptedTypes,
} from "@/constants/registerConstants";
import { useRegisterForm } from "@/hooks/register/useRegisterForm";
import { useImageCropper } from "@/hooks/register/useImageCropper";
import { useAlert } from "@/hooks/register/useAlert";
import { usePasswordToggle } from "@/hooks/register/usePasswordToggle";
import { useStepValidation } from "@/hooks/register/useStepValidation";
import { isCurrentPageValid } from "@/utils/registerFunctions";
import { StepIndicator } from "@/components/register/StepIndicator";
import { RegisterFormStep1 } from "@/components/register/steps/RegisterFormStep1";
import { RegisterFormStep2 } from "@/components/register/steps/RegisterFormStep2";
import { RegisterFormStep3 } from "@/components/register/steps/RegisterFormStep3";

export default function RegisterPage() {
  // Constants definition
  const {
    step,
    setStep,
    formData,
    setFormData,
    fieldErrors,
    setFieldErrors,
    profileImage,
    setProfileImage,
    imagePreview,
    setImagePreview,
    originalImagePreview,
    setOriginalImagePreview,
    isLoading,
    setIsLoading,
    fileInputRef,
  } = useRegisterForm();

  const {
    showCropper,
    setShowCropper,
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropComplete,
    handleCropSave,
  } = useImageCropper(setProfileImage, setImagePreview);

  const { alertMsg, setAlertMsg, showAlert } = useAlert();

  const {
    showPassword,
    togglePassword,
    showConfirmPassword,
    toggleConfirmPassword,
  } = usePasswordToggle();

  const { validateStep } = useStepValidation(
    formData,
    setFieldErrors,
    setAlertMsg,
    setIsLoading
  );

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

  // Handlers
  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (isValid) {
      setStep(step + 1);
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

  const handleCreateAccount = async () => {
    setIsLoading(true); // Activa la pantalla de carga

    try {
      let profilePicUrl = DEFAULT_AVATAR_URL;

      // Subir la imagen a Cloudinary si existe
      if (profileImage) {
        profilePicUrl = await RegisterService.uploadProfileImage(profileImage);
      }

      // Crear la cuenta
      const data = await RegisterService.createAccount(formData, profilePicUrl);

      setAlertMsg("¡Cuenta creada con éxito!");
      console.log("Usuario creado:", data);
    } catch (error: any) {
      console.error(error);
      setAlertMsg(error.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

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
            style={{
              zIndex: 99999,
              position: "absolute",
              top: "3rem",
            }}
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
          className="p-6 rounded-xl w-9/10 lg:w-full max-w-3xl min-h-[500px] transform transition flex flex-col gap-y-px duration-300 opacity-95 animate-fade-in"
          style={{
            backgroundColor: "var(--container-background)",
            boxShadow: "0 4px 50px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h2 className="text-xl mb-4 text-center font-bold">
            ¡Bienvenid@ a Apolo!
          </h2>

          {/* Contenedor del slide */}
          <div className="overflow-x-hidden min-w-0 flex">
            <div
              className="flex transition-transform min-w-0 duration-500"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              {/* Página 1 */}
              <RegisterFormStep1
                formData={formData}
                fieldErrors={fieldErrors}
                handleChange={handleChange}
                showPassword={showPassword}
                togglePassword={togglePassword}
                showConfirmPassword={showConfirmPassword}
                toggleConfirmPassword={toggleConfirmPassword}
              />

              {/* Página 2*/}
              <RegisterFormStep2
                formData={formData}
                fieldErrors={fieldErrors}
                handleChange={handleChange}
                onCountryChange={handleCountryChange}
                onGenreChange={(val) =>
                  setFormData({ ...formData, social_genre: val ?? "" })
                }
                onPhoneChange={(prefix, number) =>
                  setFormData({
                    ...formData,
                    phonePrefix: prefix,
                    phone: number,
                  })
                }
                countryOptions={countryOptions}
                dialCodeOptions={dialCodeOptions}
              />

              {/* Página 3 */}
              <RegisterFormStep3
                profileImage={profileImage}
                imagePreview={imagePreview ?? ""}
                originalImagePreview={originalImagePreview!}
                fileInputRef={fileInputRef}
                showCropper={showCropper}
                crop={crop}
                setCrop={setCrop}
                zoom={zoom}
                setZoom={setZoom}
                onCropComplete={onCropComplete}
                onCropSave={handleCropSave}
                onImageChange={handleImageChange}
                onRemoveImage={() => {
                  setProfileImage(null);
                  setImagePreview(DEFAULT_AVATAR_URL);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                onEditClick={() => setShowCropper(true)}
                onCloseCropper={() => setShowCropper(false)}
              />
            </div>
          </div>

          {/* Indicadores de página */}
          <StepIndicator currentStep={step} totalSteps={3} />

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
              <Button
                onClick={handleNext}
                disabled={!isCurrentPageValid(step, formData)}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

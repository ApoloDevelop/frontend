export const getGenreLabel = (value: string): string => {
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

export const isCurrentPageValid = (step: number, formData: any): boolean => {
  return (
    (step === 1 &&
      formData.fullname.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword) ||
    (step === 2 && formData.birthdate)
  );
};

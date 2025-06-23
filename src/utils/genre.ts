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

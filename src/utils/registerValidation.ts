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

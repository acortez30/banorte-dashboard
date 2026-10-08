export const usePasswordValidation = (password: string) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  return {
    hasUppercase,
    hasNumber,
    hasSpecial,
    hasMinLength,
    isValid: hasUppercase && hasNumber && hasSpecial && hasMinLength,
  };
};
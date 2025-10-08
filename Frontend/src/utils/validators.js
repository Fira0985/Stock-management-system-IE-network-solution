// Only letters and spaces
export const validateLetters = (str) => /^[A-Za-z\s]+$/.test(str);

// Positive numbers greater than 0
export const validatePositiveNumber = (num) => Number(num) > 0;

// Basic phone validation (digits only, optional + at start)
export const validatePhoneNumber = (str) => /^\+?\d{7,15}$/.test(str);

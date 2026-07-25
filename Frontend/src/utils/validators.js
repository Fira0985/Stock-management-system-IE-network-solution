// Only letters and spaces
export const validateLetters = (str) => /^[A-Za-z\s]+$/.test(str);

// Names may include numbers and spaces but must contain at least one letter
export const validateName = (str) => {
	if (!str) return false;
	const allowed = /^[A-Za-z0-9\s]+$/.test(str);
	const hasLetter = /[A-Za-z]/.test(str);
	return allowed && hasLetter;
};

// Positive numbers greater than 0
export const validatePositiveNumber = (num) => Number(num) > 0;

// Basic phone validation (digits only, optional + at start)
export const validatePhoneNumber = (str) => /^\+?\d{7,15}$/.test(str);

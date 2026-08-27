export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^[0-9]{10}$/.test(phone.replace(/\s+/g, ""));
}

export function isValidPincode(pincode: string): boolean {
  return /^[0-9]{6}$/.test(pincode);
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3;
  label: "Weak" | "Fair" | "Strong";
}

export function passwordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  const label = score <= 1 ? "Weak" : score === 2 ? "Fair" : "Strong";
  return { score: score as 0 | 1 | 2 | 3, label };
}

export function cardNumberValid(num: string): boolean {
  const digits = num.replace(/\s+/g, "");
  return /^[0-9]{16}$/.test(digits);
}

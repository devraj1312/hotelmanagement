// Email format check
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone format check (10 digits)
export const isValidPhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

// Password strength check (min 6 chars)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// License number format check (e.g., MP-UJJ-1234-456)
export const isValidLicenseNo = (licenseNo) => {
  const regex = /^[A-Z]{2}-[A-Z]{3}-\d{4}-\d{3}$/;
  return regex.test(licenseNo);
};
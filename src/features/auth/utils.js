export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };

  score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
};

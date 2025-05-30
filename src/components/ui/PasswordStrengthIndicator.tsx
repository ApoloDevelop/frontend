import React from "react";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export const PasswordStrengthIndicator = ({
  password,
}: {
  password: string;
}) => {
  const strength = getPasswordStrength(password);

  // Define requisitos
  const requirements = [
    {
      label: "Al menos 8 caracteres",
      valid: password.length >= 8,
    },
    {
      label: "Una letra mayúscula",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Una letra minúscula",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Un número",
      valid: /\d/.test(password),
    },
    {
      label: "Un carácter especial",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  // Define fortaleza
  let strengthLabel = "Muy débil";
  let strengthColor = "bg-red-500";
  if (strength == 4) {
    strengthLabel = "Fuerte";
    strengthColor = "bg-green-500";
  } else if (strength === 3) {
    strengthLabel = "Aceptable";
    strengthColor = "bg-yellow-500";
  } else if (strength === 2) {
    strengthLabel = "Débil";
    strengthColor = "bg-orange-400";
  } else if (strength >= 5) {
    strengthLabel = "¡Segura!";
    strengthColor = "bg-green-700";
  }

  return (
    <div className="mt-2">
      {/* Indicador de fortaleza */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-2 rounded w-16 ${strengthColor}`}></div>
        <span
          className="text-xs"
          style={{ color: strengthColor.replace("bg-", "") }}
        >
          {strengthLabel}
        </span>
      </div>

      {/* Lista de requisitos */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
        {requirements.map((req) => (
          <li key={req.label} className="flex items-center gap-1">
            <span
              className={`w-3 h-3 rounded-full inline-block flex-shrink-0 ${
                req.valid ? "bg-green-500" : "bg-gray-300"
              }`}
              style={{ minWidth: "12px", minHeight: "12px" }}
            ></span>
            <span className={req.valid ? "text-green-600" : ""}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

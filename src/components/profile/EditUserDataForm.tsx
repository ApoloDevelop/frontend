import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { EyeToggleIcon } from "../ui/EyeToggleIcon";

interface ProfileFormProps {
  username: string;
  setUsername: (v: string) => void;
  canEditUsername: boolean;
  usernameError: boolean;
  email: string;
  setEmail: (v: string) => void;
  emailError: boolean;
  bio: string;
  setBio: (v: string) => void;
  bioError: boolean;
  password: string;
  setPassword: (v: string) => void;
  passwordError: boolean;
  showPassword: boolean;
  togglePassword: () => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  confirmPasswordError: boolean;
  showConfirmPassword: boolean;
  toggleConfirmPassword: () => void;
}

export function EditUserDataForm({
  username,
  setUsername,
  canEditUsername,
  usernameError,
  email,
  setEmail,
  emailError,
  bio,
  setBio,
  bioError,
  password,
  setPassword,
  passwordError,
  showPassword,
  togglePassword,
  confirmPassword,
  setConfirmPassword,
  confirmPasswordError,
  showConfirmPassword,
  toggleConfirmPassword,
}: ProfileFormProps) {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-semibold">Nombre de usuario</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!canEditUsername}
              tabIndex={0}
              className={usernameError ? "border-red-500 border-2" : ""}
            />
          </TooltipTrigger>
          {canEditUsername && (
            <TooltipContent side="bottom">
              Solo puedes cambiar tu nombre de usuario una vez cada 30 días.
            </TooltipContent>
          )}
        </Tooltip>
        {username && (
          <p
            className={`text-xs w-9/10 mt-2 ${
              username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(username)
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {username.length > 30 ? (
              "El nombre de usuario no puede tener más de 30 caracteres."
            ) : !/^[a-zA-Z0-9_]+$/.test(username) ? (
              "El nombre de usuario solo puede contener letras, números y guion bajo (_)."
            ) : (
              <>
                Tu nombre de usuario será:{" "}
                <span>@{username.toLowerCase()}</span>
              </>
            )}
          </p>
        )}
        {!canEditUsername && (
          <p className="text-xs text-gray-500 mt-1">
            Solo puedes cambiar tu nombre de usuario una vez cada 30 días.
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold">Email</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={emailError ? "border-red-500 border-2" : ""}
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Biografía</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={bioError ? "border-red-500 border-2" : ""}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            La biografía no debe exceder los 1500 caracteres.
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <label className="text-sm font-semibold">Nueva contraseña</label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pr-10 ${
                  passwordError ? "border-red-500 border-2" : ""
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                onClick={togglePassword}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <EyeToggleIcon show={showPassword} />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            La contraseña debe tener al menos 8 caracteres, incluir una letra
            mayúscula, una minúscula, un número y un carácter especial.
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <label className="text-sm font-semibold">Confirmar contraseña</label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pr-10 ${
              confirmPasswordError ? "border-red-500 border-2" : ""
            }`}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            onClick={toggleConfirmPassword}
            aria-label={
              showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            <EyeToggleIcon show={showConfirmPassword} />
          </button>
        </div>
      </div>
    </div>
  );
}

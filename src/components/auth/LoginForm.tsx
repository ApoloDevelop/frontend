import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  credentials: { credential: string; password: string };
  onCredentialsChange: (credentials: {
    credential: string;
    password: string;
  }) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  credentials,
  onCredentialsChange,
  showPassword,
  onTogglePassword,
  loading,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Credential */}
      <div>
        <label className="mb-1 block text-sm text-zinc-700">
          Email o usuario
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Mail size={18} />
          </span>
          <input
            type="text"
            placeholder="tu@correo.com o usuario"
            value={credentials.credential}
            onChange={(e) =>
              onCredentialsChange({
                ...credentials,
                credential: e.target.value,
              })
            }
            required
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-sm text-zinc-700">Contraseña</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Lock size={18} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={credentials.password}
            onChange={(e) =>
              onCredentialsChange({ ...credentials, password: e.target.value })
            }
            required
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-purple-700 hover:bg-purple-600 focus-visible:ring-purple-400 text-white"
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

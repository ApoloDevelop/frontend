import LoginForm from "./LoginForm";
import OAuthButtons from "./OAuthButtons";
import ErrorMessage from "./ErrorMessage";

interface LoginContentProps {
  credentials: { credential: string; password: string };
  onCredentialsChange: (credentials: {
    credential: string;
    password: string;
  }) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  loading: boolean;
  error: string | null;
  oauthError: boolean;
  googleUrl?: string;
  spotifyUrl?: string;
  registerUrl: string;
  onSubmit: (e: React.FormEvent) => void;
  onRedirect: (url: string) => void;
}

export default function LoginContent({
  credentials,
  onCredentialsChange,
  showPassword,
  onTogglePassword,
  loading,
  error,
  oauthError,
  googleUrl,
  spotifyUrl,
  registerUrl,
  onSubmit,
  onRedirect,
}: LoginContentProps) {
  return (
    <div className="p-8 sm:p-10 md:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">Entra en Apolo</h2>
        <p className="text-zinc-600 mt-2">
          Accede para guardar favoritos, puntuar y descubrir música a tu medida.
        </p>
      </div>

      <ErrorMessage error={error} oauthError={oauthError} />

      <LoginForm
        credentials={credentials}
        onCredentialsChange={onCredentialsChange}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        loading={loading}
        onSubmit={onSubmit}
      />

      {/* Divider */}
      <div className="my-6 text-center text-sm text-zinc-500">— o —</div>

      {/* OAuth */}
      <OAuthButtons
        googleUrl={googleUrl}
        spotifyUrl={spotifyUrl}
        onRedirect={onRedirect}
      />

      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿No tienes cuenta?{" "}
        <a
          href={registerUrl}
          className="text-purple-700 underline underline-offset-4 hover:text-purple-600"
        >
          Regístrate
        </a>
      </p>
    </div>
  );
}

interface ErrorMessageProps {
  error: string | null;
  oauthError?: boolean;
}

export default function ErrorMessage({ error, oauthError }: ErrorMessageProps) {
  const displayError =
    error ||
    (oauthError
      ? "No se pudo completar el inicio de sesión con el proveedor. Inténtalo de nuevo."
      : null);

  if (!displayError) return null;

  return (
    <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
      {displayError}
    </div>
  );
}

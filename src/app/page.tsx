export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Apolo</h1>
      <p className="text-lg text-gray-600 mb-8">
        Tu plataforma musical para descubrir, compartir y conectar.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </a>
        <a
          href="/register"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Registrarse
        </a>
      </div>
    </div>
  );
}

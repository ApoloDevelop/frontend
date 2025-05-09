"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [step, setStep] = useState(1); // Controla el paso actual del slide
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-200 relative"
      style={{
        backgroundImage: "url('/register.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <div
        className="w-full h-full absolute top-0 left-0"
        style={{
          backdropFilter: "blur(5px)",
        }}
      ></div>
      <div
        className="p-8 rounded-xl w-1/3 max-w-md min-h-[500px] transform transition flex flex-col gap-y-px duration-300 hover:scale-103 hover:shadow-3xl"
        style={{
          backgroundColor: "var(--container-background);",
          boxShadow: "0 4px 50px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2 className="text-2xl mb-4 text-center font-bold">
          ¡Bienvenido a Apolo!
        </h2>

        {/* Contenedor del slide */}
        <div className="overflow-hidden ">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
          >
            {/* Página 1 */}
            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4 text-center">Háblanos de ti</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Nombre completo"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded mb-8 border-black"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded mb-8 border-black"
                />
              </form>
            </div>

            {/* Placeholder para futuras páginas */}
            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4">Página 2 (Placeholder)</h3>
              <p>Contenido de la segunda página.</p>
            </div>

            <div className="w-full flex-shrink-0">
              <h3 className="text-lg mb-4">Página 3 (Placeholder)</h3>
              <p>Contenido de la tercera página.</p>
            </div>
          </div>
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((page) => (
            <div
              key={page}
              className={`w-2 h-2 rounded-full ${
                step === page
                  ? "bg-black w-3 h-3 relative -top-0.5"
                  : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-between mt-6">
          <Button onClick={handlePrev} disabled={step === 1}>
            Anterior
          </Button>
          <Button onClick={handleNext} disabled={step === 3}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

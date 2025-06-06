// Sidebar.tsx
import clsx from "clsx";

export function EditProfileModalSidebar({
  section,
  setSection,
}: {
  section: "profile" | "email";
  setSection: (s: "profile" | "email") => void;
}) {
  return (
    <div className="w-35 bg-gray-100 rounded-2xl p-4">
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setSection("profile")}
            className={clsx(
              "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "profile" && "bg-gray-300 font-semibold"
            )}
          >
            Editar datos del usuario
          </button>
        </li>
        <li>
          <button
            onClick={() => setSection("email")}
            className={clsx(
              "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "email" && "bg-gray-300 font-semibold"
            )}
          >
            Editar preferencias de correo
          </button>
        </li>
      </ul>
    </div>
  );
}

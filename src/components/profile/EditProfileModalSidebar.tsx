// Sidebar.tsx
import clsx from "clsx";

export function EditProfileModalSidebar({
  section,
  setSection,
}: {
  section: "profile" | "personal" | "social";
  setSection: (s: "profile" | "personal" | "social") => void;
}) {
  return (
    <div className="w-35 bg-gray-100 rounded-2xl p-4">
      <ul className="space-y-2">
        <li id="edit-user-data">
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
        <li id="edit-personal-data">
          <button
            onClick={() => setSection("personal")}
            className={clsx(
              "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "personal" && "bg-gray-300 font-semibold"
            )}
          >
            Editar datos personales
          </button>
        </li>
        <li id="edit-social-data">
          <button
            onClick={() => setSection("social")}
            className={clsx(
              "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "social" && "bg-gray-300 font-semibold"
            )}
          >
            Editar redes sociales
          </button>
        </li>
      </ul>
    </div>
  );
}

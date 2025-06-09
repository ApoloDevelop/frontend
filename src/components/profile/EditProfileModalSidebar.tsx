// Sidebar.tsx
import clsx from "clsx";

export function EditProfileModalSidebar({
  section,
  setSection,
}: {
  section: "profile" | "personal";
  setSection: (s: "profile" | "personal") => void;
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
            onClick={() => setSection("personal")}
            className={clsx(
              "text-left text-sm w-full px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "personal" && "bg-gray-300 font-semibold"
            )}
          >
            Editar datos personales
          </button>
        </li>
      </ul>
    </div>
  );
}

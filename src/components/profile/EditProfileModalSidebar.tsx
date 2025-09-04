import clsx from "clsx";

export function EditProfileModalSidebar({
  section,
  setSection,
}: {
  section: "profile" | "personal" | "social" | "danger";
  setSection: (s: "profile" | "personal" | "social" | "danger") => void;
}) {
  return (
    <div className="w-full sm:w-28 md:w-32 lg:w-36 bg-gray-100 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none p-2 sm:p-3 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0">
      <ul className="flex sm:flex-col space-x-1 sm:space-x-0 sm:space-y-1 overflow-x-auto sm:overflow-x-visible">
        <li id="edit-user-data">
          <button
            onClick={() => setSection("profile")}
            className={clsx(
              "text-center sm:text-left text-xs w-full px-1 sm:px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "profile" && "bg-gray-300 font-semibold"
            )}
          >
            <span className="sm:hidden">Usuario</span>
            <span className="hidden sm:inline">Datos de usuario</span>
          </button>
        </li>
        <li id="edit-personal-data">
          <button
            onClick={() => setSection("personal")}
            className={clsx(
              "text-center sm:text-left text-xs w-full px-1 sm:px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "personal" && "bg-gray-300 font-semibold"
            )}
          >
            <span className="sm:hidden">Personal</span>
            <span className="hidden sm:inline">Datos personales</span>
          </button>
        </li>
        <li id="edit-social-data">
          <button
            onClick={() => setSection("social")}
            className={clsx(
              "text-center sm:text-left text-xs w-full px-1 sm:px-2 py-1 rounded hover:bg-gray-200 cursor-pointer",
              section === "social" && "bg-gray-300 font-semibold"
            )}
          >
            <span className="sm:hidden">Redes</span>
            <span className="hidden sm:inline">Redes sociales</span>
          </button>
        </li>
        <li id="danger-zone">
          <button
            onClick={() => setSection("danger")}
            className={clsx(
              "text-center sm:text-left text-xs w-full px-1 sm:px-2 py-1 rounded hover:bg-red-100 cursor-pointer text-red-700 font-medium",
              section === "danger" && "bg-red-200 font-bold text-red-800"
            )}
          >
            <span className="sm:hidden">⚠️ Peligro</span>
            <span className="hidden sm:inline">⚠️ Peligro</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

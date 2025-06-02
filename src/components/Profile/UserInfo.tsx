export const UserInfo = ({
  fullname,
  username,
  biography,
  createdAt,
  className,
}: any) => {
  let joinedText = "";
  if (createdAt) {
    const date = new Date(createdAt);
    const mes = date.toLocaleString("es-ES", { month: "long" });
    const año = date.getFullYear();
    joinedText = `Se unió en ${
      mes.charAt(0).toLowerCase() + mes.slice(1) + ` de `
    } ${año}`;
  }
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold">{fullname}</h1>
      <p className="text-gray-600">@{username}</p>
      {joinedText && <p className="text-gray-400 text-sm">{joinedText}</p>}
      <p className="text-gray-500 mt-2">{biography || "Sin biografía"}</p>
    </div>
  );
};

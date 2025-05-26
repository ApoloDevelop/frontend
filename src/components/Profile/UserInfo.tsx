export const UserInfo = ({ fullname, username, biography }: any) => {
  return (
    <div className="mt-16 px-6">
      <h1 className="text-2xl font-bold">{fullname}</h1>
      <p className="text-gray-600">@{username}</p>
      <p className="text-gray-500 mt-2">{biography || "Sin biografía"}</p>
    </div>
  );
};

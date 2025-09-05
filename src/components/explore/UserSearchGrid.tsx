"use client";

import Image from "next/image";
import Link from "next/link";

interface UserSearchGridProps {
  users: any[];
  loading: boolean;
}

export default function UserSearchGrid({
  users,
  loading,
}: UserSearchGridProps) {
  return (
    <div className="space-y-4">
      {loading && (
        <p className="text-sm text-muted-foreground">Buscando usuarios…</p>
      )}

      {/* GRID de usuarios */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {users.map((user: any) => {
          const pic = user.profile_pic || "/default-cover.png";
          const href = `/users/${user.username}`;
          const displayName = user.fullname || user.username;

          return (
            <Link
              key={user.id}
              href={href}
              className="group rounded-xl overflow-hidden bg-white border hover:shadow transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={pic}
                  alt={displayName}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium truncate group-hover:text-blue-600 transition-colors">
                  {displayName}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  @{user.username}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Información de resultados */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {users.length
            ? `${users.length} usuario${
                users.length !== 1 ? "s" : ""
              } encontrado${users.length !== 1 ? "s" : ""}`
            : "No hay nada que ver por aquí"}
        </span>
      </div>
    </div>
  );
}

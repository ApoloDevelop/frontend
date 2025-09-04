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
  if (loading) {
    return <p className="text-sm text-muted-foreground">Buscando usuarios…</p>;
  }

  if (!users.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
    </div>
  );
}

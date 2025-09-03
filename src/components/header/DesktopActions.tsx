import { GlobalSearch } from "./GlobalSearch";
import { AuthUser } from "@/types/auth";
import { LoginButton } from "./LoginButton";
import { UserMenu } from "./UserMenu";

interface DesktopActionsProps {
  user: AuthUser | null;
  userMenuOpen: boolean;
  onUserMenuToggle: () => void;
  onUserMenuClose: () => void;
  onLogout: () => void;
}

export function DesktopActions({
  user,
  userMenuOpen,
  onUserMenuToggle,
  onUserMenuClose,
  onLogout,
}: DesktopActionsProps) {
  return (
    <div className="hidden md:flex items-center gap-2">
      <GlobalSearch />

      {!user && <LoginButton />}

      {user && (
        <UserMenu
          user={user}
          isOpen={userMenuOpen}
          onToggle={onUserMenuToggle}
          onClose={onUserMenuClose}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}

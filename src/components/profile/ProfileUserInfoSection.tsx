import { Button } from "@/components/ui/button";
import { UserInfo } from "./UserInfo";
import { FollowButton } from "./FollowButton";

interface ProfileUserInfoSectionProps {
  currentUser: any;
  canEdit: boolean;
  isAdmin: boolean;
  onFollowChange: (isFollowing: boolean) => void;
  onRoleAdjustClick: () => void;
}

export const ProfileUserInfoSection = ({
  currentUser,
  canEdit,
  isAdmin,
  onFollowChange,
  onRoleAdjustClick,
}: ProfileUserInfoSectionProps) => {
  return (
    <UserInfo
      fullname={currentUser.fullname}
      username={currentUser.username}
      biography={currentUser.biography}
      createdAt={currentUser.register_date}
      className="flex flex-col items-start px-6 mt-4"
      spLink={currentUser.spotify_link}
      ytLink={currentUser.youtube_link}
      twLink={currentUser.twitter_link}
      igLink={currentUser.instagram_link}
      ttLink={currentUser.tiktok_link}
      extUrl={currentUser.external_url}
      roleId={currentUser.role_id}
      followButton={
        !canEdit && (
          <div className="flex gap-2 relative z-20">
            <FollowButton
              profileUserId={currentUser.id}
              onFollowChange={onFollowChange}
            />
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Ajustar rol clicked - isAdmin:", isAdmin);
                  onRoleAdjustClick();
                }}
                className="text-xs relative z-30 pointer-events-auto cursor-pointer"
                style={{ pointerEvents: "auto" }}
              >
                Ajustar rol
              </Button>
            )}
          </div>
        )
      }
    />
  );
};

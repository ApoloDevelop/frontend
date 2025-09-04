import { useState } from "react";

export const useProfileUpdates = () => {
  const [refreshCounters, setRefreshCounters] = useState(0);
  const [refreshFeed, setRefreshFeed] = useState(0);

  const handleFollowChange = (isFollowing: boolean) => {
    setRefreshCounters((prev) => prev + 1);
  };

  const handleRoleUpdate = (
    newRoleId: number,
    setLocalUser: any,
    currentUser: any
  ) => {
    setLocalUser((prevUser: any) => {
      const updatedUser = {
        ...currentUser,
        ...prevUser,
        role_id: newRoleId,
      };
      return updatedUser;
    });
  };

  const handleActivityPosted = () => {
    setRefreshFeed((v) => v + 1);
  };

  return {
    refreshCounters,
    refreshFeed,
    handleFollowChange,
    handleRoleUpdate,
    handleActivityPosted,
  };
};

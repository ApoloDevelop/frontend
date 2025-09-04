import { useState } from "react";

export const useProfileModals = () => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [myListsModalOpen, setMyListsModalOpen] = useState(false);

  const openRoleModal = () => setRoleModalOpen(true);
  const closeRoleModal = () => setRoleModalOpen(false);

  const openActivityModal = () => setActivityModalOpen(true);
  const closeActivityModal = () => setActivityModalOpen(false);

  const openMyListsModal = () => setMyListsModalOpen(true);
  const closeMyListsModal = () => setMyListsModalOpen(false);

  return {
    // Role modal
    roleModalOpen,
    openRoleModal,
    closeRoleModal,
    setRoleModalOpen,

    // Activity modal
    activityModalOpen,
    openActivityModal,
    closeActivityModal,
    setActivityModalOpen,

    // My lists modal
    myListsModalOpen,
    openMyListsModal,
    closeMyListsModal,
    setMyListsModalOpen,
  };
};

import { useState } from "react";

export function useEditProfileForm(user: any) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.biography || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const lastUpdated = user.username_last_update
    ? new Date(user.username_last_update)
    : null;
  const now = new Date();
  const daysSinceUpdate = lastUpdated
    ? (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    : 31;
  const canEditUsername = daysSinceUpdate >= 30;

  return {
    username,
    setUsername,
    email,
    setEmail,
    bio,
    setBio,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    canEditUsername,
    daysSinceUpdate,
  };
}

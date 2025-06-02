import { useState } from "react";

export function useEditProfileForm(user: any) {
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.biography || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return {
    email,
    setEmail,
    bio,
    setBio,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  };
}

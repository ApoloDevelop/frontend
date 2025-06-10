import { useState } from "react";

export function useEditProfileForm(user: any) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.biography || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [phonePrefix, setPhonePrefix] = useState(user?.phonePrefix || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [genre, setGenre] = useState(user?.genre || null);

  const resetForm = () => {
    setUsername(user.username);
    setEmail(user.email);
    setBio(user.biography || "");
    setPassword("");
    setConfirmPassword("");
    setBirthdate(user?.birthdate || "");
    setCountry(user?.country || "");
    setCity(user?.city || "");
    setPhonePrefix(user?.phonePrefix || "");
    setPhone(user?.phone || "");
    setGenre(user?.genre || null);
  };

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
    birthdate,
    setBirthdate,
    country,
    setCountry,
    city,
    setCity,
    phonePrefix,
    setPhonePrefix,
    phone,
    setPhone,
    genre,
    setGenre,
    canEditUsername,
    resetForm,
  };
}

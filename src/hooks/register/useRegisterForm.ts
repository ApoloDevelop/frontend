import { useState, useRef } from "react";
import { DEFAULT_AVATAR_URL } from "@/constants/registerConstants";

export function useRegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    country: "",
    city: "",
    social_genre: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    DEFAULT_AVATAR_URL
  );
  const [originalImagePreview, setOriginalImagePreview] = useState<
    string | null
  >(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return {
    step,
    setStep,
    formData,
    setFormData,
    fieldErrors,
    setFieldErrors,
    profileImage,
    setProfileImage,
    imagePreview,
    setImagePreview,
    originalImagePreview,
    setOriginalImagePreview,
    isLoading,
    setIsLoading,
    fileInputRef,
  };
}

"use client";
import { useState, useEffect } from "react";

interface UseRatingFormProps {
  open: boolean;
  initialScore?: number;
  initialTitle?: string;
  initialComment?: string;
}

interface UseRatingFormReturn {
  score: number;
  setScore: (score: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  title: string;
  setTitle: (title: string) => void;
  hovered: number | null;
  setHovered: (hovered: number | null) => void;
  resetForm: () => void;
}

export function useRatingForm({
  open,
  initialScore = 0,
  initialTitle = "",
  initialComment = "",
}: UseRatingFormProps): UseRatingFormReturn {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setScore(initialScore ?? 0);
      setTitle(initialTitle ?? "");
      setComment(initialComment ?? "");
      setHovered(null);
    } else {
      resetForm();
    }
  }, [open, initialScore, initialTitle, initialComment]);

  const resetForm = () => {
    setScore(0);
    setTitle("");
    setComment("");
    setHovered(null);
  };

  return {
    score,
    setScore,
    comment,
    setComment,
    title,
    setTitle,
    hovered,
    setHovered,
    resetForm,
  };
}

"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RatingModal } from "./RatingModal";
import { ReviewService } from "@/services/review.service";
import { Star } from "lucide-react";
import { useAuthUser } from "@/hooks/home/useAuthUser";
import { getCurrentUser } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

type RateableType = "artist" | "album" | "track" | "venue";

type BaseProps = {
  type: RateableType;
  name: string;
  defaultOpen?: boolean;
  isAuthenticated: boolean;
  itemId?: number | null;
  isVerifiedUser?: boolean;
  initialReview?: {
    score: number;
    title?: string | null;
    text?: string | null;
  } | null;
};

type ExtraProps =
  | { type: "artist" }
  | { type: "album"; artistName: string }
  | { type: "track"; artistName: string }
  | { type: "venue"; location: string };

type RatingClientProps = BaseProps & ExtraProps;

export function RatingClient(props: RatingClientProps) {
  const [open, setOpen] = useState(!!props.defaultOpen);
  const router = useRouter();
  const pathname = usePathname();

  const needsArtist = props.type === "album" || props.type === "track";
  const hasReview = !!props.initialReview;

  const handleSubmit = async (
    score: number,
    comment: string,
    title: string
  ) => {
    const { type, name } = props;
    const payload: any = { type, name, score, comment, title };

    if (needsArtist) {
      payload.artistName = props.artistName;
    } else if (props.type === "venue") {
      payload.location = props.location;
    }

    await ReviewService.rate(payload);

    window.location.reload();
    return;
  };

  const baseLabel =
    props.type === "artist"
      ? "Puntuar artista"
      : props.type === "album"
      ? "Puntuar álbum"
      : props.type === "track"
      ? "Puntuar canción"
      : "Puntuar sala";

  const label = hasReview ? "Cambiar puntuación" : baseLabel;

  const onOpen = () => {
    if (!props.isAuthenticated) {
      const next = encodeURIComponent(pathname || "/");
      router.push(`/login?next=${next}`);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={onOpen}
        // 👇 ya NO deshabilitamos el botón
        title={
          !props.isAuthenticated ? "Inicia sesión para puntuar" : undefined
        }
        data-hasreview={hasReview ? "1" : "0"}
      >
        {hasReview ? (
          <span className="mr-1 text-yellow-500 text-xl" aria-hidden>
            ★
          </span>
        ) : (
          <span className="mr-1 text-xl" aria-hidden>
            ☆
          </span>
        )}
        {label}
      </Button>

      <RatingModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        name={props.name}
        type={props.type}
        // ⬇️ precarga
        initialScore={props.initialReview?.score ?? 0}
        initialTitle={props.initialReview?.title ?? ""}
        initialComment={props.initialReview?.text ?? ""}
        hasExisting={hasReview}
      />
    </>
  );
}

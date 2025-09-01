// src/components/reviews/Rating.tsx  (SERVER)
import { getCurrentUser, TOKEN_COOKIE } from "@/lib/auth";
import { RatingClient } from "./RatingClient";

type RateableType = "artist" | "album" | "track" | "venue";

type BaseProps = {
  type: RateableType;
  name: string;
  defaultOpen?: boolean;
  itemId?: number | null;
};
type ExtraProps =
  | { type: "artist" }
  | { type: "album"; artistName: string }
  | { type: "track"; artistName: string }
  | { type: "venue"; location: string };

async function jsonOrNull(res: Response) {
  if (res.status === 204) return null;
  const raw = await res.text(); // ¡lee texto primero!
  if (!raw || !raw.trim()) return null; // vacío -> null
  try {
    return JSON.parse(raw);
  } catch {
    return null; // si no es JSON válido
  }
}

export default async function Rating(props: BaseProps & ExtraProps) {
  const user = await getCurrentUser();
  const isVerifiedUser = !!user && Number(user.role_id) === 4;

  let initialReview: {
    score: number;
    title?: string | null;
    text?: string | null;
  } | null = null;

  if (user && props.itemId) {
    const B = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get(TOKEN_COOKIE)?.value ?? null;

    if (token) {
      const res = await fetch(`${B}/reviews/mine?itemId=${props.itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await jsonOrNull(res);
        if (data && typeof data === "object") {
          initialReview = {
            score: Number(data.score ?? 0),
            title: data.title ?? null,
            text: data.text ?? null,
          };
        }
      }
    }
  }

  return (
    <RatingClient
      {...props}
      isAuthenticated={!!user}
      initialReview={initialReview}
      itemId={props.itemId ?? null}
      isVerifiedUser={isVerifiedUser}
    />
  );
}

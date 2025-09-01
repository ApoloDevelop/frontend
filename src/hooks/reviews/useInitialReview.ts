interface InitialReview {
  score: number;
  title?: string | null;
  text?: string | null;
}

async function jsonOrNull(res: Response): Promise<any> {
  if (res.status === 204) return null;
  const raw = await res.text();
  if (!raw || !raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getInitialReview(
  itemId: number | null,
  token: string | null
): Promise<InitialReview | null> {
  if (!itemId || !token) return null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

  try {
    const res = await fetch(`${backendUrl}/reviews/mine?itemId=${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await jsonOrNull(res);
      if (data && typeof data === "object") {
        return {
          score: Number(data.score ?? 0),
          title: data.title ?? null,
          text: data.text ?? null,
        };
      }
    }
  } catch (error) {
    console.warn("Error fetching initial review:", error);
  }

  return null;
}

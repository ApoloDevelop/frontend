import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewsHeaderProps {
  canWrite: boolean;
}

export function NewsHeader({ canWrite }: NewsHeaderProps) {
  return (
    <header className="mt-6 mb-4">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold">Noticias</h1>

        {canWrite && (
          <Button asChild>
            <Link href="/news/article">Añadir artículo</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

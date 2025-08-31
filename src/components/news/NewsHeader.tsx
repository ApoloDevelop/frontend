import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewsHeaderProps {
  canWrite: boolean;
}

export function NewsHeader({ canWrite }: NewsHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-6 mb-4">
      <h1 className="text-3xl font-bold">Noticias</h1>
      {canWrite && (
        <Button>
          <Link href="/news/article">Añadir artículo</Link>
        </Button>
      )}
    </div>
  );
}

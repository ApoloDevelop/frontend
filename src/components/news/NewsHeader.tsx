import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewsHeaderProps {
  canWrite: boolean;
  showAddButton?: boolean;
}

export function NewsHeader({
  canWrite,
  showAddButton = true,
}: NewsHeaderProps) {
  return (
    <header className="mt-6 mb-4">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold">Noticias</h1>

        {canWrite && showAddButton && (
          <Button asChild>
            <Link href="/news/article">Añadir artículo</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

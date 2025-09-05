import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyNewsStateProps {
  canWrite: boolean;
}

export function EmptyNewsState({ canWrite }: EmptyNewsStateProps) {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-2">Noticias</h1>
      <p className="text-gray-600">Aún no hay artículos publicados.</p>
      {canWrite && (
        <div className="mt-6">
          <Button>
            <Link href="/news/article">Añadir artículo</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

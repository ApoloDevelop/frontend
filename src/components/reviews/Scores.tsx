"use client";
import React, { useState } from "react";
import { ShieldCheck, Users } from "lucide-react";
import { ReviewsModal } from "./ReviewModal";
import { ScoreCircle } from "./ScoreCircle";
import { cn } from "@/lib/utils";

type Variant = "inline" | "card";

export function Scores({
  verified,
  unverified,
  verifiedCount,
  unverifiedCount,
  itemId,
  name,
  variant = "inline",
  className,
}: {
  verified: number | null;
  unverified: number | null;
  verifiedCount: number;
  unverifiedCount: number;
  itemId: number | null;
  name: string;
  variant?: Variant;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showingVerified, setShowingVerified] = useState(false);
  const disabled = itemId === null;

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Verificadas */}
      <div className="flex flex-col items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm font-medium">
          <ShieldCheck className="h-4 w-4" />
          Certificadas
        </span>
        <ScoreCircle
          score={disabled ? null : verified}
          ariaLabel="Nota verificada"
          size={84}
        />
        <button
          className="text-sm text-purple-700 hover:underline disabled:text-gray-400"
          onClick={() => {
            setShowingVerified(true);
            setModalOpen(true);
          }}
          disabled={disabled}
        >
          {disabled ? 0 : verifiedCount} valoraciones
        </button>
      </div>

      {/* Generales */}
      <div className="flex flex-col items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-sm font-medium">
          <Users className="h-4 w-4" />
          Generales
        </span>
        <ScoreCircle
          score={disabled ? null : unverified}
          ariaLabel="Nota general"
          size={84}
        />
        <button
          className="text-sm text-purple-700 hover:underline disabled:text-gray-400"
          onClick={() => {
            setShowingVerified(false);
            setModalOpen(true);
          }}
          disabled={disabled}
        >
          {disabled ? 0 : unverifiedCount} valoraciones
        </button>
      </div>
    </div>
  );

  return (
    <>
      {variant === "card" ? (
        <div
          className={cn(
            "rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm p-4 md:p-6",
            className
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Valoraciones</h3>
            <span className="text-sm text-muted-foreground">{name}</span>
          </div>
          {content}
        </div>
      ) : (
        <div className={cn("pt-2", className)}>{content}</div>
      )}

      <ReviewsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemId={itemId ?? 0}
        name={name}
        averageScore={showingVerified ? verified : unverified}
        verified={showingVerified}
        currentUserId={1}
      />
    </>
  );
}

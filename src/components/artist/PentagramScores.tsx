// PentagramScores.tsx
"use client";
import React, { useState } from "react";
import { ScoreCircle } from "./ScoreCircle";
import { ReviewsModal } from "../reviews/ReviewModal";
import { ShieldCheck, Users } from "lucide-react";

export function PentagramScores({
  verified,
  unverified,
  verifiedCount,
  unverifiedCount,
  itemId,
  name,
}: {
  verified: number | null;
  unverified: number | null;
  verifiedCount: number;
  unverifiedCount: number;
  itemId: number | null;
  name: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showingVerified, setShowingVerified] = useState(false);

  const handleClick = (isVerified: boolean) => {
    setShowingVerified(isVerified);
    setModalOpen(true);
  };

  const disabled = itemId === null;

  return (
    <div className="w-full">
      <div className="rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Valoraciones</h3>
          <span className="text-sm text-muted-foreground">{name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Verificadas */}
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                <ShieldCheck className="h-4 w-4" />
                Certificadas
              </span>
            </div>
            <ScoreCircle
              score={disabled ? null : verified}
              ariaLabel="Nota verificada"
              size={84}
            />
            <button
              className="text-sm text-purple-700 hover:underline disabled:text-gray-400"
              onClick={() => handleClick(true)}
              disabled={disabled}
            >
              {disabled ? 0 : verifiedCount} valoraciones
            </button>
          </div>

          {/* Generales */}
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                <Users className="h-4 w-4" />
                Generales
              </span>
            </div>
            <ScoreCircle
              score={disabled ? null : unverified}
              ariaLabel="Nota general"
              size={84}
            />
            <button
              className="text-sm text-purple-700 hover:underline disabled:text-gray-400"
              onClick={() => handleClick(false)}
              disabled={disabled}
            >
              {disabled ? 0 : unverifiedCount} valoraciones
            </button>
          </div>
        </div>
      </div>

      <ReviewsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemId={itemId ?? 0}
        name={name}
        averageScore={showingVerified ? verified : unverified}
        verified={showingVerified}
      />
    </div>
  );
}

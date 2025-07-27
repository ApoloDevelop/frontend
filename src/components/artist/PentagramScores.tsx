"use client";
import React, { useState } from "react";
import { ScoreCircle } from "./ScoreCircle";
import { ReviewsModal } from "../reviews/ReviewModal";

export function PentagramScores({
  verified,
  unverified,
  verifiedCount,
  unverifiedCount,
  itemId,
  artistName,
}: {
  verified: number | null;
  unverified: number | null;
  verifiedCount: number;
  unverifiedCount: number;
  itemId: number | null;
  artistName: string;
}) {
  if (itemId === null) {
    return (
      <div className="text-center text-gray-500">
        No hay reseñas disponibles para este artista.
      </div>
    );
  }
  console.log(itemId, artistName);
  const [modalOpen, setModalOpen] = useState(false);
  const [showingVerified, setShowingVerified] = useState(false);

  const handleClick = (isVerified: boolean) => {
    setShowingVerified(isVerified);
    setModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col items-center mb-8">
      <div className="relative w-[700px] h-[100px] flex items-center justify-center">
        {/* Pentagrama */}
        <svg
          className="absolute left-0 top-[-2px]"
          width="700"
          height="160"
          viewBox="0 0 700 160"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={0}
              x2={700}
              y1={40 + i * 20}
              y2={40 + i * 20}
              stroke="#333"
              strokeWidth={3}
            />
          ))}
          <line
            x1={350}
            x2={350}
            y1={40}
            y2={120}
            stroke="#333"
            strokeWidth={4}
          />
        </svg>

        <div className="absolute left-[100px] top-0 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Certificadas</span>
          <ScoreCircle score={verified} label="" />
          <button
            className="text-sm text-blue-600 mt-3 hover:underline cursor-pointer"
            onClick={() => handleClick(true)}
          >
            {verifiedCount} valoraciones
          </button>
        </div>

        <div className="absolute right-[100px] top-0 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Generales</span>
          <ScoreCircle score={unverified} label="" />
          <button
            className="text-sm text-blue-600 mt-3 hover:underline cursor-pointer"
            onClick={() => handleClick(false)}
          >
            {unverifiedCount} valoraciones
          </button>
        </div>
      </div>

      <ReviewsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemId={itemId}
        artistName={artistName}
        averageScore={showingVerified ? verified : unverified}
        verified={showingVerified}
      />
    </div>
  );
}

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
          <ScoreCircle score={itemId !== null ? verified : null} label="" />
          <button
            className="text-sm text-blue-600 mt-3 hover:underline cursor-pointer"
            onClick={() => handleClick(true)}
            disabled={itemId === null}
          >
            {itemId !== null ? verifiedCount : 0} valoraciones
          </button>
        </div>

        <div className="absolute right-[100px] top-0 flex flex-col items-center">
          <span className="font-semibold text-lg mb-2">Generales</span>
          <ScoreCircle score={itemId !== null ? unverified : null} label="" />
          <button
            className="text-sm text-blue-600 mt-3 hover:underline cursor-pointer"
            onClick={() => handleClick(false)}
            disabled={itemId === null}
          >
            {itemId !== null ? unverifiedCount : 0} valoraciones
          </button>
        </div>
      </div>

      <ReviewsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemId={itemId !== null ? itemId : 0}
        artistName={artistName}
        averageScore={showingVerified ? verified : unverified}
        verified={showingVerified}
      />
    </div>
  );
}

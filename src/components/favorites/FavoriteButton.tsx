"use client";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FavoriteService } from "@/services/favorites.service";
import { useAlert } from "@/hooks/register/useAlert";
import { AlertMessage } from "../ui/AlertMessage";

interface FavoriteButtonProps {
  artistName: string;
  userId: number; //(fake: 1)
}

export function FavoriteButton({ artistName, userId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { alertMsgs, setAlertMsgs, showAlert } = useAlert();

  useEffect(() => {
    async function checkFavorite() {
      try {
        const fav = await FavoriteService.isFavorite(artistName, userId);
        setIsFavorite(fav);
      } catch (err) {
        console.error("Error al obtener el estado de favorito", err);
      } finally {
        setLoading(false);
      }
    }
    checkFavorite();
  }, [artistName, userId]);

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isFavorite) {
        await FavoriteService.removeFavorite(artistName, userId);
        setIsFavorite(false);
        setAlertMsgs([`Has eliminado a ${artistName} de tus favoritos`]);
      } else {
        await FavoriteService.addFavorite(artistName, userId);
        setIsFavorite(true);
        setAlertMsgs([`Has añadido a ${artistName} a tus favoritos`]);
      }
    } catch (err) {
      console.error("Error al cambiar estado de favorito", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertMessage
        alertMsgs={alertMsgs}
        showAlert={showAlert}
        topSize="-8rem"
      />
      <button
        aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
        onClick={toggleFavorite}
        disabled={loading}
        className="p-2 hover:opacity-60 transition-opacity cursor-pointer"
        title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
      >
        <Star
          size={32}
          className={isFavorite ? "text-yellow-500" : "text-gray-400"}
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>
    </>
  );
}

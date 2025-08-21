// src/components/news/HeroImageUploader.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CropperModal } from "@/components/register/CropperModal";
import { CloudinaryService } from "@/services/cloudinary.service";
import { cropToDataUrl, dataUrlToFile } from "@/utils/cropToDataUrl";
import { acceptedTypes } from "@/constants/registerConstants"; // ya lo tienes

type Props = {
  value: string; // url actual (si existe)
  onChange: (url: string) => void; // devuelve la URL subida
  label?: string;
  targetWidth?: number; // p.ej 1600
};

export const HeroImageUploader: React.FC<Props> = ({
  value,
  onChange,
  label = "Imagen de cabecera (16:9)",
  targetWidth = 1600,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string>(value ?? "");
  const [error, setError] = useState<string | null>(null);

  // Mantén sincronizado el preview local si cambia `value` desde fuera
  useEffect(() => {
    setLocalPreview(value ?? "");
  }, [value]);

  // Limpia object URLs cuando cambien / se desmonte
  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview);
    };
  }, [originalPreview]);

  const onCropComplete = (_: any, pixels: any) => setCroppedAreaPixels(pixels);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      setError(
        `Tipos permitidos: JPEG, PNG, GIF, WEBP. "${file.name}" no es válido.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setOriginalPreview(url);
    setLocalPreview(url);
    setError(null);
    setShowCropper(true);
  };

  const handleSaveCrop = async () => {
    try {
      if (!originalPreview || !croppedAreaPixels) return;
      setLoading(true);

      // 1) Recorta + reescala a targetWidth (manteniendo 16:9)
      const dataUrl = await cropToDataUrl(
        originalPreview,
        croppedAreaPixels,
        targetWidth
      );

      // 2) Convierte a File y sube
      const file = await dataUrlToFile(dataUrl, "hero.jpg");
      const url = await CloudinaryService.uploadImage(file);

      // 3) Actualiza preview y devuelve url al padre
      setLocalPreview(url);
      onChange(url);
      setShowCropper(false);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo procesar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>

      {/* Selector */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="hero-image-input"
          className="cursor-pointer border rounded-xl px-4 py-2 text-sm hover:bg-gray-50"
        >
          {value ? "Cambiar imagen" : "Seleccionar imagen"}
          <input
            id="hero-image-input"
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(",")}
            onChange={handleSelect}
          />
        </label>

        {value && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onChange("");
              setLocalPreview("");
              setOriginalPreview("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Quitar
          </Button>
        )}
      </div>

      {/* Preview 16:9 */}
      {localPreview && (
        <div
          className="
            relative mt-2 aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 border max-w-sm mx-auto sm:mx-0
          "
        >
          <Image
            src={localPreview}
            alt="Hero preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <CropperModal
        isOpen={showCropper}
        onClose={() => setShowCropper(false)}
        originalImage={originalPreview}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        onSave={handleSaveCrop}
        aspect={16 / 9} // <— aquí forzamos el hero
        label="Recorta tu imagen en 16:9"
      />

      {loading && <p className="text-xs text-gray-500">Subiendo imagen…</p>}
    </div>
  );
};

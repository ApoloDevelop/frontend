"use client";

import { useState, useRef, useEffect } from "react";
import { CloudinaryService } from "@/services/cloudinary.service";
import { CropperModal } from "@/components/register/CropperModal";
import getCroppedImg from "@/utils/images";

interface CoverPhotoEditorProps {
  currentImageUrl?: string;
  onImageUpdated: (newImageUrl: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function CoverPhotoEditor({
  currentImageUrl,
  onImageUpdated,
  className = "",
  children,
}: CoverPhotoEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcular aspecto dinámicamente cuando se abre el cropper
  const [aspectRatio, setAspectRatio] = useState<number>(4.6875); // aspecto más panorámico basado en h-64 en desktop típico

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (max 10MB para cover)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen debe ser menor a 10MB');
      return;
    }

    setError(null);

    // Calcular aspecto dinámicamente con un retraso para asegurar que el DOM esté listo
    setTimeout(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          const ratio = width / height;
          setAspectRatio(ratio);
          console.log(`Cover aspect ratio calculated: ${ratio.toFixed(2)}:1 (${width}x${height})`);
        } else {
          // Fallback: calcular basándose en viewport width típico y h-64 (256px)
          const viewportWidth = window.innerWidth;
          const coverHeight = 256; // h-64 = 256px
          const fallbackRatio = viewportWidth / coverHeight;
          setAspectRatio(fallbackRatio);
          console.log(`Using fallback aspect ratio: ${fallbackRatio.toFixed(2)}:1 (${viewportWidth}x${coverHeight})`);
        }
      }
    }, 100);

    // Crear URL para mostrar en el cropper
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setShowCropper(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleCropSave = async () => {
    if (!originalImage || !croppedAreaPixels) return;

    setUploading(true);
    setError(null);

    try {
      // Crear imagen recortada
      const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels);
      
      // Convertir a File
      const croppedImageFile = await fetch(croppedImage)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "cover-photo.jpg", { type: "image/jpeg" }));

      // Subir a Cloudinary
      const imageUrl = await CloudinaryService.uploadImage(croppedImageFile);
      
      // Actualizar la imagen en el perfil
      onImageUpdated(imageUrl);
      
      setShowCropper(false);
      
      // Limpiar la URL temporal
      URL.revokeObjectURL(originalImage);
      
    } catch (err: any) {
      setError(err?.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
    }
  };

  const handleImageClick = () => {
    if (uploading || showCropper) return;
    const input = document.getElementById('cover-photo-input');
    input?.click();
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Wrapper clickeable que contiene la imagen */}
      <div 
        onClick={handleImageClick}
        className={`relative group cursor-pointer transition-all duration-200 w-full h-full ${uploading ? 'opacity-60' : ''}`}
        title="Haz click para cambiar tu foto de portada"
      >
        {children}
        
        {/* Overlay de hover con texto */}
        {!uploading && !showCropper && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 select-none">
            <span className="text-white font-semibold text-lg select-none">
              Editar portada
            </span>
          </div>
        )}
        
        {/* Overlay de loading */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Input oculto para seleccionar archivo */}
      <input
        id="cover-photo-input"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Modal del cropper */}
      <CropperModal
        isOpen={showCropper}
        onClose={handleCloseCropper}
        originalImage={originalImage}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        onSave={handleCropSave}
        aspect={aspectRatio} // Usar el aspecto calculado dinámicamente
        label="Ajusta tu foto de portada"
      />

      {/* Mostrar error si existe */}
      {error && (
        <div className="absolute top-full left-4 right-4 mt-2 p-2 bg-red-100 text-red-700 text-xs rounded border z-10">
          {error}
        </div>
      )}
    </div>
  );
}

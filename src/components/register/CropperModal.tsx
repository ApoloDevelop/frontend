import React from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface CropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string;
  crop: { x: number; y: number };
  setCrop: (value: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (value: number) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  onSave: () => void;
}

export const CropperModal: React.FC<CropperModalProps> = ({
  isOpen,
  onClose,
  originalImage,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  onSave,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="modal-blur-overlay"
      style={{
        content: {
          width: "auto",
          minWidth: 250,
          maxWidth: 400,
          height: "auto",
          margin: "auto",
          borderRadius: 12,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <div style={{ position: "relative", width: "100%", height: 300 }}>
        <Cropper
          image={originalImage}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="w-full flex flex-col items-center mt-4">
        <label htmlFor="zoom-range" className="text-xs text-gray-600 mb-1">
          Zoom
        </label>
        <Slider
          id="zoom-range"
          min={1}
          max={3}
          step={0.01}
          value={[zoom]}
          onValueChange={([val]) => setZoom(val)}
          className="w-3/4"
        />
      </div>

      <div className="flex flex-row gap-2 mt-4 justify-center">
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Recortar</Button>
      </div>
    </Modal>
  );
};

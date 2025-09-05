export async function cropToDataUrl(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  targetWidth = 1600, // ancho objetivo del hero
  mime = "image/jpeg",
  quality = 0.9
): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Crop canvas del área seleccionada
  const cropCanvas = document.createElement("canvas");
  const ctx = cropCanvas.getContext("2d")!;
  cropCanvas.width = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Reescalar a targetWidth manteniendo 16:9
  const targetHeight = Math.round((targetWidth * 9) / 16);
  const outCanvas = document.createElement("canvas");
  outCanvas.width = targetWidth;
  outCanvas.height = targetHeight;
  const outCtx = outCanvas.getContext("2d")!;
  outCtx.drawImage(cropCanvas, 0, 0, targetWidth, targetHeight);

  return outCanvas.toDataURL(mime, quality);
}

export async function dataUrlToFile(
  dataUrl: string,
  filename = "hero.jpg"
): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

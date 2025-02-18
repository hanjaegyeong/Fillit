import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';
import Modal from '@/components/common/Modal/Modal';
import BasicButton from '@/components/common/Button/BasicButton';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
}

const ImageCropModal = ({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
}: ImageCropModalProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = useCallback(async () => {
    try {
      if (!croppedAreaPixels) return;

      const image = new Image();
      image.src = imageUrl;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
      }, 'image/jpeg');
    } catch (error) {
      console.error('이미지 크롭 실패:', error);
    }
  }, [croppedAreaPixels, imageUrl, onClose, onCropComplete]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="normal">
      <div className="h-full flex flex-col">
        <div className="relative flex-1">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>
        <div className="p-4 flex justify-center gap-4">
          <BasicButton onClick={onClose} text="Cancel"></BasicButton>
          <BasicButton
            text="Submit"
            onClick={createCroppedImage}
            textColor="text-[#d68de1]"
          ></BasicButton>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropModal;

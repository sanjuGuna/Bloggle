import React, { useState, useRef, useCallback } from 'react';
import '../styles/ImageCropper.css';

const ImageCropper = ({ image, onCrop, onCancel, aspectRatio = 1 }) => {
  const canvasRef = useRef(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imageRef = useRef(null);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      const { width: displayWidth, height: displayHeight } = imageRef.current.getBoundingClientRect();
      
      setImageSize({ width: displayWidth, height: displayHeight });
      
      // Set initial crop to center of image
      const size = Math.min(displayWidth, displayHeight) * 0.8;
      setCrop({
        x: (displayWidth - size) / 2,
        y: (displayHeight - size) / 2,
        width: size,
        height: size / aspectRatio
      });
    }
  }, [aspectRatio]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = imageRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - crop.x,
      y: e.clientY - rect.top - crop.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    // Constrain crop area within image bounds
    const maxX = imageSize.width - crop.width;
    const maxY = imageSize.height - crop.height;

    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    }));
  }, [isDragging, dragStart, crop.width, crop.height, imageSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getCroppedImage = () => {
    if (!imageRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    // Calculate scale factor between display size and natural size
    const scaleX = image.naturalWidth / imageSize.width;
    const scaleY = image.naturalHeight / imageSize.height;

    // Set canvas size to desired output size
    const outputSize = 300; // 300x300 for profile pictures
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate source coordinates in natural image size
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // Draw the cropped image
    ctx.drawImage(
      image,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputSize, outputSize
    );

    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
  };

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImage();
    if (croppedBlob) {
      onCrop(croppedBlob);
    }
  };

  return (
    <div className="image-cropper-overlay">
      <div className="image-cropper-modal">
        <div className="cropper-header">
          <h3>Crop Profile Picture</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="cropper-content">
          <div className="image-container">
            <img
              ref={imageRef}
              src={image}
              alt="Crop preview"
              className="crop-image"
              onLoad={handleImageLoad}
              draggable={false}
            />
            <div
              className="crop-area"
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height
              }}
              onMouseDown={handleMouseDown}
            >
              <div className="crop-overlay"></div>
            </div>
          </div>
          
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="cropper-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="crop-btn" onClick={handleCrop}>
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

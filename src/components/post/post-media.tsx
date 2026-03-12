import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Images } from "lucide-react";

interface PostMediaProps {
  images: string[];
  onDoubleTap: () => void;
}

const PostMedia: React.FC<PostMediaProps> = ({ images, onDoubleTap }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    // Load first image to get aspect ratio
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = images[0];
  }, [images]);

  const handleImageClick = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      triggerHeartAnimation();
      onDoubleTap();
    }

    lastTapRef.current = now;
  };

  const triggerHeartAnimation = () => {
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 1000);
  };

  return (
    <div
      className="relative mx-5 overflow-hidden rounded-[28px] border border-border/50 bg-black/95 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.55)]"
      style={{ aspectRatio: aspectRatio.toString() }}
    >
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt="Post content"
        className="h-full w-full cursor-pointer select-none object-contain"
        onClick={handleImageClick}
        draggable={false}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/35 via-transparent to-transparent" />

      {/* Heart Animation on Double Tap */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Heart
            className="w-24 h-24 fill-white text-white animate-heart-burst"
            strokeWidth={0}
          />
        </div>
      )}

      {/* Carousel Indicators */}
      {images.length > 1 && (
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Images className="h-3.5 w-3.5" strokeWidth={2} />
          <span>
            {currentIndex + 1}/{images.length}
          </span>
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-white"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows (for desktop) */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => Math.max(0, prev - 1));
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) =>
                  Math.min(images.length - 1, prev + 1),
                );
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PostMedia;

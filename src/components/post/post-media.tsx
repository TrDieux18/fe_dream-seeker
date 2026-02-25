import type React from "react";
import { useState, useRef } from "react";
import { Heart } from "lucide-react";

interface PostMediaProps {
  images: string[];
  onDoubleTap: () => void;
}

const PostMedia: React.FC<PostMediaProps> = ({ images, onDoubleTap }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const lastTapRef = useRef<number>(0);

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
    <div className="relative bg-black aspect-square w-full">
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt="Post content"
        className="w-full h-full object-contain cursor-pointer select-none"
        onClick={handleImageClick}
        draggable={false}
      />

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
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-2 h-2"
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
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => Math.max(0, prev - 1));
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) =>
                  Math.min(images.length - 1, prev + 1),
                );
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PostMedia;

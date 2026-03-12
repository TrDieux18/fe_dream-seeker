import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import ActionPillButton from "../ui/action-pill-button";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  size: number;
  color: string;
  duration: number;
}

interface PostLikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
  onUnlike: () => void;
  className?: string;
  showLabel?: boolean;
}

const PostLikeButton: React.FC<PostLikeButtonProps> = ({
  isLiked,
  onLike,
  onUnlike,
  className,
  showLabel = false,
}) => {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleLikeClick = useCallback(() => {
    if (isLiked) {
      onUnlike();
    } else {
      // Trigger floating hearts animation
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 300);

      // Generate 5-8 floating hearts with varying properties
      const numberOfHearts = Math.floor(Math.random() * 4) + 5;
      const colors = [
        "text-red-500",
        "text-red-600",
        "text-pink-500",
        "text-pink-600",
        "text-rose-500",
      ];
      const newHearts: FloatingHeart[] = [];

      for (let i = 0; i < numberOfHearts; i++) {
        const duration = 1 + Math.random() * 0.5;
        newHearts.push({
          id: Date.now() + Math.random() * 10000 + i,
          x: (Math.random() - 0.8) * 100,
          y: 80 + Math.random() * 40,
          rotation: Math.random() * 360,
          delay: i * 0.06,
          size: 12 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration,
        });
      }

      setFloatingHearts((prev) => [...prev, ...newHearts]);

      // Cleanup hearts after animation completes
      newHearts.forEach((heart) => {
        const cleanupTime = (heart.duration + heart.delay) * 1000 + 100;
        setTimeout(() => {
          setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id));
        }, cleanupTime);
      });

      onLike();
    }
  }, [isLiked, onLike, onUnlike]);

  return (
    <div className={`relative ${className || ""}`}>
      <ActionPillButton
        label={showLabel ? (isLiked ? "Liked" : "Like") : undefined}
        active={isLiked}
        className="active:scale-90"
        onClick={handleLikeClick}
      >
        <span className="relative inline-flex h-7 w-7 items-center justify-center">
          <Heart
            className={`h-7 w-7 transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "hover:text-muted-foreground"
            } ${isHeartAnimating ? "scale-125" : "scale-100"}`}
            strokeWidth={2}
          />

          <span className="pointer-events-none absolute inset-0 overflow-visible">
            {floatingHearts.map((heart) => (
              <Heart
                key={heart.id}
                className={`absolute left-1/2 top-1/2 fill-current ${heart.color}`}
                strokeWidth={0}
                style={{
                  width: `${heart.size}px`,
                  height: `${heart.size}px`,
                  transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
                  animation: `float-up ${heart.duration}s ease-out ${heart.delay}s forwards`,
                  opacity: 0,
                  willChange: "transform, opacity",
                }}
              />
            ))}
          </span>
        </span>
      </ActionPillButton>
    </div>
  );
};

export default PostLikeButton;

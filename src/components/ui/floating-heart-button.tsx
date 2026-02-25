import { useState, useCallback } from "react";
import { Button } from "./button";
import { Heart } from "lucide-react";

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

interface FloatingHeartButtonProps {
  onLike: () => void;
  className?: string;
}

const FloatingHeartButton: React.FC<FloatingHeartButtonProps> = ({
  onLike,
  className,
}) => {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isHeartLiked, setIsHeartLiked] = useState<boolean>(false);

  const handleHeartClick = useCallback(() => {
    // Toggle heart liked state with bounce animation
    setIsHeartLiked(true);
    setTimeout(() => setIsHeartLiked(false), 300);

    // Generate 5-8 floating hearts with varying properties
    const numberOfHearts = Math.floor(Math.random() * 4) + 5; // 5-8 hearts
    const colors = [
      "text-red-500",
      "text-red-600",
      "text-pink-500",
      "text-pink-600",
      "text-rose-500",
    ];
    const newHearts: FloatingHeart[] = [];

    for (let i = 0; i < numberOfHearts; i++) {
      const duration = 1 + Math.random() * 0.5; // 1-1.5s duration
      newHearts.push({
        id: Date.now() + Math.random() * 10000 + i,
        x: (Math.random() - 0.5) * 100, // Random horizontal spread (-50px to +50px)
        y: 80 + Math.random() * 40, // Random vertical distance (80px to 120px)
        rotation: Math.random() * 360, // Random rotation
        delay: i * 0.06, // Stagger animation start
        size: 12 + Math.random() * 8, // Random size (12-20px)
        color: colors[Math.floor(Math.random() * colors.length)],
        duration,
      });
    }

    setFloatingHearts((prev) => [...prev, ...newHearts]);

    // Robust cleanup: Remove hearts after their specific animation duration completes
    newHearts.forEach((heart) => {
      const cleanupTime = (heart.duration + heart.delay) * 1000 + 100; // Add 100ms buffer
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== heart.id));
      }, cleanupTime);
    });

    // Trigger parent callback
    onLike();
  }, [onLike]);

  return (
    <div className={`relative ${className || ""}`}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-muted shrink-0 active:scale-90 transition-all duration-200"
        onClick={handleHeartClick}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            isHeartLiked
              ? "fill-red-500 text-red-500 scale-125"
              : "fill-red-500 text-red-500 scale-100"
          }`}
          strokeWidth={2}
        />
      </Button>

      {/* Floating Hearts Animation Container */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {floatingHearts.map((heart) => (
          <Heart
            key={heart.id}
            className={`absolute top-1/2 left-1/2 fill-current ${heart.color}`}
            strokeWidth={0}
            style={{
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
              animation: `floatHeartDrift ${heart.duration}s ease-out forwards`,
              animationDelay: `${heart.delay}s`,
              // CSS custom properties for dynamic animation values
              ["--float-x" as string]: `${heart.x}px`,
              ["--float-y" as string]: `-${heart.y}px`,
              ["--rotation" as string]: `${heart.rotation}deg`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FloatingHeartButton;

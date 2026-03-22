import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { Button } from "./button";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
  usePortal?: boolean;
  pickerWidth?: number;
  pickerHeight?: number;
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({
  onEmojiSelect,
  className,
  usePortal = true,
  pickerWidth = 320,
  pickerHeight = 400,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const updatePickerPosition = useCallback(() => {
    if (!containerRef.current) return;

    const triggerRect = containerRef.current.getBoundingClientRect();
    const viewportPadding = 8;
    const computedPickerWidth = Math.min(
      pickerWidth,
      window.innerWidth - viewportPadding * 2,
    );

    let left = triggerRect.right - computedPickerWidth;
    left = Math.max(viewportPadding, left);
    left = Math.min(
      left,
      window.innerWidth - computedPickerWidth - viewportPadding,
    );

    let top = triggerRect.top - pickerHeight - 8;

    // If there is not enough space above, show picker below the trigger.
    if (top < viewportPadding) {
      top = Math.min(
        triggerRect.bottom + 8,
        window.innerHeight - pickerHeight - viewportPadding,
      );
    }

    setPickerStyle({
      position: "fixed",
      left,
      top,
      width: computedPickerWidth,
      zIndex: 200,
    });
  }, [pickerHeight, pickerWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !containerRef.current?.contains(event.target as Node) &&
        !pickerRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      if (usePortal) {
        updatePickerPosition();
      }
      document.addEventListener("mousedown", handleClickOutside);
      if (usePortal) {
        window.addEventListener("resize", updatePickerPosition);
        window.addEventListener("scroll", updatePickerPosition, true);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (usePortal) {
        window.removeEventListener("resize", updatePickerPosition);
        window.removeEventListener("scroll", updatePickerPosition, true);
      }
    };
  }, [showEmojiPicker, updatePickerPosition, usePortal]);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      onEmojiSelect(emojiData.emoji);
    },
    [onEmojiSelect],
  );

  const pickerNode = (
    <div
      ref={pickerRef}
      style={usePortal ? pickerStyle : undefined}
      className={cn(
        usePortal
          ? ""
          : "absolute bottom-full right-0 z-120 mb-2 max-w-[calc(100vw-1rem)]",
      )}
    >
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        width={usePortal ? "100%" : pickerWidth}
        height={pickerHeight}
        previewConfig={{ showPreview: false }}
        searchPlaceHolder="Search emoji..."
        lazyLoadEmojis={true}
      />
    </div>
  );

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-muted shrink-0"
        onClick={toggleEmojiPicker}
      >
        <Smile
          className={`w-5 h-5 transition-colors ${
            showEmojiPicker ? "text-primary" : "text-muted-foreground"
          }`}
          strokeWidth={2}
        />
      </Button>

      {showEmojiPicker && (
        <>{usePortal ? createPortal(pickerNode, document.body) : pickerNode}</>
      )}
    </div>
  );
};

export default EmojiPickerButton;

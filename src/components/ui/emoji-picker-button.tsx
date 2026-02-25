import { useRef, useState, useCallback, useEffect } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { Button } from "./button";
import { Smile } from "lucide-react";

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({
  onEmojiSelect,
  className,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      onEmojiSelect(emojiData.emoji);
      
    },
    [onEmojiSelect],
  );

  return (
    <div className={`relative ${className || ""}`} ref={emojiPickerRef}>
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
        <div className="absolute bottom-full right-0 mb-2 z-100">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={320}
            height={400}
            previewConfig={{ showPreview: false }}
            searchPlaceHolder="Search emoji..."
            lazyLoadEmojis={true}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;

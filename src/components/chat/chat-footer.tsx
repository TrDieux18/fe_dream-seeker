import type { MessageType } from "@/types/chat.type";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import { Form, FormField, FormItem } from "../ui/form";
import { Textarea } from "../ui/textarea";
import ChatReplyBar from "./chat-reply-bar";
import { useChat } from "@/hooks/use-chat";
import EmojiPickerButton from "../ui/emoji-picker-button";
import FloatingHeartButton from "../ui/floating-heart-button";

interface ChatFooterProps {
  replyTo: MessageType | null;
  chatId: string | null;
  currentUserId: string | null;
  onCancelReply: () => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  replyTo,
  chatId,
  currentUserId,
  onCancelReply,
}) => {
  const messageSchema = z.object({
    message: z.string().optional(),
  });

  const { sendMessage } = useChat();

  const [image, setImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const messageValue = form.watch("message");
  const hasContent = messageValue?.trim() || image;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const currentValue = form.getValues("message") || "";
    form.setValue("message", currentValue + emoji, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleHeartLike = () => {
    if (chatId) {
      sendMessage({
        chatId,
        content: "❤️",
        replyTo,
      });
    }
  };

  const onSubmit = (values: { message?: string }) => {
    if (!chatId) {
      toast.error("No chat selected");
      return;
    }
    if (!values.message?.trim() && !image) {
      toast.error("Cannot send empty message");
      return;
    }
    sendMessage({
      chatId,
      content: values.message,
      image: image || undefined,
      replyTo,
    });
    onCancelReply();
    handleRemoveImage();
    form.reset();
  };

  return (
    <>
      <div className="sticky bottom-0 inset-x-0 z-50 border-t border-border/30 py-3 bg-background/95 backdrop-blur-sm">
        {image && (
          <div className="max-w-4xl mx-auto px-6 mb-3">
            <div className="w-fit relative">
              <img
                src={image}
                className="object-cover h-24 rounded-2xl min-w-24"
                alt="Preview"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveImage}
                size="icon"
                className="absolute -top-2 -right-2 bg-black/70 hover:bg-black text-white rounded-full h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-4xl px-6 mx-auto"
          >
            <div className="flex items-end gap-2">
              <div className="flex-1 relative ">
                <div className="flex items-center gap-2 bg-muted/60 rounded-full px-4 py-2 border border-border/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted shrink-0"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImageIcon
                      className="w-5 h-5 text-primary"
                      strokeWidth={2}
                    />
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1 m-0">
                        <Textarea
                          {...field}
                          autoComplete="off"
                          placeholder="Message..."
                          className="min-h-9 max-h-32 border-0 bg-transparent resize-none shadow-none focus-visible:ring-0 px-0 py-2 text-[15px] placeholder:text-muted-foreground"
                          rows={1}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                        />
                      </FormItem>
                    )}
                  />
                  <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
                  {!hasContent && (
                    <FloatingHeartButton onLike={handleHeartLike} />
                  )}
                </div>
              </div>
              {hasContent && (
                <Button
                  type="submit"
                  variant="ghost"
                  className="font-semibold text-primary hover:text-primary/80 hover:bg-transparent px-4"
                >
                  Send
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      {replyTo && (
        <ChatReplyBar
          replyTo={replyTo}
          currentUserId={currentUserId}
          onCancel={onCancelReply}
        />
      )}
    </>
  );
};

export default ChatFooter;

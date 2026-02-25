import type React from "react";
import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Image as ImageIcon,
  X,
  MapPin,
  ImagePlus,
} from "lucide-react";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import EmojiPickerButton from "../ui/emoji-picker-button";
import { usePost } from "@/hooks/use-post";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PostType } from "@/types/post.type";

// Validation Schema
const postSchema = z.object({
  caption: z
    .string()
    .max(2200, "Caption must be less than 2,200 characters")
    .optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  images: z
    .array(z.string())
    .min(1, "Please add at least one image")
    .max(10, "Maximum 10 images allowed"),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostProps {
  post?: PostType; // For edit mode
  onSuccess?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ post, onSuccess }) => {
  const { createPost, isCreatingPost } = usePost();
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const captionTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: post?.caption || "",
      location: post?.location || "",
      images: post?.images || [],
    },
  });

  const captionValue = form.watch("caption") || "";
  const locationValue = form.watch("location") || "";

  // Handle file selection
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (fileArray.length + images.length > 10) {
        toast.error("Maximum 10 images allowed per post");
        return;
      }

      fileArray.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not a valid image file`);
          return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 10MB`);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImages((prev) => {
            const newImages = [...prev, result];
            form.setValue("images", newImages, { shouldValidate: true });
            return newImages;
          });
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    },
    [images.length, form],
  );

  // Handle drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles],
  );

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      form.setValue("images", newImages, { shouldValidate: true });
      return newImages;
    });
  };

  // Handle emoji selection
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      const textarea = captionTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = form.getValues("caption") || "";
        const newValue =
          currentValue.substring(0, start) +
          emoji +
          currentValue.substring(end);
        form.setValue("caption", newValue);

        // Set cursor position after emoji
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(
            start + emoji.length,
            start + emoji.length,
          );
        }, 0);
      } else {
        const currentValue = form.getValues("caption") || "";
        form.setValue("caption", currentValue + emoji);
      }
    },
    [form],
  );

  // Handle form submission
  const onSubmit = async (data: PostFormValues) => {
    const post = await createPost({
      caption: data.caption?.trim() || undefined,
      images: data.images,
      location: data.location?.trim() || undefined,
    });

    if (post) {
      // Reset form
      form.reset();
      setImages([]);
      onSuccess?.();
    }
  };

  const isEditMode = !!post;

  return (
    <Card className="w-full max-w-150 mx-auto mb-8 overflow-hidden border-border/40 shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {isEditMode ? "Edit Post" : "Create New Post"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share your moments with the community
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Caption Field */}
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Caption
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        ref={(e) => {
                          field.ref(e);
                          // @ts-ignore
                          captionTextareaRef.current = e;
                        }}
                        placeholder="Write a caption for your post..."
                        className="min-h-30 resize-none pr-12 text-base leading-relaxed"
                        maxLength={2200}
                      />
                      <div className="absolute top-3 right-3">
                        <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
                      </div>
                    </div>
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    <FormDescription className="text-xs">
                      {captionValue.length}/2,200
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Add a location (optional)"
                      className="text-base"
                      maxLength={100}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage />
                    {locationValue && (
                      <FormDescription className="text-xs">
                        {locationValue.length}/100
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* Images Field */}
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Images
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {images.length}/10
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Drag and Drop Zone */}
                      {images.length < 10 && (
                        <div
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className={cn(
                            "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
                            isDragging
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-border hover:bg-accent/5",
                          )}
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                          />
                          <div className="flex flex-col items-center justify-center text-center gap-3">
                            <div className="rounded-full bg-primary/10 p-4">
                              <ImagePlus className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {isDragging
                                  ? "Drop your images here"
                                  : "Click to upload or drag and drop"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF up to 10MB (max 10 images)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Image Preview Grid */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square group overflow-hidden rounded-lg border border-border/40"
                            >
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-medium text-white bg-black/60 px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <Separator />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setImages([]);
                }}
                disabled={isCreatingPost}
              >
                Clear All
              </Button>
              <Button
                type="submit"
                disabled={isCreatingPost}
                className="min-w-30"
              >
                {isCreatingPost ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Posting...
                  </>
                ) : (
                  <>{isEditMode ? "Update Post" : "Create Post"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default CreatePost;

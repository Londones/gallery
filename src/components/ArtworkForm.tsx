import { useState, useEffect } from "react";
import { Upload, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  validateArtworkTitle,
  validateArtworkDescription,
  validatePlatformLink,
  validateImageFile,
} from "@/utils/inputValidation";

interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  platform_link?: string;
  created_at: string;
}

interface ArtworkFormProps {
  editingArtwork: Artwork | null;
  onArtworkSaved: (artwork: Artwork) => void;
  onEditingCancelled: () => void;
}

const ArtworkForm = ({
  editingArtwork,
  onArtworkSaved,
  onEditingCancelled,
}: ArtworkFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editingArtwork ? editingArtwork.image_url : null
  );
  const [formData, setFormData] = useState({
    title: editingArtwork?.title || "",
    description: editingArtwork?.description || "",
    platformLink: editingArtwork?.platform_link || "",
    imageFile: null as File | null,
  });
  const { toast } = useToast();

  // Update form data when editingArtwork changes
  useEffect(() => {
    if (editingArtwork) {
      setFormData({
        title: editingArtwork.title,
        description: editingArtwork.description || "",
        platformLink: editingArtwork.platform_link || "",
        imageFile: null,
      });
      setImagePreview(editingArtwork.image_url);
    } else {
      setFormData({
        title: "",
        description: "",
        platformLink: "",
        imageFile: null,
      });
      setImagePreview(null);
    }
  }, [editingArtwork]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          title: "Invalid File",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("artworks")
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("artworks").getPublicUrl(fileName);

    return publicUrl;
  };

  const validateForm = () => {
    const titleValidation = validateArtworkTitle(formData.title);
    if (!titleValidation.isValid) {
      toast({
        title: "Invalid Title",
        description: titleValidation.error,
        variant: "destructive",
      });
      return false;
    }

    const descriptionValidation = validateArtworkDescription(
      formData.description
    );
    if (!descriptionValidation.isValid) {
      toast({
        title: "Invalid Description",
        description: descriptionValidation.error,
        variant: "destructive",
      });
      return false;
    }

    const platformValidation = validatePlatformLink(formData.platformLink);
    if (!platformValidation.isValid) {
      toast({
        title: "Invalid Platform Link",
        description: platformValidation.error,
        variant: "destructive",
      });
      return false;
    }

    if (!editingArtwork && !formData.imageFile) {
      toast({
        title: "Image Required",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      if (editingArtwork) {
        let imageUrl = editingArtwork.image_url;

        if (formData.imageFile) {
          imageUrl = await uploadImageToStorage(formData.imageFile);
        }

        const { data, error } = await supabase
          .from("artworks")
          .update({
            title: formData.title.trim(),
            description: formData.description.trim()
              ? formData.description.trim()
              : null,
            image_url: imageUrl,
            platform_link: formData.platformLink.trim() || null,
          })
          .eq("id", editingArtwork.id)
          .select()
          .single();

        if (error) throw error;

        onArtworkSaved(data);
        resetForm();

        toast({
          title: "Success!",
          description: "Artwork has been updated.",
        });
      } else {
        const imageUrl = await uploadImageToStorage(formData.imageFile!);

        const { data, error } = await supabase
          .from("artworks")
          .insert({
            title: formData.title.trim(),
            description: formData.description.trim()
              ? formData.description.trim()
              : null,
            image_url: imageUrl,
            platform_link: formData.platformLink.trim() || null,
          })
          .select()
          .single();

        if (error) throw error;

        onArtworkSaved(data);
        resetForm();

        toast({
          title: "Success!",
          description: "Artwork has been added to your gallery.",
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.message?.includes("storage")) {
        errorMessage =
          "Failed to upload image. Please check your file and try again.";
      } else if (error.message?.includes("duplicate")) {
        errorMessage = "An artwork with this information already exists.";
      } else if (error.message?.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      platformLink: "",
      imageFile: null,
    });

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    onEditingCancelled();
  };

  const cancelEditing = () => {
    resetForm();
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-gray-100">
      <CardHeader>
        <CardTitle className="text-gray-900 font-light text-xl">
          {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image" className="text-gray-800">
              Artwork Image {!editingArtwork && "*"}
            </Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-pink-200 transition-colors relative">
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (imagePreview && imagePreview.startsWith("blob:")) {
                        URL.revokeObjectURL(imagePreview);
                      }
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, imageFile: null }));
                      const fileInput = document.getElementById(
                        "image"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <label
                    htmlFor="image"
                    className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors rounded-lg"
                  >
                    <span className="text-white bg-black/50 px-3 py-1 rounded-full text-sm opacity-0 hover:opacity-100 transition-opacity">
                      Change Image
                    </span>
                  </label>
                </div>
              ) : (
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP, GIF • Max 50MB
                  </p>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-800">
              Title *{" "}
              <span className="text-xs text-gray-500">
                (Max 100 characters)
              </span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter artwork title"
              maxLength={100}
              className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-800">
              Description{" "}
              <span className="text-xs text-gray-500">
                (Max 1000 characters)
              </span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your artwork..."
              rows={4}
              maxLength={1000}
              className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform" className="text-gray-800">
              Platform Link (Optional)
            </Label>
            <Input
              id="platform"
              type="url"
              value={formData.platformLink}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  platformLink: e.target.value,
                }))
              }
              placeholder="https://instagram.com/p/..."
              className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
            />
            <p className="text-xs text-gray-500">
              Supported: Instagram, Twitter/X, ArtStation, DeviantArt, Behance,
              Dribbble
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isUploading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingArtwork ? "Update Artwork" : "Add Artwork"}
                </>
              )}
            </Button>

            {editingArtwork && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEditing}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ArtworkForm;

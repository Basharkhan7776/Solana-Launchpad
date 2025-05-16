import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Spinner } from "./spinner";

const ImagePreview = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => (
  <div className="relative aspect-square">
    <button
      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <img
      src={url}
      height={500}
      width={500}
      alt=""
      className="border border-border h-full w-full rounded-md object-cover"
    />
  </div>
);

export default function InputImage({ image, setImage }: { image: string | null; setImage: any }) {
  const [uploading, setUploading] = useState(false);

  const handleUploadToCloudinary = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // Replace with your unsigned preset name
  
      // Upload directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        }
      );
  
      const data = await response.json();
      if (data.secure_url) {
        setImage(data.secure_url); // Pass the URL to the parent component
        console.log("Image URL:", data.secure_url); // Log the uploaded image URL here
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-40">
      <div className="mt-1 w-full">
        {image ? (
          <ImagePreview
            url={image}
            onRemove={() => setImage(null)}
          />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                handleUploadToCloudinary(file);
              }
            }}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
            maxFiles={1}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "border border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-none focus:border-primary",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="profile" />
                {uploading ? (
                  <Spinner />
                ) : (
                  <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
                )}
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}

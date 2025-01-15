import React, { FC, useState } from "react";
import ReactImagePickerEditor, {
  ImagePickerConf,
} from "react-image-picker-editor";
import "react-image-picker-editor/dist/index.css";
import { MdDelete } from "react-icons/md";
import { COLORS } from "@/app/_utils/COLORS";

interface ImgPickerProps {
  initialImages?: string[]; // URLs of preloaded images
  onImagesChange: (images: string[]) => void; // Callback to get the selected images
  singleSelection?: boolean; // Enable single or multiple selection
}

const ImgPicker: FC<ImgPickerProps> = ({
  initialImages = [],
  onImagesChange,
  singleSelection = false,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);

  const handleImageChange = (newDataUri: string) => {
    const updatedImages = singleSelection
      ? [newDataUri]
      : [...images, newDataUri];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const config: ImagePickerConf = {
    borderRadius: "8px",
    language: "en",
    width: "90px",
    height: "80px",
    objectFit: "contain",
    compressInitial: null,
    darkMode: false,
    rtl: false,
  };

  console.log("images?.length: ", JSON.stringify(images, null, 2));

  return (
    <div className="flex  items-center h-full bg-gray-100 p-4">
      <ReactImagePickerEditor
        config={config}
        imageSrcProp=""
        imageChanged={handleImageChange}
      />
      {images && images?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-4 px-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative border-2 rounded-lg bg-opacity-75 w-24 h-16 flex-shrink-0"
            >
              <img
                src={image}
                alt={`Selected ${index + 1}`}
                className="w-full h-full object-cover rounded-md shadow-md bg-opacity-65"
              />
              <button
                onClick={async () => {
                  await handleImageRemove(index);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md opacity-0 hover:opacity-100 transition-opacity"
              >
                <MdDelete
                  size={24}
                  className="text-red-600 cursor-pointer hover:text-red-600"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImgPicker;

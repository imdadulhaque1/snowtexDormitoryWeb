import React, { FC, useState } from "react";

interface IconInputProps {
  label: string;
  onIconChange: (iconData: {
    htmlIcon: File | null;
    svgIcon: string | null;
  }) => void;
}

const IconInput: FC<IconInputProps> = ({ label, onIconChange }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string); // Set preview URL
        onIconChange({ htmlIcon: file, svgIcon: null });
      };
      reader.readAsDataURL(file); // Convert to base64 URL for preview
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    setPreview(code); // Preview as raw SVG/HTML
    onIconChange({ htmlIcon: null, svgIcon: code });
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept=".svg,.png,.jpg,.jpeg"
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          onChange={handleFileChange}
        />
      </div>
      {/* SVG/HTML Input */}
      <div>
        <textarea
          placeholder="Enter SVG or HTML code here..."
          className="text-black w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          rows={4}
          onChange={handleCodeChange}
        />
      </div>
      {/* Preview Section */}
      {preview && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
          <div className="flex items-center justify-center h-24 w-full border bg-gray-50">
            {preview.startsWith("data:") ? (
              <img
                src={preview}
                alt="Icon Preview"
                className="max-h-full max-w-full"
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: preview }}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconInput;

import React, { useState } from "react";

export const ImageUploader = ({ onUpload }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(urls);
    onUpload(files);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Upload Images:
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      />
      <div className="grid grid-cols-3 gap-4">
        {selectedImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

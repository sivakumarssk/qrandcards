import React, { useState } from "react";

export const VideoUploader = ({ onUpload }) => {
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setSelectedVideos(urls);
    onUpload(files);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Upload Videos:
      </label>
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoChange}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      />
      <div className="grid grid-cols-2 gap-4">
        {selectedVideos.map((src, index) => (
          <video
            key={index}
            src={src}
            controls
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

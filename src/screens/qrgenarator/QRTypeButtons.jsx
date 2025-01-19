import React from "react";

const QRTypeButtons = ({ activeType, setActiveType }) => {
  const qrTypes = [
    "text",
    "url",
    "phone",
    "email",
    "upi",
    "youtube",
    "facebook",
    "instagram",
    "whatsapp",
    "googleMaps",
    "appStore",
    "playStore",
    "Image",
    "Pdf",
    "Audio",
    "vedio",
  ];

  return (
    <div className="flex flex-wrap justify-center sm:justify-start sm:gap-4 sm:mt-6 items-center gap-4 mt-6">
      {qrTypes.map((type) => (
        <button
          key={type}
          onClick={() => setActiveType(type)}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
            activeType === type
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-600"
          } hover:bg-purple-500 hover:text-white transition`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default QRTypeButtons;

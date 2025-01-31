import React from "react";

const QRTypeButtons = ({ activeType, setActiveType,setQrCodeValue,setShowWatermark,setIsPaymentComplete }) => {
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
    "app",
    "googleMaps",
    "appStore",
    "playStore",
    "wifi",
    "image",
    "pdf"
  ];

  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap justify-center items-center sm:max-w-[60%]  sm:justify-center sm:gap-4 sm:mt-6  gap-4 mt-6">

      {qrTypes.map((type) => (
        <button
          key={type}
          onClick={() =>{ setActiveType(type);setQrCodeValue('');setShowWatermark(true);setIsPaymentComplete(false)}}
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

    </div>
  );
};

export default QRTypeButtons;

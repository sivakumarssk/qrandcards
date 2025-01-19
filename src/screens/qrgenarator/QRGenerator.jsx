import React, { useState } from "react";
import QRForm from "./QRForm";
import QRTypeButtons from "./QRTypeButtons";

const QRGenerator = () => {
  const [activeType, setActiveType] = useState("text");

  const handleFormSubmit = (data) => {
    alert(`Generated QR data: ${JSON.stringify(data, null, 2)}`);
    // Replace with actual QR generation logic
  };

  return (
    <div className="py-8 px-4 mt-[4%] bg-gray-100 h-[100vh]">
      <h1 className="text-4xl pt-10 font-bold text-center text-purple-600">
        QR Code Generator
      </h1>
      <p className="text-center text-gray-600 mt-2 mb-6">
        Generate easy & customizable QR codes in seconds.
      </p>

      {/* Button Component */}
      <QRTypeButtons activeType={activeType} setActiveType={setActiveType} />

      {/* Form Component */}
      <div className="mt-10 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <QRForm activeType={activeType} onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default QRGenerator;

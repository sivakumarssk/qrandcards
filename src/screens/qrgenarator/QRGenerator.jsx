import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QRForm from "./QRForm";
import QRTypeButtons from "./QRTypeButtons";

const QRGenerator = () => {
  const [activeType, setActiveType] = useState("text");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoSize, setLogoSize] = useState(50);
  const [logoMargin, setLogoMargin] = useState(10);

  const qrCodeRef = useRef(null);

  const handleFormSubmit = (data) => {
    let value;


    switch (activeType) {
      case "text":
        value = data.text;
        break;
      case "url":
        value = data.url;
        break;
      case "phone":
        value = `tel:${data.phone}` || "";
        break;
      case "email":
        value = `mailto:${data.email}?subject=${data.subject}&body=${data.message}` || "";
        break;
      case "upi":
        value = `upi://pay?pa=${data.upi}&pn=${data.name || ""}&mc=${data.merchantCode || ""}&tid=${data.transactionId || ""}` || "";
        break;
      case "youtube":
        value = data.youtube || "";
        break;
      case "facebook":
        value = data.facebook || "";
        break;
      case "instagram":
        value = data.instagram || "";
        break;
      case "playStore":
        value = data.playStore || "";
        break;
      case "appStore":
        value = data.appStore || "";
        break;
      case "whatsapp":
        value = `https://wa.me/${data.whatsapp}${data?.message ? `?text=${encodeURIComponent(data.message)}` : ""}` || "";
        break;
      case "googleMaps":
        value = data.location || "";
        break;
      case "Wifi":
        value = `WIFI:S:${data.ssid};T:WPA;P:${data.password};;` || "";
        break;
      // case "Image":
      //   value =  data.image || "";
      // case "Pdf":
      //   value =  data.pdf || "";
      // case "Audio":
      //   value =  data.audio || "";
      // case "video":
      //   value =  data.video || "";
      default:
        value = "";
    }


    // Set the QR code value
    setQrCodeValue(value);

    // Optional: Update additional customizations if needed
    if (data.color) setQrColor(data.color);
    if (data.bgColor) setBgColor(data.bgColor);
    if (data.logo) setLogoUrl(data.logo);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result); // Set the uploaded logo as a data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "qrcode.png";
    link.click();
  };

  const printQRCode = () => {
    const canvas = qrCodeRef.current.querySelector("canvas");
    if (!canvas) {
      alert("QR Code not found. Please generate one first.");
      return;
    }

    setTimeout(() => {
      const image = canvas.toDataURL("image/png");
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";

      document.body.appendChild(iframe);

      iframe.contentDocument.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <img src="${image}" style="width: 300px; height: 300px;" />
          </body>
        </html>
      `);

      iframe.contentDocument.close();
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      iframe.addEventListener("afterprint", () => {
        iframe.remove();
      });
    }, 100);
  };

  return (
    <div className="py-8 px-4 mt-[4%] bg-gray-100 min-h-screen">
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

      {/* QR Code Display */}
      {qrCodeValue && (
        <div className="mt-10 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-center text-gray-700 mb-4">
            Your QR Code
          </h3>
          <div className="text-center flex justify-center items-center" ref={qrCodeRef}>
            <QRCodeCanvas
              value={qrCodeValue}
              size={300} // Increase the QR code size for better scannability
              fgColor={qrColor}
              bgColor={bgColor}
              imageSettings={{
                src: logoUrl,
                x: undefined,
                y: undefined,
                height: 60, // Adjust to ensure it's small
                width: 60,  // Adjust to ensure it's small
                excavate: true, // Clear the area beneath the logo
              }}
            />

          </div>

          {/* QR Customization */}
          <div className="mt-6">
            <label className="block text-sm text-gray-500 mb-2">
              Change QR Code Color:
            </label>
            <input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            />

            <label className="block text-sm text-gray-500 mb-2">
              Upload Logo for QR Code:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            />
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              onClick={downloadQRCode}
            >
              Download QR Code
            </button>
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
              onClick={printQRCode}
            >
              Print QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;

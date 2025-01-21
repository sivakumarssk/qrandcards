import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QRForm from "./QRForm";
import QRTypeButtons from "./QRTypeButtons";
import defaultLogos from "../../components/helper/defaultLogo";

const QRGenerator = () => {
  const [activeType, setActiveType] = useState("text");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrColor, setQrColor] = useState("#2463EB");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState("");

  const qrCodeRef = useRef(null);


  useEffect(() => {
    setLogoUrl(defaultLogos(activeType));
  }, [activeType]);

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
      case "wifi":
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

    if (file.size > 500 * 1024) {
      alert("Please upload an image smaller than 500KB.");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          // Create a circular canvas
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");

          // Draw circular mask
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Draw the image onto the canvas
          ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);

          // Set the circular image as the logo
          setLogoUrl(canvas.toDataURL());
        };
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
              size={300}
              fgColor={qrColor}
              bgColor={bgColor}
              imageSettings={{
                src: logoUrl,
                x: undefined,
                y: undefined,
                height: 45, // Adjust to ensure it's small
                width: 45,
                excavate: true, // Clear the area beneath the logo
              }}
            />

          </div>

          {/* QR Customization */}
          <div className="mt-6">
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                🎨 May QR color change as per your luck!:
              </label>

              {/* QR Code Color */}
              <div className="flex items-center space-x-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">QR Code Color:</p>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-16 h-10 border-none rounded-lg cursor-pointer shadow-md"
                  />
                </div>
                {/* <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: qrColor }}></div> */}
              </div>

            </div>


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

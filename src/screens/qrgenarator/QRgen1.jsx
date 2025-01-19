import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { SketchPicker } from "react-color";

function QRgen() {
  const [inputValue, setInputValue] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoSize, setLogoSize] = useState(50);
  const [logoMargin, setLogoMargin] = useState(10);

  const qrCodeRef = useRef(null);

  const generateQrCode = () => {
    if (inputValue.trim() === "") {
      alert("Please enter text or URL to generate QR Code");
      return;
    }
    setQrCodeValue(inputValue);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 ">
      <h1 className="text-[54px] font-bold text-[#6567f2] mb-2">Custom QR Code Generator</h1>
      <p className="text-xl text-gray mb-6">Customize QR code with styles, colors, and branding.</p>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter text or URL"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={generateQrCode}
        >
          Generate QR Code
        </button>

        {/* QR Code Customization Options */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Customize Colors:</h3>
          <div className="flex space-x-4">
            {/* QR Code Color */}
            <div>
              <p className="text-sm text-gray-500 mb-1">QR Color:</p>
              <SketchPicker
                color={qrColor}
                onChange={(color) => setQrColor(color.hex)}
                disableAlpha
              />
            </div>

            {/* Background Color */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Background:</p>
              <SketchPicker
                color={bgColor}
                onChange={(color) => setBgColor(color.hex)}
                disableAlpha
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Branding:</h3>
            <input
              type="text"
              placeholder="Enter Logo URL"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <div className="flex justify-between">
              <div>
                <label className="block text-sm text-gray-500">Logo Size:</label>
                <input
                  type="number"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-2 w-20"
                  min="10"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Logo Margin:</label>
                <input
                  type="number"
                  value={logoMargin}
                  onChange={(e) => setLogoMargin(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-2 w-20"
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        {qrCodeValue && (
          <div className="mt-6 text-center" ref={qrCodeRef}>
            <div className="justify-self-center my-10">
              <QRCodeCanvas
                value={qrCodeValue}
                size={200}
                fgColor={qrColor}
                bgColor={bgColor}
                imageSettings={{
                  src: logoUrl,
                  x: undefined,
                  y: undefined,
                  height: logoSize,
                  width: logoSize,
                  excavate: true, // Ensures logo area is clear
                  margin: logoMargin,
                }}
              />
            </div>
            <div className="mt-4 flex justify-center space-x-4">
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
    </div>
  );
}

export default QRgen;

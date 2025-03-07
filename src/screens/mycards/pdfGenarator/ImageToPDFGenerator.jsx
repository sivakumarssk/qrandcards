import React, { useState, useEffect, useRef } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const ImagePDFGenerator = () => {
  const [images, setImages] = useState([]);
  const [activeMode, setActiveMode] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    if (activeMode === "camera") {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
        }
      };
      startCamera();
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [activeMode]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setImages((prev) => [...prev, canvas.toDataURL("image/png")]);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    ).then((results) => setImages((prev) => [...prev, ...results]));
  };

  const generatePDF = async () => {
    if (images.length === 0) {
      alert("No images to generate PDF.");
      return;
    }
    setIsPdfGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const content = images.flatMap((img, index) => [
      {
        image: img,
        width: 400,
        alignment: "center",
        margin: [0, 221]
      },
      index < images.length - 1 ? { text: "", pageBreak: "after" } : null
    ].filter(Boolean));
    pdfMake.createPdf({ pageSize: "A4", pageMargins: [0, 0, 0, 0], content }).download("Images.pdf");
    setIsPdfGenerating(false);
  };

  return (
    <div className="min-h-screen mt-[15%] lg:mt-[5%] flex flex-col items-center justify-center bg-gray-200 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Image to PDF Generator</h1>
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={() => setActiveMode("camera")} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Use Camera</button>
          <button onClick={() => setActiveMode("gallery")} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Use Gallery</button>
        </div>

        {activeMode === "camera" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Camera Capture</h2>
            <div className="relative">
              <video ref={videoRef} className="w-full h-64 rounded shadow-md bg-black" autoPlay playsInline muted />
              <button onClick={captureImage} className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full">Capture</button>
            </div>
          </div>
        )}

        {activeMode === "gallery" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload from Gallery</h2>
            <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="w-full p-2 border rounded" />
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Preview Images</h2>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <img key={idx} src={img} alt={`img-${idx}`} className="object-cover rounded border" />
              ))}
            </div>
          </div>
        )}

        <button onClick={generatePDF} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">Generate PDF</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {isPdfGenerating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p className="text-lg font-semibold">Generating PDF, please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePDFGenerator;

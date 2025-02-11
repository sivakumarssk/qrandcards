import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QRForm from "./QRForm";
import QRTypeButtons from "./QRTypeButtons";
import defaultLogos from "../../components/helper/defaultLogo";
import './QRgenarator.css'
import axios from "axios";

const QRGenerator = () => {
  const [activeType, setActiveType] = useState("text");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoUrl, setLogoUrl] = useState("");
  const [showWatermark, setShowWatermark] = useState(true);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [prices, setPrices] = useState(null);
  

  const qrCodeRef = useRef(null);

  const fetchPrices = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/getPrice");
      if (response.data) {
        const {
          totalpriceQR,
          dicountpriceQR
        } = response.data;

        setPrices({
          totalpriceQR,
          dicountpriceQR
        });
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  useEffect(()=>{
    fetchPrices()
  },[])

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
        value = `https://wa.me/+91${data.whatsapp}${data?.message ? `?text=${encodeURIComponent(data.message)}` : ""}` || "";
        break;
      case "googleMaps":
        value = data.location || "";
        break;
      case "wifi":
        value = `WIFI:S:${data.ssid};T:WPA;P:${data.password};;` || "";
        break;
      case "app":
        value = `https://admin.qrandcards.com/api/app?ios=${data.appappStore || "#"}&android=${data.appplayStore || "#"}`;
        break;
      case "image":
        value = `https://admin.qrandcards.com${data.url}`;
        break;
      case "pdf":
        value = `https://admin.qrandcards.com${data.url}`;
        break;
      default:
        value = "";
    }

    setQrCodeValue(value);

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
          const canvas = document.createElement("canvas");
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");

          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);

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

  const updateQRCodeCount = async () => {
    try {
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "totalQR",
        value: 1
      });

      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "dailyQR",
        value: 1
      });

      console.log("QR code count updated successfully!");
    } catch (error) {
      console.error("Error updating QR code count:", error);
    }
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/signin");
      return;
    }
  
    try {
      // Fetch order ID from backend
      const response = await axios.post("https://admin.qrandcards.com/api/create-order", {
        amount: prices?.dicountpriceQR || 37,
        currency: "INR",
      });
  
      const { orderId, amount } = response.data;
  
      // Razorpay payment options
      const options = {
        key: "rzp_live_HJLLQQPlyQFOGr",
        amount: amount, // Amount from backend
        currency: "INR",
        name: "Personal Visiting Card",
        description: "Download PDF",
        order_id: orderId, // Use order ID from backend
        handler: function (paymentResponse) {
          setShowWatermark(false);
          setIsPaymentComplete(true);
          alert("Payment successful! Watermark removed.");
          updateQRCodeCount();
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210"
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed. Please try again.");
        console.error(response.error);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Payment initiation failed. Please try again.");
    }
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
      <QRTypeButtons activeType={activeType} setActiveType={setActiveType} setIsPaymentComplete={setIsPaymentComplete} setShowWatermark={setShowWatermark} setQrCodeValue={setQrCodeValue} />

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
          <div className="relative text-center flex justify-center p-2 items-center qr-code-container" ref={qrCodeRef}>
            <QRCodeCanvas
              value={qrCodeValue}
              size={300}
              fgColor={qrColor}
              bgColor={bgColor}
              imageSettings={{
                src: logoUrl,
                x: undefined,
                y: undefined,
                height: 35,
                width: 35,
                excavate: true,
              }}
            />
            {showWatermark && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-gray-300 backdrop-blur-sm bg-opacity-75"
                style={{
                  zIndex: 4,
                  pointerEvents: "none", // Prevent interaction
                }}
              >
                <p
                  className="text-black font-bold opacity-70 text-2xl"
                >
                  QR AND CARDS WATERMARK
                </p>
              </div>
            )}
          </div>


          {/* QR Customization */}
          <div className="mt-6">
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                🎨 Customize QR Code Color:
              </label>

              <div className="flex items-center space-x-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">May Color of QR change your Luck:</p>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-16 h-10 border-none rounded-lg cursor-pointer shadow-md"
                  />
                </div>
              </div>
            </div>

            <label className="block text-sm text-gray-500 mb-2">Upload Logo/Image/Zodiac sign/Lucky No. for QR Code:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            />
          </div>

          {!isPaymentComplete && (
            <div className="text-center mt-6">
              <div className="text-center mt-6">
                <p className="text-red-500 font-semibold mb-4">
                  This QR Code has a watermark. Make a payment to remove it.
                </p>
                <div className="flex flex-col items-center mb-4">
                  <p className="text-gray-500 line-through text-sm">₹{prices?.totalpriceQR || 100}</p>
                  <p className="text-green-600 font-bold text-lg">₹{prices?.dicountpriceQR || 37}</p>
                  <p className="text-blue-500 text-sm">(Offer price)</p>
                </div>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  onClick={handlePayment}
                >
                  Pay ₹{prices?.dicountpriceQR || 37} to Remove Watermark
                </button>
              </div>

            </div>
          )}

          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              onClick={downloadQRCode}
              disabled={showWatermark}
            >
              Download QR Code
            </button>
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
              onClick={printQRCode}
              disabled={showWatermark}
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

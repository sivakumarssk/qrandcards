import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS

const QRTypeSection = () => {
  const navigate = useNavigate();

  const qrTypes = [
    { label: "URL", icon: "🔗", route: "/qr-generator?type=url" },
    { label: "PDF", icon: "📄", route: "/qr-generator?type=pdf" },
    { label: "Image", icon: "🖼️", route: "/qr-generator?type=image" },
    { label: "App Markets", icon: "📱", route: "/qr-generator?type=app" },
    { label: "Text", icon: "✏️", route: "/qr-generator?type=text" },
    { label: "Maps", icon: "🗺️", route: "/qr-generator?type=maps" },
    { label: "Wi-Fi", icon: "📶", route: "/qr-generator?type=wifi" },
    { label: "Audio", icon: "🎵", route: "/qr-generator?type=audio" },
    { label: "WhatsApp", icon: "📱", route: "/qr-generator?type=whatsapp" },
    { label: "YouTube", icon: "🎥", route: "/qr-generator?type=youtube" },
    { label: "Instagram", icon: "📸", route: "/qr-generator?type=instagram" },
    { label: "Facebook", icon: "📘", route: "/qr-generator?type=facebook" },
    { label: "E-mail", icon: "📧", route: "/qr-generator?type=email" },
    { label: "TikTok", icon: "🎵", route: "/qr-generator?type=tiktok" },
    { label: "Phone Call", icon: "📞", route: "/qr-generator?type=phone" },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="text-center py-10 px-5">
      <h2 className="text-2xl font-bold mb-8">Create QR for Specified Types</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {qrTypes.map((type, index) => (
          <div
            key={type.label}
            className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:scale-105 hover:bg-gray-100 transition-transform duration-300 ease-in-out transform hover:shadow-lg hover:scale-110"
            onClick={() => handleNavigation(type.route)}
            data-aos={index % 2 === 0 ? "fade-up" : "fade-down"} // Add AOS animation
          >
            <div className="text-3xl mb-2">{type.icon}</div>
            <p className="text-sm font-medium">{type.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRTypeSection;

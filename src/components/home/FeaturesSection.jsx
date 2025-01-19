import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";  // Make sure AOS styles are imported

function FeaturesSection() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
        >
          <h3 className="text-xl font-bold">QR Code Generator</h3>
          <p className="mt-2 text-gray-600">
            Easily create QR codes for URLs, text, or business cards.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h3 className="text-xl font-bold">Visiting Card Creator</h3>
          <p className="mt-2 text-gray-600">
            Design professional cards with customizable templates.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h3 className="text-xl font-bold">Secure Downloads</h3>
          <p className="mt-2 text-gray-600">
            Download your QR codes and cards securely and quickly.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h3 className="text-xl font-bold">Highly Customizable</h3>
          <p className="mt-2 text-gray-600">
            Create and customize QR codes to match your brand colors & logo.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h3 className="text-xl font-bold">Card Templates</h3>
          <p className="mt-2 text-gray-600">
            Select from ready-made card templates to get started.
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg text-center"
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <h3 className="text-xl font-bold">Projects</h3>
          <p className="mt-2 text-gray-600">
            Easily categorize and manage your QR codes and short links.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;

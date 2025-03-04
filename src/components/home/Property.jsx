import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import property from "../../assets/qrimages/property.jpg";
import { useNavigate } from "react-router-dom";

function Property() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div className="container mx-auto pb-16 pt-4 px-4 overflow-hidden sm:pt-16">
        <div className="grid md:grid-cols-2 items-center gap-10 overflow-hidden">
          {/* Text Content */}
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-4">Property Cards</h2>
            <p className="text-gray-600 text-xl text-justify">
            Discover elegance in every detail with our luxury property cards, meticulously crafted to showcase the essence of prestigious living. Whether you're listing a residential estate, a commercial space, or a vacation property, our cards are designed to captivate potential buyers and investors alike.
            </p>
            <br />
            <p className="text-lg">&#10004; Opulent designs blending contemporary allure with classic sophistication</p>
            <p className="text-lg">&#10004; Tailored templates that exude exclusivity for every property type</p>
            <p className="text-lg">&#10004; High-definition printing on premium, durable cardstock</p>
            <p className="text-lg">&#10004; Intuitive customization tools for seamless personalization</p>
            <p className="text-lg">&#10004; Expedited production and dependable delivery</p>
            <p className="text-lg">&#10004; Make an impeccable impression from the first glimpse</p>
          </div>

          {/* Image Frames */}
          <div data-aos="fade-left" className="flex  space-x-4">
            <img
              src={property}
              alt="Personal Cards"
              className="w-full rounded-lg shadow-lg  h-[400px]"
            />
          </div>

          

        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/mycards/property")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            Go to Property
          </button>
        </div>
      </div>
    </>
  );
}

export default Property;

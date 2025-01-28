import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import pesrnalcards from "../../assets/corousel/pesrnalcards.png";
import { useNavigate } from "react-router-dom";

function CardsAbout() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <div className="container mx-auto pb-16 pt-4 px-4 overflow-hidden sm:pt-16">
        <div className="grid md:grid-cols-2 items-center gap-10 overflow-hidden">
          {/* Image Frames */}
          <div data-aos="fade-right" className="flex space-x-4">
            <img
              src={pesrnalcards}
              alt="Personal Cards"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Text Content */}
          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold mb-4">Personal Cards</h2>
            <p className="text-gray-600 text-xl text-justify">
              Create personalized visiting cards with ease. Customize your card with detailed information, images, and links, all tailored to showcase your brand or individuality.
            </p>
            <br />
            <p className="text-lg">&#10004; Showcase your personal or business identity</p>
            <p className="text-lg">&#10004; Add contact information, social media links, and UPI links</p>
            <p className="text-lg">&#10004; Include custom images and galleries</p>
            <p className="text-lg">&#10004; Download high-quality printable cards</p>
            <p className="text-lg">&#10004; Easy sharing with a professional look</p>
            <p className="text-lg">&#10004; All data remains secure and private</p>
            <p className="text-lg">&#10004; Fully customizable design and layout</p>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/mycards/personal")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            Go to Personal Cards
          </button>
        </div>
      </div>
    </>
  );
}

export default CardsAbout;

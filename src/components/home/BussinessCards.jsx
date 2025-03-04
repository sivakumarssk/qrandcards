import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import bussinesscards from "../../assets/qrimages/bussiness.jpg";
import { useNavigate } from "react-router-dom";

function BussinessCards() {
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
            <h2 className="text-3xl font-bold mb-4">Business Visiting Cards</h2>
            <p className="text-gray-600 text-xl text-justify">
              Create professional business visiting cards effortlessly. Customize your card with essential business details, branding elements, and links, all designed to make a lasting impression on your clients and partners.
            </p>
            <br />
            <p className="text-lg">&#10004; Showcase your business identity and professional brand</p>
            <p className="text-lg">&#10004; Add your contact information, company website, social media profiles, and more</p>
            <p className="text-lg">&#10004; Incorporate your company logo, images, and brand colors for a polished look</p>
            <p className="text-lg">&#10004; Download high-resolution printable cards ready for distribution</p>
            <p className="text-lg">&#10004; Share your business card digitally via email or messaging platforms</p>
            <p className="text-lg">&#10004; Keep your data secure and private, with full control over what you share</p>
            <p className="text-lg">&#10004; Fully customizable design and layout to match your business style</p>
          </div>


          {/* Image Frames */}
          <div data-aos="fade-left" className="flex space-x-4">
            <img
              src={bussinesscards}
              alt="Personal Cards"
              className="w-full rounded-lg shadow-lg h-[400px]"
            />
          </div> 

        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/mycards/business")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            Go to Business Cards
          </button>
        </div>
      </div>
    </>
  );
}

export default BussinessCards;

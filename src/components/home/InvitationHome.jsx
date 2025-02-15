import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import invitationImage from "../../assets/corousel/invitation.png";
import { useNavigate } from "react-router-dom";

function InvitationHome() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="container mx-auto pb-16 pt-4 px-4 overflow-hidden sm:pt-16">
      <div className="grid md:grid-cols-2 items-center gap-10 overflow-hidden">
        {/* Image Frame */}
        <div data-aos="fade-right" className="flex space-x-4">
          <img
            src={invitationImage}
            alt="Elegant Invitation Cards"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Text Content */}
        <div data-aos="fade-left">
          <h2 className="text-3xl font-bold mb-4">Elegant Invitation Cards / Property Cards</h2>
          <p className="text-gray-600 text-xl text-justify">
            Celebrate in style with our exquisite invitation cards designed to leave a lasting impression. Whether you’re hosting a wedding, a birthday party, an anniversary, or a corporate event, our invitations are crafted to reflect your unique style and set the tone for your special occasion.
          </p>
          <br />
          <p className="text-lg">&#10004; Sophisticated designs that blend modern trends with timeless elegance</p>
          <p className="text-lg">&#10004; Fully customizable templates to suit any occasion</p>
          <p className="text-lg">&#10004; Premium quality printing on luxurious paper</p>
          <p className="text-lg">&#10004; Easy-to-use design tool for instant personalization</p>
          <p className="text-lg">&#10004; Fast turnaround and reliable delivery</p>
          <p className="text-lg">&#10004; Impress your guests from the very first moment</p>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/mycards/invitation")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
        >
          Go to Invitation
        </button>
      </div>
    </div>
  );
}

export default InvitationHome;

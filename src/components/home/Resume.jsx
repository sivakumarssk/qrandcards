import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import resume from "../../assets/corousel/resume.png";
import { useNavigate } from "react-router-dom";

function Resume() {
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
              src={resume}
              alt="Personal Cards"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Text Content */}
          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold mb-4">Resume Cards</h2>
            <p className="text-gray-600 text-xl text-justify">
              Build a standout resume card that highlights your professional skills, work experience, and education. Customize your resume card to create a visually appealing and informative snapshot of your career in a compact, easy-to-share format.
            </p>
            <br />
            <p className="text-lg">&#10004; Present your professional experience, education, and skills</p>
            <p className="text-lg">&#10004; Add contact details, personal bio, and social media links (LinkedIn, portfolio, etc.)</p>
            <p className="text-lg">&#10004; Include custom sections like certifications, awards, and key projects</p>
            <p className="text-lg">&#10004; Download your resume card in a high-quality format for easy printing or sharing</p>
            <p className="text-lg">&#10004; Share your resume card quickly through email or as a digital link</p>
            <p className="text-lg">&#10004; Keep your personal data secure and private while presenting your achievements</p>
            <p className="text-lg">&#10004; Fully customizable design and layout to suit your professional style</p>
          </div>


        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/mycards/resume")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            Go to Resume
          </button>
        </div>
      </div>
    </>
  );
}

export default Resume;

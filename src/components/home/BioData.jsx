import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import bioData from "../../assets/corousel/bioData.png";
import { useNavigate } from "react-router-dom";

function BioData() {
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
            <h2 className="text-3xl font-bold mb-4">Bio Data Cards</h2>
            <p className="text-gray-600 text-xl text-justify">
              Create professional bio data cards with ease. Customize your card to highlight key personal and career details, showcasing your skills, qualifications, and contact information in a sleek, easy-to-read format.
            </p>
            <br />
            <p className="text-lg">&#10004; Present your personal information in a clean, organized layout</p>
            <p className="text-lg">&#10004; Add career objectives, skills, qualifications, and achievements</p>
            <p className="text-lg">&#10004; Include personal details such as contact info, social profiles, and portfolio links</p>
            <p className="text-lg">&#10004; Upload a professional photo to enhance your profile</p>
            <p className="text-lg">&#10004; Download high-quality bio data cards for printing or digital sharing</p>
            <p className="text-lg">&#10004; Share your bio data with potential employers, clients, or collaborators effortlessly</p>
            <p className="text-lg">&#10004; Secure and private, with full control over your personal information</p>
            <p className="text-lg">&#10004; Fully customizable design, ensuring your bio data stands out</p>
          </div>

          {/* Image Frames */}
          <div data-aos="fade-left" className="flex space-x-4">
            <img
              src={bioData}
              alt="Personal Cards"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          

        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/mycards/bioData")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            Go to BioData
          </button>
        </div>
      </div>
    </>
  );
}

export default BioData;

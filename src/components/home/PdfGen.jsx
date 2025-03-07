import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import pdfGenImage from "../../assets/qrimages/pdfGen.png";
import { useNavigate } from "react-router-dom";

function PdfGen() {
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
            <h2 className="text-3xl font-bold mb-4">Generate PDF for Free with Powerful Features:</h2>
            {/* <p className="text-gray-600 text-xl text-justify">
              Create professional business visiting cards effortlessly. Customize your card with essential business details, branding elements, and links, all designed to make a lasting impression on your clients and partners.
            </p> */}
            <br />
            <p className="text-lg">&#10004; Effortlessly create and download PDFs without any cost</p>
            <p className="text-lg">&#10004; Edit and modify your PDFs at any time</p>
            <p className="text-lg">&#10004; High-quality PDFs ready to print or share</p>
            <p className="text-lg">&#10004; No sign-up required, just start creating instantly</p>
            <p className="text-lg">&#10004; Secure and private – no data stored in the cloud</p>
          </div>


          {/* Image Frames */}
          <div data-aos="fade-left" className="flex space-x-4">
            <img
              src={pdfGenImage}
              alt="Personal Cards"
              className="w-full rounded-lg shadow-lg h-[400px]"
            />
          </div> 

        </div>

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/PDFGenerator")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200"
          >
            Go to PDF Generator
          </button>
        </div>
      </div>
    </>
  );
}

export default PdfGen;

import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from 'swiper/modules';
import { Navigation } from 'swiper/modules';
import "aos/dist/aos.css";
import AOS from "aos";
import Corousel from "../../components/home/Corousel";
import FeaturesSection from "../../components/home/FeaturesSection";
import QrAbout from "../../components/home/QrAbout";
import QRTypeSection from "../../components/home/QRTypeSection";
import Testimonials from "../../components/home/Testimonials";
import Footer from "../../components/home/Footer ";
import DownloadApp from "../../components/home/DownloadApp";
import AboutHome from "../../components/home/AboutHome";
import CardsAbout from "../../components/home/CardsAbout";
import BussinessCards from "../../components/home/BussinessCards";
import Resume from "../../components/home/Resume";
import BioData from "../../components/home/BioData";

function Home() {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section with Carousel */}
      
      <Corousel/>

      {/* Features Section */}
      <FeaturesSection/>

      {/* About Section */}
      <AboutHome/>

      <QrAbout/>

      <QRTypeSection/>

      <CardsAbout/>

      <BussinessCards/>

      <Resume/>
      <BioData/>

      <Testimonials/>

      {/* <DownloadApp/> */}


      <Footer/>

      {/* Call-to-Action Section */}
      {/* <div className="bg-blue-600 text-white py-10 text-center">
        <h2 className="text-3xl font-bold">Get Started Today</h2>
        <p className="mt-2">
          Join thousands of users creating QR codes and visiting cards.
        </p>
        <div className="mt-4">
          <Link
            to="/signup"
            className="bg-white text-blue-600 py-2 px-6 rounded-lg font-bold hover:bg-blue-100 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </div> */}
    </div>
  );
}

export default Home;

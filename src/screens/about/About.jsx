import React, { useEffect } from "react";
import { UserIcon, ClipboardIcon, ShieldCheckIcon, CurrencyDollarIcon, PhoneIcon, SparklesIcon } from "@heroicons/react/24/outline"; // Ensure correct import path
import Footer from "../../components/home/Footer ";
import AboutHome from "../../components/home/AboutHome";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS

function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: 'ease-in-out', // Easing for smooth transitions
      // once: true,
    });
  }, []);


  // Array of features
  const features = [
    {
      title: "Easy to Use",
      description: "Our platform is designed with simplicity in mind, ensuring anyone can create stunning QR codes and cards without prior experience.",
      icon: <UserIcon className="w-8 h-8 text-blue-600 mx-auto" />
    },
    {
      title: "Customizable Designs",
      description: "Choose from a wide variety of templates and styles to create a design that matches your brand or personal style.",
      icon: <ClipboardIcon className="w-8 h-8 text-blue-600 mx-auto" />
    },
    {
      title: "Secure & Fast",
      description: "Generate and download your QR codes and visiting cards securely, with no delays.",
      icon: <ShieldCheckIcon className="w-8 h-8 text-blue-600 mx-auto" />
    },
    {
      title: "Affordable Pricing",
      description: "We offer competitive pricing to ensure that everyone can access our tools without breaking the bank.",
      icon: <CurrencyDollarIcon className="w-8 h-8 text-blue-600 mx-auto" />
    },
    {
      title: "Dedicated Support",
      description: "Our support team is here to assist you every step of the way, ensuring you have a seamless experience.",
      icon: <PhoneIcon className="w-8 h-8 text-blue-600 mx-auto" />
    },
    {
      title: "Innovation at Heart",
      description: "We continuously improve our platform to bring you the latest and greatest in QR and card generation technology.",
      icon: <SparklesIcon className="w-8 h-8 text-blue-600 mx-auto" />
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">About Us</h1>
        <p className="mt-4 text-xl">
          Learn more about our mission, vision, and the tools we provide to empower you.
        </p>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          At <strong>QR & Cards</strong>, our mission is to make it simple and easy for individuals
          and businesses to create custom QR codes and professional visiting cards. We aim to
          provide intuitive tools and stunning designs that help you stand out.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-lg text-center"
              data-aos="fade-up" // AOS fade-up animation
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-blue-600">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <AboutHome/>

      {/* Call-to-Action Section */}
      <div className="bg-blue-600 text-white py-10 text-center">
        <h2 className="text-3xl font-bold">Join Our Community</h2>
        <p className="mt-2">
          Discover why thousands of users trust <strong>QR & Cards</strong> for their design needs.
        </p>
        <div className="mt-4">
          <a
            href="/qr-generator"
            className="bg-white text-blue-600 py-2 px-6 rounded-lg font-bold hover:bg-blue-100 transition"
          >
            Get Started
          </a>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default About;

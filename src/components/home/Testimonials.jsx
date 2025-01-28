import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import t1 from "../../assets/socialmedia/onesquare.jpeg";
import t2 from "../../assets/socialmedia/onesquare.jpeg";
import t3 from "../../assets/socialmedia/pixelmind.png";
import t4 from "../../assets/socialmedia/zodiac.jpeg";

// Testimonials Data
const testimonials = [
  {
    name: "1square",
    role: "Business Listing App",
    image: t1,
    review: "List your business, sell your pre-owned products, create posters with your name and image, and manage cash books / generate invoices.",
    link: "https://play.google.com/store/apps/details?id=com.onesquare.onesquare",
  },
  {
    name: "1square",
    role: "Business Listing App",
    image: t2,
    review: "List your business, sell your pre-owned products, create posters with your name and image, and manage cash books / generate invoices.",
    link: "https://apps.apple.com/in/app/1square-connect-seller-buyer/id6736521646",
  },
  {
    name: "Pixel Mind",
    role: "Where Innovation Meets Creativity",
    image: t3,
    review: "We craft cutting-edge applications, deliver impactful digital marketing solutions, and offer a wide range of innovative advertisement services to help businesses thrive in the digital landscape.",
    link: "https://pixelmindsolutions.com/",
  },
  {
    name: "ZODIAC TALK",
    role: "",
    image: t4,
    review: "Coming Soon",
  },
];

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">OUR PARTNERS</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full sm:w-80 md:w-96 p-8 bg-white rounded-xl shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-500 ease-in-out"
            data-aos="fade-up"
            data-aos-delay={`${index * 200}`}
          >
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full border-4 border-gold-500 object-cover"
              />
              <div>
                <h4 className="text-xl font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 italic mb-6">{testimonial.review}</p>
            {testimonial.link && (
              <a
                href={testimonial.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg shadow-lg block transform hover:scale-110 transition duration-300"
              >
                Visit
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

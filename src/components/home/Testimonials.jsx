import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import t1 from '../../assets/socialmedia/onesquare.jpeg'
import t2 from '../../assets/socialmedia/onesquare.jpeg'
import t3 from '../../assets/socialmedia/pixelmind.png'
import t4 from '../../assets/socialmedia/zodiac.jpeg'

const testimonials = [
  {
    name: "1square",
    role: "Bussiness Listing App",
    image: t1,
    review: "This service is amazing! It has streamlined my business processes and saved us hours of work.",
  },
  {
    name: "1square",
    role: "Bussiness Listing App",
    image: t2,
    review: "I couldn't be happier with the results. The QR generator is simple, fast, and effective.",
  },
  {
    name: "Pixel Mind",
    role: " Where Innovation Meets Creativity",
    image: t3,
    review: "We craft cutting-edge applications, deliver impactful digital marketing solutions, and offer a wide range of innovative advertisement services to help businesses thrive in the digital landscape.",
  },
  {
    name: "ZODIAC TALK",
    role: "",
    image: t4,
    review: "Comming Soon",
  },
];

const Testimonials = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="py-16">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">What Our Customers Say</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="w-full sm:w-80 md:w-96 p-8 bg-white rounded-xl shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-500 ease-in-out"
            data-aos="fade-up" // AOS animation
            data-aos-delay={`${index * 200}`} // Delay based on index
          >
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full border-4 border-gold-500"
              />
              <div>
                <h4 className="text-xl font-semibold text-gray-800">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 italic">{testimonial.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;

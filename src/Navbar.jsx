import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import './NavBar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 1000 });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300); // Add the fixed navbar after 300px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 fixed top-0 left-0 bg-blue-600 shadow-lg"`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-white"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <Link to="/">QR & Cards</Link>
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link
            to="/"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="300"
          >
            About
          </Link>
          <Link
            to="/qr-generator"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="400"
          >
            QR Generator
          </Link>
          <Link
            to="/visiting-cards"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="500"
          >
            My Cards
          </Link>
          <Link
            to="/pricing"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="600"
          >
            Plans
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4 text-white">
          <Link
            to="/signin"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="700"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="hover:text-blue-300 transition"
            data-aos="fade-down"
            data-aos-delay="800"
          >
            Sign Up
          </Link>
          {/* <button
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg transition"
            data-aos="fade-down"
            data-aos-delay="900"
          >
            Logout
          </button> */}
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            About
          </Link>
          <Link
            to="/qr-generator"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            QR Generator
          </Link>
          <Link
            to="/visiting-cards"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Visiting Cards
          </Link>
          <Link
            to="/pricing"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Plans
          </Link>
          <Link
            to="/signin"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-4 hover:bg-blue-500 transition"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Sign Up
          </Link>
          <button
            className="w-full py-2 px-4 text-left bg-red-500 hover:bg-red-600 text-white transition"
            data-aos="fade-up"
            data-aos-delay="700"
            onClick={() => setIsMenuOpen(false)}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

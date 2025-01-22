import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // For checking the current route

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 1000 });

    // Reinitialize AOS on route change
    AOS.refresh();
  }, [location.pathname]);

  const activeClassName = "text-blue-500 font-bold";

  return (
    <nav
      className="w-full z-50 transition-all drop-shadow-lg duration-300 fixed top-0 left-0 bg-white shadow-lg"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-black"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <NavLink to="/" exact>
            QR AND CARDS
          </NavLink>
        </div>

        {/* Menu Items */}
        <div className="hidden md:flex space-x-6 text-black">
          <NavLink
            to="/"
            exact
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="200"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="300"
          >
            About
          </NavLink>
          <NavLink
            to="/qr-generator"
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="400"
          >
            QR Generator
          </NavLink>
          <NavLink
            to="/visiting-cards"
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="500"
          >
            My Cards
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="600"
          >
            Plans
          </NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4 text-black">
          <NavLink
            to="/signin"
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="700"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition`
                : "hover:text-blue-300 transition"
            }
            data-aos="fade-down"
            data-aos-delay="800"
          >
            Sign Up
          </NavLink>
        </div>

        {/* Hamburger Menu */}
        <button
          className="md:hidden text-black focus:outline-none"
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
        <div className="md:hidden bg-white drop-shadow-lg text-black">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
            data-aos-delay="100"
          >
            About
          </NavLink>
          <NavLink
            to="/qr-generator"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
            data-aos-delay="200"
          >
            QR Generator
          </NavLink>
          <NavLink
            to="/visiting-cards"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Visiting Cards
          </NavLink>
          <NavLink
            to="/pricing"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Plans
          </NavLink>
          <NavLink
            to="/signin"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Sign In
          </NavLink>
          <NavLink
            to="/signup"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${activeClassName} hover:text-blue-300 transition block py-2 px-4`
                : "hover:text-blue-300 transition block py-2 px-4"
            }
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Sign Up
          </NavLink>
          <button
            className="w-full py-2 px-4 text-left bg-red-500 hover:bg-red-600 text-black transition"
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

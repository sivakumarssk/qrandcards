import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import logo from './assets/qrimages/logo.jpg'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // For checking the current route
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 1000 });

    // Reinitialize AOS on route change
    AOS.refresh();
  }, [location.pathname]);

  const handleLogOut = () => {
    setIsMenuOpen(false)
    localStorage.removeItem('token')
    navigate('/signin')
  }

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
          <NavLink to="/" exact className='flex'>
            {/* <img
              src={logo}
              alt="logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto"
            /> */}
            <span className="text-lg sm:text-xl font-bold text-center block mt-2">
              QR AND CARDS
            </span>
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
          <div className="relative group" data-aos="fade-down"
            data-aos-delay="400">
            {/* Main Menu Item */}
            <NavLink
              to="#"
              className="hover:text-blue-300 transition flex items-center space-x-2"
              onClick={(e) => e.preventDefault()}
            >
              My Cards
              <span className="text-lg">&#9662;</span>
            </NavLink>

            {/* Submenu */}
            <ul className="absolute hidden w-[150px] group-hover:flex flex-col bg-white shadow-lg rounded-lg py-2 top-full left-0">
              <li>
                <NavLink
                  to="/mycards/pricing"
                  className="block px-4 py-2 text-sm hover:bg-blue-100 transition"
                >
                  Personal Cards
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/visiting-cards/business"
                  className="block px-4 py-2 text-sm hover:bg-blue-100 transition"
                >
                  Business Cards
                </NavLink>
              </li> */}
            </ul>
          </div>
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
        {!token && <div className="hidden md:flex items-center space-x-4 text-black">
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
        </div>}

        {token && <button
          className="hidden md:flex w-20 py-2 px-4 text-left text-white rounded bg-red-500 hover:bg-red-600 text-black transition"
          data-aos="fade-up"
          data-aos-delay="700"
          onClick={handleLogOut}
        >
          Logout
        </button>}

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

          <div className="relative" data-aos="fade-up"
            data-aos-delay="400">
            <button
              className="w-full text-left px-4 py-2 hover:bg-blue-100"
              onClick={(e) => e.preventDefault()}
            >
              My Cards
            </button>
            <ul className="pl-4">
              <li>
                <NavLink
                  to="/mycards/pricing"
                  className="block py-2 px-4 text-sm hover:bg-blue-100 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Personal Cards
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/visiting-cards/business"
                  className="block py-2 px-4 text-sm hover:bg-blue-100 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Business Cards
                </NavLink>
              </li>
            </ul>
          </div>
          
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
          {!token && (
            <>
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
            </>
          )}

          {token && <button
            className="w-full py-2 px-4 text-left text-white bg-red-500 hover:bg-red-600 text-black transition"
            data-aos="fade-up"
            data-aos-delay="700"
            onClick={handleLogOut}
          >
            Logout
          </button>}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

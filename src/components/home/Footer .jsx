// File: src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold">QR AND CARDS GENERATOR</h3>
            <p className="text-sm text-gray-400">
            simplify your QR and e-visiting cards creation, with our advance tools
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/policy/privacy"
              className="text-gray-400 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              to="/policy/termsandconditions"
              className="text-gray-400 hover:text-white"
            >
              Terms of Service
            </Link>
            <Link
              to="/policy/refund"
              className="text-gray-400 hover:text-white"
            >
              Refund Policy
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          © 2025 AtoZ key Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

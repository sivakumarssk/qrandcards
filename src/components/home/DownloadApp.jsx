// File: src/components/DownloadApp.jsx
import React from "react";
import { motion } from "framer-motion";
import googleplay from '../../assets/corousel/google-play.png'
import appstore from '../../assets/corousel/app-store.png'

const DownloadApp = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 mt-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white">Download Our App</h2>
        <p className="text-lg text-white mt-4">Get started with our app and enjoy amazing features today!</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        <motion.a
          href="https://play.google.com/store/apps/details?id=com.example.app" // Replace with your Play Store link
          target="_blank"
          rel="noopener noreferrer"
          className="w-48 sm:w-60 md:w-72 h-14 bg-white flex items-center justify-center rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={googleplay} // Play Store logo
            alt="Google Play"
            className="w-10 h-10 mr-4 ml-4"
          />
          <span className="text-lg font-semibold text-gray-800">Get it on Google Play</span>
        </motion.a>

        <motion.a
          href="https://apps.apple.com/us/app/id1234567890" // Replace with your App Store link
          target="_blank"
          rel="noopener noreferrer"
          className="w-48 sm:w-60 md:w-72 bg-white flex items-center justify-center rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={appstore} // App Store logo
            alt="App Store"
            className="w-10 h-10 mr-4 ml-4"
          />
          <span className="text-lg font-semibold text-gray-800">Get it on App Store</span>
        </motion.a>
      </div>
    </div>
  );
};

export default DownloadApp;

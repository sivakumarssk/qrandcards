import React, { useState } from "react";

const QRForm = ({ activeType, onSubmit }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderFields = () => {
    switch (activeType) {
      case "text":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Text
            </label>
            <input
              type="text"
              name="text"
              placeholder="Enter text..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
          </div>
        );
      case "url":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              placeholder="Enter URL..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
          </div>
        );
      case "phone":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
          </div>
        );
      case "email":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Enter subject..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
            </div>
          </>
        );
      case "upi":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              UPI ID
            </label>
            <input
              type="text"
              name="upi"
              placeholder="Enter UPI ID..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
          </div>
        );
      // Add similar fields for YouTube, Facebook, WhatsApp, etc.
      default:
        return <p className="text-gray-500">Please select a QR type.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderFields()}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-500 transition"
      >
        Generate QR Code
      </button>
    </form>
  );
};

export default QRForm;

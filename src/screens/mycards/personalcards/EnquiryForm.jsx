import React, { useState } from "react";

export const EnquiryForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Name:
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        required
      />
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Email:
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        required
      />
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Message:
      </label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        rows="4"
        required
      ></textarea>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>
  );
};

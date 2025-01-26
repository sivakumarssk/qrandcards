import React, { useState } from "react";

export const SocialMediaLinks = ({ onLinksChange }) => {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      onLinksChange(updatedLinks);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    onLinksChange(updatedLinks);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Add Social Media Links:
      </label>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="url"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Enter social media link"
          className="border border-gray-300 rounded-lg p-2 flex-1"
        />
        <button
          onClick={handleAddLink}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center justify-between">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {link}
            </a>
            <button
              onClick={() => handleRemoveLink(index)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

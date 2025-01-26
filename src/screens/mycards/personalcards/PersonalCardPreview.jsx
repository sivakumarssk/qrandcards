import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import  PersonalCardPDF  from "./PersonalCardPDF.jsx";

const PersonalCardPreview = ({ formData, onEdit }) => {
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          {/* Profile Section */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
            <img
              src={
                formData.profilePicture ||
                "https://via.placeholder.com/150?text=Profile+Picture"
              }
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {formData.name || "Your Name"}
          </h1>
          <p className="text-blue-500 text-sm">{formData.hashtag || "#Hashtag"}</p>
          <p className="text-center mt-2 text-gray-600">
            {formData.description || "Short description about yourself."}
          </p>

          {/* Contact Details */}
          <div className="mt-6 w-full md:w-2/3 text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Contact Details
            </h2>
            <ul className="space-y-2">
              <li>
                <strong>Phone:</strong> {formData.phoneNumber || "N/A"}
              </li>
              <li>
                <strong>Profession:</strong> {formData.profession || "N/A"}
              </li>
              <li>
                <strong>Address:</strong> {formData.address || "N/A"}
              </li>
              <li>
                <strong>Company:</strong> {formData.companyName || "N/A"}
              </li>
              <li>
                <strong>Website:</strong> {formData.website || "N/A"}
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          {formData.socialMediaLinks.length > 0 && (
            <div className="mt-6 w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Social Media Links
              </h2>
              <ul className="flex flex-wrap space-x-4">
                {formData.socialMediaLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* About Section */}
          {formData.about && (
            <div className="mt-6 w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                About Me
              </h2>
              <p className="text-gray-600">{formData.about}</p>
            </div>
          )}

          {/* Product/Service Images */}
          {formData.productImages.length > 0 && (
            <div className="mt-6 w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Products/Services
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gallery Images */}
          {formData.galleryImages.length > 0 && (
            <div className="mt-6 w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Gallery
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {formData.galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Video Gallery */}
          {formData.galleryVideos.length > 0 && (
            <div className="mt-6 w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Video Gallery
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {formData.galleryVideos.map((video, index) => (
                  <video
                    key={index}
                    src={video}
                    controls
                    className="w-full h-40 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          )}

          {/* UPI Link */}
          {formData.upiLink && (
            <div className="mt-6 w-full md:w-2/3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                UPI Payments
              </h2>
              <a
                href={formData.upiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Click here to make a payment
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
            onClick={onEdit}
          >
            Edit Details
          </button>
          <PDFDownloadLink
            document={<PersonalCardPDF formData={formData} />}
            fileName="personal-card.pdf"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Download PDF
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default PersonalCardPreview;

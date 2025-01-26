import React, { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import FacebookIcon from "../../../assets/socialmedia/facebook.png";
import InstagramIcon from "../../../assets/socialmedia/instagram.png";
import PhoneIcon from "../../../assets/socialmedia/instagram.png";
import EmailIcon from "../../../assets/socialmedia/instagram.png";
import AddressIcon from "../../../assets/socialmedia/instagram.png";
import PaytmIcon from "../../../assets/socialmedia/instagram.png";
import GooglePayIcon from "../../../assets/socialmedia/instagram.png";



function PersonalCards() {
  const [formData, setFormData] = useState({
    name: "",
    profileImage: null,
    hashtag: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    about: "",
    socialLinks: [
      { platform: "Facebook", link: "" },
      { platform: "Instagram", link: "" },
    ],
    upiLinks: [
      { platform: "Paytm", link: "" },
      { platform: "Google Pay", link: "" },
    ],
    productImages: [],
    gallery: [],
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [key]: file });
  };

  const handleMultipleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, [key]: [...formData[key], ...files] });
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const socialIcons = {
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
  };

  const upiIcons = {
    Paytm: PaytmIcon,
    "Google Pay": GooglePayIcon,
  };

  const handleDownloadPDF = async () => {
    try {
      const previewElement = document.getElementById("preview-content");
  
      // Render the preview element to a canvas
      const canvas = await html2canvas(previewElement, { useCORS: true, scale: 2 });
  
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF("p", "mm", "a4");
  
      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      // Scale ratio
      const scaleRatio = pdfWidth / canvasWidth;
  
      // Scaled height of the full canvas content in the PDF
      const scaledHeight = canvasHeight * scaleRatio;
  
      let currentHeight = 0;
  
      while (currentHeight < canvasHeight) {
        if (currentHeight > 0) pdf.addPage();
  
        // Extract the visible portion of the canvas for the current page
        const canvasPage = document.createElement("canvas");
        canvasPage.width = canvas.width;
        canvasPage.height = Math.min(canvasHeight - currentHeight, pdfHeight / scaleRatio);
  
        const context = canvasPage.getContext("2d");
        context.drawImage(
          canvas,
          0,
          currentHeight,
          canvas.width,
          canvasPage.height,
          0,
          0,
          canvas.width,
          canvasPage.height
        );
  
        const pageImgData = canvasPage.toDataURL("image/jpeg");
        pdf.addImage(
          pageImgData,
          "JPEG",
          0,
          0,
          pdfWidth,
          (canvasPage.height * pdfWidth) / canvas.width
        );
  
        currentHeight += canvasPage.height;
      }
  
      const fileName = formData.name
        ? `${formData.name}-E-Visiting-Card.pdf`
        : "E-Visiting-Card.pdf";
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    }
  };
  
  




  if (previewMode) {
    return (
      <div className="p-6 bg-gray-100 mt-[5%] min-h-screen flex flex-col justify-center items-center">
        <div
          id="preview-content"
          className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full"
        >
          {/* Profile Image */}
          {formData.profileImage && (
            <div className="flex justify-center mb-4">
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-300"
              />
            </div>
          )}
          <h2 className="text-xl font-bold text-center mb-2">{formData.hashtag}</h2>
          <p className="text-center text-gray-700 mb-4">{formData.description}</p>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
              About Me
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.about}</p>
          </div>

          {/* Contact Details */}
          <div className="mb-6">
            <h3 className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
              Contact Details
            </h3>
            <ul className="border p-4 rounded-b-lg space-y-2">
              {formData.phone && (
                <li>
                  <img src={PhoneIcon} alt="Phone" className="inline w-5 h-5 mr-2" />
                  {formData.phone}
                </li>
              )}
              {formData.email && (
                <li>
                  <img src={EmailIcon} alt="Email" className="inline w-5 h-5 mr-2" />
                  {formData.email}
                </li>
              )}
              {formData.address && (
                <li>
                  <img
                    src={AddressIcon}
                    alt="Address"
                    className="inline w-5 h-5 mr-2"
                  />
                  {formData.address}
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          {formData.socialLinks.some((link) => link.link) && (
            <div className="mb-6">
              <h3 className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
                Social Media Links
              </h3>
              <ul className="border p-4 rounded-b-lg space-y-2">
                {formData.socialLinks.map(
                  (link, index) =>
                    link.link && (
                      <li key={index}>
                        <img
                          src={socialIcons[link.platform]}
                          alt={link.platform}
                          className="inline w-5 h-5 mr-2"
                        />
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {link.link}
                        </a>
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* UPI Links */}
          {formData.upiLinks.some((link) => link.link) && (
            <div className="mb-6">
              <h3 className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
                UPI Links
              </h3>
              <ul className="border p-4 rounded-b-lg space-y-2">
                {formData.upiLinks.map(
                  (link, index) =>
                    link.link && (
                      <li key={index}>
                        <img
                          src={upiIcons[link.platform]}
                          alt={link.platform}
                          className="inline w-5 h-5 mr-2"
                        />
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {link.link}
                        </a>
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* Product Images */}
          {formData.productImages.length > 0 && (
            <div className="mb-6">
              <h3 className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
                Products
              </h3>
              <div className="border p-4 rounded-b-lg grid grid-cols-4 gap-4 justify-items-center">
                {formData.productImages.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Product"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {formData.gallery.length > 0 && (
            <div className="mb-6">
              <h3 className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
                Gallery
              </h3>
              <div className="border p-4 rounded-b-lg grid grid-cols-4 gap-4 justify-items-center">
                {formData.gallery.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Gallery"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">

          <button
            className="bg-red-500 text-white mt-4 py-2 px-4 rounded"
            onClick={() => setPreviewMode(false)}
          >
            Edit Details
          </button>
          <button
            className="bg-green-500 text-white mt-4 py-2 px-4 rounded ml-4"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-[5%]">
      <h1 className="text-3xl font-bold mb-6">Create Personal Visiting Card</h1>
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={(e) => {
          e.preventDefault();
          handlePreview();
        }}
      >
        <div className="mb-4">
          <label className="block mb-2">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "profileImage")}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Hashtag</label>
          <input
            type="text"
            name="hashtag"
            value={formData.hashtag}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Social Links</label>
          {formData.socialLinks.map((link, index) => (
            <div key={index} className="flex mb-2">
              <span className="w-1/3">{link.platform}</span>
              <input
                type="text"
                placeholder="Link"
                value={link.link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: formData.socialLinks.map((l, i) =>
                      i === index ? { ...l, link: e.target.value } : l
                    ),
                  })
                }
                className="w-2/3 border p-2 rounded"
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block mb-2">UPI Links</label>
          {formData.upiLinks.map((link, index) => (
            <div key={index} className="flex mb-2">
              <span className="w-1/3">{link.platform}</span>
              <input
                type="text"
                placeholder="Link"
                value={link.link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    upiLinks: formData.upiLinks.map((l, i) =>
                      i === index ? { ...l, link: e.target.value } : l
                    ),
                  })
                }
                className="w-2/3 border p-2 rounded"
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFileChange(e, "productImages")}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Gallery Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFileChange(e, "gallery")}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Preview
        </button>
      </form>
    </div>
  );
}

export default PersonalCards;

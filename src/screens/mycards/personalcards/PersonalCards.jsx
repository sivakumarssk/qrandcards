import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function PersonalCards() {
  const [formData, setFormData] = useState({
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

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 20;

    const addCenteredSection = (title, subtitle) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(title, 105, y, { align: "center" });
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(subtitle, 105, y, { align: "center" });
      y += 20;
    };

    const addSectionHeader = (title) => {
      doc.setFillColor(230, 230, 230);
      doc.rect(10, y, 190, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 12, y + 6);
      y += 12;
    };

    const addImagesInGrid = (items, startX = 12, startY = 20, imgWidth = 40, imgHeight = 40, gapX = 10, gapY = 10) => {
      let x = startX;
      let y = startY;

      items.forEach((item) => {
        if (y + imgHeight > 280) {
          doc.addPage();
          x = startX;
          y = 20;
        }

        const img = URL.createObjectURL(item);
        doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);

        x += imgWidth + gapX;
        if (x + imgWidth > 190) {
          x = startX;
          y += imgHeight + gapY;
        }
      });

      return y + imgHeight + gapY;
    };

    // Profile Section
    if (formData.profileImage) {
      const img = URL.createObjectURL(formData.profileImage);
      doc.addImage(img, "JPEG", 80, y, 50, 50);
      y += 60;
    }
    addCenteredSection(formData.hashtag, formData.description);

    // About Me
    addSectionHeader("About Me");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(formData.about, 180), 12, y);
    y += 20;

    // Contact Details
    addSectionHeader("Contact Details");
    doc.text(`Phone: ${formData.phone}`, 12, y);
    y += 10;
    doc.text(`Email: ${formData.email}`, 12, y);
    y += 10;
    doc.text(`Address: ${formData.address}`, 12, y);
    y += 20;

    // Social Media Links
    if (formData.socialLinks.some((link) => link.link)) {
      addSectionHeader("Social Media Links");
      formData.socialLinks.forEach((link) => {
        if (link.link) {
          doc.text(`${link.platform}: ${link.link}`, 12, y);
          y += 10;
        }
      });
    }

    // Products
    if (formData.productImages.length > 0) {
      addSectionHeader("Products");
      y = addImagesInGrid(formData.productImages, 12, y);
    }

    // Gallery
    if (formData.gallery.length > 0) {
      addSectionHeader("Gallery");
      y = addImagesInGrid(formData.gallery, 12, y);
    }

    doc.save("portfolio.pdf");
  };

  if (previewMode) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Preview Portfolio</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Profile Section */}
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
          )}
          <h2 className="text-xl font-bold text-center mb-2">{formData.hashtag}</h2>
          <p className="text-center text-gray-700 mb-4">{formData.description}</p>
          <div>
            <h3 className="font-bold">About Me</h3>
            <p className="text-gray-700 mb-4">{formData.about}</p>
          </div>
          <div>
            <h3 className="font-bold">Contact Details</h3>
            <ul>
              <li>Phone: {formData.phone}</li>
              <li>Email: {formData.email}</li>
              <li>Address: {formData.address}</li>
            </ul>
          </div>
          {formData.socialLinks.some((link) => link.link) && (
            <div>
              <h3 className="font-bold">Social Media Links</h3>
              <ul>
                {formData.socialLinks.map((link, index) =>
                  link.link ? (
                    <li key={index}>
                      {link.platform}: <a href={link.link}>{link.link}</a>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}
          {formData.productImages.length > 0 && (
            <div>
              <h3 className="font-bold">Products</h3>
              <div className="grid grid-cols-4 gap-4">
                {formData.productImages.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
          {formData.gallery.length > 0 && (
            <div>
              <h3 className="font-bold">Gallery</h3>
              <div className="grid grid-cols-4 gap-4">
                {formData.gallery.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Gallery"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create Personal Portfolio</h1>
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

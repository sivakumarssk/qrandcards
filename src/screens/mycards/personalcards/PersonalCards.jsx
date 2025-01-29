import React, { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import FacebookIcon from "../../../assets/socialmedia/facebook.png";
import InstagramIcon from "../../../assets/socialmedia/instagram.png";
import PhoneIcon from "../../../assets/socialmedia/phone.png";
import EmailIcon from "../../../assets/socialmedia/email.png";
import AddressIcon from "../../../assets/socialmedia/address.png";
import PhonePayIcon from "../../../assets/socialmedia/phonepay.png";
import GooglePayIcon from "../../../assets/socialmedia/gpay.png";

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
      { platform: "Phone Pay", link: "" },
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


  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let currentY = 10; // Starting position on the page

    // Function to add sections to the PDF with high-quality rendering
    const addSectionToPDF = async (sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;

      const canvas = await html2canvas(sectionElement, { useCORS: true, scale: 3 });
      const imgData = canvas.toDataURL("image/png");
      const sectionHeight = (canvas.height / canvas.width) * pdfWidth;

      if (currentY + sectionHeight > pdfHeight) {
        pdf.addPage();
        currentY = 10;
      }

      pdf.addImage(imgData, "PNG", 10, currentY, pdfWidth - 20, sectionHeight);
      currentY += sectionHeight + 10;

      // Add clickable links for sections with links
      if (sectionId === "social-links-section" || sectionId === "upi-links-section") {
        const links = formData[sectionId === "social-links-section" ? "socialLinks" : "upiLinks"];
        links.forEach((link, index) => {
          if (link.link) {
            const linkY = currentY - sectionHeight + 20 + index * 10;
            pdf.link(20, linkY, pdfWidth - 40, 5, { url: link.link });
          }
        });
      }
    };

    // Render each section
    const sections = [
      "profile-section",
      "about-section",
      "contact-section",
      "social-links-section",
      "upi-links-section",
      "products-section",
      "gallery-section",
    ];

    for (const sectionId of sections) {
      await addSectionToPDF(sectionId);
    }

    // Save the PDF
    const fileName = formData.name
      ? `${formData.name.replace(/\s+/g, "_")}_E-Visiting_Card.pdf`
      : "E-Visiting_Card.pdf";
    pdf.save(fileName);
  };

  console.log(formData.name, "nameout");

  const socialIcons = {
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
  };

  const upiIcons = {
    "Phone Pay": PhonePayIcon,
    "Google Pay": GooglePayIcon,
  };

  const handlePDFPayment = () => {
    const options = {
      key: "rzp_live_HJLLQQPlyQFOGr",
      razorpay_secret: "cm2v1OSggPZ5vVHX5rl3jrq4",
      amount: 185 * 100, // Discounted price in paise
      currency: "INR",
      name: "Personal Visiting Card",
      description: "Download PDF",
      handler: function (response) {
        // Payment successful
        handleDownloadPDF(); // Trigger PDF download after payment
        alert("Payment successful! Your PDF will be downloaded.");
      },
      modal: {
        ondismiss: function () {
          // Payment popup closed by the user
          alert("Payment cancelled.");
        },
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      // Handle payment failure
      alert("Payment failed. Please try again.");
      console.error(response.error);
    });

    rzp.open(); // Open Razorpay payment popup
  };


  if (previewMode) {
    return (
      <div className="p-6 bg-gray-100 mt-[5%] min-h-screen flex flex-col justify-center items-center">
        <div
          id="preview-content"
          className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full"
        >
          {/* Profile Image */}
          <div id="profile-section">
            {formData.profileImage && (
              <div className="flex justify-center mb-4"  >
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-gray-300"
                />
              </div>
            )}
            <h2 className="text-xl font-bold text-center mb-2">{formData.name}</h2>
            <h2 className="text-xl font-bold text-center mb-2">{formData.hashtag}</h2>
            <p className="text-center text-gray-700 mb-4 pb-4">{formData.description}</p>
          </div>

          {/* About Section */}
          <div className="mb-6" id="about-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
              About Me
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.about}</p>
          </div>

          {/* Contact Details */}
          <div className="mb-6" id="contact-section" >
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
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
            <div className="mb-6" id="social-links-section">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
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
            <div className="mb-6" id="upi-links-section">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
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
            <div className="mb-6" id="products-section">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
                {/* Products */}
                My Achievements
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
            <div className="mb-6" id="gallery-section">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg" id="gallery-section">
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
          <div className="flex justify-center items-center mt-6">
            <div className="text-center">
              <p className="text-gray-500 line-through">₹500</p>
              <p className="text-green-600 font-bold text-xl">₹185</p>
              <p className="text-blue-500 text-sm">(63% Off)</p>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ml-4"
              onClick={handlePDFPayment}
            >
              Pay ₹185 to Download PDF
            </button>
          </div>

        </div>

        <div className="mt-4 mb-4">
          <p className="text-center"><span className="font-semibold">Note</span> -you can convert your pdf to QR</p>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-[14%] lg:mt-[4%]">
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
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name" // Ensure this matches the key in formData
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Profession</label>
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
          <label className="block mb-2">About Yourself</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Whatsapp Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Residential Address</label>
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
          <label className="block mb-2">Achievement/Awards Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFileChange(e, "productImages")}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Images/Friends</label>
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

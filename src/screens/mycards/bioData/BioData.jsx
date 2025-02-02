import React, { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import getCroppedImg from "./cropImage.js";
import FacebookIcon from "../../../assets/socialmedia/facebook.png";
import InstagramIcon from "../../../assets/socialmedia/instagram.png";
import PhoneIcon from "../../../assets/socialmedia/phone.png";
import EmailIcon from "../../../assets/socialmedia/email.png";
import AddressIcon from "../../../assets/socialmedia/address.png";
import Cropper from "react-easy-crop";

function BioData() {
  const [formData, setFormData] = useState({
    name: "",
    profileImage: null,
    croppedProfileImage: null,
    education: "",
    profession:"",
    dob: "",
    height:"",
    nativeplace: "",
    caste:"",
    familydetails:"",
    hobbies:"",
    phone: "",
    email: "",
    address: "",
    socialLinks: [
      { platform: "Facebook", link: "" },
      { platform: "Instagram", link: "" },
    ],
    gallery: [],
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFormData({ ...formData, croppedProfileImage: croppedImage });
      setShowCropModal(false);
    } catch (error) {
      console.error("Cropping error:", error);
    }
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
      "education-section",
      "about-section",
      "family-section",
      "hobbies-section",
      "contact-section",
      "social-links-section",
      "gallery-section",
    ];

    for (const sectionId of sections) {
      await addSectionToPDF(sectionId);
    }

    // Save the PDF
    const fileName = formData.name
      ? `${formData.name.replace(/\s+/g, "_")}_E-Business_Card.pdf`
      : "E-Business_Card.pdf";
    pdf.save(fileName);
  };

  console.log(formData.name, "nameout");

  const socialIcons = {
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
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
          <div className="flex justify-center mb-4"  >
            {formData.croppedProfileImage ? (
              <img
                src={formData.croppedProfileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-300"
              />
            ) : formData.profileImage ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-300"
              />
            ) : (
              <p>No Image Selected</p>
            )}
          </div>

            <h2 className="text-xl font-bold text-center mb-2 pb-4">{formData.name}</h2>
          </div>

          {/* Education Section */}
          <div className="mb-6" id="education-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
            Education
            </h3>
            
            <p className="border p-4 rounded-b-lg">
            {formData.education}</p>
          </div>
           
          {/* About Section */}
          <div className="mb-6" id="about-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
             About me
            </h3>
            
            <p className="border p-4 rounded-b-lg">
            {formData.profession && <h4><span className="text-md font-bold mb-1">Profession: </span> {formData.profession}</h4>}<br/>
            {formData.dob && <h4><span className="text-md font-bold mb-1">Date, time, place of birth: </span> {formData.dob}</h4>}<br/>
            {formData.height && <h4><span className="text-md font-bold mb-1">Height: </span> {formData.height}</h4>}<br/>
            {formData.nativeplace && <h4><span className="text-md font-bold mb-1">Native place: </span> {formData.nativeplace}</h4>}<br/>
            {formData.caste && <h4><span className="text-md font-bold mb-1">Caste / sub caste: </span> {formData.caste}</h4>}<br/>
            </p>
          </div>

        {/* Family details Section */}
          <div className="mb-6" id="family-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
            Family details
            </h3>
            
            <p className="border p-4 rounded-b-lg">
            {formData.familydetails}</p>
          </div>

           {/* Activities/ hobbies Section */}
           <div className="mb-6" id="hobbies-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
            Activities/ hobbies
            </h3>
            
            <p className="border p-4 rounded-b-lg">
            {formData.hobbies}</p>
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

          {/* Gallery */}
          {formData.gallery.length > 0 && (
            <div className="mb-6" id="gallery-section">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
              YOUR IMAGES
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
      <h1 className="text-3xl font-bold mb-6">Create Bio Data</h1>
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={(e) => {
          e.preventDefault();
          handlePreview();
        }}
      >
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.croppedProfileImage && (
            <div className="mt-4">
              <img
                src={formData.croppedProfileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-300"
              />
            </div>
          )}
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
          <label className="block mb-2">Education</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Profession</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

           <div className="mb-4">
          <label className="block mb-2">Date, time, place of birth</label>
          <input
            type="text"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>


        <div className="mb-4">
          <label className="block mb-2">Height</label>
          <input
            type="text"
            name="height"
            value={formData.height }
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Native Place</label>
          <input
            type="text"
            name="nativeplace"
            value={formData.nativeplace}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Caste / Sub Caste</label>
          <input
            type="text"
            name="caste"
            value={formData.caste}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Family Details</label>
          <textarea
            name="familydetails"
            value={formData.familydetails}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Activities/ hobbies</label>
          <textarea
            name="hobbies"
            value={formData.hobbies}
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
          <label className="block mb-2">Location</label>
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
          <label className="block mb-2">YOUR IMAGES</label>
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

      {/* Cropper Modal */}
      {showCropModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-2">Crop Your Image</h3>
              <div className="relative w-[300px] h-[300px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowCropModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleCrop}
                >
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}

export default BioData;

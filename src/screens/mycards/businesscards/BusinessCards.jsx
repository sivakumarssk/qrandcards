import React, { useCallback, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import getCroppedImg from "./cropImage.js";
import FacebookIcon from "../../../assets/socialmedia/facebook.png";
import InstagramIcon from "../../../assets/socialmedia/instagram.png";
import PhoneIcon from "../../../assets/socialmedia/phone.png";
import EmailIcon from "../../../assets/socialmedia/email.png";
import AddressIcon from "../../../assets/socialmedia/address.png";
import PhonePayIcon from "../../../assets/socialmedia/phonepay.png";
import GooglePayIcon from "../../../assets/socialmedia/gpay.png";
import websiteIcon from "../../../assets/socialmedia/website.png";
import Cropper from "react-easy-crop";
import axios from "axios";
import whatsappImage from "../../../assets/qrimages/whatsapp.png";
import { useNavigate } from "react-router-dom";


function BusinessCards() {
  const [formData, setFormData] = useState({
    name: "",
    profileImage: null,
    croppedProfileImage: null,
    hashtag: "",
    designation:"",
    description: "",
    phone: "",
    email: "",
    address: "",
    about: "",
    gstno:"",
    bussinestimings:"",
    referal:"",
    socialLinks: [
      { platform: "Website", link: "" },
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [prices, setPrices] = useState(null);
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchPrices = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/getPrice");
      if (response.data) {
        const {
          totalpriceBusiness,
          dicountpriceBusiness,
        } = response.data;

        setPrices({
          totalpriceBusiness,
          dicountpriceBusiness,
        });
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  const fetchCardsBackground = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/cardsBackground");
      if (response.status === 200) {
        setBackgrounds(response?.data?.image);
      }
    } catch (error) {
      console.error("Error fetching cards background:", error);
    }
  };

  const handleReferal = async () => {
    if (formData.referal && formData.referal.trim() !== "") {
      const userEmail = localStorage.getItem("email");
      if (userEmail) {
        try {
          await axios.post("https://admin.qrandcards.com/api/addreferals", {
            user: userEmail,
            referal: formData.referal,
            type: "Business Card",
          });
          console.log("Referral posted successfully.");
        } catch (error) {
          console.error("Error posting referral:", error);
        }
      }
    }
  };

  useEffect(()=>{
    fetchPrices()
    fetchCardsBackground();
  },[])

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
    let currentY = 10; // Start position for content
  
    // Load and apply background image
    let bgImage = null;
    if (selectedBackground) {
      bgImage = new Image();
      bgImage.src = selectedBackground;
      await new Promise((resolve) => {
        bgImage.onload = resolve;
      });
    }
  
    // 🟢 Apply background to the first page
    if (bgImage) {
      pdf.addImage(bgImage, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
  
    // Function to capture each section and add it to the PDF
    const addSectionToPDF = async (sectionId) => {
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;
  
      const canvas = await html2canvas(sectionElement, {
        useCORS: true,
        scale: 3,
        backgroundColor: null, // Keep section transparent
      });
  
      const imgData = canvas.toDataURL("image/png");
      const sectionHeight = (canvas.height / canvas.width) * pdfWidth;
  
      // 🟢 Check if the section fits on the current page
      if (currentY + sectionHeight > pdfHeight) {
        pdf.addPage();
        currentY = 10;
  
        // 🟢 Apply background image on new page
        if (bgImage) {
          pdf.addImage(bgImage, "PNG", 0, 0, pdfWidth, pdfHeight);
        }
      }
  
      pdf.addImage(imgData, "PNG", 10, currentY, pdfWidth - 20, sectionHeight);
      currentY += sectionHeight + 10;
  
      // 🟢 Add clickable links (only for specific sections)
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
  
    // 🟢 List of Sections to Add to PDF
    const sections = [
      "profile-section",
      "about-section",
      "contact-section",
      "social-links-section",
      "upi-links-section",
      "bussines-section",
      "products-section",
      "gallery-section",
    ];
  
    // 🟢 Render each section in the PDF
    for (const sectionId of sections) {
      await addSectionToPDF(sectionId);
    }
  
    // 🟢 Save the PDF
    const fileName = formData.name
      ? `${formData.name.replace(/\s+/g, "_")}_E-Business_Card.pdf`
      : "E-Business_Card.pdf";
    pdf.save(fileName);
    
    handleReferal();
  };
  

  console.log(formData.name, "nameout");

  const socialIcons = {
    Website: websiteIcon,
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
  };

  const upiIcons = {
    "Phone Pay": PhonePayIcon,
    "Google Pay": GooglePayIcon,
  };

  const updateBusinessCount = async () => {
    try {
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "totalBusiness",
        value: 1
      });

      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "dailyBusiness",
        value: 1
      });

      console.log("QR code count updated successfully!");
    } catch (error) {
      console.error("Error updating QR code count:", error);
    }
  };

  const handlePDFPayment = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      navigate("/signin");
      return;
    }
  
    try {
      // Fetch order ID from backend
      const response = await axios.post("https://admin.qrandcards.com/api/create-order", {
        amount: prices?.dicountpriceInvitation || 185,
        currency: "INR",
      });
  
      const { orderId, amount } = response.data;
  
      // Razorpay payment options
      const options = {
        key: "rzp_live_HJLLQQPlyQFOGr",
        amount: amount, // Amount from backend
        currency: "INR",
        name: "Personal Visiting Card",
        description: "Download PDF",
        order_id: orderId, // Use order ID from backend
        handler: function (paymentResponse) {
          handleDownloadPDF();
          updateBusinessCount();
          alert("Payment successful! Your PDF will be downloaded.");
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled.");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9876543210"
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed. Please try again.");
        console.error(response.error);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  if (previewMode) {
    return (
      <div className="p-6 bg-gray-100 mt-[5%] min-h-screen flex flex-col justify-center items-center">
        <div
          id="preview-content"
          className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full"
          style={{
            overflow: "hidden",
            backgroundImage: selectedBackground ? `url(${selectedBackground})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
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

            <h2 className="text-xl font-bold text-center mb-2">{formData.name}</h2>
            <p className="text-center text-gray-700 mb-4 pb-4">{formData.description}</p>
          </div>

          {/* About Section */}
          <div className="mb-6" id="about-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
             About us
            </h3>
            
            <p className="border p-4 rounded-b-lg">
            {formData.hashtag && <h4><span className="text-md font-bold mb-1">My Name:</span> {formData.hashtag}</h4>}<br/>
            {formData.designation && <h4><span className="text-md font-bold mb-1">My Designation:</span> {formData.designation}</h4>}<br/>
            {formData.about}</p>
          </div>


          {/* Contact Details */}
          <div className="mb-6" id="contact-section" >
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
              Contact Details
            </h3>
            <ul className="border p-4 rounded-b-lg space-y-2">
              {formData.phone && (
                <li>
                <img src={whatsappImage} alt="Phone" className="inline w-5 h-5 mr-2" />
                <a
                  href={`https://api.whatsapp.com/send?phone=${formData.phone}`}
                  data-url={`https://api.whatsapp.com/send?phone=${formData.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {formData.phone}
                </a>
              </li>
              )}
              {formData.email && (
                <li>
                  <img src={EmailIcon} alt="Email" className="inline w-5 h-5 mr-2" />
                  <a href={`mailto:${formData.email}`} className="text-blue-500 underline">
                    {formData.email}
                  </a>
                </li>
              )}
              {formData.address && (
                <li>
                  <img
                    src={AddressIcon}
                    alt="Address"
                    className="inline w-5 h-5 mr-2"
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      formData.address
                    )}`}
                    data-url={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      formData.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {formData.address}
                  </a>
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

          {/* Bussines Timings */}
          <div className="mb-6" id="bussines-section">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
             Bussines Info
            </h3>
            
            <p className="border p-4 rounded-b-lg">
            {formData.gstno && <p><span className="text-md font-bold mb-1">GST No:</span> {formData.gstno}</p>}<br/>
            {formData.bussinestimings && <p><span className="text-md font-bold mb-1">Bussines Timings:</span> {formData.bussinestimings}</p>}<br/>
            </p>
          </div>
          

          {/* Product Images */}
          {formData.productImages.length > 0 && (
            <div className="mb-6" id="products-section">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg">
                {/* Products */}
                Product Images
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
              Other Business Images
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
              <p className="text-gray-500 line-through">₹{prices?.totalpriceBusiness || 500}</p>
              <p className="text-green-600 font-bold text-xl">₹{prices?.dicountpriceBusiness || 185}</p>
              <p className="text-blue-500 text-sm">(Offer price)</p>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ml-4"
              onClick={handlePDFPayment}
            >
              Pay ₹{prices?.dicountpriceBusiness || 185} to Download PDF
            </button>
          </div>

        </div>

        <div className="mt-4 mb-4">
          <p className="text-center"><span className="font-semibold">Note</span> -you can convert your pdf to QR</p>
          <p className="text-center">By Using Our QR Generator</p>
        </div>
      </div>
    );
  }



  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-[14%] lg:mt-[4%]">
      <h1 className="text-3xl font-bold mb-6">Create Business Visiting Card</h1>
      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={(e) => {
          e.preventDefault();
          handlePreview();
        }}
      >
        <div className="mb-4">
          <label className="block mb-2">Logo Image</label>
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
          <label className="block mb-2">Bussines name</label>
          <input
            type="text"
            name="name" // Ensure this matches the key in formData
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Your name</label>
          <input
            type="text"
            name="hashtag"
            value={formData.hashtag}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
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
          <label className="block mb-2">About Us</label>
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
          <label className="block mb-2">Location</label>
          <input
            type="text"
            name="address"
            placeholder="Link"
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
                placeholder="Upi Id"
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
          <label className="block mb-2">GST No</label>
          <input
            type="text"
            name="gstno"
            value={formData.gstno}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Bussines Timings</label>
          <input
            type="text"
            name="bussinestimings"
            value={formData.bussinestimings}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Referal Code (Optional)</label>
          <input
            type="number"
            name="referal"
            value={formData.referal}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFileChange(e, "productImages")}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Your Other Business Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFileChange(e, "gallery")}
          />
        </div>

        {/* Background Images Selection */}
        {backgrounds?.length > 0 && (
          <div className="mb-4">
            <label className="block mb-2">Select Background</label>
            <div className="flex space-x-2 overflow-x-auto">
              {backgrounds.map((bg, index) => (
                <img
                  key={index}
                  src={`https://admin.qrandcards.com${bg}`}
                  alt={`Background ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    selectedBackground === `https://admin.qrandcards.com${bg}`
                      ? "border-blue-800"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedBackground(`https://admin.qrandcards.com${bg}`)}
                />
              ))}
            </div>
          </div>
        )}

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

export default BusinessCards;

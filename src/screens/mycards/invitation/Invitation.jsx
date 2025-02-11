import React, { useCallback, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import getCroppedImg from "./cropImage.js";
import Cropper from "react-easy-crop";
import axios from "axios";
import AddressIcon from "../../../assets/socialmedia/address.png";
import whatsappImage from "../../../assets/qrimages/whatsapp.png";
import { useNavigate } from "react-router-dom";


function Invitation() {
  const [formData, setFormData] = useState({
    name: "",
    profileImage: null,
    croppedProfileImage: null,
    description: "",
    occasion: "",
    dob: "",
    phone: "",
    venue: "",
    address: "",
    regards: "",
    gallery: [],
    referal: "",
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [prices, setPrices] = useState(null);

  // New states for backgrounds
  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const navigate = useNavigate();


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
            type: "Invitation card",
          });
          console.log("Referral posted successfully.");
        } catch (error) {
          console.error("Error posting referral:", error);
        }
      }
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/getPrice");
      if (response.data) {
        const {
          totalpriceInvitation,
          dicountpriceInvitation
        } = response.data;

        setPrices({
          totalpriceInvitation,
          dicountpriceInvitation
        });
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };


  // Fetch background images from API on mount
  useEffect(() => {
    fetchCardsBackground();
    fetchPrices()
  }, []);

  console.log(backgrounds, "back");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMultipleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, [key]: [...formData[key], ...files] });
  };

  // Handle file input for profile image
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

  // Get the cropped area from Cropper
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Crop and save the image
  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFormData((prevData) => ({
        ...prevData,
        croppedProfileImage: croppedImage
      }));
      setShowCropModal(false);
    } catch (error) {
      console.error("Cropping error:", error);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  // PDF generation function – content will start at the top (fixed top margin)
  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    let currentY = 10; // Start position for content
  
    // 🖼️ Load and apply background image (if selected)
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
      if (currentY + sectionHeight > pdfHeight - 10) {
        pdf.addPage();
        currentY = 10;
  
        // 🟢 Apply background image on new page
        if (bgImage) {
          pdf.addImage(bgImage, "PNG", 0, 0, pdfWidth, pdfHeight);
        }
      }
  
      pdf.addImage(imgData, "PNG", 10, currentY, pdfWidth - 20, sectionHeight);
      currentY += sectionHeight + 10;
    };
  
    // 🟢 List of Sections to Add to PDF
    const sections = [
      "foreground-section",
      "gallery-section",
    ];
  
    // 🟢 Render each section in the PDF
    for (const sectionId of sections) {
      await addSectionToPDF(sectionId);
    }
  
    // 🟢 Save the PDF
    const fileName = formData.name
      ? `${formData.name.replace(/\s+/g, "_")}_Invitation.pdf`
      : "Invitation.pdf";
    pdf.save(fileName);
  
    // ✅ Handle referral after download
    handleReferal();
  };
  
  
  
  
  

  // Update backend count after PDF generation
  const updateBioDataCount = async () => {
    try {
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "totalBio",
        value: 1
      });
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "dailyBio",
        value: 1
      });
      console.log("QR code count updated successfully!");
    } catch (error) {
      console.error("Error updating QR code count:", error);
    }
  };

  // Payment handler (uses Razorpay) before PDF download
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
          updateBioDataCount();
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
      <div className="p-6 bg-gray-100 mt-[5%] min-h-screen flex flex-col items-center justify-center">
        {/* Preview Container – use ID "invitation-card" for PDF generation */}
        <div
          id="invitation-card"
          className="relative bg-white p-6 rounded-lg shadow-md max-w-3xl w-full border"
          style={{
            overflow: "hidden",
            backgroundImage: selectedBackground ? `url(${selectedBackground})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay to ensure content visibility */}
          {/* <div className="absolute inset-0 bg-white opacity-70 pointer-events-none"></div> */}

          {/* Background Watermark (if any) */}
          {formData.occasion && (
            <div id ="Background-Watermark" className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <span
                className="text-6xl font-bold text-center"
                style={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                {formData.occasion}
              </span>
            </div>
          )}

          {/* Foreground Content */}
          <div className="relative mt-6" id="foreground-section">
            <div className="flex justify-center mb-4">
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
            {formData.name && (
              <h2 className="text-xl font-bold text-center mb-2 pb-4">
                {formData.name}
              </h2>
            )}
            {formData.description && (
              <p className="mb-2 text-center">{formData.description}</p>
            )}
            {formData.dob && (
              <p className="mb-2 text-center">Date/Time: {formData.dob}</p>
            )}
            {/* Contact Details Box */}
            <div className="border p-4 rounded my-4 mt-6 bg-white bg-opacity-80">
              {formData.phone && (
                <div className="mb-2 flex items-center">
                  <img src={whatsappImage} alt="Phone" className="inline w-5 h-5 mr-2" />

                  <span className="mr-2">WhatsApp:</span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${formData.phone}`}
                    data-url={`https://api.whatsapp.com/send?phone=${formData.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {formData.phone}
                  </a>
                </div>
              )}
              {formData.venue && (
                <div className="mb-2 flex items-center">
                  <img
                    src={AddressIcon}
                    alt="Address"
                    className="inline w-5 h-5 mr-2"
                  />
                  <span className="mr-2">Venue:</span>
                  <span>{formData.venue}</span>
                </div>
              )}
              {formData.address && (
                <div className="mb-2 flex items-center">
                  <img
                    src={AddressIcon}
                    alt="Address"
                    className="inline w-5 h-5 mr-2"
                  />
                  <span className="mr-2">Location:</span>
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
                </div>
              )}
              {formData.regards && (
                <p className="text-center">Regards: {formData.regards}</p>
              )}
            </div>
          </div>

           {/* Gallery */}
           {formData.gallery.length > 0 && (
            <div className="mb-6" id="gallery-section">
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

        {/* Action Buttons */}
        <div className="flex flex-col items-center mt-6">
          <button
            className="bg-red-500 text-white mt-4 py-2 px-4 rounded"
            onClick={() => setPreviewMode(false)}
          >
            Edit Details
          </button>
          <div className="flex items-center mt-6">
            <div className="text-center mr-4">
              <p className="text-gray-500 line-through">₹{prices?.totalpriceInvitation || 500}</p>
              <p className="text-green-600 font-bold text-xl">₹{prices?.dicountpriceInvitation || 185}</p>
              <p className="text-blue-500 text-sm">(Offer price)</p>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ml-4"
              onClick={handleDownloadPDF}
            >
              Pay ₹{prices?.dicountpriceInvitation || 185} to Download PDF
            </button>
          </div>
        </div>

        <div className="mt-4 mb-4">
          <p className="text-center">
            <span className="font-semibold">Note</span> - you can convert your PDF to QR
          </p>
          <p className="text-center">By Using Our QR Generator</p>
        </div>
      </div>
    );
  }

  // ----- FORM VIEW -----
  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-[14%] lg:mt-[4%]">
      <h1 className="text-3xl font-bold mb-6">Create Invitation Card</h1>
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
          <label className="block mb-2">Name/Names</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Occasion</label>
          <input
            type="text"
            name="occasion"
            value={formData.occasion}
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
          <label className="block mb-2">Date/Time</label>
          <input
            type="text"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />
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
          <label className="block mb-2">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
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
            placeholder="Link"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">With regards</label>
          <input
            type="text"
            name="regards"
            value={formData.regards}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
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
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${selectedBackground === `https://admin.qrandcards.com${bg}`
                    ? "border-blue-800"
                    : "border-gray-200"
                    }`}
                  onClick={() => setSelectedBackground(`https://admin.qrandcards.com${bg}`)}
                />
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
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

export default Invitation;

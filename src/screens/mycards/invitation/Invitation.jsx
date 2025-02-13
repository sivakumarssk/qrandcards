import React, { useCallback, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import getCroppedImg from "./cropImage.js";
import Cropper from "react-easy-crop";
import axios from "axios";
import AddressIcon from "../../../assets/socialmedia/address.png";
import whatsappImage from "../../../assets/qrimages/whatsapp.png";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfMake from "html-to-pdfmake";

// Set up pdfMake's virtual file system
pdfMake.vfs = pdfFonts.vfs;

/**
 * Helper: Create a circular image from a data URL.
 * Uses a scale factor for higher resolution, draws a border with padding.
 */
const makeImageCircular = async (
  dataUrl,
  size = 96,
  borderWidth = 4,
  borderColor = "#d1d5db",
  padding = 4
) => {
  const scaleFactor = 2; // Increase resolution to reduce blur.
  const canvas = document.createElement("canvas");
  canvas.width = size * scaleFactor;
  canvas.height = size * scaleFactor;
  const ctx = canvas.getContext("2d");
  
  // Scale drawing context to work in "size" units.
  ctx.scale(scaleFactor, scaleFactor);
  
  const centerX = size / 2;
  const centerY = size / 2;
  // Compute inner radius for the image (leaving padding and border).
  const innerRadius = (size - borderWidth - 2 * padding) / 2;
  
  // Draw the border circle.
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius + borderWidth / 2, 0, Math.PI * 2, false);
  ctx.fillStyle = borderColor;
  ctx.fill();
  
  // Clip the inner circle.
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, false);
  ctx.clip();
  
  // Draw the image inside the clipped area with padding.
  const img = new Image();
  img.src = dataUrl;
  await new Promise(resolve => { img.onload = resolve; });
  ctx.drawImage(img, padding, padding, size - 2 * padding, size - 2 * padding);
  
  return canvas.toDataURL();
};

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

  // -------------------- Fetching Data --------------------
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

  const fetchPrices = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/getPrice");
      if (response.data) {
        const { totalpriceInvitation, dicountpriceInvitation } = response.data;
        setPrices({ totalpriceInvitation, dicountpriceInvitation });
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
    }
  };

  useEffect(() => {
    fetchCardsBackground();
    fetchPrices();
  }, []);

  // -------------------- Input Handlers --------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleMultipleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData(prevData => ({ ...prevData, [key]: [...prevData[key], ...files] }));
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

  // -------------------- Cropper --------------------
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFormData(prevData => ({
        ...prevData,
        croppedProfileImage: croppedImage,
      }));
      setShowCropModal(false);
    } catch (error) {
      console.error("Cropping error:", error);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  // -------------------- Helper Functions --------------------
  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const getBase64FromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const convertToDataURL = async (source) => {
    if (typeof source === "string" && source.startsWith("data:")) {
      return source;
    }
    try {
      return await getBase64FromUrl(source);
    } catch (e) {
      console.error("Error converting image:", source, e);
      return source;
    }
  };

  // -------------------- PDF Generation --------------------
  const handleDownloadPDF = async () => {
    let bgDataUrl = null;
    if (selectedBackground) {
      try {
        bgDataUrl = await getBase64FromUrl(selectedBackground);
      } catch (error) {
        console.error("Error converting background image:", error);
      }
    }
  
    const styles = {
      header: {
        fontSize: 24,
        bold: true,
        color: "#1f2937",
        margin: [0, 10, 0, 10],
      },
      description: {
        fontSize: 14,
        color: "#4b5563",
        margin: [0, 5, 0, 15],
      },
      dateTime: {
        fontSize: 14,
        color: "#4b5563",
        margin: [0, 5, 0, 15],
      },
      contactBox: {
        margin: [0, 20, 0, 20],
        padding: 20,
        borderRadius: 8,
        border: [1, "solid", "#e5e7eb"],
      },
      contactItem: {
        margin: [0, 5, 0, 5],
        fontSize: 13,
        color: "#4b5563",
      },
      link: {
        color: "#3b82f6",
        decoration: "none",
      },
      regards: {
        fontSize: 14,
        color: "#4b5563",
        italics: true,
        margin: [0, 15, 0, 15],
      },
      galleryContainer: {
        margin: [0, 20, 0, 20],
      },
      // Updated galleryImage style: borderRadius set to 10
      galleryImage: {
        objectFit: "cover",
        borderRadius: 10,
      },
    };
  
    const contentDefinition = [];
  
    // --- Profile (Logo) Image as Circular with Padding ---
    if (formData.croppedProfileImage) {
      const profileDataUrl = await convertToDataURL(formData.croppedProfileImage);
      const circularProfile = await makeImageCircular(profileDataUrl, 96, 4, "#d1d5db", 4);
      contentDefinition.push({
        image: circularProfile,
        width: 96,
        height: 96,
        alignment: "center",
        margin: [0, 30, 0, 20],
      });
    }
  
    // --- Name ---
    if (formData.name) {
      contentDefinition.push({
        text: formData.name,
        style: "header",
        alignment: "center",
      });
    }
  
    // --- Description ---
    if (formData.description) {
      contentDefinition.push({
        text: formData.description,
        style: "description",
        alignment: "center",
      });
    }
  
    // --- Date/Time ---
    if (formData.dob) {
      contentDefinition.push({
        text: `Date/Time: ${formData.dob}`,
        style: "dateTime",
        alignment: "center",
      });
    }
  
    // --- Contact Details ---
    const contactDetails = [];
    const whatsappIconDataUrl = await convertToDataURL(whatsappImage);
    const addressIconDataUrl = await convertToDataURL(AddressIcon);
  
    if (formData.phone) {
      contactDetails.push({
        columns: [
          { width: 20, image: whatsappIconDataUrl, fit: [20, 20] },
          { width: "auto", text: "WhatsApp: ", margin: [5, 2, 0, 0] },
          {
            width: "*",
            text: formData.phone,
            color: "#3b82f6",
            link: `https://api.whatsapp.com/send?phone=${formData.phone}`,
            margin: [5, 2, 0, 0],
          },
        ],
        style: "contactItem",
      });
    }
  
    if (formData.venue) {
      contactDetails.push({
        columns: [
          { width: 20, image: addressIconDataUrl, fit: [20, 20] },
          { width: "auto", text: "Venue: ", margin: [5, 2, 0, 0] },
          { width: "*", text: formData.venue, margin: [5, 2, 0, 0] },
        ],
        style: "contactItem",
      });
    }
  
    if (formData.address) {
      contactDetails.push({
        columns: [
          { width: 20, image: addressIconDataUrl, fit: [20, 20] },
          { width: "auto", text: "Location: ", margin: [5, 2, 0, 0] },
          {
            width: "*",
            text: formData.address,
            color: "#3b82f6",
            link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`,
            margin: [5, 2, 0, 0],
          },
        ],
        style: "contactItem",
      });
    }
  
    if (contactDetails.length > 0) {
      contentDefinition.push({
        stack: contactDetails,
        style: "contactBox",
      });
    }
  
    // --- Regards ---
    if (formData.regards) {
      contentDefinition.push({
        text: `Regards: ${formData.regards}`,
        style: "regards",
        alignment: "center",
      });
    }
  
    // --- Gallery ---
    if (formData.gallery.length > 0) {
      // Process each image into a fixed size with round corners.
      const galleryImages = await Promise.all(
        formData.gallery.map(async (file) => ({
          image: await getBase64FromFile(file),
          width: 100,
          height: 100,
          style: "galleryImage",
          alignment: "center",
        }))
      );
      // Arrange images into rows with 4 columns.
      const rows = [];
      for (let i = 0; i < galleryImages.length; i += 4) {
        let row = galleryImages.slice(i, i + 4);
        while (row.length < 4) {
          row.push({ text: "" });
        }
        rows.push({
          columns: row,
          columnGap: 25,
          margin: [7, 10, 7, 10],
          style: "galleryContainer",
        });
      }
      rows.forEach((r) => contentDefinition.push(r));
    }
  
    // Wrap all content in one table cell for an overall border.
    const fullContent = {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: contentDefinition,
              margin: [0, 0, 0, 0],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => "#e5e7eb",
        vLineColor: () => "#e5e7eb",
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 10,
        paddingBottom: () => 10,
      },
    };
  
    const documentDefinition = {
      content: [fullContent],
      pageSize: "A4",
      pageMargins: [40, 40, 40, 40],
      styles: styles,
      defaultStyle: {
        fontSize: 12,
        lineHeight: 1.4,
        color: "#374151",
      },
      background: function (currentPage, pageSize) {
        if (bgDataUrl) {
          return {
            image: bgDataUrl,
            width: pageSize.width,
            height: pageSize.height,
            opacity: 0.6,
          };
        }
        return {};
      },
      watermark: formData.occasion
        ? {
            text: formData.occasion,
            color: "#000000",
            opacity: 0.1,
            bold: true,
            fontSize: 48,
            angle: 0,
          }
        : undefined,
    };
  
    const fileName = formData.name
      ? `${formData.name.replace(/\s+/g, "_")}_Invitation.pdf`
      : "Invitation.pdf";
  
    pdfMake.createPdf(documentDefinition).download(fileName);
  };
  

  // -------------------- Update Backend Count --------------------
  const updateBioDataCount = async () => {
    try {
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "totalBio",
        value: 1,
      });
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "dailyBio",
        value: 1,
      });
      console.log("QR code count updated successfully!");
    } catch (error) {
      console.error("Error updating QR code count:", error);
    }
  };

  // -------------------- Payment Handler --------------------
  const handlePDFPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const response = await axios.post("https://admin.qrandcards.com/api/create-order", {
        amount: prices?.dicountpriceInvitation || 185,
        currency: "INR",
      });
      const { orderId, amount } = response.data;
      const options = {
        key: "rzp_live_HJLLQQPlyQFOGr",
        amount: amount,
        currency: "INR",
        name: "Personal Visiting Card",
        description: "Download PDF",
        order_id: orderId,
        handler: function (paymentResponse) {
          handleDownloadPDF();
          updateBioDataCount();
          alert("Payment successful! Your PDF will be downloaded.");
        },
        modal: {
          ondismiss: function () {
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
        alert("Payment failed. Please try again.");
        console.error(response.error);
      });
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  // -------------------- Render --------------------
  if (previewMode) {
    return (
      <div className="p-6 bg-gray-100 mt-[5%] min-h-screen flex flex-col items-center justify-center">
        {/* Preview Container – PDF will be generated from this view */}
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
          {formData.occasion && (
            <div
              id="Background-Watermark"
              className="absolute inset-0 flex justify-center items-center pointer-events-none"
            >
              <span
                className="text-6xl font-bold text-center"
                style={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                {formData.occasion}
              </span>
            </div>
          )}
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
            <div className="border p-4 rounded my-4 mt-6 bg-white bg-opacity-80">
              {formData.phone && (
                <div className="mb-2 flex items-center">
                  <img
                    src={whatsappImage}
                    alt="Phone"
                    className="inline w-5 h-5 mr-2"
                  />
                  <span className="mr-2">WhatsApp:</span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${formData.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
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
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
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
        <div className="flex flex-col items-center mt-6">
          <button
            className="bg-red-500 text-white mt-4 py-2 px-4 rounded"
            onClick={() => setPreviewMode(false)}
          >
            Edit Details
          </button>
          <div className="flex items-center mt-6">
            <div className="text-center mr-4">
              <p className="text-gray-500 line-through">
                ₹{prices?.totalpriceInvitation || 500}
              </p>
              <p className="text-green-600 font-bold text-xl">
                ₹{prices?.dicountpriceInvitation || 185}
              </p>
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
                  onClick={() =>
                    setSelectedBackground(`https://admin.qrandcards.com${bg}`)
                  }
                />
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
          Preview
        </button>
      </form>
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

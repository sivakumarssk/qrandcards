import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage.js";
import { useNavigate } from "react-router-dom";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import AddressIcon from "../../../assets/socialmedia/address.png";
import whatsappImage from "../../../assets/qrimages/whatsapp.png";
import EmailIcon from "../../../assets/socialmedia/email.png";
import FacebookIcon from "../../../assets/socialmedia/facebook.png";
import InstagramIcon from "../../../assets/socialmedia/instagram.png";

// Set up pdfMake's virtual file system
pdfMake.vfs = pdfFonts.vfs;

/**
 * Helper: Create a circular image from a data URL.
 * Uses a scale factor for higher resolution and draws a border with padding.
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

  // Scale context so our coordinates are in "size" units.
  ctx.scale(scaleFactor, scaleFactor);

  const centerX = size / 2;
  const centerY = size / 2;
  const innerRadius = (size - borderWidth - 2 * padding) / 2;

  // Draw border circle.
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius + borderWidth / 2, 0, Math.PI * 2, false);
  ctx.fillStyle = borderColor;
  ctx.fill();

  // Clip the inner circle.
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, false);
  ctx.clip();

  // Draw the image with padding.
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => { img.onload = resolve; });
  ctx.drawImage(img, padding, padding, size - 2 * padding, size - 2 * padding);

  return canvas.toDataURL();
};

/**
 * Helper: Convert an image URL (or blob URL) to a data URL.
 */
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

/**
 * Helper: Convert a File object to a data URL.
 */
const getBase64FromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Helper: If source is already a data URL, return it; otherwise, convert.
 */
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

function Resume() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    profileImage: null,
    croppedProfileImage: null,
    qualification: "",
    experience: "",
    skills: "",
    phone: "",
    email: "",
    address: "",
    referal: "",
    certificates: [],
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

  // -------------------- Fetching Data --------------------
  const fetchPrices = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/getPrice");
      if (response.data) {
        const { totalpriceResume, dicountpriceResume } = response.data;
        setPrices({ totalpriceResume, dicountpriceResume });
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

  useEffect(() => {
    fetchPrices();
    fetchCardsBackground();
  }, []);

  // -------------------- Input Handlers --------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultipleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, [key]: [...prev[key], ...files] }));
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
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFormData(prev => ({ ...prev, croppedProfileImage: croppedImage }));
      setShowCropModal(false);
    } catch (error) {
      console.error("Cropping error:", error);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
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

    // Define custom styles for the PDF.
    const styles = {
      header: {
        fontSize: 24,
        bold: true,
        color: "#1f2937",
        margin: [0, 10, 0, 10],
      },
      sectionTitle: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        fillColor: "#3b82f6",
        color: "#ffffff",
        margin: [0, 5, 0, 5],
        padding: 5,
      },
      sectionContent: {
        fontSize: 14,
        margin: [5, 5, 5, 5],
      },
      contactBox: {
        margin: [0, 0, 0, 20],
        padding: 10,
        border: [1, "solid", "#e5e7eb"],
        borderRadius: 8
      },
      galleryContainer: {
        margin: [0, 0, 0, 20],
      },
      // Gallery (and Certificate) images with increased size and rounded corners.
      galleryImage: {
        objectFit: "cover",
        borderRadius: 10,
      },
    };

    const contentDefinition = [];

    // --- Profile (Logo) Section (Circular with Padding) ---
    if (formData.croppedProfileImage) {
      const profileDataUrl = await convertToDataURL(formData.croppedProfileImage);
      const circularProfile = await makeImageCircular(profileDataUrl, 96, 4, "#d1d5db", 4);
      contentDefinition.push({
        image: circularProfile,
        width: 96,
        height: 96,
        alignment: "center",
        margin: [0, 20, 0, 20],
      });
    }

    // --- Full Name and DOB ---
    if (formData.fullName) {
      contentDefinition.push({
        text: formData.fullName,
        style: "header",
        alignment: "center",
      });
    }
    if (formData.dob) {
      contentDefinition.push({
        text: `DOB: ${formData.dob}`,
        style: "sectionContent",
        alignment: "center",
      });
    }

    // --- Qualification Section ---
    if (formData.qualification) {
      contentDefinition.push({
        table: {
          widths: ["*"],
          body: [
            [{ text: "Qualification", style: "sectionTitle" }],
            [{ text: formData.qualification, style: "sectionContent" }],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
          padding: () => 5,
        },
        margin: [0, 10, 0, 10],
      });
    }

    // --- Experience Section ---
    if (formData.experience) {
      contentDefinition.push({
        table: {
          widths: ["*"],
          body: [
            [{ text: "Experience", style: "sectionTitle" }],
            [{ text: formData.experience, style: "sectionContent" }],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
          padding: () => 5,
        },
        margin: [0, 10, 0, 10],
      });
    }

    // --- Skills/Hobbies Section ---
    if (formData.skills) {
      contentDefinition.push({
        table: {
          widths: ["*"],
          body: [
            [{ text: "Skills / Hobbies", style: "sectionTitle" }],
            [{ text: formData.skills, style: "sectionContent" }],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
          padding: () => 5,
        },
        margin: [0, 10, 0, 10],
      });
    }

    // --- Contact Details Section ---
    const contactDetails = [];
    if (formData.phone) {
      contactDetails.push({
        columns: [
          { width: 20, image: await convertToDataURL(whatsappImage), fit: [20, 20] },
          { width: "auto", text: "WhatsApp: ", margin: [5, 2, 0, 0] },
          {
            width: "*",
            text: formData.phone,
            color: "#3b82f6",
            link: `https://api.whatsapp.com/send?phone=+91${formData.phone}`,
            margin: [5, 2, 0, 0],
          },
        ],
        style: "sectionContent",
      });
    }
    if (formData.email) {
      contactDetails.push({
        columns: [
          { width: 20, image: await convertToDataURL(EmailIcon), fit: [20, 20] },
          { width: "auto", text: "Email: ", margin: [5, 2, 0, 0] },
          {
            width: "*",
            text: formData.email,
            color: "#3b82f6",
            link: `mailto:${formData.email}`,
            margin: [5, 2, 0, 0],
          },
        ],
        style: "sectionContent",
      });
    }
    if (formData.address) {
      contactDetails.push({
        columns: [
          { width: 20, image: await convertToDataURL(AddressIcon), fit: [20, 20] },
          { width: "auto", text: "Address: ", margin: [5, 2, 0, 0] },
          {
            width: "*",
            text: formData.address,
            color: "#3b82f6",
            link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`,
            margin: [5, 2, 0, 0],
          },
        ],
        style: "sectionContent",
      });
    }
    if (contactDetails.length > 0) {
      contentDefinition.push({
        table: {
          widths: ["*"],
          body: [
            [{ text: "Contact Details", style: "sectionTitle" }],
            [{ stack: contactDetails }],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
          padding: () => 5,
        },
        margin: [0, 10, 0, 10],
      });
    }

    // --- Certificates Section ---
    if (formData.certificates.length > 0) {
      const certificateImages = await Promise.all(
        formData.certificates.map(async (file) => ({
          image: await getBase64FromFile(file),
          width: 120,
          height: 120,
          alignment: "center",
          style: "galleryImage",
        }))
      );
      const certRows = [];
      for (let i = 0; i < certificateImages.length; i += 4) {
        let row = certificateImages.slice(i, i + 4);
        while (row.length < 4) row.push({ text: "" });
        certRows.push({
          columns: row,
          columnGap: 15,
          margin: [0, 10, 0, 10],
        });
      }
      contentDefinition.push({
        table: {
          widths: ["*"],
          body: [
            [{ text: "Certificates", style: "sectionTitle" }],
            [{ stack: certRows }],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
          padding: () => 5,
        },
        margin: [0, 10, 0, 10],
      });
    }

    // --- Gallery Section ---
    if (formData.gallery.length > 0) {
      const galleryImages = await Promise.all(
        formData.gallery.map(async (file) => ({
          image: await getBase64FromFile(file),
          width: 120,
          height: 120,
          alignment: "center",
          style: "galleryImage",
        }))
      );
      const galleryRows = [];
      for (let i = 0; i < galleryImages.length; i += 4) {
        let row = galleryImages.slice(i, i + 4);
        while (row.length < 4) row.push({ text: "" });
        galleryRows.push({
          columns: row,
          columnGap: 15,
          margin: [0, 10, 0, 10],
        });
      }
      contentDefinition.push({
        table: {
          widths: ["*"],
          body: [
            [{ text: "Gallery", style: "sectionTitle" }],
            [{ stack: galleryRows }],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => "#e5e7eb",
          vLineColor: () => "#e5e7eb",
          padding: () => 5,
        },
        margin: [0, 10, 0, 10],
      });
    }

    const containerWidth = 500;


    // Wrap all content in one table cell to create an overall border.
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
      pageMargins: [20, 40, 40, 40],
      styles: styles,
      defaultStyle: {
        fontSize: 12,
        lineHeight: 1.4,
        color: "#374151",
      },
      background: (currentPage, pageSize) => {
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

    const fileName = formData.fullName
      ? `${formData.fullName.replace(/\s+/g, "_")}_Resume.pdf`
      : "Resume.pdf";

    pdfMake.createPdf(documentDefinition).download(fileName);
    handleReferal();
  };

  const handleReferal = async () => {
    if (formData.referal && formData.referal.trim() !== "") {
      const userEmail = localStorage.getItem("email");
      if (userEmail) {
        try {
          await axios.post("https://admin.qrandcards.com/api/addreferals", {
            user: userEmail,
            referal: formData.referal,
            type: "Resume",
          });
          console.log("Referral posted successfully.");
        } catch (error) {
          console.error("Error posting referral:", error);
        }
      }
    }
  };

  const updateResumeCount = async () => {
    try {
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "totalResume",
        value: 1,
      });
      await axios.post("https://admin.qrandcards.com/api/incrementCount", {
        type: "dailyResume",
        value: 1,
      });
      console.log("Resume count updated successfully!");
    } catch (error) {
      console.error("Error updating resume count:", error);
    }
  };

  const handlePDFPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      const response = await axios.post("https://admin.qrandcards.com/api/create-order", {
        amount: prices?.dicountpriceResume || 185,
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
          updateResumeCount();
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
          {/* Profile Section */}
          <div id="profile-section" className="flex flex-col items-center mb-6">
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
            <h2 className="text-xl font-bold text-center">{formData.fullName}</h2>
            <h3 className="text-lg text-center mt-1 mb-2">{formData.dob}</h3>
          </div>
  
          {/* Qualification Section */}
          <div id="about-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Qualification
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.qualification}</p>
          </div>
  
          {/* Experience Section */}
          <div id="experience-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Experience
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.experience}</p>
          </div>
  
          {/* Skills/Hobbies Section */}
          <div id="skills/hobbies-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Skills/Hobbies
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.skills}</p>
          </div>
  
          {/* Contact Details Section */}
          <div id="contact-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Contact Details
            </h3>
            <ul className="border p-4 rounded-b-lg space-y-2">
              {formData.phone && (
                <li>
                  <img src={whatsappImage} alt="Phone" className="inline w-5 h-5 mr-2" />
                  <a
                    href={`https://api.whatsapp.com/send?phone=+91${formData.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline "
                  >
                    {formData.phone}
                  </a>
                </li>
              )}
              {formData.email && (
                <li>
                  <img src={EmailIcon} alt="Email" className="inline w-5 h-5 mr-2" />
                  <a href={`mailto:${formData.email}`} className="text-blue-500 no-underline">
                    {formData.email}
                  </a>
                </li>
              )}
              {formData.address && (
                <li>
                  <img src={AddressIcon} alt="Address" className="inline w-5 h-5 mr-2" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline"
                  >
                    {formData.address}
                  </a>
                </li>
              )}
            </ul>
          </div>
  
          {/* Certificates Section */}
          {formData.certificates.length > 0 && (
            <div id="products-section" className="mb-6">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
                Certificate Images
              </h3>
              <div className="border p-4 rounded-b-lg grid grid-cols-4 gap-4 justify-items-center">
                {formData.certificates.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt="Certificate"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
  
          {/* Gallery Section */}
          {formData.gallery.length > 0 && (
            <div id="gallery-section" className="mb-6">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
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
  
          <div className="flex justify-center items-center">
            <button
              className="bg-red-500 text-white mt-4 py-2 px-4 rounded"
              onClick={() => setPreviewMode(false)}
            >
              Edit Details
            </button>
            <div className="flex justify-center items-center mt-6">
              <div className="text-center">
                <p className="text-gray-500 line-through">₹{prices?.totalpriceResume || 500}</p>
                <p className="text-green-600 font-bold text-xl">₹{prices?.dicountpriceResume || 185}</p>
                <p className="text-blue-500 text-sm">(Offer price)</p>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ml-4"
                onClick={handlePDFPayment}
              >
                Pay ₹{prices?.dicountpriceResume || 185} to Download PDF
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
        </div>
      );
    }
  
    return (
      <div className="p-6 bg-gray-100 min-h-screen mt-[14%] lg:mt-[4%]">
        <h1 className="text-3xl font-bold mb-6">Create Resume</h1>
        <form
          className="bg-white p-6 rounded-lg shadow-md"
          onSubmit={(e) => {
            e.preventDefault();
            setPreviewMode(true);
          }}
        >
          <div className="mb-4">
            <label className="block mb-2">Profile Image</label>
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
            <label className="block mb-2">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Qualification</label>
            <textarea name="qualification" value={formData.qualification} onChange={handleInputChange} className="w-full border p-2 rounded"></textarea>
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Experience</label>
            <textarea name="experience" value={formData.experience} onChange={handleInputChange} className="w-full border p-2 rounded"></textarea>
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Skills/Hobbies</label>
            <textarea name="skills" value={formData.skills} onChange={handleInputChange} className="w-full border p-2 rounded"></textarea>
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Whatsapp Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Referal Code (Optional)</label>
            <input type="number" name="referal" value={formData.referal} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Certificates</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleFileChange(e, "certificates")} />
          </div>
  
          <div className="mb-4">
            <label className="block mb-2">Gallery</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleFileChange(e, "gallery")} />
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
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setShowCropModal(false)}>
                  Cancel
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCrop}>
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default Resume;

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

pdfMake.vfs = pdfFonts.vfs;

// === Helpers ===

// Convert an image URL (or blob URL) to a data URL.
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

// Convert a File object to a data URL.
const getBase64FromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// If source is already a data URL, return it; otherwise, convert.
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

// Create a circular image (used for the profile) via canvas.
const makeImageCircular = async (dataUrl, size = 96, borderWidth = 4, borderColor = "#d1d5db", padding = 4) => {
  const scaleFactor = 2;
  const canvas = document.createElement("canvas");
  canvas.width = size * scaleFactor;
  canvas.height = size * scaleFactor;
  const ctx = canvas.getContext("2d");

  ctx.scale(scaleFactor, scaleFactor);
  const centerX = size / 2;
  const centerY = size / 2;
  const innerRadius = (size - borderWidth - 2 * padding) / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius + borderWidth / 2, 0, Math.PI * 2, false);
  ctx.fillStyle = borderColor;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, false);
  ctx.clip();

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => { img.onload = resolve; });
  ctx.drawImage(img, padding, padding, size - 2 * padding, size - 2 * padding);
  return canvas.toDataURL();
};

// Helper: Group an array of items into rows of a given count.
const groupIntoRows = (items, count = 4) => {
  const rows = [];
  for (let i = 0; i < items.length; i += count) {
    let row = items.slice(i, i + count);
    while (row.length < count) row.push({ text: "" });
    rows.push({
      columns: row,
      columnGap: 10,
      margin: [0, 5, 0, 5],
    });
  }
  return rows;
};

const frameImageWithWhiteBackground = async (
  dataUrl,
  frameSize = 100,
  frameHeight =130,
  scaleFactor = 40
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      // Create a canvas with increased pixel density.
      const canvas = document.createElement("canvas");
      canvas.width = frameHeight * scaleFactor;
      canvas.height = frameSize * scaleFactor;
      const ctx = canvas.getContext("2d");
      
      // Scale the context so that drawing operations are in the original frameSize units.
      ctx.scale(scaleFactor, scaleFactor);
      
      // Fill the background with white.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, frameSize, frameSize);
      
      // Calculate the scale for the image to fit within the frame.
      const scale = Math.min(frameSize / img.width, frameSize / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (frameSize - width) / 2;
      const y = (frameSize - height) / 2;
      
      // Draw the image onto the canvas.
      ctx.drawImage(img, x, y, width, height);
      
      // Return a high resolution data URL.
      resolve(canvas.toDataURL());
    };
    img.onerror = (err) => reject(err);
  });
};

function BioData() {
  const [formData, setFormData] = useState({
    name: "",
    education: "",
    profession: "",
    dob: "",
    height: "",
    nativeplace: "",
    caste: "",
    familydetails: "",
    hobbies: "",
    phone: "",
    email: "",
    address: "",
    referal: "",
    socialLinks: [
      { platform: "Facebook", link: "" },
      { platform: "Instagram", link: "" },
    ],
    gallery: [],
    profileImage: null,
    croppedProfileImage: null,
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

  // Social icons mapping
  const socialIcons = {
    Facebook: FacebookIcon,
    Instagram: InstagramIcon,
  };

  // -------------------- Fetching Data --------------------
  const fetchPrices = async () => {
    try {
      const response = await axios.get("https://admin.qrandcards.com/api/getPrice");
      if (response.data) {
        const { totalpriceBio, dicountpriceBio } = response.data;
        setPrices({ totalpriceBio, dicountpriceBio });
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultipleFileChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], ...files] }));
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
      setFormData((prev) => ({ ...prev, croppedProfileImage: croppedImage }));
      setShowCropModal(false);
    } catch (error) {
      console.error("Cropping error:", error);
    }
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  // -------------------- PDF Generation with pdfMake --------------------
  // Build a document definition that mimics your Resume component style.
  // Only the value part of contact and social links will be clickable.
  const handleDownloadPDF = async () => {
    let bgDataUrl = null;
    if (selectedBackground) {
      try {
        bgDataUrl = await getBase64FromUrl(selectedBackground);
      } catch (error) {
        console.error("Error converting background image:", error);
      }
    }
    // Process gallery images into rows of 4.
    let galleryItems = [];
    if (formData.gallery && formData.gallery.length > 0) {
      galleryItems = await Promise.all(
        formData.gallery.map(async (file) => {
          // Get the base64 string of the original image file
          const dataUrl = await getBase64FromFile(file);
          // Create a framed image with a white background (adjust frame size as needed)
          const framedDataUrl = await frameImageWithWhiteBackground(dataUrl, 100);
          return {
            image: framedDataUrl,
            width: 100,   // Fixed width
            height: 100,  // Fixed height
            alignment: "center",
          };
        })
      );
    }
    const galleryRows = groupIntoRows(galleryItems, 4);

    // Process profile image.
    let profileImageObj = null;
    if (formData.croppedProfileImage) {
      const profileDataUrl = await convertToDataURL(formData.croppedProfileImage);
      const circularProfile = await makeImageCircular(profileDataUrl, 96, 4, "#d1d5db", 4);
      profileImageObj = {
        image: circularProfile,
        width: 96,
        height: 96,
        alignment: "center",
        margin: [0, 20, 0, 20],
      };
    }

// Build Contact Details with only the value clickable.
const contactDetails = [];
if (formData.phone) {
  contactDetails.push({
    columns: [
      { image: await convertToDataURL(whatsappImage), width: 20, height: 20, margin: [0,0,0,0] },
      {
        text: [
          { text: "WhatsApp: ", color: "black" },
          { text: formData.phone, link: `https://api.whatsapp.com/send?phone=+91${formData.phone}`, color: "blue" }
        ],
        margin: [5,0,0,5]
      }
    ],
    columnGap: 5,
    margin: [0,0,0,0]
  });
}
if (formData.email) {
  contactDetails.push({
    columns: [
      { image: await convertToDataURL(EmailIcon), width: 20, height: 20, margin: [0,0,0,0] },
      {
        text: [
          { text: "Email: ", color: "black" },
          { text: formData.email, link: `mailto:${formData.email}`, color: "blue" }
        ],
        margin: [0,0,0,5]
      }
    ],
    columnGap: 5,
    margin: [0,0,0,0]
  });
}
if (formData.address) {
  contactDetails.push({
    columns: [
      { image: await convertToDataURL(AddressIcon), width: 20, height: 20, margin: [0,0,0,0] },
      {
        text: [
          { text: "Address: ", color: "black" },
          { text: formData.address, link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`, color: "blue" }
        ],
        margin: [0,0,0,5]
      }
    ],
    columnGap: 5,
    margin: [0,0,0,0]
  });
}

// Build Social Links with only the value clickable.
const socialItems = await Promise.all(
  formData.socialLinks
    .filter((s) => s.link)
    .map(async (s) => {
      const iconDataUrl = await convertToDataURL(
        s.platform === "Facebook" ? FacebookIcon : InstagramIcon
      );
      return {
        columns: [
          { image: iconDataUrl, width: 20, height: 20, margin: [0,0,0,0] },
          {
            text: [
              { text: `${s.platform}: `, color: "black" },
              { text: s.link, link: s.link, color: "blue" }
            ],
            margin: [0,0,0,5]
          }
        ],
        columnGap: 5,
        margin: [0,0,0,0]
      };
    })
);

    const docDefinition = {
      content: [
        profileImageObj,
        { text: formData.name, style: "header", alignment: "center" },
        { text: `DOB: ${formData.dob}`, style: "subheader", alignment: "center" },
        {
          table: {
            widths: ["*"],
            body: [
              [{ text: "Education", style: "sectionTitle" }],
              [{ text: formData.education, style: "sectionContent" }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [{ text: "About Me", style: "sectionTitle" }],
              [{
                text:
                  `Profession: ${formData.profession}\n` +
                  `Height: ${formData.height}\n` +
                  `Native Place: ${formData.nativeplace}\n` +
                  `Caste/Sub Caste: ${formData.caste}`,
                style: "sectionContent",
              }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [{ text: "Family Details", style: "sectionTitle" }],
              [{ text: formData.familydetails, style: "sectionContent" }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [{ text: "Activities / Hobbies", style: "sectionTitle" }],
              [{ text: formData.hobbies, style: "sectionContent" }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [{ text: "Contact Details", style: "sectionTitle" }],
              [{ stack: contactDetails, style: "sectionContent" }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [{ text: "Social Links", style: "sectionTitle" }],
              [{ stack: socialItems, style: "sectionContent" }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
        galleryItems.length > 0 && {
          table: {
            widths: ["*"],
            body: [
              [{ text: "Gallery", style: "sectionTitle" }],
              [{ stack: groupIntoRows(galleryItems, 4) }],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
        },
      ].filter(Boolean),
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          alignment: "center",
          margin: [0, 10, 0, 10],
        },
        subheader: {
          fontSize: 16,
          alignment: "center",
          margin: [0, 5, 0, 10],
        },
        sectionTitle: {
          fontSize: 18,
          bold: true,
          fillColor: "#3b82f6",
          color: "white",
          alignment: "center",
          margin: [7, 5, 0, 0],
          padding: 5,
        },
        sectionContent: {
          fontSize: 14,
          alignment: "left",
          margin: [5, 5, 5, 5],
        },
      },
      pageMargins: [40, 40, 40, 40],
    };

    // Wrap content in an outer container table of fixed width and center it.
    const containerWidth = 515;
    const fullContainer = {
      alignment: "center",
      table: {
        widths: [containerWidth],
        body: [
          [
            {
              stack: docDefinition.content,
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

    const finalDocDefinition = {
      content: [fullContainer],
      pageSize: "A4",
      pageMargins: [20, 40, 40, 40],
      styles: docDefinition.styles,
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
    };

    const fileName = formData.name
      ? `${formData.name.replace(/\s+/g, "_")}_BioData.pdf`
      : "BioData.pdf";

    pdfMake.createPdf(finalDocDefinition).download(fileName);
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
            type: "Bio Data",
          });
          console.log("Referral posted successfully.");
        } catch (error) {
          console.error("Error posting referral:", error);
        }
      }
    }
  };

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
      console.log("Bio Data count updated successfully!");
    } catch (error) {
      console.error("Error updating Bio Data count:", error);
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
        amount: prices?.dicountpriceBio || 185,
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

  if (previewMode) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen mt-[5%] flex flex-col justify-center items-center">
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
            <h2 className="text-xl font-bold text-center">{formData.name}</h2>
            <h3 className="text-lg text-center mt-1 mb-2">{formData.dob}</h3>
          </div>
  
          {/* Education Section */}
          <div id="education-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Education
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.education}</p>
          </div>
  
          {/* About Me Section */}
          <div id="about-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              About me
            </h3>
            <p className="border p-4 rounded-b-lg">
              {formData.profession && (<><span className="font-bold">Profession: </span>{formData.profession}<br/></>)}
              {formData.dob && (<><span className="font-bold">Date, time, place of birth: </span>{formData.dob}<br/></>)}
              {formData.height && (<><span className="font-bold">Height: </span>{formData.height}<br/></>)}
              {formData.nativeplace && (<><span className="font-bold">Native place: </span>{formData.nativeplace}<br/></>)}
              {formData.caste && (<><span className="font-bold">Caste / sub caste: </span>{formData.caste}</>)}
            </p>
          </div>
  
          {/* Family Details Section */}
          <div id="family-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Family details
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.familydetails}</p>
          </div>
  
          {/* Hobbies Section */}
          <div id="hobbies-section" className="mb-6">
            <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
              Activities/ hobbies
            </h3>
            <p className="border p-4 rounded-b-lg">{formData.hobbies}</p>
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
                  <span className="font-bold">WhatsApp: </span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=+91${formData.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline"
                  >
                    {formData.phone}
                  </a>
                </li>
              )}
              {formData.email && (
                <li>
                  <img src={EmailIcon} alt="Email" className="inline w-5 h-5 mr-2" />
                  <span className="font-bold">Email: </span>
                  <a href={`mailto:${formData.email}`} className="text-blue-500 no-underline">
                    {formData.email}
                  </a>
                </li>
              )}
              {formData.address && (
                <li>
                  <img src={AddressIcon} alt="Address" className="inline w-5 h-5 mr-2" />
                  <span className="font-bold">Address: </span>
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
  
          {/* Social Links Section */}
          {formData.socialLinks.some((link) => link.link) && (
            <div id="social-links-section" className="mb-6">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
                Social Media Links
              </h3>
              <ul className="border p-4 rounded-b-lg space-y-2">
                {formData.socialLinks.map(
                  (link, index) =>
                    link.link && (
                      <li key={index}>
                        <img
                          src={link.platform === "Facebook" ? FacebookIcon : InstagramIcon}
                          alt={link.platform}
                          className="inline w-5 h-5 mr-2"
                        />
                        <span className="font-bold">{link.platform}: </span>
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 no-underline"
                        >
                          {link.link}
                        </a>
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
  
          {/* Gallery Section */}
          {formData.gallery.length > 0 && (
            <div id="gallery-section" className="mb-6">
              <h3 className="bg-blue-500 text-center text-white py-2 px-4 rounded-t-lg w-full">
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
  
          <div className="flex justify-center items-center">
            <button
              className="bg-red-500 text-white mt-4 py-2 px-4 rounded"
              onClick={() => setPreviewMode(false)}
            >
              Edit Details
            </button>
            <div className="flex justify-center items-center mt-6">
              <div className="text-center">
                <p className="text-gray-500 line-through">₹{prices?.totalpriceBio || 500}</p>
                <p className="text-green-600 font-bold text-xl">₹{prices?.dicountpriceBio || 185}</p>
                <p className="text-blue-500 text-sm">(Offer price)</p>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ml-4"
                onClick={handlePDFPayment}
              >
                Pay ₹{prices?.dicountpriceBio || 185} to Download PDF
              </button>
            </div>
          </div>
  
          <div className="mt-4 mb-4">
            <p className="text-center"><span className="font-semibold">Note</span> - you can convert your PDF to QR</p>
            <p className="text-center">By Using Our QR Generator</p>
          </div>
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
          setPreviewMode(true);
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
            name="name"
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
            value={formData.height}
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
  
        <div>
          <label className="block mb-2">YOUR IMAGES</label>
          <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleFileChange(e, "gallery")} />
        </div>
  
        <div>
        <p className="text-left pt-2 mb-4">Note: Please Upload Images in 6:9 ratio for Best Quality Cards</p>
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

export default BioData;

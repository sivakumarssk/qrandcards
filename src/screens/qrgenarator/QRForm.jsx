import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QRForm = ({ activeType, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    setFormData({});
    setErrors({});
  }, [activeType]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleFileUpload = async (file, type) => {
    if (!file) {
      alert(`Please select a ${type} file to upload.`);
      return;
    }

    const formData = new FormData();
    if (imageFile) {

      formData.append("image", file);
    }
    if (pdfFile) {
      formData.append("pdf", file);
    }

    try {
      setLoading(true)
      const response = await axios.post("https://admin.qrandcards.com/api/qrfiles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response) {
        alert(`${type} uploaded successfully`);
        setFormData((prev) => ({ ...prev, url: response?.data?.url }))
        setLoading(false)
        console.log(response.data);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert(`${type} upload failed`);
      setLoading(false)
    }
  };

  const validateForm = () => {
    let newErrors = {};
    switch (activeType) {
      case "text":
        if (!formData.text) newErrors.text = "Text is required.";
        break;
      case "url":
        if (!formData.url) newErrors.url = "URL is required.";
        else if (!/^https?:\/\//.test(formData.url))
          newErrors.url = "Invalid URL format. Must start with http:// or https://.";
        break;
      case "phone":
        if (!formData.phone) newErrors.phone = "Phone number is required.";
        else if (!/^\d{10,15}$/.test(formData.phone))
          newErrors.phone = "Invalid phone number format.";
        break;
      case "email":
        if (!formData.email) newErrors.email = "Email is required.";
        else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        )
          newErrors.email = "Invalid email address.";
        break;
      case "upi":
        if (!formData.upi) newErrors.upi = "UPI ID is required.";
        break;
      case "youtube":
        if (!formData.youtube)
          newErrors.youtube = "YouTube URL is required.";
        else if (!/^https?:\/\/(www\.)?youtube\.com\//.test(formData.youtube))
          newErrors.youtube = "Invalid YouTube URL.";
        break;
      case "facebook":
        if (!formData.facebook)
          newErrors.facebook = "Facebook URL is required.";
        else if (!/^https?:\/\/(www\.)?facebook\.com\//.test(formData.facebook))
          newErrors.facebook = "Invalid Facebook URL.";
        break;
      case "instagram":
        if (!formData.instagram)
          newErrors.instagram = "Instagram URL is required.";
        else if (
          !/^https?:\/\/(www\.)?instagram\.com\//.test(formData.instagram)
        )
          newErrors.instagram = "Invalid Instagram URL.";
        break;
      case "whatsapp":
        if (!formData.whatsapp)
          newErrors.whatsapp = "WhatsApp number is required.";
        else if (!/^\d{10,15}$/.test(formData.whatsapp))
          newErrors.whatsapp = "Invalid WhatsApp number format.";
        break;
      case "googleMaps":
        if (!formData.location)
          newErrors.location = "Google Maps link is required.";
        else if (!/^https?:\/\/(www\.)?google\.com\/maps|^https?:\/\/maps\.app\.goo\.gl/.test(formData.location))
          newErrors.location = "Invalid Google Maps link.";
        break;
      case "app":
        if (!formData.appplayStore) newErrors.appplayStore = "Play Store link is required.";
        if (!formData.appappStore) newErrors.appappStore = "App Store link is required.";
        break;
      case "wifi":
        if (!formData.ssid) newErrors.ssid = "SSID is required.";
        if (!formData.password) newErrors.password = "Password is required.";
        break;
      case "Image":
        if (!formData.image) newErrors.image = "Image is required.";
        break;
      case "Pdf":
        if (!formData.pdf) newErrors.pdf = "PDF is required.";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(loading){
      return;
    } 
    if(activeType ==='image' || activeType ==='pdf'){
      if(!imageFile || !pdfFile){
        alert(`Please select a ${type} file to upload.`);
        return
      }
    }
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    if (validateForm()) {
      if (imageFile) {

      }
      onSubmit(formData);
    }
  };

  const renderFields = () => {
    switch (activeType) {
      case "text":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Text</label>
            <input
              type="text"
              name="text"
              value={formData.text || ""}
              placeholder="Enter text..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.text && (
              <p className="text-red-500 text-sm mt-1">{errors.text}</p>
            )}
          </div>
        );

      case "url":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">URL</label>
            <input
              type="url"
              name="url"
              value={formData.url || ""}
              placeholder="Enter URL..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>
        );

      case "phone":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              placeholder="Enter phone number..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        );

      case "email":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                placeholder="Enter email..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Subject (Optional)
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject || ""}
                placeholder="Enter subject..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Message (Optional)
              </label>
              <textarea
                name="message"
                placeholder="Enter message..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                rows="4"
                value={formData.message || ""}
                onChange={handleChange}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
          </>
        );

      case "upi":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">UPI ID</label>
            <input
              type="text"
              name="upi"
              value={formData.upi || ""}
              placeholder="Enter UPI ID..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.upi && (
              <p className="text-red-500 text-sm mt-1">{errors.upi}</p>
            )}
          </div>
        );

      case "youtube":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              YouTube URL
            </label>
            <input
              type="url"
              name="youtube"
              value={formData.youtube || ""}
              placeholder="Enter YouTube URL..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.youtube && (
              <p className="text-red-500 text-sm mt-1">{errors.youtube}</p>
            )}
          </div>
        );

      case "facebook":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook || ""}
              placeholder="Enter Facebook URL..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.facebook && (
              <p className="text-red-500 text-sm mt-1">{errors.facebook}</p>
            )}
          </div>
        );

      case "instagram":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram || ""}
              placeholder="Enter Instagram URL..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.instagram && (
              <p className="text-red-500 text-sm mt-1">{errors.instagram}</p>
            )}
          </div>
        );
      case "playStore":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Play Store App Link
            </label>
            <input
              type="url"
              name="playStore"
              value={formData.playStore || ""}
              placeholder="Enter Play Store app link..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.playStore && (
              <p className="text-red-500 text-sm mt-1">{errors.playStore}</p>
            )}
          </div>
        );

      case "appStore":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              App Store App Link
            </label>
            <input
              type="url"
              name="appStore"
              value={formData.appStore || ""}
              placeholder="Enter App Store app link..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.appStore && (
              <p className="text-red-500 text-sm mt-1">{errors.appStore}</p>
            )}
          </div>
        );
      case "app":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Play Store App Link
              </label>
              <input
                type="url"
                name="appplayStore"
                value={formData.appplayStore || ""}
                placeholder="Enter Play Store app link..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.appplayStore && (
                <p className="text-red-500 text-sm mt-1">{errors.appplayStore}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                App Store App Link
              </label>
              <input
                type="url"
                name="appappStore"
                value={formData.appappStore || ""}
                placeholder="Enter App Store app link..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.appappStore && (
                <p className="text-red-500 text-sm mt-1">{errors.appappStore}</p>
              )}
            </div>
          </>
        );
      case "whatsapp":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp || ""}
                placeholder="Enter WhatsApp number..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Message (Optional)
              </label>
              <textarea
                name="whatappmessage"
                value={formData.whatappmessage || ""}
                placeholder="Enter optional message..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                rows="4"
                onChange={handleChange}
              />
            </div>
          </>
        );

      case "googleMaps":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Google Maps Link
            </label>
            <input
              type="url"
              name="location"
              value={formData.location || ""}
              placeholder="Enter Google Maps link..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onChange={handleChange}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
        );

      case "wifi":
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">SSID</label>
              <input
                type="text"
                name="ssid"
                value={formData.ssid || ""}
                placeholder="Enter WiFi SSID..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.ssid && (
                <p className="text-red-500 text-sm mt-1">{errors.ssid}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                placeholder="Enter WiFi password..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </>
        );

      case "image":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" 
            className="mb-2 max-w-[180px]" /><br/>
            <button
              type="button"
              onClick={() => handleFileUpload(imageFile, "Image")}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
            >
              Upload Image
            </button>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>
        )

      case "pdf":
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Upload PDF</label>
            <input type="file" onChange={handlePdfChange} accept="application/pdf" 
            className="mb-2 max-w-[180px]" /><br/>
            <button
              type="button"
              onClick={() => handleFileUpload(pdfFile, "PDF")}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition"
            >
              Upload PDF
            </button>
            {errors.pdf && <p className="text-red-500 text-sm mt-1">{errors.pdf}</p>}
          </div>
        )

      default:
        return <p className="text-gray-500">Select a Plan to Proceed..</p>;
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      {renderFields()}
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-500 transition"
      >
        Generate QR Code
      </button>
    </form>
  );
};

export default QRForm;

import textImage from "../../assets/qrimages/text.png";
import urlImage from "../../assets/qrimages/url.png";
import phoneImage from "../../assets/qrimages/phone.png";
import emailImage from "../../assets/qrimages/email.png";
import upiImage from "../../assets/qrimages/upi.png";
import youtubeImage from "../../assets/qrimages/youtube.png";
import facebookImage from "../../assets/qrimages/facebook.png";
import instagramImage from "../../assets/qrimages/instagram.png";
import whatsappImage from "../../assets/qrimages/whatsapp.png";
import googleMapsImage from "../../assets/qrimages/googleMaps.png";
import appStoreImage from "../../assets/qrimages/appStore.png";
import playStoreImage from "../../assets/qrimages/playStore.png";
import wifiImage from "../../assets/qrimages/wifi.png";
import imageImage from "../../assets/qrimages/image.png";
import pdfImage from "../../assets/qrimages/pdf.png";
import audioImage from "../../assets/qrimages/audio.png";
import videoImage from "../../assets/qrimages/video.png";

const defaultLogos = (activeType) => {
    const defaultLogos = {
        text: textImage,
        url: urlImage,
        phone: phoneImage,
        email: emailImage,
        upi: upiImage,
        youtube: youtubeImage,
        facebook: facebookImage,
        instagram: instagramImage,
        whatsapp: whatsappImage,
        googleMaps: googleMapsImage,
        appStore: appStoreImage,
        playStore: playStoreImage,
        wifi: wifiImage,
        image: imageImage,
        pdf: pdfImage,
        audio: audioImage,
        video: videoImage,
    };

    return defaultLogos[activeType]
}

export default defaultLogos
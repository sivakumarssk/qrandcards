import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; 
import about from '../../assets/corousel/about-us.jpg'

const AboutHome = ()=>{
    return(
        <>
        <div className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 items-center gap-8">
          {/* Text Content */}
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-4">About Our Platform</h2>
            <p className="text-gray-600 text-justify">
            At [Your Platform Name], we believe in the power of personalization. 
            Whether you're a small business owner, a freelancer, or someone looking to 
            make a professional impression, our platform offers the tools you need to 
            create unique, high-quality visiting cards and business cards that reflect 
            your brand. With a vast selection of customizable templates, fonts, and 
            design elements, you can easily craft a card that speaks to your style and 
            business identity. Our QR Code Generator further elevates your networking efforts, 
            enabling you to create custom QR codes for your business cards or marketing materials, 
            seamlessly connecting your physical presence with your digital world.
            </p>
            <p className="text-gray-600 text-justify">
            We understand that first impressions matter, and that's why we focus on making it simple for you to design cards and QR codes that stand out. Our platform's easy-to-use interface ensures that anyone, regardless of their design experience, can create professional-looking cards and codes with ease. Whether you need a traditional visiting card or a modern business card that includes a QR code linking to your website, social media, or portfolio, we’ve got you covered. Additionally, all our designs are optimized for both print and digital use, so your personalized cards and QR codes will look great no matter how they are shared or distributed.
            </p>
          </div>

          {/* Image Frames */}
          <div data-aos="fade-left" className="flex space-x-4">
            <img
              src={about}
              alt="About Image 1"
              className="w-[full] rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
        </>
    )
}

export default AboutHome
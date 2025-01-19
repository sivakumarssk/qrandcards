import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import qrScreen from '../../assets/corousel/qrScreen.png'

function QrAbout() {
    return (
        <>
            <div className="container mx-auto py-16 px-4">
                <div className="grid md:grid-cols-2 items-center gap-10">
                    {/* Image Frames */}
                    <div data-aos="fade-right" className="flex space-x-4">
                        <img
                            src={qrScreen}
                            alt="About Image 1"
                            className="w-[full] rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Text Content */}
                    <div data-aos="fade-left">
                        <h2 className="text-3xl font-bold mb-4">QR codes</h2>
                        <p className="text-gray-600 text-xl text-justify">
                            Generate QR Code with the ability to change the destination of QR Code on the go. You can customize the URL anytime with the help of link management tool.
                        </p>
                        <br/>
                        <p className="text-lg">&#10004;  Advanced scan analytics</p>
                        <p className="text-lg">&#10004;  Manage URL destination dynamically</p>
                        <p className="text-lg">&#10004;  Schedule and rotate QR Code URL</p>
                        <p className="text-lg">&#10004;  Password protection</p>
                        <p className="text-lg">&#10004;  Retarget device, language and country</p>
                        <p className="text-lg">&#10004;  Easily customizable</p>
                        <p className="text-lg">&#10004;  Unlimited scans</p>
                        <p className="text-lg">&#10004;  No data stored in cloud</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QrAbout
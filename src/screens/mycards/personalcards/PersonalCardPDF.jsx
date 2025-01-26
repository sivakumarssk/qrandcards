import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const PersonalCardPDF = ({ personalDetails, socialLinks, images, videos, about, contactInfo }) => {

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Personal Portfolio", 20, 20);

    doc.setFontSize(12);
    doc.text("Personal Information", 20, 40);
    doc.text(`Name: ${personalDetails.name}`, 20, 50);
    doc.text(`Profession: ${personalDetails.profession}`, 20, 60);
    doc.text(`Phone: ${personalDetails.phone}`, 20, 70);


    doc.text(`Social Links: `, 20, 80);
    socialLinks.forEach((link, index) => {
        doc.text(`${index +1}:  ${link}`, 20 , 90 + (index * 10));
    })

    doc.save(`${personalDetails.name || 'personalCard'}-Portfolio.pdf`)
  }


  return (
    <>
        <div>
            <button onClick={generatePDF}>Generate PDF</button>
        </div>
    </>
  )
};

export default PersonalCardPDF

import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-6 mt-[5%]">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p>QR AND CARDS (web app) is part of "ATOZKEYSOLUTION"</p>
      <p>
        By accessing or using the QR AND CARDS web application ("App"), you agree to comply
        with and be bound by these Terms and Conditions ("Terms"). Please read
        these Terms carefully before using the App.
      </p>
      <ol className="list-decimal pl-6 mt-4">
        <li>
          <strong>Acceptance of Terms:</strong> By using QR AND CARDS, you agree to these Terms. If you do not agree with any part of these Terms, you must not use the App.
        </li>
        <li>
          <strong>Changes to Terms:</strong> We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the App or through other communication. Your continued use of the App following any modifications constitutes your acceptance of the new Terms.
        </li>
        <li>
          <strong>User Accounts:</strong>
          <ul className="list-disc pl-6">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>Notify us immediately of unauthorized use of your account.</li>
          </ul>
        </li>
        <li>
          <strong>Use of the App:</strong> You agree to use the App in compliance with all laws and regulations.
        </li>
        <li>
          <strong>Fees and Payments:</strong> Pricing and terms for services will be clearly outlined in the App.
        </li>
        <li>
          <strong>Intellectual Property:</strong> All content, trademarks, and data on the App are owned by or licensed to ATOZKEYSOLUTION.
        </li>
        <li>
          <strong>Termination:</strong> We reserve the right to terminate your account for violations.
        </li>
        <li>
          <strong>Disclaimer of Warranties:</strong> The App is provided on an "as is" basis.
        </li>
        <li>
          <strong>Governing Law:</strong> These Terms will be governed by the laws of [Country/State].
        </li>
        <li>
          <strong>Contact Information:</strong> For questions, contact us at <a href="mailto:qrandcards@gmail.com">qrandcards@gmail.com</a>.
        </li>
      </ol>
    </div>
  );
};

export default TermsAndConditions;

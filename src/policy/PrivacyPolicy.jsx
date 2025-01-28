import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6 mt-[5%]">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>
        ATOZKEYSOLUTION ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application ("QR AND CARDS").
      </p>
      <h2 className="text-2xl font-bold mt-6 mb-4">1. Information We Collect</h2>
      <ul className="list-disc pl-6">
        <li>
          <strong>Personal Information:</strong> Name, email, phone, payment information, and account credentials.
        </li>
        <li>
          <strong>Non-Personal Information:</strong> Device type, IP address, usage data, geolocation, etc.
        </li>
      </ul>
      <h2 className="text-2xl font-bold mt-6 mb-4">2. How We Collect Information</h2>
      <p>We collect information directly from you, automatically via cookies, or from third parties.</p>
      <h2 className="text-2xl font-bold mt-6 mb-4">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6">
        <li>To manage your account and personalize the app.</li>
        <li>To process payments and send communications.</li>
        <li>For analytics and legal compliance.</li>
      </ul>
      <h2 className="text-2xl font-bold mt-6 mb-4">4. Data Security</h2>
      <p>We implement industry-standard security measures but cannot guarantee absolute security.</p>
      <h2 className="text-2xl font-bold mt-6 mb-4">5. Contact Us</h2>
      <p>
        For questions, contact us at <a href="mailto:qrandcards@gmail.com">qrandcards@gmail.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

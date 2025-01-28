import React from "react";

const RefundPolicy = () => {
  return (
    <div className="container mx-auto p-6 mt-[5%]">
      <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>
      <p>
        QR AND CARDS is part of ATOZKEYSOLUTION, and we aim to provide high-quality services. This Refund Policy outlines the conditions for refunds for purchases made via the App.
      </p>
      <h2 className="text-2xl font-bold mt-6 mb-4">1. General Refund Policy</h2>
      <ul className="list-disc pl-6">
        <li>Refund requests must be submitted within 14 days of purchase.</li>
        <li>Not all purchases are eligible for refunds.</li>
      </ul>
      <h2 className="text-2xl font-bold mt-6 mb-4">2. In-App Purchases</h2>
      <p>
        Refunds for in-app purchases are non-refundable except in cases of technical issues, accidental purchases, or unauthorized transactions.
      </p>
      <h2 className="text-2xl font-bold mt-6 mb-4">3. How to Request a Refund</h2>
      <p>
        To request a refund, email us at <a href="mailto:qrandcards@gmail.com">qrandcards@gmail.com</a> with your name, purchase details, and reason.
      </p>
      <h2 className="text-2xl font-bold mt-6 mb-4">4. Refund Processing</h2>
      <p>
        Refunds will be processed to the original payment method within 5–10 business days after approval.
      </p>
      <p>Thank you for your support, ATOZKEYSOLUTION.</p>
    </div>
  );
};

export default RefundPolicy;

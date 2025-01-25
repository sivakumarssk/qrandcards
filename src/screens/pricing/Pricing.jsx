import React from "react";
import Footer from "../../components/home/Footer ";

function Pricing() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold">Pricing Plans</h1>
        <p className="mt-4 text-xl">
          Choose the plan that best suits your needs and start creating today!
        </p>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Plans</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-blue-600">Basic</h3>
            <p className="mt-4 text-gray-600">For personal use and small projects.</p>
            <div className="mt-6 text-4xl font-bold">₹29</div>
            <p className="text-gray-500">per month</p>
            <ul className="mt-4 text-gray-600">
              <li>✓ Create unlimited QR Codes</li>
              <li>✓ Standard templates</li>
              <li>✓ Secure downloads</li>
            </ul>
            <button className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
              Choose Basic
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center border-4 border-blue-600">
            <h3 className="text-xl font-bold text-blue-600">Pro</h3>
            <p className="mt-4 text-gray-600">Ideal for businesses and professionals.</p>
            <div className="mt-6 text-4xl font-bold">₹59</div>
            <p className="text-gray-500">per month</p>
            <ul className="mt-4 text-gray-600">
              <li>✓ All features in Basic</li>
              <li>✓ Customizable templates</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <button className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
              Choose Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-blue-600">Enterprise</h3>
            <p className="mt-4 text-gray-600">For organizations with advanced needs.</p>
            <div className="mt-6 text-4xl font-bold">₹99</div>
            <p className="text-gray-500">per month</p>
            <ul className="mt-4 text-gray-600">
              <li>✓ All features in Pro</li>
              <li>✓ Team collaboration</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
              Choose Enterprise
            </button>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <Footer/>
    </div>
  );
}

export default Pricing;

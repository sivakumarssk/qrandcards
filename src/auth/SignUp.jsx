import React from "react";

function SignUp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

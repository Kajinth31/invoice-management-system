import React, { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    shop: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // later connect to backend
  };
  
  if (form.password !== form.confirmPassword) {
  alert("Passwords do not match");
  return;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
            S
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500">Start using SmartRetail</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Shop */}
          <input
            type="text"
            name="shop"
            placeholder="Shop Name"
            value={form.shop}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer">Login</span>
        </p>

      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    shop: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    console.log("API_BASE =", API_BASE);
    console.log("Register URL =", `${API_BASE}/api/register`);

    // 🔴 Validation
    if (!form.name || !form.shop || !form.email || !form.password) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (new TextEncoder().encode(form.password).length > 72) {
    setErrorMessage("Password is too long. Please use 72 bytes or less.");
    return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          shop: form.shop,
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Registration failed");
      }

      setSuccessMessage("Account created successfully!");

      // redirect after 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Register error:", error);
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white border border-blue-100 rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Back Button */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>

          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-md">
            S
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Start using SmartRetail
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="shop"
            placeholder="Shop Name"
            value={form.shop}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
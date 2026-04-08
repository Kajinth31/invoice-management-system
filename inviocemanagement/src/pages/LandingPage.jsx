import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      title: "Invoice Upload",
      description: "Upload PDF or image invoices quickly and process them with ease.",
      icon: "📄",
    },
    {
      title: "Automatic Extraction",
      description: "Extract product details using OCR and smart processing.",
      icon: "🤖",
    },
    {
      title: "Smart Price Calculation",
      description: "Calculate VAT, profit margin, and final selling price accurately.",
      icon: "💰",
    },
    {
      title: "Search & History",
      description: "Search past products and invoices whenever you need them.",
      icon: "🔍",
    },
    {
      title: "Secure Access",
      description: "Users can access their own data safely with account-based access.",
      icon: "🔐",
    },
    {
      title: "Business Friendly",
      description: "Designed for retailers, shops, and businesses handling daily invoices.",
      icon: "🏪",
    },
  ];

  const steps = [
    "Upload your invoice",
    "Extract invoice data automatically",
    "Review and edit product details",
    "Calculate price with VAT and profit",
    "Save and search anytime",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartRetail</h1>
            <p className="text-xs text-gray-500">Invoice Management System</p>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-blue-600">
              How It Works
            </a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-blue-600">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
              Simple. Smart. Reliable.
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Manage invoices faster with a smarter system
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Upload supplier invoices, extract product details, calculate selling
              prices with VAT and profit, and keep everything organized in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl sm:p-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Processed
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between rounded-xl border border-blue-100 bg-white px-4 py-3">
                  <span className="text-gray-500">Product</span>
                  <span className="font-medium text-gray-900">Milk Powder 1kg</span>
                </div>
                <div className="flex justify-between rounded-xl border border-blue-100 bg-white px-4 py-3">
                  <span className="text-gray-500">Case Price</span>
                  <span className="font-medium text-gray-900">£24.00</span>
                </div>
                <div className="flex justify-between rounded-xl border border-blue-100 bg-white px-4 py-3">
                  <span className="text-gray-500">Units</span>
                  <span className="font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between rounded-xl border border-blue-100 bg-white px-4 py-3">
                  <span className="text-gray-500">VAT</span>
                  <span className="font-medium text-gray-900">20%</span>
                </div>
                <div className="flex justify-between rounded-xl border border-blue-100 bg-blue-600 px-4 py-3">
                  <span className="font-medium text-white">Suggested Price</span>
                  <span className="font-bold text-white">£3.39</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Key Features</h3>
          <p className="mt-3 text-gray-600">
            Everything you need to manage invoices and pricing efficiently.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h4 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h4>
              <p className="mt-2 text-sm leading-7 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white/70 py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold text-gray-900">How It Works</h3>
            <p className="mt-3 text-gray-600">
              A simple flow built for daily business use.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <div
                key={index}
                className="rounded-2xl border border-blue-100 bg-white p-5 text-center shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-medium leading-6 text-gray-700">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl sm:p-10">
          <h3 className="text-3xl font-bold text-gray-900">
            Start managing invoices with confidence
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Join a smarter way to upload, calculate, save, and search invoice data.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <h4 className="text-lg font-semibold text-gray-900">SmartRetail</h4>
          <p className="mt-2 text-sm text-gray-500">
            Smart invoice management for modern businesses
          </p>
          <p className="mt-4 text-sm text-gray-400">
            © 2026 SmartRetail. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
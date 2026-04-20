import React from "react";

export default function Footer() {
  return (
    <footer className="mt-6 rounded-2xl border border-blue-100 bg-white px-4 py-4 text-center shadow-sm sm:px-6">
      <p className="text-sm text-gray-500">
        © 2026 <span className="font-semibold text-gray-700">SmartRetail</span>. All rights reserved.
      </p>
      <p className="mt-1 text-xs text-gray-400">
        Smart invoice and product management system
      </p>
    </footer>
  );
}
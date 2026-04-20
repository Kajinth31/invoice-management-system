import React, { useState } from "react";

export default function FileUpload({ onUpload, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const mockEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      };
      onUpload(mockEvent);
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border p-5 text-center shadow-sm transition-all duration-200 sm:p-8 ${
        isDragging
          ? "border-blue-400 bg-blue-50 ring-4 ring-blue-100"
          : "border-blue-100 bg-gradient-to-br from-white to-blue-50"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Icon */}
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border transition-colors sm:h-20 sm:w-20 ${
          isDragging
            ? "border-blue-300 bg-blue-100 text-blue-600"
            : "border-blue-100 bg-white text-blue-600"
        }`}
      >
        <svg
          className="h-8 w-8 sm:h-10 sm:w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        Upload Supplier Invoice
      </h2>

      {/* Description */}
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        Drag and drop your invoice here or choose a file to extract product details,
        case costs, and smart selling prices automatically.
      </p>

      {/* Upload input */}
      <div className="mt-6 flex flex-col items-center justify-center">
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          id="invoice-upload"
          onChange={onUpload}
          disabled={isProcessing}
        />

        <label
          htmlFor="invoice-upload"
          className={`inline-flex min-w-[200px] items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 sm:text-base ${
            isProcessing
              ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-500"
              : "cursor-pointer bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Scanning...
            </span>
          ) : (
            "Select Invoice File"
          )}
        </label>

        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
          Supports JPG, PNG or PDF
        </p>
      </div>
    </div>
  );
}
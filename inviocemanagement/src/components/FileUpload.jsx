import React, { useState } from 'react';

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
      // MODIFIED: Changed max-width and padding to make it fill the space better
      className={`w-full p-10 sm:p-16 rounded-2xl border shadow-2xl text-center transition-all duration-300 flex flex-col items-center justify-center ${
        isDragging 
          ? 'bg-blue-600/10 border-blue-400 border-dashed border-2 scale-[1.01]' 
          : 'bg-gray-900/40 border-gray-800 border-solid hover:border-blue-500/30'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* MODIFIED: Added an icon container for a cleaner look */}
      <div className={`mb-6 p-4 rounded-full bg-gray-950 border transition-colors ${isDragging ? 'border-blue-400 text-blue-400' : 'border-gray-800 text-blue-500/50'}`}>
        <svg 
          className="w-12 h-12" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white tracking-tight">
        Upload Supplier Invoice
      </h2>
      <p className="mb-8 text-gray-400 max-w-sm mx-auto text-sm">
        Drag and drop your invoice here. SmartRetail will automatically extract products, costs, and calculate your new RRPs.
      </p>
      
      <div className="flex flex-col items-center justify-center w-full">
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
          className={`w-full max-w-full px-8 py-4 rounded-xl font-bold cursor-pointer transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            isProcessing 
              ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95'
          }`}
        >
          {isProcessing ? (
             <>
               <span className="animate-spin text-lg">⏳</span>
               Scanning...
             </>
          ) : 'Select Invoice File'}
        </label>
        
        <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold">
          Supports JPG, PNG, or PDF
        </p>
      </div>
    </div>
  );
}
import React from 'react';

export default function SettingsPanel({ margin, setMargin, vat, setVat }) {
  return (
    <div className="bg-gray-900 p-5 sm:p-6 rounded-xl border border-blue-900/40 shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
      <h3 className="font-semibold text-blue-400/80 tracking-wide uppercase text-sm">Global Variables</h3>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
        
        {/* Margin Input */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3">
          <label className="text-sm text-gray-400 font-medium">Target Margin (%)</label>
          <input 
            type="number" 
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="bg-gray-950 border border-blue-500/30 rounded-md p-2 w-20 text-center text-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />
        </div>

        {/* VAT Input */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3">
          <label className="text-sm text-gray-400 font-medium">Default VAT (%)</label>
          <input 
            type="number" 
            value={vat}
            onChange={(e) => setVat(Number(e.target.value))}
            className="bg-gray-950 border border-blue-500/30 rounded-md p-2 w-20 text-center text-gray-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />
        </div>

      </div>
    </div>
  );
}
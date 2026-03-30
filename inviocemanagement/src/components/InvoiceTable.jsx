import React from 'react';

export default function InvoiceTable({ products, onSave, margin, vat, onUpdateProduct }) {
  
  if (!products || products.length === 0) return (
    <div className="p-10 text-center bg-gray-900/50 rounded-xl border border-dashed border-gray-800 text-gray-500">
      No products found in database or invoice. Try searching above or uploading a file.
    </div>
  );

  // The "Next 9" Calculation Logic (Unit Cost + VAT + Profit)
  const calculateSmartRRP = (p) => {
    if (!p.case_price || !p.units_per_case) return 0;
    
    // Use individual settings if they exist, otherwise use global settings
    const currentMargin = p.individualMargin !== undefined ? p.individualMargin : margin;
    const currentVatRate = p.vat_code === 'Z' ? 0 : (p.individualVat !== undefined ? p.individualVat : vat);

    const unitCost = p.case_price / p.units_per_case;
    const costWithVat = unitCost * (1 + (currentVatRate / 100));
    const priceWithProfit = costWithVat * (1 + (currentMargin / 100));
    
    // Round to next .9 (e.g., 2.15 -> 2.19)
    return (Math.ceil(priceWithProfit * 10) / 10) - 0.01;
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
      
      {/* Table Header Action Bar */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-200">
          Product Pricing Intelligence
        </h2>
        <button 
          onClick={onSave} 
          className="bg-blue-600 text-white px-6 py-1 rounded-lg font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
        >
          Update Database
        </button>
      </div>

      {/* The Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300 min-w-[800px]">
          <thead className="bg-gray-950 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">Item #</th>
              <th className="px-6 py-4 font-medium">Product Name</th>
              <th className="px-6 py-4 font-medium">UOS</th>
              <th className="px-6 py-4 font-medium">Case Cost</th>
              <th className="px-6 py-4 font-medium text-center">Margin %</th>
              <th className="px-6 py-4 font-medium text-center">VAT %</th>
              <th className="px-6 py-4 font-medium text-blue-400 text-right">Smart RRP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map((p, index) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-4 text-gray-500 font-mono">{p.item_number}</td>
                <td className="px-6 py-4 font-medium text-gray-200">{p.product_name}</td>
                <td className="px-6 py-4 text-gray-400">{p.units_per_case}</td>
                <td className="px-6 py-4 font-mono">£{p.case_price.toFixed(2)}</td>
                
                {/* Individual Margin Edit */}
                <td className="px-6 py-4 text-center">
                  <input 
                    type="number"
                    value={p.individualMargin !== undefined ? p.individualMargin : margin}
                    onChange={(e) => onUpdateProduct(index, 'individualMargin', e.target.value)}
                    className="w-16 bg-gray-800 border border-gray-700 rounded text-center py-1 focus:border-blue-500 outline-none text-blue-300"
                  />
                </td>

                {/* Individual VAT Edit */}
                <td className="px-6 py-4 text-center">
                  <input 
                    type="number"
                    disabled={p.vat_code === 'Z'} // Keep it disabled if it's Zero-rated
                    value={p.vat_code === 'Z' ? 0 : (p.individualVat !== undefined ? p.individualVat : vat)}
                    onChange={(e) => onUpdateProduct(index, 'individualVat', e.target.value)}
                    className={`w-16 bg-gray-800 border border-gray-700 rounded text-center py-1 focus:border-blue-500 outline-none ${p.vat_code === 'Z' ? 'opacity-30 cursor-not-allowed' : 'text-green-400'}`}
                  />
                </td>

                {/* The "Next 9" Calculated RRP */}
                <td className="px-6 py-4 font-bold text-blue-400 text-right text-base">
                  £{calculateSmartRRP(p).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
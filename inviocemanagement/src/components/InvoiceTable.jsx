import React from "react";

export default function InvoiceTable({
  products,
  onSave,
  margin,
  vat,
  onUpdateProduct,
}) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-6 py-12 text-center text-sm text-gray-500">
        No products found in database or invoice. Try searching above or uploading a file.
      </div>
    );
  }

  const calculateSmartRRP = (p) => {
    if (!p.case_price || !p.units_per_case) return 0;

    const currentMargin =
      p.individualMargin !== undefined ? p.individualMargin : margin;

    const currentVatRate =
      p.vat_code === "Z"
        ? 0
        : p.individualVat !== undefined
        ? p.individualVat
        : vat;

    const unitCost = p.case_price / p.units_per_case;
    const costWithVat = unitCost * (1 + currentVatRate / 100);
    const priceWithProfit = costWithVat * (1 + currentMargin / 100);

    return Math.ceil(priceWithProfit * 10) / 10 - 0.01;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-blue-100 bg-gradient-to-r from-white to-blue-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          Product Pricing Intelligence
        </h2>

        <button
          onClick={onSave}
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          Update Database
        </button>
      </div>

      {/* Scrollable table container */}
      <div className="max-h-[500px] overflow-auto">
        <table className="min-w-[900px] w-full text-left text-sm text-gray-700">
          <thead className="sticky top-0 z-10 border-b border-blue-100 bg-blue-50 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-4 py-4 font-semibold sm:px-6">Item #</th>
              <th className="px-4 py-4 font-semibold sm:px-6">Product Name</th>
              <th className="px-4 py-4 font-semibold sm:px-6">UOS</th>
              <th className="px-4 py-4 font-semibold sm:px-6">Case Cost</th>
              <th className="px-4 py-4 text-center font-semibold sm:px-6">
                Margin %
              </th>
              <th className="px-4 py-4 text-center font-semibold sm:px-6">
                VAT %
              </th>
              <th className="px-4 py-4 text-right font-semibold text-blue-700 sm:px-6">
                Smart RRP
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-blue-50">
            {products.map((p, index) => (
              <tr
                key={index}
                className="transition-colors hover:bg-blue-50/60"
              >
                <td className="px-4 py-4 font-mono text-xs text-gray-500 sm:px-6 sm:text-sm">
                  {p.item_number}
                </td>

                <td className="px-4 py-4 font-medium text-gray-900 sm:px-6">
                  {p.product_name}
                </td>

                <td className="px-4 py-4 text-gray-600 sm:px-6">
                  {p.units_per_case}
                </td>

                <td className="px-4 py-4 font-mono text-gray-700 sm:px-6">
                  £{Number(p.case_price || 0).toFixed(2)}
                </td>

                {/* Margin input */}
                <td className="px-4 py-4 text-center sm:px-6">
                  <input
                    type="number"
                    value={
                      p.individualMargin !== undefined
                        ? p.individualMargin
                        : margin
                    }
                    onChange={(e) =>
                      onUpdateProduct(index, "individualMargin", e.target.value)
                    }
                    className="w-16 rounded-lg border border-gray-300 bg-white py-1.5 text-center text-sm text-blue-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </td>

                {/* VAT input */}
                <td className="px-4 py-4 text-center sm:px-6">
                  <input
                    type="number"
                    disabled={p.vat_code === "Z"}
                    value={
                      p.vat_code === "Z"
                        ? 0
                        : p.individualVat !== undefined
                        ? p.individualVat
                        : vat
                    }
                    onChange={(e) =>
                      onUpdateProduct(index, "individualVat", e.target.value)
                    }
                    className={`w-16 rounded-lg border py-1.5 text-center text-sm outline-none transition ${
                      p.vat_code === "Z"
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : "border-gray-300 bg-white text-green-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                </td>

                {/* Smart RRP */}
                <td className="px-4 py-4 text-right text-base font-bold text-blue-700 sm:px-6">
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
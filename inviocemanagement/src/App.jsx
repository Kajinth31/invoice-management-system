import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import InvoiceTable from './components/InvoiceTable';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const [margin, setMargin] = useState(40);
  const [vat, setVat] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDatabase(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDatabase = async (query) => {
    try {
      setErrorMessage('');
      const url = `${API_BASE}/api/products/search?query=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();

      if (result.status === 'success') {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Database fetch error:', error);
      setErrorMessage('Could not load products from database.');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Upload failed');
      }

      if (result.status === 'success') {
        setProducts((prev) => [...result.data, ...prev]);
        setSuccessMessage('Invoice uploaded and processed successfully.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.message || 'Error uploading file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (products.length === 0) return;

    setErrorMessage('');
    setSuccessMessage('');

    const productsToSave = products.map((p) => {
      const actualVatPct = p.vat_code === 'Z' ? 0 : (p.individualVat ?? vat);
      const currentMargin = p.individualMargin ?? margin;

      const unitCost = p.case_price / p.units_per_case;
      const costWithVat = unitCost * (1 + actualVatPct / 100);
      const priceWithProfit = costWithVat * (1 + currentMargin / 100);
      const smartRRP = (Math.ceil(priceWithProfit * 10) / 10) - 0.01;

      return {
        ...p,
        rrp: Number(smartRRP.toFixed(2)),
      };
    });

    try {
      const response = await fetch(`${API_BASE}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productsToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Save failed');
      }

      setSuccessMessage(result.message || 'Saved successfully.');
      fetchDatabase(searchTerm);
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage(error.message || 'Error saving to database.');
    }
  };

  const handleUpdateProduct = (index, field, value) => {
    setProducts((prevProducts) => {
      const updated = [...prevProducts];
      const numericFields = [
        'units_per_case',
        'quantity',
        'case_price',
        'rrp',
        'individualVat',
        'individualMargin',
      ];

      updated[index] = {
        ...updated[index],
        [field]: numericFields.includes(field) ? Number(value) || 0 : value,
      };

      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <header className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  SmartRetail Manager
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  Database &amp; Invoice Intelligence
                </p>
              </div>

              <div className="w-full lg:w-96">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Search products
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by item number or product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-10 pr-4 text-gray-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
            </div>
          </header>

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 shadow-md">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 shadow-md">
              {successMessage}
            </div>
          )}

          <section className="grid grid-cols-1 gap-6">
            <div>
              <div>
                <FileUpload onUpload={handleFileUpload} isProcessing={isProcessing} />
              </div>

            </div>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Products table</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Review extracted items, update values, and save them to the database.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-sm text-gray-300">
                  Default VAT: <span className="font-semibold text-white">{vat}%</span>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-sm text-gray-300">
                  Default Margin: <span className="font-semibold text-white">{margin}%</span>
                </div>
              </div>
            </div>

            <InvoiceTable
              products={products}
              onSave={handleSaveToDatabase}
              margin={margin}
              vat={vat}
              onUpdateProduct={handleUpdateProduct}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
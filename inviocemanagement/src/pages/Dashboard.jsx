import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import InvoiceTable from "../components/InvoiceTable";
import Footer from "../components/Footer";
import {
  searchProducts,
  uploadInvoice,
  saveProducts,
} from "../services/productService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const [margin] = useState(40);
  const [vat] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDatabase(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchDatabase = async (query) => {
    try {
      setErrorMessage("");
      const result = await searchProducts(query);

      if (result.status === "success") {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error("Database fetch error:", error);
      setErrorMessage("Could not load products from database.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await uploadInvoice(file);

      if (result.status === "success") {
        setProducts((prev) => [...(result.data || []), ...prev]);
        setSuccessMessage("Invoice uploaded and processed successfully.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error.message || "Error uploading file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (products.length === 0) return;

    setErrorMessage("");
    setSuccessMessage("");

    const productsToSave = products.map((p) => {
      const actualVatPct = p.vat_code === "Z" ? 0 : p.individualVat ?? vat;
      const currentMargin = p.individualMargin ?? margin;

      const unitsPerCase = Number(p.units_per_case) || 1;
      const casePrice = Number(p.case_price) || 0;

      const unitCost = casePrice / unitsPerCase;
      const costWithVat = unitCost * (1 + actualVatPct / 100);
      const priceWithProfit = costWithVat * (1 + currentMargin / 100);
      const smartRRP = Math.ceil(priceWithProfit * 10) / 10 - 0.01;

      return {
        ...p,
        rrp: Number(smartRRP.toFixed(2)),
      };
    });

    try {
      const result = await saveProducts(productsToSave);
      setSuccessMessage(result.message || "Saved successfully.");
      fetchDatabase(searchTerm);
    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage(error.message || "Error saving to database.");
    }
  };

  const handleUpdateProduct = (index, field, value) => {
    setProducts((prevProducts) => {
      const updated = [...prevProducts];

      const numericFields = [
        "units_per_case",
        "quantity",
        "case_price",
        "rrp",
        "individualVat",
        "individualMargin",
      ];

      updated[index] = {
        ...updated[index],
        [field]: numericFields.includes(field) ? Number(value) || 0 : value,
      };

      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isSearching = searchTerm.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
        <div className="space-y-4 sm:space-y-5">
          {/* Header */}
          <header className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xl sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-md">
                    S
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                          SmartRetail Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                          Invoice and product management
                        </p>
                      </div>

                      {/* Mobile logout only */}
                      <button
                        onClick={handleLogout}
                        className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 sm:hidden"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row xl:items-end">
                <div className="w-full xl:w-96">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search products
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Search by item number or product name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Desktop logout only */}
                <button
                  onClick={handleLogout}
                  className="hidden rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:block"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Alerts */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
              {successMessage}
            </div>
          )}

          {/* Smaller Summary Cards */}
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Products
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {products.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Default VAT
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {vat}%
              </h3>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Default Margin
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                {margin}%
              </h3>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                System Status
              </p>
              <h3 className="mt-2 text-base font-semibold text-green-600 sm:text-lg">
                Ready
              </h3>
            </div>
          </section>

          {/* Hide upload while searching */}
          {!isSearching && (
            <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-5">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Upload Invoice
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload PDF or image invoices and extract product details automatically.
                </p>
              </div>

              <FileUpload onUpload={handleFileUpload} isProcessing={isProcessing} />
            </section>
          )}

          {/* Optional searching info */}
          {isSearching && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Showing search results for:{" "}
              <span className="font-semibold">{searchTerm}</span>
            </div>
          )}

          {/* Products Table */}
          <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Products Table
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Review extracted items, update values, and save them to the database.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-gray-700 sm:px-4 sm:text-sm">
                  VAT: <span className="font-semibold text-gray-900">{vat}%</span>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-gray-700 sm:px-4 sm:text-sm">
                  Margin: <span className="font-semibold text-gray-900">{margin}%</span>
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
          <Footer />
        </div>
      </div>
    </div>
  );
}
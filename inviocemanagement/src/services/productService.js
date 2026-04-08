const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function searchProducts(query = "") {
  const url = `${API_BASE}/api/products/search?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Failed to fetch products");
  }

  return result;
}

export async function uploadInvoice(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Upload failed");
  }

  return result;
}

export async function saveProducts(products) {
  const response = await fetch(`${API_BASE}/api/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(products),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail || "Save failed");
  }

  return result;
}
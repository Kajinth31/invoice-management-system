import json
import google.generativeai as genai
from app.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

PROMPT = """
Analyze this wholesale invoice image or PDF row by row.
Extract the product table into a strict JSON list of dictionaries.

CRITICAL INSTRUCTION:
Be extremely careful with row alignment.
Read straight across from left to right for each item.
Notice that the Weight/Size (e.g., 120G, 100G) may be in its own unlabelled column.
Notice that the UOP column usually contains a hyphen (-).

Use exactly these keys:
- "item_number" (string)
- "product_name" (string, COMBINE the Product Description and the Weight/Size)
- "units_per_case" (integer, from the UOS column)
- "quantity" (integer, from the Qty column)
- "case_price" (float, from the Price(£) column)
- "rrp" (float, from the RRP(£) column)
- "vat_code" (string, from the VAT column, usually 'Z' or 'A')

Return ONLY valid JSON.
No markdown.
No explanation.
"""


def parse_invoice_with_gemini(file_path: str):
    uploaded_file = genai.upload_file(file_path)
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content([uploaded_file, PROMPT])

    raw_text = response.text.strip()
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    data = json.loads(raw_text)

    if not isinstance(data, list):
        raise ValueError("Gemini response is not a list")

    cleaned = []
    for item in data:
        cleaned.append({
            "item_number": str(item.get("item_number", "")).strip(),
            "product_name": str(item.get("product_name", "")).strip(),
            "units_per_case": int(item.get("units_per_case", 0)),
            "quantity": int(item.get("quantity", 0)),
            "case_price": float(item.get("case_price", 0)),
            "rrp": float(item.get("rrp", 0)),
            "vat_code": str(item.get("vat_code", "")).strip(),
        })

    return cleaned
import pdfplumber
import json

def analyze_pdf(pdf_path, pages_to_check):
    results = {}
    with pdfplumber.open(pdf_path) as pdf:
        for page_num in pages_to_check:
            # pages are 0-indexed in pdfplumber, 1-indexed in human terms
            # The user said Module 1 is pp. 8-13
            # Let's inspect page 8 (index 7) as a sample
            page = pdf.pages[page_num]
            text = page.extract_text()
            tables = page.extract_tables()
            
            results[f"Page_{page_num+1}"] = {
                "Text_Sample": text[:500] if text else "No text found",
                "Table_Count": len(tables),
                "Table_Sample": tables[0] if tables else "No tables found"
            }
            
    return results

if __name__ == "__main__":
    pdf_path = "source/80_percent.pdf"
    # Inspecting first page of Module 1 (p.8 -> idx 7), Module 2 (p.14 -> idx 13), Module 3 (p.22 -> idx 21)
    pages_to_inspect = [7, 13, 21] 
    analysis = analyze_pdf(pdf_path, pages_to_inspect)
    print(json.dumps(analysis, indent=2, ensure_ascii=False))

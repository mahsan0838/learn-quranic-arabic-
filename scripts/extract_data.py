"""
QuranVoc 80 - Enhanced Data Extraction Script
Extracts vocabulary data from the 80% PDF using OCR with improved parsing
"""

import json
import re
from pdf2image import convert_from_path
import pytesseract

# Set the path to tesseract.exe on Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf_page(pdf_path, page_number):
    """Extract text from a specific PDF page using OCR"""
    try:
        # Convert PDF page to image
        images = convert_from_path(pdf_path, first_page=page_number, last_page=page_number)
        
        if images:
            # Perform OCR with Arabic language support
            text = pytesseract.image_to_string(images[0], lang='ara+eng')
            return text
        return ""
    except Exception as e:
        print(f"Error extracting page {page_number}: {e}")
        return ""

def parse_word_entries(text):
    """
    Parse OCR text to extract word entries.
    This is a basic parser - you may need to adjust based on actual PDF structure.
    """
    words = []
    lines = text.split('\n')
    
    # Simple pattern: look for lines with English meanings
    current_word = {}
    word_id = 1
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Try to identify word entries
        # This is a simplified parser - adjust based on your PDF structure
        if len(line) > 2 and not line.isdigit():
            # Check if line contains English text (basic heuristic)
            if any(c.isalpha() and ord(c) < 128 for c in line):
                # Likely an English meaning
                if current_word and 'english' in current_word:
                    # Save previous word
                    words.append(current_word)
                    current_word = {}
                    word_id += 1
                
                current_word['id'] = word_id
                current_word['english'] = line
                current_word['arabic'] = ''  # Will be filled from PDF
                current_word['urdu'] = ''    # Will be filled manually
                current_word['grammatical_info'] = ''
                current_word['frequency'] = 0
                current_word['category'] = 'general'
    
    # Add last word
    if current_word:
        words.append(current_word)
    
    return words

def extract_all_pages(pdf_path, start_page, end_page):
    """Extract text from a range of pages"""
    all_text = ""
    for page_num in range(start_page, end_page + 1):
        print(f"Processing page {page_num}...")
        text = extract_text_from_pdf_page(pdf_path, page_num)
        all_text += f"\n\n--- PAGE {page_num} ---\n\n{text}"
    return all_text

def main():
    pdf_path = "source/80_percent.pdf"
    
    print("=" * 60)
    print("QuranVoc 80 - OCR Data Extraction")
    print("=" * 60)
    print("\nNOTE: OCR is not 100% accurate.")
    print("Manual review and correction will be needed.\n")
    
    # Test extraction on one page first
    print("Testing OCR on page 8...")
    test_text = extract_text_from_pdf_page(pdf_path, 8)
    print(f"\nExtracted text sample:\n{test_text[:800]}\n")
    
    # Ask user if they want to continue
    print("\n" + "=" * 60)
    print("EXTRACTION OPTIONS:")
    print("=" * 60)
    print("\n1. Extract Module 1 (pages 8-13) - High-Frequency Words")
    print("2. Extract Module 2 (pages 14-21) - Key Nouns")
    print("3. Extract Module 3 (pages 22-37) - Essential Verbs")
    print("4. Extract ALL modules (pages 8-37)")
    print("5. Save raw OCR text to file for manual processing")
    print("\nRecommendation: Start with option 5 to review OCR quality")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == '1':
        print("\nExtracting Module 1...")
        text = extract_all_pages(pdf_path, 8, 13)
        with open("module_1_raw.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("✓ Saved to module_1_raw.txt")
        
    elif choice == '2':
        print("\nExtracting Module 2...")
        text = extract_all_pages(pdf_path, 14, 21)
        with open("module_2_raw.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("✓ Saved to module_2_raw.txt")
        
    elif choice == '3':
        print("\nExtracting Module 3...")
        text = extract_all_pages(pdf_path, 22, 37)
        with open("module_3_raw.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("✓ Saved to module_3_raw.txt")
        
    elif choice == '4':
        print("\nExtracting ALL modules (this may take a few minutes)...")
        text = extract_all_pages(pdf_path, 8, 37)
        with open("all_modules_raw.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("✓ Saved to all_modules_raw.txt")
        
    elif choice == '5':
        print("\nExtracting raw OCR text from all pages...")
        text = extract_all_pages(pdf_path, 8, 37)
        with open("ocr_raw_output.txt", "w", encoding="utf-8") as f:
            f.write(text)
        print("✓ Saved to ocr_raw_output.txt")
        print("\nNext steps:")
        print("1. Review ocr_raw_output.txt")
        print("2. Check OCR quality and accuracy")
        print("3. Decide: manual entry vs. OCR + corrections")
        
    else:
        print("Invalid choice. Exiting.")
        return
    
    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print("\n1. Review the extracted text file")
    print("2. Check for OCR errors (especially Arabic text)")
    print("3. Consider manual data entry if OCR quality is poor")
    print("4. Use quran_vocab_sample.json as template for manual entry")
    print("\nFor best accuracy with religious content, manual entry")
    print("is recommended to ensure proper Arabic diacritics.")

if __name__ == "__main__":
    main()

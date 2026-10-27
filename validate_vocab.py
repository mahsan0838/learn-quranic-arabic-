"""
Helper script to validate and count words in the vocabulary JSON file
"""

import json
import sys

def validate_vocab_json(filepath):
    """Validate the vocabulary JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("✓ JSON is valid!")
        print("\n" + "="*60)
        print("VOCABULARY DATA SUMMARY")
        print("="*60)
        
        # Check metadata
        if 'metadata' in data:
            meta = data['metadata']
            print(f"\nSource: {meta.get('source', 'N/A')}")
            print(f"Target: {meta.get('total_words', 'N/A')} words")
            print(f"Coverage: {meta.get('coverage_percentage', 'N/A')}%")
        
        # Check modules
        total_words = 0
        for module_key in ['module_1', 'module_2', 'module_3']:
            if module_key in data:
                module = data[module_key]
                word_count = len(module.get('words', []))
                total_words += word_count
                
                print(f"\n{module.get('name', module_key)}:")
                print(f"  Pages: {module.get('pages', 'N/A')}")
                print(f"  Words entered: {word_count}")
                print(f"  Target: {module.get('target_count', 'N/A')}")
                
                if word_count > 0:
                    # Show sample words
                    words = module['words']
                    print(f"  Sample: {words[0].get('arabic', 'N/A')} - {words[0].get('english', 'N/A')}")
        
        print(f"\n{'='*60}")
        print(f"TOTAL WORDS ENTERED: {total_words} / 300")
        print(f"Progress: {(total_words/300)*100:.1f}%")
        print(f"{'='*60}\n")
        
        # Validation checks
        issues = []
        for module_key in ['module_1', 'module_2', 'module_3']:
            if module_key in data:
                for word in data[module_key].get('words', []):
                    # Check required fields
                    if not word.get('arabic'):
                        issues.append(f"Word ID {word.get('id', '?')}: Missing Arabic text")
                    if not word.get('english'):
                        issues.append(f"Word ID {word.get('id', '?')}: Missing English meaning")
                    if not word.get('id'):
                        issues.append(f"Word missing ID")
        
        if issues:
            print("⚠️  VALIDATION ISSUES:")
            for issue in issues[:10]:  # Show first 10
                print(f"  - {issue}")
            if len(issues) > 10:
                print(f"  ... and {len(issues)-10} more issues")
        else:
            print("✓ No validation issues found!")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"✗ JSON SYNTAX ERROR: {e}")
        print(f"  Line {e.lineno}, Column {e.colno}")
        return False
    except FileNotFoundError:
        print(f"✗ File not found: {filepath}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "quran_vocab_template.json"
    validate_vocab_json(filepath)

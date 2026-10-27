"""
Builds app/src/data/vocab.json from the hand-transcribed pages in data/pdf/*.txt.

Row format (one word per line, '|' separated):
    arabic | english | note | frequency | category
Verb rows use ';' inside the arabic field:
    past ; present ; imperative ; active participle ; verbal noun | ...
Lines starting with '## <page> | <section title>' open a new section.

Run from the repo root:  python scripts/build_vocab.py
"""
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "pdf")
OUT = os.path.join(ROOT, "app", "src", "data", "vocab.json")

# Page ranges (PDF page numbers) for each module.
MODULES = {
    1: {"name": "High-Frequency Words", "pages": (8, 13),
        "description": "Pronouns, particles, prepositions and question words. Covers 41.5% of the Qur'an."},
    2: {"name": "Key Nouns & Attributes", "pages": (14, 21),
        "description": "Names and attributes of Allah, prophets, the Last Day, faith, family, people and the world."},
    3: {"name": "Essential Verbs", "pages": (22, 41),
        "description": "The most frequent Qur'anic verbs with their past, present, imperative, participle and verbal noun."},
}
VERB_FORM_LABELS = ["past", "present", "imperative", "active_participle", "verbal_noun"]


def module_for(page):
    for module_id, info in MODULES.items():
        lo, hi = info["pages"]
        if lo <= page <= hi:
            return module_id
    raise ValueError(f"page {page} is outside every module")


def parse():
    entries = []
    for path in sorted(glob.glob(os.path.join(SRC, "*.txt"))):
        page, section = None, None
        with open(path, encoding="utf-8") as f:
            for lineno, raw in enumerate(f, 1):
                line = raw.strip()
                if not line or line.startswith("#") and not line.startswith("##"):
                    continue
                if line.startswith("##"):
                    head, _, title = line[2:].partition("|")
                    page, section = int(head.strip()), title.strip()
                    continue
                cols = [c.strip() for c in line.split("|")]
                if len(cols) != 5:
                    sys.exit(f"{path}:{lineno}: expected 5 columns, got {len(cols)}: {line}")
                arabic, english, note, freq, category = cols
                entry = {
                    "page": page,
                    "section": section,
                    "english": english,
                    "note": note or None,
                    "frequency": int(freq) if freq else None,
                    "category": category,
                    "module": module_for(page),
                }
                if ";" in arabic:
                    forms = [p.strip() for p in arabic.split(";")]
                    if len(forms) != len(VERB_FORM_LABELS):
                        sys.exit(f"{path}:{lineno}: verb row needs 5 forms: {line}")
                    entry["arabic"] = forms[0]
                    entry["forms"] = dict(zip(VERB_FORM_LABELS, forms))
                else:
                    entry["arabic"] = arabic
                entries.append(entry)
    return entries


def load_urdu():
    """Supplementary Urdu glosses (not from the PDF), keyed by page then position."""
    path = os.path.join(ROOT, "data", "supplement", "urdu.txt")
    pages, page = {}, None
    with open(path, encoding="utf-8") as f:
        for lineno, raw in enumerate(f, 1):
            line = raw.strip()
            if not line or (line.startswith("#") and not line.startswith("##")):
                continue
            if line.startswith("##"):
                page = int(line[2:].strip())
                pages[page] = []
                continue
            english, _, urdu = line.rpartition(" | ")
            if not english or not urdu:
                sys.exit(f"{path}:{lineno}: expected 'english | urdu': {line}")
            pages[page].append((english.strip(), urdu.strip()))
    return pages


def attach_urdu(entries):
    urdu = load_urdu()
    by_page = {}
    for e in entries:
        by_page.setdefault(e["page"], []).append(e)
    for page, rows in by_page.items():
        glosses = urdu.get(page, [])
        if len(glosses) != len(rows):
            sys.exit(f"urdu.txt page {page}: {len(glosses)} glosses for {len(rows)} entries")
        for i, (entry, (english, gloss)) in enumerate(zip(rows, glosses), 1):
            if entry["english"] != english:
                sys.exit(f"urdu.txt page {page} #{i}: '{english}' != PDF '{entry['english']}'")
            entry["urdu"] = gloss


def grammatical_info(entry):
    parts = [entry["section"]]
    if entry["note"]:
        parts.append(entry["note"])
    return " · ".join(parts)


def main():
    entries = parse()
    entries.sort(key=lambda e: e["page"])  # stable: keeps file order within a page
    attach_urdu(entries)
    out = {
        "metadata": {
            "source": "80% of Quranic Words by Dr. Abdulazeez Abdulraheem (Islamic Book Trust)",
            "total_words": len(entries),
            "coverage_percentage": 82.6,
            "modules": len(MODULES),
            "note": "Transcribed by hand from the PDF; Arabic diacritics still need a human proofread. "
                    "english, frequency, forms and Arabic come from the PDF; urdu is a supplementary "
                    "gloss added afterwards (data/supplement/urdu.txt) and is not from the PDF.",
        }
    }
    next_id = 1
    for module_id, info in MODULES.items():
        words = []
        for e in (e for e in entries if e["module"] == module_id):
            word = {
                "id": next_id,
                "arabic": e["arabic"],
                "english": e["english"],
                "urdu": e["urdu"],
                "grammatical_info": grammatical_info(e),
                "frequency": e["frequency"],
                "category": e["category"],
                "page": e["page"],
            }
            if "forms" in e:
                word["forms"] = e["forms"]
            words.append(word)
            next_id += 1
        out[f"module_{module_id}"] = {
            "name": info["name"],
            "description": info["description"],
            "pages": f"{info['pages'][0]}-{info['pages'][1]}",
            "words": words,
        }
        print(f"module {module_id}: {len(words)} words")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"wrote {len(entries)} words -> {OUT}")


if __name__ == "__main__":
    main()

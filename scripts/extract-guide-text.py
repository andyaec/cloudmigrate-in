"""Dump a Microsoft incentives PDF to page-indexed text so a new edition can be diffed
against the data in src/data/incentives/*.json.

Usage:
    pip install pymupdf
    python3 scripts/extract-guide-text.py "<path to guide.pdf>" scripts/.guide-text/cpi.txt
    python3 scripts/extract-guide-text.py "<path to guide.pdf>" --toc     # list engagement pages

The output folder scripts/.guide-text/ is git-ignored: the guides are Microsoft Confidential.
"""

import os
import re
import sys

import fitz  # PyMuPDF


def extract(src: str) -> list[str]:
    doc = fitz.open(src)
    return [page.get_text() for page in doc]


def toc(pages: list[str]):
    for i, text in enumerate(pages, start=1):
        lines = [l.strip() for l in text.splitlines() if l.strip() and not l.startswith("Microsoft Confidential") and not re.fullmatch(r"\d+", l.strip())]
        head = " ".join(lines[:3])
        if "Engagement Summary" in head or "Incentive Summary" in head or len(lines) < 4:
            print(f"p{i:>3}  {' | '.join(lines[:2])[:120]}")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    pages = extract(sys.argv[1])
    if sys.argv[2] == "--toc":
        toc(pages)
        return
    out = sys.argv[2]
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    with open(out, "w") as f:
        for i, text in enumerate(pages, start=1):
            f.write(f"\n\n===== PAGE {i} =====\n{text}")
    print(f"{len(pages)} pages -> {out}")


if __name__ == "__main__":
    main()

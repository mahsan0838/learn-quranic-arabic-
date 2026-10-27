"""
Generates the PWA / favicon artwork in web/public from one parametric design:
an eight-pointed star (khatam) in gold on deep emerald.

Run from the repo root:  python scripts/make_icons.py
Needs PyMuPDF (pip install pymupdf).
"""
import math
import os

import pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "web", "public")


def star_points(cx, cy, outer, inner, points=8, rotation=-math.pi / 2):
    pts = []
    for i in range(points * 2):
        r = outer if i % 2 == 0 else inner
        a = rotation + i * math.pi / points
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return " ".join(f"{x:.2f},{y:.2f}" for x, y in pts)


def logo_svg(size=512, rounded=True, gradients=True):
    """gradients=False draws flat colours (PyMuPDF's SVG renderer ignores gradients)."""
    c = size / 2
    s = size / 512
    outer_star = star_points(c, c, 150 * s, 115 * s)
    inner_star = star_points(c, c, 96 * s, 74 * s, rotation=-math.pi / 2 + math.pi / 8)
    rx = 112 * s if rounded else 0
    gold = "url(#gold)" if gradients else "#d9b45f"
    if gradients:
        bg = '<rect width="%s" height="%s" rx="%s" fill="url(#bg)"/>' % (size, size, rx)
    else:
        bg = (
            '<rect width="%s" height="%s" rx="%s" fill="#06150f"/>' % (size, size, rx)
            + '<circle cx="%s" cy="%s" r="%s" fill="#0a2219"/>' % (c, c, 250 * s)
            + '<circle cx="%s" cy="%s" r="%s" fill="#0d2d22"/>' % (c, c, 190 * s)
        )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#14503e"/>
      <stop offset="0.6" stop-color="#0a2a21"/>
      <stop offset="1" stop-color="#05110d"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3dc9a"/>
      <stop offset="0.55" stop-color="#d4ad55"/>
      <stop offset="1" stop-color="#a47c2c"/>
    </linearGradient>
  </defs>
  {bg}
  <circle cx="{c}" cy="{c}" r="{196 * s}" fill="none" stroke="#d4ad55" stroke-opacity="0.5" stroke-width="{2.5 * s}"/>
  <circle cx="{c}" cy="{c}" r="{182 * s}" fill="none" stroke="#d4ad55" stroke-opacity="0.25" stroke-width="{1.5 * s}"/>
  <polygon points="{outer_star}" fill="{gold}"/>
  <polygon points="{inner_star}" fill="#0b2a20"/>
  <circle cx="{c}" cy="{c}" r="{30 * s}" fill="{gold}"/>
</svg>"""


def render(svg, path, px):
    doc = pymupdf.open(stream=svg.encode("utf-8"), filetype="svg")
    page = doc[0]
    zoom = px / page.rect.width
    page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True).save(path)
    print("wrote", os.path.relpath(path, ROOT))


def main():
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(logo_svg(512, rounded=True))
    # Android/desktop installs use these; the full-bleed version is "maskable".
    render(logo_svg(512, rounded=True, gradients=False), os.path.join(OUT, "icon-512.png"), 512)
    render(logo_svg(512, rounded=True, gradients=False), os.path.join(OUT, "icon-192.png"), 192)
    render(logo_svg(512, rounded=False, gradients=False), os.path.join(OUT, "icon-maskable-512.png"), 512)
    # iOS applies its own rounding, so give it a square image.
    render(logo_svg(512, rounded=False, gradients=False), os.path.join(OUT, "apple-touch-icon.png"), 180)
    render(logo_svg(512, rounded=True, gradients=False), os.path.join(OUT, "favicon-48.png"), 48)


if __name__ == "__main__":
    main()

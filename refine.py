from pathlib import Path
import re

root = Path("dist")
for p in root.glob("*.html"):
    s = p.read_text(encoding="utf-8-sig")
    links = []
    for href, label in [("index.html","Home"),("services.html","Services"),("portfolio.html","Portfolio"),("resources.html","Resources")]:
        current = ' aria-current="page"' if href == p.name else ''
        links.append(f'<a href="{href}"{current}>{label}</a>')
    nav = '<header class="wrap nav"><a class="brand" href="index.html"><img src="mark.png" alt="">The Learning Freelance</a><nav aria-label="Main navigation">' + ''.join(links) + '</nav><a class="button outline" href="index.html#contact">Let’s talk</a></header>'
    s = re.sub(r'<header.*?</header>', nav, s, count=1, flags=re.S)
    if p.name == "resources.html":
        s = s.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap">')
    # Heading hierarchy carries the content without repeated section kickers.
    if p.name != "resources.html":
        s = re.sub(r'<p class="eyebrow">.*?</p>', '', s, flags=re.S)
    if p.name == "index.html":
        s = s.replace('<section class="wrap section workflow-motion-section">', '<section class="wrap section workflow-motion-section"><img class="workspace-art" src="workspace-art.png" alt="" loading="lazy" width="1536" height="1024">')
    if p.name == "services.html":
        s = s.replace('<section class="wrap section page-intro">', '<section class="wrap section page-intro illustrated-intro"><div>')
        s = s.replace('</section><section class="services"', '</div><img src="workspace-art.png" alt="" width="1536" height="1024"></section><section class="services"', 1)
    p.write_text(s, encoding="utf-8")

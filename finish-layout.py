from pathlib import Path
import re

p = Path("dist/portfolio.html")
s = p.read_text(encoding="utf-8")
s = re.sub(r'(<div class="evidence-grid">.*?</div>)', r'<details class="results-gallery"><summary>View results screenshots</summary>\1</details>', s, flags=re.S)
p.write_text(s, encoding="utf-8")

from html.parser import HTMLParser
class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ("src", "href") and value and not value.startswith(("http", "#")):
                assert (Path("dist") / value.split("#")[0]).exists(), value
for p in Path("dist").glob("*.html"):
    Links().feed(p.read_text(encoding="utf-8"))
print("Local links and assets verified.")

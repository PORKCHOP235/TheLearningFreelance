from pathlib import Path
import re

root = Path("dist")
home = (root / "index.html").read_text(encoding="utf-8-sig")
services = re.search(r'<section class="services".*?</section>', home, re.S).group()
services_page = home[:home.index("<main")] + '<main id="main"><section class="wrap section page-intro"><p class="eyebrow">How I can help</p><h1>Services</h1><p class="lead">Systems, people, and practical support for local business owners.</p></section>' + services + '<section class="wrap section"><h2>Let’s review what you need.</h2><p>We’ll discuss your current tools, team, and priorities, then agree on a scope of work.</p><a class="button" href="index.html#contact">Request a discovery call ↗</a></section></main>' + home[home.index("<footer"):]
services_page = services_page.replace('<title>The Learning Freelance — Jonel Enad</title>', '<title>Services — The Learning Freelance</title>').replace('<script src="site.js" defer></script>', '')
services_page = services_page.replace('href="#"', 'href="index.html"').replace('href="#contact"', 'href="index.html#contact"').replace('href="#about"', 'href="index.html#about"')
(root / "services.html").write_text(services_page, encoding="utf-8")
overview = '''<section class="wrap section service-overview" id="services"><p class="eyebrow">Services</p><h2>Support where it matters.</h2><div class="service-columns">
<article><h3>Business operations</h3><p>CRM setup, SOPs, specialist VA hiring, team coordination, and day-to-day management.</p></article>
<article><h3>Marketing &amp; sales</h3><p>Social media management, email and SMS campaigns, SEO, and sales follow-up.</p></article>
<article><h3>Website creation</h3><p>A clear website that explains your offer and helps visitors take the next step.</p></article></div><a class="textlink" href="services.html">Explore all services ↗</a></section>'''
home = home.replace(services, "")
home = re.sub(r'<section class="wrap section editorial">.*?</section>', overview, home, flags=re.S)
home = home.replace('<h1 id="hero-name">Jonel Enad</h1>', '<h1 id="hero-name">Virtual business management.</h1>').replace('<p class="eyebrow">Virtual business management</p>', '<p class="eyebrow">Jonel Enad · The Learning Freelance</p>')
home = home.replace('I help local businesses build systems and run their day-to-day operations remotely.', 'I help local business owners set up systems, coordinate their teams, and keep daily operations moving remotely.')
home = re.sub(r'<details><summary>See the reporting details</summary>.*?</details>', '<a class="textlink" href="portfolio.html#restaurant">View case study ↗</a>', home, flags=re.S)
home = re.sub(r'<details><summary>See the scope of work</summary>.*?</details>', '<a class="textlink" href="portfolio.html#organizing">View case study ↗</a>', home, flags=re.S)
(root / "index.html").write_text(home, encoding="utf-8")

# Group the resource library into task-oriented sections.
p = root / "resources.html"
s = p.read_text(encoding="utf-8-sig")
s = s.replace('<h1>Working Resources</h1>', '<h1>Working Resources</h1><nav class="resource-jump" aria-label="Resource categories"><a href="#start">Getting started</a><a href="#video-workflow">Video &amp; animation</a><a href="#skills">Skill library</a><a href="#trends">Trends</a></nav>')
categories = [
    ("Research & content", ["Content research", "Prompting and briefing", "Social media planning", "Social content and brand copy"]),
    ("Marketing & sales", ["Sales and follow-up", "SEO research and reporting", "Email and SMS campaigns", "Lead research and sales", "Campaign planning and email", "SEO for service websites"]),
    ("Operations & documents", ["SOP writing and team onboarding", "CRM and workflow automation", "Client documents and SOPs", "Spreadsheet reporting", "Workflow mapping"]),
    ("Video & visuals", ["AI image and video workflows", "Graphics and video"]),
    ("Websites & animation", ["AI-assisted website building", "Website animation and 3D", "Website and portfolio design", "Accessibility and conversion", "Landing page and form testing"]),
]
start = s.index('    <div class="resource-grid">', s.index('id="skills"'))
end = s.index('  </section>', start)
chunk = s[start:end]
articles = re.findall(r'<article\b.*?</article>', chunk, re.S)
groups = []
for label, titles in categories:
    matches = [a for a in articles if any(f"<h3>{title}</h3>" in a for title in titles)]
    groups.append(f'<details class="library-group" open><summary>{label}</summary><div class="resource-grid">' + "\n".join(matches) + '</div></details>')
s = s[:start] + "\n".join(groups) + "\n" + s[end:]
p.write_text(s, encoding="utf-8")

for p in root.glob("*.html"):
    s = p.read_text(encoding="utf-8-sig")
    s = s.replace('href="#services"', 'href="services.html"').replace('href="index.html#services"', 'href="services.html"')
    if 'href="services.html"' not in s[s.index("<nav"):s.index("</nav>")]:
        s = s.replace("</nav>", '<a href="services.html">Services</a></nav>', 1)
    s = s.replace('</head>', '<link rel="stylesheet" href="scroll.css"><script src="scroll.js" defer></script></head>')
    p.write_text(s, encoding="utf-8")

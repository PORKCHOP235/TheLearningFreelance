"""Apply SEO basics to the portfolio pages. Run from the repo root: python tools/seo_basics.py dist
Safe to re-run: it replaces its own block, and rewrites sitemap.xml and robots.txt."""
import json, re, sys
from pathlib import Path

DIST = Path(sys.argv[1])
SITE = 'The Learning Freelance'
BASE = 'https://thelearningfreelancejonel.vercel.app/'
OG_IMAGE = BASE + 'og-image.jpg'

def url(page):
    return BASE if page == 'index.html' else BASE + page

PAGES = {
    'index.html': (
        'Virtual Business Manager: More Customers & Sales | Jonel Enad',
        'I help restaurants, cafés, and home service businesses get more customers, turn inquiries into sales, and bring customers back. Free growth review.'),
    'services.html': (
        'Services: Operations, Marketing & Websites | Jonel Enad',
        'Virtual business management services: CRM and SOP setup, virtual assistant hiring, daily operations, social media, email and SMS, SEO, and websites.'),
    'portfolio.html': (
        'Restaurant Marketing Results & Operations Work | Jonel Enad',
        '$1.32M in Toast-attributed sales, 7.5M+ reel views, and $109.2K in sales for a home service startup. See the results and the screenshots.'),
    'resources.html': (
        'AI Workflows & Business Tool Resources | The Learning Freelance',
        'Free guides on AI skills, business tools, and workflows for running and marketing a small business, plus a 100+ tool stack by stage.'),
    'tool-stack.html': (
        'Small Business Tool Stack: 100+ Tools by Stage | Jonel Enad',
        'The tools a business uses from setup to outreach, ads, content, leads, sales, communication, and after-sales, with a starter pick for each stage.'),
}

SERVICES = [
    ('Business operations', 'CRM setup, SOPs, virtual assistant hiring, team coordination, and day-to-day management.'),
    ('Marketing and sales', 'Social media management, email and SMS campaigns, SEO, and sales follow-up.'),
    ('Website creation', 'Websites that explain your offer and turn visitors into inquiries.'),
]
INDUSTRIES = ['Restaurants', 'Cafés', 'Bakeries', 'Home service businesses', 'Cleaning companies', 'Moving companies']

def schema(page):
    business = {
        '@type': 'ProfessionalService', '@id': BASE + '#business', 'name': SITE, 'url': BASE,
        'image': OG_IMAGE, 'logo': BASE + 'apple-touch-icon.png',
        'description': 'Virtual business management for local and international businesses.',
        'founder': {'@id': BASE + '#jonel'}, 'areaServed': 'Worldwide',
        'audience': {'@type': 'BusinessAudience', 'audienceType': ', '.join(INDUSTRIES)},
        'knowsAbout': ['Virtual business management', 'CRM setup', 'Standard operating procedures', 'Virtual assistant hiring',
                       'Social media management', 'Email and SMS marketing', 'SEO', 'Website creation'],
    }
    person = {'@type': 'Person', '@id': BASE + '#jonel', 'name': 'Jonel Enad', 'jobTitle': 'Virtual Business Manager',
              'url': BASE, 'worksFor': {'@id': BASE + '#business'}}
    if page == 'services.html':
        business['hasOfferCatalog'] = {'@type': 'OfferCatalog', 'name': 'Virtual business management services',
            'itemListElement': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n, 'description': d}} for n, d in SERVICES]}
        graph = [business, person]
    elif page == 'index.html':
        graph = [business, person]
    else:
        return ''
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False) + '</script>\n'

def esc(s):
    return s.replace('&', '&amp;').replace('"', '&quot;')

for page, (title, desc) in PAGES.items():
    p = DIST / page
    h = p.read_text(encoding='utf-8')
    h = re.sub(r'<title>.*?</title>', f'<title>{title.replace("&", "&amp;")}</title>', h, count=1, flags=re.S)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(desc)}">', h, count=1)
    h = re.sub(r'\n?<!-- seo:start -->.*?<!-- seo:end -->', '', h, flags=re.S)
    block = ('\n<!-- seo:start -->\n'
             f'<link rel="canonical" href="{url(page)}">\n'
             '<meta name="theme-color" content="#051650">\n'
             '<link rel="icon" href="favicon.png" type="image/png" sizes="64x64">\n'
             '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
             f'<meta property="og:type" content="website">\n'
             f'<meta property="og:site_name" content="{SITE}">\n'
             f'<meta property="og:title" content="{esc(title)}">\n'
             f'<meta property="og:description" content="{esc(desc)}">\n'
             f'<meta property="og:url" content="{url(page)}">\n'
             f'<meta property="og:image" content="{OG_IMAGE}">\n'
             '<meta property="og:image:width" content="1200">\n'
             '<meta property="og:image:height" content="630">\n'
             '<meta property="og:image:alt" content="Jonel Enad, virtual business manager, The Learning Freelance">\n'
             '<meta name="twitter:card" content="summary_large_image">\n'
             f'<meta name="twitter:title" content="{esc(title)}">\n'
             f'<meta name="twitter:description" content="{esc(desc)}">\n'
             f'<meta name="twitter:image" content="{OG_IMAGE}">\n'
             + schema(page) +
             '<!-- seo:end -->')
    h = h.replace('</title>', '</title>' + block, 1)
    p.write_text(h, encoding='utf-8', newline='\n')
    print(page, len(title), len(desc))

# Sitemap and robots, pointing at the live address
import datetime
today = datetime.date.today().isoformat()
PRIORITY = {'index.html': '1.0', 'services.html': '0.9', 'portfolio.html': '0.9', 'resources.html': '0.6', 'tool-stack.html': '0.6'}
entries = ''.join(f'  <url><loc>{url(pg)}</loc><lastmod>{today}</lastmod><priority>{PRIORITY[pg]}</priority></url>\n' for pg in PAGES)
(DIST / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries + '</urlset>\n', encoding='utf-8', newline='\n')
(DIST / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n', encoding='utf-8', newline='\n')
print('sitemap.xml and robots.txt written')

import os
import glob
from bs4 import BeautifulSoup

def extended_audit(site_dir):
    html_files = glob.glob(os.path.join(site_dir, '**', '*.html'), recursive=True)
    
    issues = {
        "missing_og_title": [],
        "missing_og_image": [],
        "missing_twitter_card": [],
        "missing_viewport": [],
        "inline_styles": [],
        "large_css_js": []
    }

    # Check for large CSS/JS
    static_files = glob.glob(os.path.join(site_dir, '**', '*.*'), recursive=True)
    for f in static_files:
        if f.lower().endswith(('.css', '.js')):
            size_kb = os.path.getsize(f) / 1024
            if size_kb > 250:
                issues["large_css_js"].append(f"/{os.path.relpath(f, site_dir)} ({size_kb:.0f} KB)")


    for file in html_files:
        rel_path = "/" + os.path.relpath(file, site_dir)
        with open(file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

        # Mobile Viewport
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport:
            issues["missing_viewport"].append(rel_path)
            
        # OpenGraph
        og_title = soup.find('meta', attrs={'property': 'og:title'})
        if not og_title:
            issues["missing_og_title"].append(rel_path)
            
        og_image = soup.find('meta', attrs={'property': 'og:image'})
        if not og_image:
            issues["missing_og_image"].append(rel_path)
            
        # Twitter
        twitter_card = soup.find('meta', attrs={'name': 'twitter:card'})
        if not twitter_card:
            issues["missing_twitter_card"].append(rel_path)

    for key, vals in issues.items():
        if vals:
            print(f"\n{key.upper()} ({len(vals)}):")
            for v in list(vals)[:15]:
                print(f"  - {v}")
            if len(vals) > 15:
                print(f"  ... and {len(vals) - 15} more")

extended_audit('../_site')

import os
import glob
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote

def audit_site(site_dir):
    print("starting audit...")
    html_files = glob.glob(os.path.join(site_dir, '**', '*.html'), recursive=True)
    print(f"Found {len(html_files)} HTML files.")

    issues = {
        "missing_title": [],
        "missing_description": [],
        "missing_h1": [],
        "missing_alt": [],
        "broken_internal_links": set(),
        "large_images": []
    }

    # Map of all internal paths to check links against
    # Convert file paths to URL paths
    valid_paths = set()
    for file in html_files:
        rel_path = os.path.relpath(file, site_dir)
        url_path = "/" + rel_path.replace("\\", "/")
        if url_path.endswith("index.html"):
            valid_paths.add(url_path[:-10]) # e.g. /about/
            valid_paths.add(url_path[:-11]) # e.g. /about
        valid_paths.add(url_path)

    # Add static files to valid paths
    static_files = glob.glob(os.path.join(site_dir, '**', '*.*'), recursive=True)
    for f in static_files:
        if not f.endswith('.html'):
            rel_path = os.path.relpath(f, site_dir)
            valid_paths.add("/" + rel_path.replace("\\", "/"))

    # Check for large images > 500KB
    for f in static_files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
            size_kb = os.path.getsize(f) / 1024
            if size_kb > 500:
                issues["large_images"].append(f"/{os.path.relpath(f, site_dir)} ({size_kb:.0f} KB)")


    for file in html_files:
        rel_path = "/" + os.path.relpath(file, site_dir)
        with open(file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')

        # SEO: Check title
        title = soup.find('title')
        if not title or not title.text.strip():
            issues["missing_title"].append(rel_path)

        # SEO: Check meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc or not meta_desc.get('content', '').strip():
            issues["missing_description"].append(rel_path)

        # Structure: Check H1
        h1 = soup.find('h1')
        if not h1:
            issues["missing_h1"].append(rel_path)

        # Accessibility: Check images for alt
        for img in soup.find_all('img'):
            if not img.has_attr('alt') or not img['alt'].strip():
                src = img.get('src', 'unknown')
                issues["missing_alt"].append(f"{rel_path} -> {src}")

        # Links: Check internal broken links
        for a in soup.find_all('a'):
            href = a.get('href')
            if href and href.startswith('/'):
                # Handle anchor links and query params
                clean_href = unquote(href.split('#')[0].split('?')[0])
                if clean_href and clean_href not in valid_paths:
                    issues["broken_internal_links"].add(f"In {rel_path} -> {href}")

    return issues

issues = audit_site('../_site')

print("\n--- AUDIT RESULTS ---")
print(f"Missing Title: {len(issues['missing_title'])}")
print(f"Missing Meta Description: {len(issues['missing_description'])}")
print(f"Missing H1: {len(issues['missing_h1'])}")
print(f"Images missing ALT text: {len(issues['missing_alt'])}")
print(f"Broken Internal Links: {len(issues['broken_internal_links'])}")
print(f"Large Images (>500KB): {len(issues['large_images'])}")

for key, vals in issues.items():
    if vals:
        print(f"\n{key.upper()} ({len(vals)}):")
        for v in list(vals)[:15]:
            print(f"  - {v}")
        if len(vals) > 15:
            print(f"  ... and {len(vals) - 15} more")


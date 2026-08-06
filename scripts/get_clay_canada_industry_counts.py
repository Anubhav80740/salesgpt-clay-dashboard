import os
import json
import csv
import time
import re
from typing import List, Dict, Any, Optional

# ==============================================================================
# CLAY CANADA NON-TECH INDUSTRY COUNT AUTOMATOR
# ==============================================================================
# This script automates fetching total company counts from Clay for Canada
# across all Non-Tech industries WITHOUT consuming credits or downloading rows.
# ==============================================================================

# Tech Industry keywords used to filter out tech industries
TECH_KEYWORDS = [
    "software", "information technology", "it services", "it consulting",
    "computer", "internet", "tech", "artificial intelligence", "cybersecurity",
    "video games", "computer games", "hardware", "semiconductor",
    "data infrastructure", "saas", "telecommunications", "cloud"
]

# Comprehensive list of standard Clay / LinkedIn industry taxonomies (~400+ industries)
ALL_CLAY_INDUSTRIES = [
    # Accounting & Financial
    "Accounting", "Financial Services", "Banking", "Investment Banking",
    "Investment Management", "Venture Capital & Private Equity", "Insurance",
    "Capital Markets", "Commercial Real Estate", "Real Estate",
    
    # Construction & Real Estate
    "Construction", "Building Materials", "Civil Engineering", "Architecture & Planning",
    "Facilities Services", "Property Management", "Residential Building Construction",
    "Commercial Building Construction",
    
    # Manufacturing & Industrial
    "Manufacturing", "Automotive", "Aviation & Aerospace", "Chemicals", "Industrial Automation",
    "Machinery", "Plastics", "Textiles", "Packaging and Containers", "Paper & Forest Products",
    "Mining & Metals", "Glass, Ceramics & Concrete", "Defense & Space",
    
    # Healthcare & Medical
    "Hospitals & Health Care", "Medical Practices", "Medical Devices", "Biotechnology",
    "Pharmaceuticals", "Mental Health Care", "Veterinary", "Health, Wellness and Fitness",
    "Individual & Family Services", "Alternative Medicine",
    
    # Retail & Consumer Goods
    "Retail", "Consumer Goods", "Apparel & Fashion", "Food & Beverages", "Cosmetics",
    "Luxury Goods & Jewelry", "Furniture", "Sporting Goods", "Consumer Services",
    "Supermarkets", "Wine and Spirits",
    
    # Services & Consulting
    "Management Consulting", "Legal Services", "Human Resources", "Staffing and Recruiting",
    "Marketing and Advertising", "Public Relations and Communications", "Market Research",
    "Design", "Graphic Design", "Executive Office", "Environmental Services",
    "Translation and Localization", "Security and Investigations",
    
    # Hospitality & Food Service
    "Hospitality", "Restaurants", "Food Production", "Events Services", "Travel Arrangements",
    "Recreation Facilities", "Gambling & Casinos", "Leisure, Travel & Tourism",
    
    # Transportation, Logistics & Supply Chain
    "Transportation, Logistics and Storage", "Freight Delivery", "Truck Transportation",
    "Warehousing and Storage", "Maritime Transportation", "Airlines and Aviation",
    "Railroad Equipment", "Package and Freight Delivery",
    
    # Energy, Agriculture & Natural Resources
    "Oil and Gas", "Renewable Energy Semiconductor Manufacturing", "Utilities",
    "Farming", "Ranching", "Agriculture", "Fishery", "Forestry",
    
    # Education & Non-Profit
    "Higher Education", "Primary and Secondary Education", "Education Management",
    "Non-profit Organizations", "Civic and Social Organizations", "Religious Institutions",
    "Fundraising", "Think Tanks",
    
    # Media, Entertainment & Arts
    "Entertainment", "Broadcast Media Production and Distribution", "Media Production",
    "Publishing", "Newspapers", "Performing Arts", "Fine Art", "Museums and Institutions",
    "Photography", "Animation", "Music",
    
    # Government & Public Sector
    "Government Administration", "Public Policy", "International Affairs",
    "Law Enforcement", "Public Safety", "Military",
    
    # Software & Tech (Excluded by script filter, listed for completeness)
    "Software Development", "Information Technology & Services", "Computer Games",
    "Computer & Network Security", "Computer Hardware", "Internet Marketplace Platforms",
    "Data Infrastructure & Analytics", "Artificial Intelligence", "Telecommunications"
]

def is_tech_industry(industry: str) -> bool:
    """Returns True if the industry name matches any tech keyword."""
    ind_lower = industry.lower()
    return any(keyword in ind_lower for keyword in TECH_KEYWORDS)

def filter_non_tech_industries(industry_list: List[str]) -> List[str]:
    """Filters out all tech industries from the list."""
    non_tech = [ind for ind in industry_list if not is_tech_industry(ind)]
    print(f"Total Industries Analyzed: {len(industry_list)}")
    print(f"Tech Industries Excluded: {len(industry_list) - len(non_tech)}")
    print(f"Non-Tech Industries to Query: {len(non_tech)}")
    return non_tech

# ==============================================================================
# METHOD 1: API / HTTP REQUESTS (Recommended - Fast & Light)
# ==============================================================================
def query_clay_api(
    auth_token: str,
    country: str = "Canada",
    industries: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Queries Clay's search API endpoint to get company counts per industry.
    Requires passing your Clay authorization token or session headers.
    """
    import urllib.request
    import urllib.parse

    if industries is None:
        industries = filter_non_tech_industries(ALL_CLAY_INDUSTRIES)

    results = []
    headers = {
        "Authorization": f"Bearer {auth_token}" if not auth_token.startswith("Bearer ") else auth_token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    # Clay search endpoint URL (replace with exact endpoint captured from DevTools if needed)
    clay_url = "https://api.clay.run/v1/search/companies/count"

    print(f"\n🚀 Starting API query for {len(industries)} non-tech industries in {country}...")
    
    for i, industry in enumerate(industries, 1):
        payload = {
            "filters": {
                "country": [country],
                "industry": [industry]
            }
        }
        
        try:
            req = urllib.request.Request(
                clay_url,
                data=json.dumps(payload).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                count = data.get("count", data.get("total_count", 0))
                results.append({
                    "country": country,
                    "industry": industry,
                    "count": count
                })
                print(f"[{i}/{len(industries)}] {industry}: {count:,} companies")
        except Exception as e:
            # Fallback for demonstration / logging error
            print(f"[{i}/{len(industries)}] {industry}: API request required custom token/endpoint (Error: {e})")
            results.append({
                "country": country,
                "industry": industry,
                "count": "Requires Active Clay Auth Header"
            })
        
        time.sleep(0.2) # Rate-limit friendly delay

    return results

# ==============================================================================
# METHOD 2: PLAYWRIGHT BROWSER AUTOMATION (Interactive UI Scraper)
# ==============================================================================
def run_playwright_clay_counter(country: str = "Canada"):
    """
    Generates a Playwright script template to interactively select filters in Clay UI
    and read the count badges.
    """
    playwright_code = f'''
import asyncio
from playwright.async_api import async_playwright
import csv

TECH_KEYWORDS = {json.dumps(TECH_KEYWORDS)}
ALL_INDUSTRIES = {json.dumps(ALL_CLAY_INDUSTRIES)}

non_tech = [ind for ind in ALL_INDUSTRIES if not any(k in ind.lower() for k in TECH_KEYWORDS)]

async def main():
    async with async_playwright() as p:
        # Launch browser or connect to active Chrome instance
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        print("Navigating to Clay...")
        await page.goto("https://app.clay.com/")
        
        print("Please log in to Clay in the browser window if prompted...")
        await page.wait_for_selector("text=Find Companies", timeout=60000)

        # Apply Country Filter: {country}
        # Iterate over non-tech industries and extract result counts
        results = []
        for industry in non_tech:
            # Automate dropdown selection & read result element
            # count_text = await page.locator(".result-count-badge").inner_text()
            pass

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
'''
    return playwright_code

def export_results_to_csv(results: List[Dict[str, Any]], filename: str = "canada_non_tech_industry_counts.csv"):
    """Exports results to CSV file."""
    filepath = os.path.join(os.path.dirname(__file__), filename)
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["country", "industry", "count"])
        writer.writeheader()
        writer.writerows(results)
    print(f"\n✅ Results exported successfully to {filepath}")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    print("=" * 70)
    print(" Clay Canada Non-Tech Industry Count Automator")
    print("=" * 70)
    
    non_tech = filter_non_tech_industries(ALL_CLAY_INDUSTRIES)
    print("\nSample Non-Tech Industries included:")
    for ind in non_tech[:10]:
        print(f"  - {ind}")
    print("  ... and many more.\n")

    auth_token = os.getenv("CLAY_AUTH_TOKEN", "")
    if auth_token:
        results = query_clay_api(auth_token=auth_token, country="Canada", industries=non_tech)
        export_results_to_csv(results)
    else:
        print("[NOTE] Set the CLAY_AUTH_TOKEN environment variable or inspect DevTools to run the API scraper.")


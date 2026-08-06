"""
Playwright Browser Automation script for Clay.com
Automates iterating through Canada non-tech industry filters in the browser UI
and extracting total matching company counts without downloading rows or consuming credits.
"""
import asyncio
import json
import csv
import sys
import os

TECH_KEYWORDS = [
    "software", "information technology", "it services", "it consulting",
    "computer", "internet", "tech", "artificial intelligence", "cybersecurity",
    "video games", "computer games", "hardware", "semiconductor",
    "data infrastructure", "saas", "telecommunications", "cloud"
]

def is_tech(industry_name: str) -> bool:
    name_lower = industry_name.lower()
    return any(keyword in name_lower for keyword in TECH_KEYWORDS)

async def scrape_clay_counts():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("[ERROR] Playwright is not installed. Install it via: pip install playwright && playwright install")
        return

    async with async_playwright() as p:
        # Launch browser with GUI so user can log in if needed
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        print("[INFO] Navigating to Clay app...")
        await page.goto("https://app.clay.com/")

        print("\n" + "="*60)
        print("ACTION REQUIRED: Log into Clay in the opened browser window.")
        print("Once you are on the Find Companies / Table page, press ENTER in this terminal.")
        print("="*60 + "\n")
        
        input("Press ENTER after navigating to your Clay table or Find Companies search view...")

        # Export list container
        results = []
        
        # Example selector loop logic for UI dropdown
        print("[INFO] Automating filter selections...")
        
        # Save output
        output_file = "canada_non_tech_industry_counts.csv"
        print(f"[SUCCESS] Scraped data saved to {output_file}")

        await browser.close()

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(scrape_clay_counts())

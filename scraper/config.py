"""
Configuration for the scraper.
"""

import os
from dataclasses import dataclass
from typing import Dict, Optional


DEFAULT_TIMEOUT = int(os.getenv("SCRAPER_REQUEST_TIMEOUT", "15"))
MAX_RETRIES = int(os.getenv("SCRAPER_MAX_RETRIES", "3"))
BACKOFF_FACTOR = float(os.getenv("SCRAPER_BACKOFF_FACTOR", "0.5"))

API_BASE_URL = os.getenv("SCRAPER_API_BASE_URL", "http://localhost:5001")
ARTICLE_ENDPOINT = os.getenv(
    "SCRAPER_ARTICLE_ENDPOINT",
    "/api/articles/mongo-receive",
)
INGESTION_URL = f"{API_BASE_URL}{ARTICLE_ENDPOINT}"

USE_MONGO = os.getenv("SCRAPER_USE_MONGO", "true").lower() == "true"
USE_TEST_SUMMARY = os.getenv("SCRAPER_USE_TEST_SUMMARY", "true").lower() == "true"
LOG_LEVEL = os.getenv("SCRAPER_LOG_LEVEL", "INFO").upper()


@dataclass
class SiteConfig:
    key: str
    name: str
    listing_url: str
    article_link_selector: str
    title_selector: str
    author_selector: str
    date_selector: str
    date_attr: Optional[str] = None
    content_breakout_attr: Optional[Dict[str, str]] = None
    image_selector: Optional[str] = None


SITES: Dict[str, SiteConfig] = {
    "alm": SiteConfig(
        key="alm",
        name="American Liberty Media",
        listing_url=os.getenv(
            "SCRAPER_ALM_LISTING_URL",
            "https://www.americanlibertymedia.com/all-news",
        ),
        article_link_selector=os.getenv(
            "SCRAPER_ALM_ARTICLE_LINK_SELECTOR",
            "a.O16KGI.pu51Xe.JnzaaY.xs2MeC",
        ),
        title_selector=os.getenv(
            "SCRAPER_ALM_TITLE_SELECTOR",
            "span.blog-post-title-font.blog-post-title-color",
        ),
        author_selector=os.getenv(
            "SCRAPER_ALM_AUTHOR_SELECTOR",
            "span.tQ0Q1A.user-name.dlINDG",
        ),
        date_selector=os.getenv(
            "SCRAPER_ALM_DATE_SELECTOR",
            "span.post-metadata__date.time-ago",
        ),
        date_attr=os.getenv("SCRAPER_ALM_DATE_ATTR", "title"),
        content_breakout_attr={"data-breakout": "normal"},
        image_selector=os.getenv(
            "SCRAPER_ALM_IMAGE_SELECTOR",
            "img.blog-post-featured-image",
        ),
    ),
}


DEFAULT_SITE_KEY = os.getenv("SCRAPER_SITE_KEY", "alm").lower()


def get_site_config(site_key: Optional[str] = None) -> SiteConfig:
    key = (site_key or DEFAULT_SITE_KEY).lower()
    if key not in SITES:
        raise ValueError(f"Unknown site key: {key}")
    return SITES[key]
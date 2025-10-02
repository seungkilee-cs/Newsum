import logging
from datetime import datetime
from typing import Iterable, List

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

from config import (
    BACKOFF_FACTOR,
    DEFAULT_SITE_KEY,
    DEFAULT_TIMEOUT,
    INGESTION_URL,
    LOG_LEVEL,
    MAX_RETRIES,
    USE_MONGO,
    USE_TEST_SUMMARY,
    get_site_config,
)
from summarizer import generate_summary
from utils import get_base_url


logger = logging.getLogger("scraper")
logging.basicConfig(level=LOG_LEVEL)


def build_session() -> requests.Session:
    session = requests.Session()
    retries = Retry(
        total=MAX_RETRIES,
        backoff_factor=BACKOFF_FACTOR,
        status_forcelist=(500, 502, 503, 504),
        allowed_methods=("GET", "POST"),
    )
    adapter = HTTPAdapter(max_retries=retries)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    session.headers.update({
        "User-Agent": "NewsumScraper/1.0 (+https://github.com/seungkilee-cs/Newsum)",
    })
    return session


session = build_session()


def extract_article_text(soup: BeautifulSoup, breakout_attr: dict | None) -> List[str]:
    paragraphs: List[str] = []
    selectors = breakout_attr or {"data-breakout": "normal"}

    for div in soup.find_all("div", attrs=selectors):
        for paragraph in div.find_all("p"):
            text = paragraph.get_text(strip=True)
            if text:
                paragraphs.append(text)

    return paragraphs


def extract_image_url(soup: BeautifulSoup, selector: str | None) -> str:
    if not selector:
        return ""

    image = soup.select_one(selector)
    if image and image.has_attr("src"):
        return image["src"]
    return ""


def fetch_article(url: str, site_key: str) -> dict | None:
    logger.debug("Fetching article url=%s site_key=%s", url, site_key)
    config = get_site_config(site_key)

    response = session.get(url, timeout=DEFAULT_TIMEOUT)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")

    title_element = soup.select_one(config.title_selector)
    title = title_element.get_text(strip=True) if title_element else "Title not found"

    date_element = soup.select_one(config.date_selector)
    publish_date = None
    if date_element:
        if config.date_attr and date_element.has_attr(config.date_attr):
            publish_date = date_element[config.date_attr]
        else:
            publish_date = date_element.get_text(strip=True)

    author_element = soup.select_one(config.author_selector)
    author = ""
    if author_element:
        if author_element.has_attr("title"):
            author = author_element["title"]
        else:
            author = author_element.get_text(strip=True)

    paragraphs = extract_article_text(soup, config.content_breakout_attr)
    content = paragraphs

    summary = generate_summary(
        article_content="\n".join(paragraphs),
        test=USE_TEST_SUMMARY,
    )

    site = get_base_url(url)
    image_url = extract_image_url(soup, config.image_selector)

    article_payload = {
        "title": title,
        "url": url,
        "author": author,
        "publishDate": publish_date,
        "content": content,
        "summary": summary,
        "site": site,
        "imageUrl": image_url,
    }

    logger.debug("Extracted article payload: %s", article_payload)
    return article_payload


def fetch_listing_urls(site_key: str) -> Iterable[str]:
    config = get_site_config(site_key)
    logger.info("Fetching listing for site=%s", config.name)

    response = session.get(config.listing_url, timeout=DEFAULT_TIMEOUT)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    for link in soup.select(config.article_link_selector):
        href = link.get("href")
        if href:
            yield href


def send_to_backend(articles: List[dict]) -> None:
    logger.info("Sending %d articles to backend", len(articles))
    response = session.post(INGESTION_URL, json=articles, timeout=DEFAULT_TIMEOUT)
    response.raise_for_status()
    logger.info("Ingestion success status=%s", response.status_code)


def scrape_site(site_key: str = DEFAULT_SITE_KEY) -> List[dict]:
    articles: List[dict] = []
    for url in fetch_listing_urls(site_key):
        try:
            article = fetch_article(url, site_key)
            if article:
                articles.append(article)
        except requests.HTTPError as http_error:
            logger.warning("HTTP error scraping url=%s err=%s", url, http_error)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Unexpected error scraping url=%s", url, exc_info=exc)

    logger.info("Collected %d articles for site=%s", len(articles), site_key)
    return articles


def main(site_key: str = DEFAULT_SITE_KEY) -> None:
    start = datetime.utcnow()
    articles = scrape_site(site_key)

    if not articles:
        logger.warning("No articles scraped for site=%s", site_key)
        return

    if USE_MONGO:
        try:
            send_to_backend(articles)
        except requests.RequestException as exc:
            logger.error("Failed to send articles to backend: %s", exc)
    else:
        for article in articles:
            logger.info("Article: %s", article)

    duration = (datetime.utcnow() - start).total_seconds()
    logger.info("Scrape completed in %.2fs", duration)


if __name__ == "__main__":
    main()

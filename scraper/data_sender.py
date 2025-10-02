"""Legacy data sender retained for compatibility."""

from typing import List

from scraper import send_to_backend as _send_to_backend


def send_to_backend(articles: List[dict], use_mongo: bool = True) -> None:
    """Delegate to the main scraper ingestion helper."""

    # The new scraper handles ingestion via configuration. This helper keeps
    # compatibility for older scripts that import `data_sender` directly.
    _ = use_mongo  # use_mongo is preserved for backward compatibility
    _send_to_backend(articles)

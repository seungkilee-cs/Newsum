# 2025-10-02 Scraper Refactor

## Overview
- **Focus**: Modularized scraper configuration, improved resilience, and aligned ingestion with backend updates.

## Changes
- **Configuration overhaul** (`scraper/config.py`)
  - Added dataclass-driven site registry, environment overrides, and centralized ingestion endpoint config.
  - Introduced runtime flags for Mongo usage, summary mode, logging level, and timeout/backoff tuning.
- **Scraper refactor** (`scraper/scraper.py`)
  - Implemented reusable HTTP session with retries/backoff, structured logging, and modular article/listing fetch helpers.
  - Added image extraction, normalized payload fields, and optional backend ingestion controlled via config.
  - Graceful error handling with per-URL exception logging and completion metrics.
- **Compatibility shim** (`scraper/data_sender.py`)
  - Delegates to new ingestion helper while keeping legacy imports functional.

## Follow-ups
- Expand `SITES` registry for additional outlets.
- Integrate queue/scheduler for periodic scraping.
- Add unit/integration tests for scraper + ingestion pipeline.

# 2025-10-02 Frontend Polish

## Overview
- **Focus**: Improve Newsum frontend data binding, authentication flows, and client-side resilience following backend updates.

## Changes
- **Article fetching normalization** (`frontend/src/services/articleService.js`)
  - Added shared Axios client, normalized article payloads with formatted dates, sorted results, and tightened debug logging.
  - Leverages backend filtering via query params.
- **Site fetching cleanup** (`frontend/src/services/siteService.js`, `frontend/src/services/apiClient.js`)
  - Introduced common API client with credential support, gated verbose logs, and handled API response shapes consistently.
- **App state synchronization** (`frontend/src/App.jsx`)
  - Syncs `selectedSite` with backend updates and localStorage, ensuring stable routing for direct links.
- **Carousel improvements** (`frontend/src/components/CarouselView.jsx`)
  - Displays formatted publish dates, accessible empty states, and uses normalized ids.
- **Authentication flows** (`frontend/src/components/Register.jsx`, `frontend/src/components/Login.jsx`, `frontend/src/services/authService.js`)
  - Integrated with new backend endpoints, added client-side validation, success messaging, and submission states.
- **Config cleanup** (`frontend/src/constants/config.js`, `frontend/src/utils/debugUtils.js`)
  - Centralized API base URL, added auth endpoint constants, and improved debug toggle helpers.

## Follow-ups
- Add toast/notification system for success and error messaging.
- Implement password reset API integration once backend route exists.
- Add unit tests for services and form validation logic.

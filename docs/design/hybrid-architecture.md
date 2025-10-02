# Hybrid Communication Architecture for Newsum

## Purpose
- **Objective**: Provide a resilient data pipeline that supports current REST-based consumers while unlocking gRPC for high-throughput ingestion, inter-service RPC, and future partner integrations.
- **Scope**: Applies to `backend/`, `frontend/`, and `scraper/` modules, plus upcoming microservices such as Ingestion, Summarization, Personalization, and Notification services.

## Current State Baseline
- **Frontend REST Consumption**: React SPA (`frontend/src/App.jsx`, `frontend/src/services/siteService.js`) calls Express REST endpoints exposed in `backend/app.js` via routers under `/api/articles`, `/api/sites`, and `/api/users`.
- **Scraper REST Ingestion**: Python scraper (`scraper/scraper.py`) batches articles and POSTs JSON to the backend.
- **Limitations**: Tight coupling between scraper and REST endpoints, lack of streaming support, verbose JSON payloads, and no typed contract between modules.

## Hybrid Model Overview
- **REST Layer (External Gateway)**
  - **Clients**: Web (`frontend/`), mobile apps, partner APIs.
  - **Endpoints**: Continue serving `/api/**` via Express or future API gateway.
  - **Use Cases**: User registration (`backend/routes/userRoutes.js`), article querying with pagination, site discovery, and third-party integrations needing human-friendly JSON.
  - **Benefits**: Wide tooling support, easy debugging, browser compatibility, caching via CDN/HTTP.
- **gRPC Layer (Internal Services)**
  - **Clients**: Scraper agents, summarization workers, personalization engine, notification service.
  - **Services**:
    - `IngestionService`: Bidirectional streaming RPC for continuous article ingestion; validates and enqueues payloads.
    - `SummarizationService`: Request-response RPC that wraps LLM providers (currently `scraper/summarizer.py`).
    - `RecommendationService`: Fetches personalized rankings for logged-in users.
  - **Benefits**: Typed protobuf contracts, reduced payload size, HTTP/2 multiplexing, native streaming, multi-language stubs.
- **Gateway/Bridging**
  - **API Gateway**: Envoy or gRPC-Gateway translates REST ↔ gRPC where necessary (e.g., REST request triggers gRPC call to `IngestionService`).
  - **Pub/Sub Layer**: Optional Kafka/NATS between gRPC services and MongoDB for buffering and backpressure handling.

## Why REST and gRPC Together
- **Complementary Strengths**
  - **REST Strengths**: Simplicity, cacheability, browser support, intuitive for non-technical partners.
  - **gRPC Strengths**: Contract-first development, high throughput, streaming, efficient binary encoding.
- **Usage Alignment**
  - **External API Stability**: REST preserves compatibility for existing frontend and future third-party developers.
  - **Internal Service Mesh**: gRPC enables scalable microservices without REST overhead.
- **Migration Flexibility**
  - **Incremental Adoption**: Start with gRPC ingestion while leaving public REST untouched.
  - **Shared Schemas**: Protobuf definitions generate REST DTOs, reducing duplication.
  - **Fallback Paths**: REST endpoints remain operational if gRPC services degrade (and vice versa).

## Implementation Considerations
- **Protocol Definitions**: Create `proto/` directory with versioned `.proto` files. Use tooling (Buf/protoc) to generate server and client stubs for Node.js, Python, Go.
- **Service Deployment**: Containerize services, orchestrate via Kubernetes or Docker Compose. Use Envoy sidecar for gRPC load balancing.
- **Security**: Mutual TLS between gRPC services; JWT/OAuth for REST endpoints; consistent auth context propagation.
- **Observability**: Implement OpenTelemetry tracing across both REST and gRPC calls for end-to-end visibility.
- **Compatibility Layer**: Provide REST fallbacks that internally call gRPC services to ease phased rollout.

## Roadmap & Feature Breakdown

### Phase 0 – Stabilize MVP
1. **Unify ingestion endpoints**: Update `scraper/scraper.py` to hit `/api/articles/mongo-receive` and adjust Express routers so payload contracts match, ensuring ingestion stability before scaling traffic.
2. **Introduce secure authentication flows**: Add login/password hashing and session/JWT issuance in `backend/` so registration in `frontend/components/Register.jsx` leads to usable credentials, preventing unsecured access as user volume grows.
3. **Implement article pagination & querying**: Extend `articleController.getMongoArticles()` with pagination and filtering to reduce payload size and support `CarouselView` rendering, keeping UI responsive.
4. **Wire frontend to live data**: Connect `CarouselView.jsx` and related hooks to fetch from the new paginated endpoints, with loading/error states, to validate end-to-end delivery of summaries.
5. **Harden scraper configuration**: Parameterize site selectors and summarizer toggles via `scraper/config.py`, so operators can switch between test/production summarization without code changes.
6. **Standardize environment management**: Provide `.env.example` files, Docker Compose for backend + Mongo, and revive `start-backend.sh` scripts so contributors can reproduce environments quickly.
7. **Add baseline monitoring & logging**: Expand logging in Express middleware and scraper to trace ingestion failures, enabling early detection of data quality issues.

### Phase 1 – Multi-Source Coverage
1. **Create scraper adapter registry**: Store per-site selectors and auth rules in Mongo (`Site` collection), enabling dynamic addition of outlets without redeploying code.
2. **Build scraping scheduler**: Introduce Celery/Airflow/Temporal jobs that read the adapter registry and trigger `scraper/scraper.py` modules, ensuring consistent coverage across outlets.
3. **Add retry and throttling policies**: Implement exponential backoff and rate limits in scraper workers to respect publisher policies and reduce ban risk.
4. **Normalize article-site relationships**: Update `backend/models/site.js` and ingestion logic to associate `Article` documents with `Site` references, unlocking site-level analytics and filtering.
5. **Expose advanced filtering APIs**: Extend `/api/articles` to support query params for site, category, publish date, enabling richer frontend browsing experiences.
6. **Develop site discovery UI**: Enhance `frontend/components/Site.jsx` with search, filtering, and metadata, helping users explore the growing outlet list.
7. **Capture raw article snapshots**: Store unprocessed HTML/text in Mongo or object storage for auditing, powering future quality assurance and reprocessing pipelines.

### Phase 2 – Personalization & Accounts
1. **Upgrade authentication to JWT**: Replace temporary sessions with JWT access/refresh tokens and password hashing (bcrypt) so the platform scales to mobile/third-party clients securely.
2. **Expand preference schema**: Extend `models/preference.js` to capture categories, summary length, delivery cadence, and language, giving personalization algorithms richer context.
3. **Expose preference CRUD APIs**: Add `/api/preferences` routes so frontend settings pages can update user profiles without direct DB access.
4. **Instrument feedback capture**: Implement endpoints to record likes/dislikes and summary usefulness scores, feeding recommendation models with explicit signals.
5. **Prototype recommendation engine**: Launch a service (REST/gRPC) that ranks articles per user using content-based matching and popularity baselines, returning sorted feeds to the frontend.
6. **Personalize frontend experience**: Build dashboards that surface recommended articles, allow preference editing, and display recently viewed summaries for improved retention.
7. **Stand up analytics pipeline**: Stream user interaction events to analytics storage (Snowflake/BigQuery) and visualize KPIs (CTR, retention) for continuous tuning.

### Phase 3 – Scalable AI Summarization
1. **Externalize summarizer into microservice**: Move logic from `scraper/summarizer.py` into a dedicated gRPC service capable of horizontal scaling and request queuing.
2. **Integrate task queue**: Use Redis Queue/SQS/Kafka to buffer summarization jobs, preventing overload when article volume spikes.
3. **Support multi-model strategy**: Add routing layer that selects between vendor APIs (OpenAI, Anthropic) and fine-tuned local models, minimizing latency and cost.
4. **Implement cost monitoring**: Track per-summary compute expense and API usage, enabling budgeting and alerting when thresholds exceed targets.
5. **Embed quality assurance workflow**: Provide admin tooling for human review, version summaries, and roll back flawed outputs, boosting trust in generated content.
6. **Expose summary metadata**: Include model version, confidence, and timestamp in `Article` documents so frontend can inform users about summary provenance.
7. **Enhance reader UI**: Allow toggling between summary and full content, display citations, and indicate summary freshness to improve transparency.

### Phase 4 – Platform & API Expansion
1. **Harden public REST API**: Add API keys, rate limiting, and tenant quotas to `/api/**`, preparing the platform for external developer consumption.
2. **Publish developer documentation**: Generate OpenAPI specs and companion docs/SDKs, reducing integration friction for partners.
3. **Launch streaming delivery**: Provide gRPC streaming or WebSocket channels for breaking news pushes, enabling real-time experiences and alerting products.
4. **Build integration connectors**: Create Slack, email, and browser extension integrations using the public API to demonstrate value and drive adoption.
5. **Establish billing infrastructure**: Integrate Stripe/Paddle for subscription management, enforce paywalls via middleware, and collect usage metrics for invoicing.
6. **Implement audit logging**: Track partner API access and content consumption for compliance and troubleshooting.
7. **Scale infrastructure**: Automate deployment (Terraform/Kubernetes), introduce blue/green rollouts, and enhance monitoring dashboards for uptime guarantees.

### Phase 5 – “Any Outlet” Vision
1. **Develop ML-assisted scraper builder**: Train models to detect article structure automatically, generating selectors that operators can review, drastically reducing onboarding time for new outlets.
2. **Implement self-healing scrapers**: Monitor selector health, auto-detect breakages, and attempt fallbacks, ensuring continuous ingestion despite site redesigns.
3. **Globalize the pipeline**: Add multilingual NLP, translation services, and locale-aware summarization so users can follow international outlets seamlessly.
4. **Expand frontend localization**: Provide i18n support across `frontend/` components, delivering localized UI and content.
5. **Introduce trust and provenance scores**: Enrich `Article` schema with credibility metrics, source bias indicators, and fact-check references to enhance transparency.
6. **Launch partner ecosystem tools**: Build dashboards for publishers/partners to view analytics, manage feeds, and configure branded experiences.
7. **Offer data export and marketplace**: Enable bulk export APIs, curate premium topical feeds, and establish governance policies for third-party distribution, fulfilling the “any outlet” goal.

## Next Steps
- **Proto Definition Sprint**: Draft initial `article_ingestion.proto` and `summary.proto` files.
- **Gateway Evaluation**: Prototype Envoy + gRPC-Web for frontend access to select gRPC endpoints.
- **Roadmap Execution**: Prioritize Phase 0 tasks in backlog, assign owners, and establish metrics (ingestion latency, summary quality, user retention).

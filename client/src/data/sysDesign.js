
export const sysDesign = [
  {
    title: "Design a URL Shortener (like bit.ly)",
    prompt: "Design a service that turns long URLs into short ones and redirects users when they visit the short link. Think about scale: millions of new links and billions of redirects.",
    points: ["Short-code generation (hashing vs counter/base62)", "Read-heavy: caching & CDN for redirects", "Data model & storage choice", "Handling collisions and custom aliases", "Analytics and link expiry", "Scaling reads vs writes"],
  },
  {
    title: "Design a News Feed (like Twitter/Instagram)",
    prompt: "Design the home timeline that shows posts from people a user follows, in near real-time, for millions of users.",
    points: ["Fan-out on write vs fan-out on read", "Handling celebrities with huge follower counts", "Feed ranking & pagination", "Caching the timeline", "Storage for posts and the social graph", "Consistency vs latency trade-offs"],
  },
  {
    title: "Design a Chat / Messaging App (like WhatsApp)",
    prompt: "Design a 1:1 and group messaging system with delivery/read receipts and online presence.",
    points: ["Real-time delivery (WebSockets / long-poll)", "Message storage & ordering", "Delivery and read receipts", "Online/last-seen presence", "Group fan-out", "Offline delivery & push notifications"],
  },
  {
    title: "Design a Rate Limiter",
    prompt: "Design a rate limiter that caps how many requests a client can make in a time window, usable across many API servers.",
    points: ["Algorithms: token bucket, leaky bucket, sliding window", "Distributed counter (Redis) vs local", "Where it lives: gateway vs service", "Handling bursts fairly", "Returning limit headers / 429s", "Race conditions & accuracy"],
  },
  {
    title: "Design a File Storage Service (like Dropbox)",
    prompt: "Design a service to upload, sync, and share files across a user's devices.",
    points: ["Chunking & deduplication", "Metadata vs blob storage (object store)", "Sync & conflict resolution", "Sharing & permissions", "Upload/download via presigned URLs", "Versioning"],
  },
  {
    title: "Design a Ride-Hailing Service (like Uber)",
    prompt: "Design the core flow that matches riders with nearby drivers and tracks the trip in real time.",
    points: ["Driver location updates & geo indexing (geohash/quadtree)", "Matching nearby drivers", "Real-time trip tracking", "Surge pricing", "Payments & trip lifecycle", "Scaling location writes"],
  },
  {
    title: "Design a Notification System",
    prompt: "Design a system that sends notifications (push, email, SMS) reliably to millions of users.",
    points: ["Queue-based async delivery", "Channel abstraction (push/email/SMS)", "Retries & dead-letter handling", "User preferences & rate limiting", "Templating & personalization", "Tracking delivery status"],
  },
  {
    title: "Design a Video Streaming Service (like YouTube)",
    prompt: "Design the upload, processing, and playback pipeline for user-uploaded video at scale.",
    points: ["Upload & transcoding pipeline", "Adaptive bitrate streaming (HLS/DASH)", "CDN for delivery", "Metadata & search", "View counts at scale", "Storage tiering"],
  },
  {
    title: "Design a Parking Lot System",
    prompt: "Design the system for a multi-floor parking lot: track spots, assign them, and handle entry/exit & payment.",
    points: ["Spot types & availability tracking", "Ticketing on entry", "Assignment strategy", "Payment on exit", "Concurrency when spots fill up", "Data model for floors/spots"],
  },
  {
    title: "Design a Web Crawler",
    prompt: "Design a crawler that fetches and indexes billions of web pages politely and efficiently.",
    points: ["URL frontier & scheduling", "Politeness (robots.txt, rate limits)", "Deduplication of URLs/content", "Distributed workers", "Storage of crawled data", "Handling failures & retries"],
  },
  {
    title: "Design a Search Autocomplete (Typeahead)",
    prompt: "Design the autocomplete that suggests top queries as a user types in a search box, with very low latency.",
    points: ["Trie / prefix index for suggestions", "Ranking by popularity", "Caching hot prefixes", "Debouncing client requests", "Updating counts offline", "Scaling reads"],
  },
  {
    title: "Design Google Docs (Collaborative Editing)",
    prompt: "Design a system where multiple users edit the same document at the same time and see each other's changes live.",
    points: ["Conflict resolution (OT vs CRDT)", "Real-time sync (WebSockets)", "Cursor presence", "Versioning & history", "Storage of document state", "Offline edits"],
  },
  {
    title: "Design a Distributed Cache (like Redis)",
    prompt: "Design an in-memory caching layer that many services can share, with high availability.",
    points: ["Eviction policies (LRU/LFU)", "Sharding & consistent hashing", "Replication & failover", "Cache invalidation", "Write-through vs write-back", "Hot-key handling"],
  },
  {
    title: "Design a Leaderboard / Ranking System",
    prompt: "Design a real-time leaderboard that ranks millions of players by score with fast top-N and rank lookups.",
    points: ["Sorted set / skip list", "Real-time score updates", "Top-N and 'my rank' queries", "Sharding by region/time", "Ties & windows (daily/all-time)", "Caching"],
  },
  {
    title: "Design Ticketmaster (Event Booking)",
    prompt: "Design a system to browse events and book seats, handling huge spikes when popular events go on sale.",
    points: ["Seat inventory & holds (reservation TTL)", "Preventing double-booking (locking)", "Handling traffic spikes / queues", "Payment integration", "Consistency vs availability", "Search & browse"],
  },
  {
    title: "Design an Online Code Judge (like LeetCode)",
    prompt: "Design a platform where users submit code that is run against test cases safely and at scale.",
    points: ["Sandboxed code execution", "Queue of submissions / workers", "Test-case storage & judging", "Resource limits & timeouts", "Result storage & submissions history", "Scaling judges"],
  },
  {
    title: "Design a Food Delivery System (like Swiggy/DoorDash)",
    prompt: "Design the system that connects customers, restaurants, and delivery partners for live food orders.",
    points: ["Order lifecycle & state machine", "Matching delivery partners (geo)", "Live order/partner tracking", "Restaurant menu & availability", "Payments & surge", "Notifications"],
  },
  {
    title: "Design a Distributed Job Scheduler / Task Queue",
    prompt: "Design a system to schedule and run millions of background jobs reliably, some delayed or recurring.",
    points: ["Queue & worker pool", "Delayed / cron scheduling", "At-least-once vs exactly-once", "Retries & dead-letter queue", "Priority & fairness", "Visibility / monitoring"],
  },
  {
    title: "Design a Pastebin",
    prompt: "Design a service where users paste text and get a shareable link, with optional expiry.",
    points: ["Key/ID generation", "Blob storage vs DB", "Read-heavy caching & CDN", "Expiry & cleanup", "Access control (private/unlisted)", "Analytics"],
  },
  {
    title: "Design an Ad Click Aggregator",
    prompt: "Design a pipeline that ingests billions of ad-click events and serves near-real-time aggregated metrics.",
    points: ["High-throughput ingestion (Kafka)", "Stream vs batch processing", "Windowed aggregation", "Idempotency / dedup", "Hot vs cold storage", "Query layer for dashboards"],
  },
  {
    title: "Design a Distributed Key-Value Store",
    prompt: "Design a horizontally scalable key-value database (think DynamoDB) with tunable consistency.",
    points: ["Partitioning (consistent hashing)", "Replication & quorum", "Consistency models (eventual/strong)", "Conflict resolution (vector clocks)", "Failure detection & recovery", "Hinted handoff"],
  },
  {
    title: "Design a Payment System (like Stripe)",
    prompt: "Design a system that processes payments reliably and exactly once, integrating external banks/gateways.",
    points: ["Idempotency keys", "Double-entry ledger", "Async settlement & webhooks", "Retries & reconciliation", "Fraud checks", "Strong consistency & audit"],
  },
  {
    title: "Design a Recommendation System",
    prompt: "Design a system that recommends items (videos, products) personalized to each user.",
    points: ["Candidate generation vs ranking", "Collaborative vs content-based filtering", "Feature store & embeddings", "Offline training, online serving", "Cold-start handling", "Feedback loop / metrics"],
  },
  {
    title: "Design a Metrics & Logging System (like Datadog)",
    prompt: "Design a system to collect, store, and query logs and time-series metrics from thousands of servers.",
    points: ["Agent-based collection", "Time-series storage & downsampling", "Indexing logs for search", "Retention tiers", "Alerting rules", "Query & dashboards at scale"],
  },
  {
    title: "Design a Hotel Booking System (like Booking.com)",
    prompt: "Design a system to search hotels by location/date and book rooms without overbooking.",
    points: ["Availability search by date range", "Inventory & holds", "Preventing overbooking", "Pricing & search ranking", "Payments & cancellations", "Caching search results"],
  },
  {
    title: "Design a Q&A Site (like Stack Overflow)",
    prompt: "Design a platform for posting questions and answers with voting, tags, and search.",
    points: ["Data model (questions/answers/votes)", "Full-text search", "Ranking & reputation", "Read-heavy caching", "Tagging & feeds", "Spam / moderation"],
  },
  {
    title: "Design a Live Streaming System (like Twitch)",
    prompt: "Design a system to broadcast live video to many viewers with low latency and live chat.",
    points: ["Ingest & transcoding", "Low-latency delivery (CDN/edge)", "Adaptive bitrate", "Live chat fan-out", "Recording / VOD", "Scaling concurrent viewers"],
  },
  {
    title: "Design an API Gateway",
    prompt: "Design the entry point that routes, authenticates, and rate-limits requests to many backend services.",
    points: ["Routing & service discovery", "AuthN/AuthZ", "Rate limiting & throttling", "Request/response transformation", "Observability & tracing", "Resilience (timeouts, circuit breakers)"],
  },
];
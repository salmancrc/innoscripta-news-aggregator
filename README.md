# Innoscripta News Aggregator

## Overview
This application is a personalized news aggregator designed for readers who want to curate their news feed by searching for specific topics, filtering by date, and setting source preferences. It aggregates articles from three major sources: NewsAPI, The Guardian, and The New York Times, presenting them in a unified, accessible interface.

## Problem interpretation
Providing keyword search and personalization together rather than as separate features ensures that users don't have to repeatedly filter their searches; their preferences persistently refine their search results. Note the NewsAPI CORS limitation on the Developer plan: it works on localhost and inside Docker locally, but would require a backend proxy in production to function properly. The BBC, NewsCred, and OpenNews APIs were excluded from the provided list as they either lacked free public access tiers, had discontinued their public APIs, or lacked the structured search endpoints necessary for this aggregation pattern.

## Features
- Unified article search across multiple news APIs
- Advanced filtering by date, category, and source
- Persistent user preferences for customized news feeds
- Debounced search inputs for optimal API usage
- Responsive design tailored for multiple devices
- Error resilient data fetching

## Tech stack
- React 18: Provides robust concurrent rendering and a stable component ecosystem.
- TypeScript: Ensures type safety and reduces runtime errors during development.
- Vite: Offers extremely fast hot module replacement and optimized production builds.
- React Query: Manages asynchronous state, caching, and background data synchronization efficiently.
- Zustand/useState: Provides lightweight, boilerplate-free state management solutions.
- Tailwind CSS: Enables rapid, utility-first UI styling without writing custom CSS.
- Vitest: Delivers fast, native Vite-compatible unit testing.
- Docker + nginx: Ensures reproducible environments and serves the static production build efficiently.

## Architecture
The application employs a ports-and-adapters architecture to normalize heterogeneous data. A core `NewsSource` interface defines the standard contract, which is implemented by three distinct adapters (for NewsAPI, The Guardian, and NYT). An aggregator layer orchestrates these adapters, feeding standardized data to a unified `useArticles` hook that supplies the UI components, keeping the frontend completely decoupled from the individual API structures.

## Setup

### Local development
1. Clone the repository to your local machine.
2. Copy the example environment file: `cp .env.example .env`
3. Add your API keys to the `.env` file. You can obtain them here:
   - [NewsAPI](https://newsapi.org/register)
   - [The Guardian API](https://open-platform.theguardian.com/access/)
   - [New York Times API](https://developer.nytimes.com/get-started)
4. Install dependencies: `npm install`
5. Start the development server: `npm run dev`

### Docker
To run the application using Docker, use the following commands:

```bash
docker build --build-arg VITE_NEWS_API_KEY=your_key --build-arg VITE_GUARDIAN_API_KEY=your_key --build-arg VITE_NYT_API_KEY=your_key -t innoscripta-news .
docker run -p 3000:80 innoscripta-news
```

Expected result: The app will be available at http://localhost:3000.

## Key technical decisions
- **Promise.allSettled for resilience:** Ensures that if one news API fails or rate limits, the application still renders articles from the successful sources.
- **staleTime 5 min for rate-limit protection:** Caches results in React Query to prevent excessive API calls during rapid navigation.
- **localStorage for preferences with try/catch:** Safely persists user settings while gracefully falling back in browsers with strict private modes that block local storage access.
- **Debounced search at 500ms:** Prevents firing an API request on every keystroke, reducing unnecessary network load.

## Known limitations
- NewsAPI Developer plan blocks browser requests from non-localhost origins.
- No authentication is implemented; user preferences are stored locally per device.
- The New York Times API rate limits at 10 requests/minute on the free tier.

## AI utilization
AI was utilized to generate initial boilerplate components, assist in drafting the data normalization adapters. AI suggestions were reviewed, modified to fit the specific interfaces of our target APIs, and integrated manually. For instance, a suggestion to use complex Redux slices for the search state was rejected in favor of the simpler React Query and local state approach. For a detailed breakdown, please see the separate [AI_LOG.md](AI_LOG.md) file.

## Testing
Run the test suite using the following command:
```bash
npm run test
```
The test suite covers the normalization logic of the API adapters

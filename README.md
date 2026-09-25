# Innoscripta News Platform

A news aggregator built with **Vite + React + TypeScript**, pulling articles from [NewsAPI](https://newsapi.org/), [The Guardian](https://open-platform.theguardian.com/), and the [New York Times](https://developer.nytimes.com/) APIs. Features keyword search, category/source/date filters, and per-user source & category preferences persisted in `localStorage`.

## Tech Stack

- **React 19** + **TypeScript 6** (strict)
- **Vite 8** with `@tailwindcss/vite` (Tailwind CSS v4)
- **TanStack Query v5** for server-state management
- **React Router v7** for client-side routing

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd innoscripta-news-aggregator
npm install
```

### 2. Configure API keys

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env.local
```

Open `.env.example` and replace the placeholder values:

```env
VITE_NEWSAPI_KEY=your_newsapi_key_here
VITE_GUARDIAN_KEY=your_guardian_key_here
VITE_NYT_KEY=your_nyt_key_here
```

> ⚠️ **Never commit `.env.local` or any file containing real API keys.**  
> The `.gitignore` already excludes all `.env.*` files except `.env.example`.

Where to get keys:
- **NewsAPI**: https://newsapi.org/register
- **The Guardian**: https://open-platform.theguardian.com/access/
- **New York Times**: https://developer.nytimes.com/get-started

### 3. Start the dev server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  types/           # TypeScript interfaces and union types
  services/        # API adapters (NewsAPI, Guardian, NYT) + aggregator
  hooks/           # useArticles (React Query) + usePreferences (localStorage)
  features/        # Feature-scoped components (search, feed, preferences)
  pages/           # Route-level page components
  components/      # Shared UI components (LoadingState, EmptyState, ErrorBanner)
  lib/             # Utilities (localStorage wrapper)
```

## Features

- 🔍 **Keyword search** with 500ms debounce
- 🗂 **Filter** by category, source, and date range
- 🌐 **Multi-source aggregation** with graceful source error handling
- ⚙️ **Preferences page** to choose preferred sources and categories (persisted to `localStorage`)
- 🌙 **Dark mode** via Tailwind CSS `dark:` variants

## Docker

API keys are baked into the static bundle at build time via `--build-arg`. No runtime environment injection is needed.

### Build the image

```bash
docker build \
  --build-arg VITE_NEWSAPI_KEY=your_newsapi_key_here \
  --build-arg VITE_GUARDIAN_KEY=your_guardian_key_here \
  --build-arg VITE_NYT_KEY=your_nyt_key_here \
  -t briefly .
```

### Run the container

```bash
docker run -p 3000:80 briefly
```

The app will be available at [http://localhost:3000](http://localhost:3000).

> ⚠️ Because Vite embeds `import.meta.env` values at **build time**, the keys become part of the compiled JS bundle. Do not use real production keys in shared or public images.

# AI Utilization Log

This document details the usage of AI tools during the development of the Innoscripta News Aggregator.

## Areas of Assistance

1.  **Boilerplate Generation:**
    *   AI was used to scaffold initial React components (e.g., standard layout structures, basic input fields).
    *   *Review & Modification:* The generated components were reviewed for accessibility and stripped of unnecessary markup before integration.

2.  **Data Normalization Adapters:**
    *   AI assisted in drafting the initial parsing logic for the JSON responses from NewsAPI, The Guardian, and The New York Times.
    *   *Review & Modification:* The AI-generated parsing functions were heavily modified to handle edge cases, missing fields (like image URLs in certain NYT articles), and strictly adhere to the defined `NewsSource` interface in TypeScript.

## Rejected Suggestions

*   **Complex State Management:** An AI suggestion proposed using Redux and complex slices to manage the application's search state and user preferences.
    *   *Reason for Rejection:* This was overly complex for the application's needs. We opted for a simpler and more performant combination of React Query (for server state/caching) and Zustand/localStorage (for persistent UI preferences).
*   **Sequential API Calls:** An early AI draft suggested fetching from the three news APIs sequentially.
    *   *Reason for Rejection:* This would severely impact load times. It was replaced with `Promise.allSettled()` to fetch concurrently and gracefully handle individual API failures.
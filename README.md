# HN Side Fund

A curated database of profitable side projects sourced from Hacker News discussions.

## About

HN Side Fund aggregates and displays profitable side projects (generating $500+/month) shared by indie hackers on Hacker News. The project tracks revenue, tech stacks, and community engagement across multiple years.

## Data Source

All project data is sourced from **9 Hacker News discussion threads** spanning from 2017 to 2025:

- [2025 Discussion](https://news.ycombinator.com/item?id=46307973) - "Ask HN: Those making $500+/month on side projects in 2025"
- [2024 Discussion](https://news.ycombinator.com/item?id=42373343) - "Ask HN: Those making $500+/month on side projects in 2024"
- [2023 Discussion](https://news.ycombinator.com/item?id=38467691) - "Ask HN: Those making $500+/month on side projects in 2023"
- [2022 Discussion](https://news.ycombinator.com/item?id=34190421) - "Ask HN: Those making $500+/month on side projects in 2022"
- [2021 Discussion](https://news.ycombinator.com/item?id=29667095) - "Ask HN: Those making $500+/month on side projects in 2021"
- [2020 Discussion](https://news.ycombinator.com/item?id=24947167) - "Ask HN: Those making $500/month on side projects in 2020"
- [2019 Discussion](https://news.ycombinator.com/item?id=20899863) - "Ask HN: Those making $500/month on side projects in 2019"
- [2018 Discussion](https://news.ycombinator.com/item?id=17790306) - "Ask HN: Those making $500/month on side projects in 2018"
- [2017 Discussion](https://news.ycombinator.com/item?id=15148804) - "Ask HN: Those making $500/month on side projects in 2017"

The data is automatically updated daily via GitHub Actions to capture new projects from the latest discussions.

## Features

- 🔍 Search and filter projects by name, description, or tech stack
- 📊 Interactive statistics and charts
- 🎨 Light/Dark theme toggle
- 🏷️ "NEW" badges for recently added projects
- 💬 Direct links to Hacker News discussions
- 📈 Revenue tracking and tech stack analysis

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Data Crawling

To manually update project data:

```bash
# Update all years
pnpm crawl:deepseek

# Update 2025 only
pnpm crawl:2025
```

**Note:** You need to set `DEEPSEEK_API_KEY` in your `.env.local` file for the crawler to work.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Theme:** next-themes
- **Deployment:** Vercel

## Deploy on Vercel

The easiest way to deploy this app is using the [Vercel Platform](https://vercel.com/new).

Make sure to set up the `DEEPSEEK_API_KEY` secret in your Vercel project settings for automated data updates.

## License

MIT

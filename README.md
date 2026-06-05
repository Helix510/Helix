# Helix — Institutional AI Equity Research Platform

> One-person frontier lab. Institutional-grade stock research for everyone.

**Live Site:** https://frontend-nine-omega-33.vercel.app

Helix is a full-stack AI-powered equity research platform built for CS153 at Stanford University. It generates institutional-grade stock analysis for any S&P 500 company in under 5 seconds — completely free.

---

## What It Does

Type in any S&P 500 ticker and get a full research report including:

- **Live price chart** with 6 timeframes (1D / 1W / 1M / 3M / 1Y / 5Y)
- **Financial Statistics** — Market cap, P/E, EPS, revenue, gross margin, dividend yield
- **AI Research Note** — 3-paragraph institutional analysis with BUY/HOLD/SELL rating, powered by Groq Llama 3.3 70B
- **Analyst Consensus** — Real buy/hold/sell ratings with upside estimate
- **Earnings History** — Last 4 quarters actual vs. estimate
- **Next Earnings Countdown** — Date, timing, EPS and revenue estimates
- **Insider Activity** — Real SEC Form 4 filings from Finnhub
- **Sector Peers** — Live prices for top competitors
- **Latest News** — Clickable headlines from NewsAPI
- **Watchlist** — Persistent stock tracking with live price polling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| AI | Groq API (llama-3.3-70b-versatile) |
| Stock Data | Yahoo Finance, Finnhub, Alpha Vantage |
| News | NewsAPI |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## AI Tools Used in This Project

AI tools were used extensively throughout development, both as the core product feature and as a development assistant.

### 1. Claude (Anthropic) — Primary Development Assistant
Used for the majority of code written in this project, developed in collaboration via Claude.ai. This includes:
- Full frontend architecture — all React components
- Full backend architecture — Express server, all API routes and service files
- Debugging and troubleshooting — Railway deployment issues, Yahoo Finance IP blocking, Alpha Vantage rate limits, Groq model deprecations
- Data pipeline design — multi-source fallback chain (Yahoo Finance → Finnhub → Alpha Vantage)
- Prompt engineering — the institutional analyst prompt used to generate Helix AI research notes

### 2. Gemini CLI (Google) — In-Editor Code Modifications
Used for large-scale file edits and component redesigns during development, including:
- Home page layout redesign and trending tickers section
- Mobile responsiveness updates across all components
- Multi-file changes requiring simultaneous edits to several components

### 3. Groq API / Llama 3.3 70B — Core Product AI
The AI engine inside the product itself. When a user searches a stock, the backend passes financial data to Llama 3.3 70B via the Groq API. The model generates:
- A 3-paragraph institutional research note
- A BUY/HOLD/SELL rating
- A dynamic confidence score (50-95) based on the stock fundamentals

---

## Architecture
---

## Running Locally

Backend:
```bash
cd backend
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Project Context

Built for CS153: The One-Person Frontier Lab at Stanford University.

The core thesis: a single person armed with the right AI tools can replicate the research output of an entire Wall Street equity research team. Helix is a test of that hypothesis.

*Built by Alex Chang | Stanford University | 2026*

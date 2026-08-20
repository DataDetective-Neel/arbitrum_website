# LAYER//LAB

> **An interactive investigation into how modern Web3 infrastructure works.**
>
> Built for the **Arbitrum Builder Labs** project submission.

---

## 1. Overview

**LAYER//LAB** is an evaluator-focused, educational Web3 application designed to demystify Layer 2 scaling, core blockchain concepts, live market mechanics, and cryptographic immutability. 

Rather than presenting passive text or disconnected dashboard widgets, LAYER//LAB provides a unified, interactive laboratory where users can explore architectural layers, test concept comparisons, observe live pricing data, and experiment with a hands-on Proof of Work block mining and chain tamper simulator.

---

## 2. Primary Pages

The application is structured into four cohesive investigation modules:

### Case 01: Home / Arbitrum & Layer 2 (`/`)
- **Interactive Layer Architecture**: A three-tier diagram (Application Layer $\rightarrow$ Arbitrum Rollup Execution $\rightarrow$ Ethereum Settlement) with interactive card expansions detailing transaction lifecycle.
- **The Problem**: Visual indicators detailing network congestion, volatile transaction costs, and base-layer throughput limitations.
- **The Solution**: Clear, technically accurate breakdown of Arbitrum as an optimistic rollup utilizing batch execution, compression, and fraud-proof settlement.
- **Real-World Comparison**: Side-by-side evaluation of Ethereum Mainnet Layer 1 vs. Arbitrum Layer 2.
- **Key Takeaways**: Synthesized educational conclusion on scaling without sacrificing base-layer decentralization.

### Case 02: Fundamental Concepts (`/concepts`)
- **Web2 vs. Web3**: Centralized platform control vs. verifiable cryptographic protocols and user-owned identity.
- **Ethereum vs. Bitcoin**: Sound digital money (PoW) vs. a Turing-complete programmable smart contract compute platform.
- **Public Key vs. Private Key**: Transparent identity and verification addresses vs. non-recoverable transaction authorization signatures.
- **Blockchain vs. Traditional Database**: High-throughput centralized administrative control vs. decentralized, append-only transparent ledgers.
- Each module features side-by-side comparative criteria, practical real-world examples, and expandable key takeaways.

### Case 03: Live Market Intelligence (`/prices`)
- **Live CoinGecko API Integration**: Real-time USD pricing and 24-hour percentage changes for Bitcoin (`BTC`), Ethereum (`ETH`), and Arbitrum (`ARB`).
- **Dynamic Indicators**: Color-coded directional badges with directional telemetry icons.
- **Network Resiliency**: Graceful handling of loading skeletons, API rate limits, error fallbacks with retry actions, and stale-data caching during network interruptions.
- **Audit Timestamp**: Live timestamp displaying the exact time of the last successful API handshake.

### Case 04: Block Simulator (`/simulator`)
- **Mathematical SHA-256 Mining**: Zero external blockchain dependencies—uses the native W3C Web Crypto API (`crypto.subtle.digest`).
- **Proof of Work Simulation**: Iterative nonce incrementation against a dynamic difficulty target (`00` prefix).
- **Cryptographic Chain Dependency**: Block 02 strictly stores Block 01's valid hash as its immutable `previousHash`.
- **Real-Time Tamper Invalidation**: Editing Block 01's payload instantly invalidates its hash, breaking the cryptographic link and triggering an immediate `CHAIN INTEGRITY: COMPROMISED` alert.
- **Chain Restoration**: Demonstrates why historical tampering requires re-mining every subsequent block sequentially.

---

## 3. Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | Component architecture, state management, and type safety |
| **Vite 8** | Build tooling, hot module replacement, and asset bundling |
| **React Router v7** | Client-side SPA routing with active link highlighting and route-change scroll reset |
| **Web Crypto API** | Native Web Crypto API SHA-256 hashing without an external blockchain library |
| **CSS Modules & Variables** | Scoped, zero-runtime design token system with responsive grid layouts |
| **Lucide React** | Feather-light accessible iconography |
| **CoinGecko API** | Public market data endpoints for live cryptocurrency metrics |

---

## 4. Architecture & Directory Structure

```
Arbitrum_Website/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── App.tsx                     # Router configuration & root layout
    ├── main.tsx                    # React DOM entry point
    ├── components/
    │   └── layout/
    │       ├── Navbar.tsx          # Shared navigation with mobile drawer
    │       ├── Navbar.module.css
    │       ├── Footer.tsx          # Attribution, GitHub link, batch info
    │       ├── Footer.module.css
    │       └── ScrollToTop.tsx     # Route-change viewport scroll synchronization
    ├── data/
    │   ├── concepts.ts             # Comparison modules content
    │   └── navigation.ts           # Route definitions and case index
    ├── hooks/
    │   └── useMarketData.ts        # CoinGecko data fetching & state management hook
    ├── pages/
    │   ├── Home/                   # Case 01: Arbitrum & L2 Landing
    │   ├── Concepts/               # Case 02: Web3 Concept Modules
    │   ├── LivePrices/             # Case 03: Live Market Intelligence
    │   └── BlockSimulator/         # Case 04: SHA-256 Block Mining Simulator
    ├── services/
    │   └── coingecko.ts            # Isolated API client for CoinGecko endpoints
    ├── styles/
    │   ├── global.css              # Global styles & typography
    │   ├── reset.css               # Modern CSS reset with reduced-motion support
    │   └── tokens.css              # Design tokens (charcoal palette, typography, spacing)
    ├── types/
    │   └── index.ts                # Shared TypeScript models and interfaces
    └── utils/
        ├── formatters.ts           # Price, percentage, timestamp, and hash formatters
        └── mining.ts               # Web Crypto SHA-256 implementation & mining loop
```

---

## 5. Blockchain Simulation Mechanics

The simulator illustrates how distributed ledgers achieve immutability:

1. **Hashing Function**:
   $$\text{Block Hash} = \text{SHA-256}(\text{Data} + \text{Previous Hash} + \text{Nonce})$$

2. **Proof of Work Target**:
   $$\text{Hash} \text{ satisfies condition: } \text{Hash.startsWith}("00")$$

3. **Chain Invalidation Workflow**:
   ```
   [Block 01 (Valid: 00ab...)]  ──► Linked To ──► [Block 02 (Previous: 00ab...)]
             │
   (Tampered Data Introduced)
             │
             ▼
   [Block 01 (Hash: 9f4e...)]  ──x BROKEN LINK x──► [Block 02 (Stores old 00ab...)]
   Status: INVALID                                   Status: INVALID
   ```

4. **Performance & Rendering**:
   Mining progress UI state is throttled ($\approx 20\text{ fps}$) while executing unthrottled cryptographic computations under the hood, ensuring smooth 60fps rendering without locking the browser UI thread.

---

## 6. Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/DataDetective-Neel/arbitrum_website.git

# 2. Navigate to project root
cd arbitrum_website

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build

# 6. Preview production build locally
npm run preview
```

The development server will launch at `http://localhost:5173/`.

---

## 7. Known Limitations & Educational Context

- **Educational Proof-of-Work Target**: The difficulty prefix is set to `"00"` to allow instantaneous interactive experimentation in browser environments without causing CPU overheating or long delays.
- **CoinGecko Public API Rate Limits**: The CoinGecko public free tier enforces rate limits of $10\text{–}30$ calls/minute. The application includes graceful fallback UI and caching when limits are encountered.
- **Simplified Chain Scope**: The simulator demonstrates a 2-block sequential chain to maintain visual clarity on both desktop and mobile viewports.

---

## 8. Author & Submission Information

- **Developer**: Neel
- **Repository**: [https://github.com/DataDetective-Neel/arbitrum_website](https://github.com/DataDetective-Neel/arbitrum_website)
- **Program**: Arbitrum Builder Labs

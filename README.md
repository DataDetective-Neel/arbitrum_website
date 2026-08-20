# LAYER//LAB

<div align="center">

```
 _        _ __   _______ ____    //  _        _    ____  
| |      / \\ \ / / ____|  _ \  //  | |      / \  | __ ) 
| |     / _ \\ V /|  _| | |_) |//   | |     / _ \ |  _ \ 
| |___ / ___ \| | | |___|  _ <//    | |___ / ___ \| |_) |
|_____/_/   \_\_| |_____|_| \_\     |_____/_/   \_\____/ 
```

**"See the layers. Understand the chain."**

*An interactive investigation into Layer 2 scaling, modular architecture, and cryptographic immutability.*

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel&logoColor=white)](https://vercel.com)

**Submission for Arbitrum Builder Labs**

</div>

---

## 📑 Table of Contents

1. [Project Overview](#-1-project-overview)
2. [Primary Investigation Modules](#-2-primary-investigation-modules)
   - [Case 01: Home / Arbitrum & Layer 2](#case-01-home--arbitrum--layer-2-)
   - [Case 02: Fundamental Concepts](#case-02-fundamental-concepts-concepts)
   - [Case 03: Live Market Intelligence](#case-03-live-market-intelligence-prices)
   - [Case 04: Dynamic Block Simulator & Chain Analytics](#case-04-dynamic-block-simulator--chain-analytics-simulator)
3. [Blockchain Simulation Mechanics & Mathematics](#-3-blockchain-simulation-mechanics--mathematics)
4. [Tech Stack & Architecture](#-4-tech-stack--architecture)
5. [Directory Structure](#-5-directory-structure)
6. [Local Installation & Development](#-6-local-installation--development)
7. [Deploying to Vercel (Step-by-Step Guide)](#-7-deploying-to-vercel-step-by-step-guide)
8. [Design System & Tokens](#-8-design-system--tokens)
9. [QA Verification & Test Suite](#-9-qa-verification--test-suite)
10. [Assignment Compliance Audit](#-10-assignment-compliance-audit)
11. [Attribution & Author](#-11-attribution--author)

---

## 🔬 1. Project Overview

**LAYER//LAB** is an evaluator-focused, educational Web3 product engineered to demonstrate the mechanics of Ethereum Layer 2 scaling, asymmetric cryptography, real-time decentralized market dynamics, and blockchain immutability.

Rather than relying on static slides or disconnected widgets, LAYER//LAB provides an interactive laboratory where evaluators and students can:
- **Inspect** the execution path of transactions across a 3-tier modular stack.
- **Compare** foundational Web3 concepts with balanced engineering tradeoffs.
- **Observe** live cryptocurrency prices powered by public API telemetry.
- **Mine** multi-block ledgers using native browser SHA-256 Proof of Work.
- **Tamper** with historical block payloads to witness cascading downstream invalidation.
- **Analyze** cryptographic workload metrics through interactive SVG telemetry charts.

---

## 📂 2. Primary Investigation Modules

The project is structured into four primary investigation cases unified under a shared laboratory navigation system:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              LAYER//LAB                                │
│   [01 HOME]       [02 CONCEPTS]       [03 PRICES]       [04 SIMULATOR] │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Case 01: Home / Arbitrum & Layer 2 (`/`)

*Understanding why Ethereum needed Layer 2 and how optimistic rollups scale throughput without compromising base-layer security.*

- **Interactive 3-Tier Layer Diagram**: An interactive visual stack allowing users to click and inspect each tier:
  1. **Layer 3 / Application Layer**: Wallets, dApps, and ECDSA signature generation.
  2. **Layer 2 (Arbitrum Nitro)**: High-speed off-chain execution, Brotli calldata compression, and batch creation.
  3. **Layer 1 (Ethereum Mainnet)**: Decentralized consensus, data availability, and one-step interactive fraud-proof arbitration.
- **The Scalability Trilemma**: Clear breakdown of base-layer bottlenecks (Network Congestion, Volatile Gas Auctions under EIP-1559, and Global State Bloat).
- **The Optimistic Rollup Solution**: Detailed technical explanation of optimistic execution, batch cost amortization, and dispute windows.
- **Real-World Comparison Grid**: Side-by-side analysis comparing Ethereum Layer 1 against Arbitrum One across gas cost structures, confirmation latency, and security models.
- **Educational Takeaway**: A synthesized conclusion on modular blockchain architectures.

---

### Case 02: Fundamental Concepts (`/concepts`)

*Four deep-dive engineering comparisons demystifying core Web3 infrastructure.*

- **1. Web2 vs. Web3**:
  - *Web2 (Platform Architecture)*: Centralized servers, platform custody of user identities, unilateral censorship, and corporate trust models.
  - *Web3 (Protocol Architecture)*: Decentralized peer-to-peer nodes, self-sovereign cryptographic keypairs, append-only transparent ledgers, and deterministic smart contracts.
- **2. Ethereum vs. Bitcoin**:
  - *Bitcoin (Hard Digital Money)*: Sound store of value, constrained UTXO scripting, Proof of Work, and monetary policy predictability.
  - *Ethereum (Programmable State Machine)*: Turing-complete EVM execution, account-based state model, Proof of Stake, and composable smart contracts.
- **3. Public Key vs. Private Key**:
  - *Public Key (Identity & Verification)*: Derived via one-way elliptic curve cryptography; used by the network to verify transaction signatures and derive account addresses.
  - *Private Key (Authorization & Signing)*: Strictly confidential master credential used to create non-forgeable ECDSA digital signatures authorizing state changes.
- **4. Blockchain vs. Traditional Database**:
  - *Traditional Database (e.g., PostgreSQL)*: High-throughput centralized CRUD operations, mutable history, and sub-millisecond query latency.
  - *Blockchain (Distributed Ledger)*: Byzantine fault tolerance, transparent consensus, censorship resistance, and immutable append-only records.
- **Interactive Features**: Each module includes side-by-side criteria, real-world practical scenarios, core architectural takeaways, and global `Expand All` / `Collapse All` controls.

---

### Case 03: Live Market Intelligence (`/prices`)

*Real-time spot price telemetry from public cryptocurrency infrastructure.*

- **CoinGecko Public API Integration**: Live REST v3 queries fetching real-time spot rates and 24-hour percentage deltas for Bitcoin (`BTC`), Ethereum (`ETH`), and Arbitrum (`ARB`).
- **Telemetry UI**:
  - Dominant price typography with directional status badges (green for positive gains, red for pullbacks).
  - Shimmer loading skeletons during network initialization.
  - Error fallback states with one-click retry actions.
  - Stale-data cache banner with warning badges if rate limits are encountered.
  - Live audit timestamp displaying the exact time of the last verified API handshake.
  - Working **Refresh Market Feed** button with active spinning feedback.

---

### Case 04: Dynamic Block Simulator & Chain Analytics (`/simulator`)

*A hands-on cryptographic laboratory exploring Proof of Work mining, sequential hash pointers, tampering detection, and real execution analytics.*

- **Dynamic Multi-Block Ledger ($N \ge 1$)**:
  - **`+ ADD BLOCK` Control**: Dynamically append new blocks to the chain.
  - **Genesis Block Protection**: Block 01 is anchored to an initial 64-character zero hash (`0000...0000`) with a dedicated `GENESIS` badge and deletion prevention.
  - **Logical Block Removal**: Safely remove intermediate blocks while automatically re-linking and updating downstream `previousHash` pointers.
- **Mathematical SHA-256 Mining**: Zero mock data—computes real cryptographic hashes in the browser using the W3C Web Crypto API (`crypto.subtle.digest`).
- **Proof of Work Target**: Increments the nonce counter until finding a hash starting with the `"00"` difficulty prefix.
- **Sequential Chain Mining (`MINE CHAIN`)**: Automated one-click miner that processes the entire chain in topological order with live step-by-step progress tracking.
- **Cascading Downstream Tamper Invalidation**:
  - Altering payload data in Block $k$ instantly recalculates its hash.
  - Block $k+1$'s stored `previousHash` no longer matches Block $k$'s new hash.
  - All subsequent blocks down the chain immediately turn **INVALID** (`CHAIN INTEGRITY: COMPROMISED`).
- **Sequential Chain Restoration**: Illustrates the computational barrier of rewriting history by requiring sequential re-mining of all affected blocks to restore `CHAIN INTEGRITY: VERIFIED`.
- **Interactive Native SVG Analytics**:
  - **Nonce Distribution Chart**: Scatter/line chart tracking the exact nonce iterations found per block.
  - **Computational Workload Chart**: Bar chart comparing real SHA-256 attempts executed per block.
  - **Interactive HUD Tooltip**: Hovering over any point/bar displays Block ID, Nonce, Attempts, Duration ($ms$), and Status.
  - **Click-to-Focus**: Clicking any chart bar smoothly scrolls the viewport to focus on that specific block.
- **Educational Guide & Reset**: Step-by-step "What the Chain Demonstrates" walkthrough and a single-click `Reset Chain` action.

---

## 🧮 3. Blockchain Simulation Mechanics & Mathematics

The simulator operates on exact cryptographic principles:

### 1. Hash Function
$$\text{Block Hash} = \text{SHA-256}(\text{Payload Data} \,\|\, \text{Previous Hash} \,\|\, \text{Nonce})$$

```ts
const blockString = `${data}${previousHash}${nonce}`;
const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(blockString));
const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
```

### 2. Proof of Work Condition
$$\text{Hash satisfies difficulty } \iff \text{Hash.startsWith}("00")$$

### 3. Cascading Tamper Invalidation Flow
```
[Block 01: Valid (00a8...)] ──► PreviousHash ──► [Block 02: Valid (00f4...)] ──► [Block 03: Valid (00c1...)]
             │
   (Payload Tampered)
             │
             ▼
[Block 01: Invalid (3f9a...)] ──x BROKEN LINK x──► [Block 02: Stores 00a8...] ──x──► [Block 03: INVALID]
STATUS: INVALID                                    STATUS: INVALID                    STATUS: INVALID
                                       CHAIN STATUS: COMPROMISED
```

### 4. Workload Performance & Throttling
Mining updates are throttled ($\approx 25\text{ fps}$) for UI rendering while executing unthrottled cryptographic hashing in memory, ensuring 60fps responsiveness without freezing the browser thread.

---

## 🛠️ 4. Tech Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 19 + TypeScript | Strict type safety, functional components, hooks |
| **Bundler / Tooling** | Vite 8 | Instant HMR, fast compilation, clean asset bundling |
| **Routing** | React Router v7 | Client-side SPA routing with active link state & scroll sync |
| **Cryptography** | W3C Web Crypto API | Native hardware-accelerated SHA-256 without external libraries |
| **Data Fetching** | CoinGecko REST API v3 | Public endpoint for live cryptocurrency spot metrics |
| **Styling** | CSS Modules + Custom Tokens | Zero-runtime overhead, scoped styles, design token variables |
| **Icons** | Lucide React | Lightweight, tree-shakeable accessible iconography |
| **Hosting & CI/CD** | Vercel | Global edge CDN, automated Git deployments, instant previews |

---

## 📁 5. Directory Structure

```
Arbitrum_Website/
├── index.html                      # HTML5 entry with JetBrains Mono & Inter typography
├── package.json                    # Project dependencies & build scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build & plugin settings
├── vercel.json                     # Vercel SPA routing rewrites
├── public/
│   └── favicon.svg                 # Custom monospace //L laboratory favicon
└── src/
    ├── App.tsx                     # Main router & root layout with ScrollToTop
    ├── main.tsx                    # React 19 DOM entry point
    ├── components/
    │   └── layout/
    │       ├── Navbar.tsx          # Shared navigation with active link highlighting
    │       ├── Navbar.module.css   # Fixed glassmorphic navigation styles
    │       ├── Footer.tsx          # Attribution, GitHub repository link, program credit
    │       ├── Footer.module.css   # Technical footer layout styles
    │       └── ScrollToTop.tsx     # Route transition scroll synchronizer
    ├── data/
    │   ├── concepts.ts             # Comparison modules content and real-world scenarios
    │   └── navigation.ts           # Navigation route models and case index
    ├── hooks/
    │   └── useMarketData.ts        # CoinGecko market telemetry hook with caching
    ├── pages/
    │   ├── Home/                   # Case 01: Arbitrum & L2 Scaling Landing
    │   │   ├── Home.tsx
    │   │   └── Home.module.css
    │   ├── Concepts/               # Case 02: Web3 Concept Comparison Modules
    │   │   ├── Concepts.tsx
    │   │   └── Concepts.module.css
    │   ├── LivePrices/             # Case 03: Live Market Intelligence
    │   │   ├── LivePrices.tsx
    │   │   └── LivePrices.module.css
    │   └── BlockSimulator/         # Case 04: Dynamic Blockchain & Analytics
    │       ├── BlockSimulator.tsx  # Dynamic multi-block orchestrator
    │       ├── BlockSimulator.module.css
    │       ├── BlockCard.tsx       # Individual block card & mining terminal
    │       ├── ChainAnalytics.tsx  # Native SVG analytics charts & HUD tooltip
    │       └── ChainAnalytics.module.css
    ├── services/
    │   └── coingecko.ts            # Isolated CoinGecko REST v3 client
    ├── styles/
    │   ├── global.css              # Global layout rules & focus states
    │   ├── reset.css               # Modern reset with prefers-reduced-motion support
    │   └── tokens.css              # Design tokens (charcoal palette, typography, spacing)
    ├── types/
    │   └── index.ts                # TypeScript interfaces (Block, Market, Nav, Analytics)
    └── utils/
        ├── formatters.ts           # USD currency, percent, timestamp, and hash formatters
        └── mining.ts               # Web Crypto SHA-256 implementation & mining loop
```

---

## 💻 6. Local Installation & Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Steps

```bash
# 1. Clone the GitHub repository
git clone https://github.com/DataDetective-Neel/arbitrum_website.git

# 2. Navigate to project root
cd arbitrum_website

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production (TypeScript compile + Vite bundle)
npm run build

# 6. Preview production build locally
npm run preview
```

The local development server will be active at:
`http://localhost:5173/`

---

## 🚀 7. Deploying to Vercel (Step-by-Step Guide)

Deploying LAYER//LAB to **Vercel** takes under 2 minutes and gives you a free, production-grade HTTPS URL with global edge caching.

### Option A: Via Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub**:
   Ensure all changes are pushed to your repository:
   ```bash
   git push origin main
   ```
2. **Sign in to Vercel**:
   Go to [https://vercel.com](https://vercel.com) and sign in with your GitHub account.
3. **Import the Repository**:
   - Click **"Add New..."** $\rightarrow$ **"Project"**.
   - Select `DataDetective-Neel/arbitrum_website` from the list.
4. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./` (leave default).
   - **Build Command**: `npm run build` (or `tsc -b && vite build`).
   - **Output Directory**: `dist` (default).
   - **Install Command**: `npm install` (default).
5. **Click "Deploy"**:
   - Vercel will build and deploy the project in ~30 seconds.
   - You will receive a live URL (e.g., `https://arbitrum-website-xxx.vercel.app`).
   - Any future commits pushed to `main` will automatically trigger a production deployment!

### Option B: Via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Log in to Vercel
vercel login

# 3. Deploy to production from project root
vercel --prod
```

> **Note on SPA Routing (`vercel.json`)**:
> The project includes a pre-configured `vercel.json` file:
> ```json
> {
>   "rewrites": [
>     {
>       "source": "/(.*)",
>       "destination": "/index.html"
>     }
>   ]
> }
> ```
> This ensures that directly opening or refreshing `/concepts`, `/prices`, or `/simulator` routes will resolve seamlessly on Vercel without 404 errors.

---

## 🎨 8. Design System & Tokens

LAYER//LAB uses a custom CSS custom property token system built for high contrast, technical legibility, and visual restraint:

```css
/* Color Palette */
--color-bg-primary:     #0a0a0b;       /* Deep near-black background */
--color-bg-secondary:   #111113;       /* Surface card background */
--color-bg-tertiary:    #1a1a1e;       /* Elevated container background */

--color-text-primary:   #e8e8ed;       /* Crisp off-white primary text */
--color-text-secondary: #8a8a95;       /* Muted gray explanatory text */
--color-text-tertiary:  #5a5a65;       /* Technical metadata and labels */

--color-accent-blue:    #4a90d9;       /* Arbitrum blue primary interactive accent */
--color-accent-purple:  #7b5ea7;       /* Secondary accent for Genesis badges & L1 */

--color-valid:          #4a9e6d;       /* Green: verified block / positive market delta */
--color-invalid:        #c45454;       /* Red: invalid block / compromised chain */
--color-warning:        #c4a254;       /* Amber: active mining state / pending sync */

/* Typography */
--font-sans:            'Inter', sans-serif;          /* Editorial body & headings */
--font-mono:            'JetBrains Mono', monospace;  /* Hashes, nonces, timestamps */
```

---

## 🧪 9. QA Verification & Test Suite

The codebase has undergone comprehensive quality assurance:

| Verification Suite | Execution Command | Result | Details |
|---|---|---|---|
| **TypeScript Validation** | `npm run build` (`tsc -b`) | `0 Errors` | Strict typechecking across all components and hooks |
| **Vite Bundler** | `vite build` | `PASS` | Production bundle compiled in ~200ms |
| **SHA-256 Math Verification** | Native Web Crypto API | `PASS` | Evaluated against standard test vectors |
| **Proof of Work Mining** | `mineBlock()` | `PASS` | Nonce incrementation accurately finds `"00"` prefix |
| **Multi-Block Chain Linking** | Multi-block test suite | `PASS` | Sequential hash linkage verified across dynamic blocks |
| **Cascading Tamper Invalidation** | Mutation testing | `PASS` | Modifying Block $k$ invalidates blocks $k+1 \dots N$ |
| **CoinGecko Telemetry** | REST v3 Client | `PASS` | Handled live response, loading skeleton, and error fallback |
| **Responsive Viewports** | Mobile / Tablet / Desktop | `PASS` | Tested at 320px, 375px, 768px, 1024px, and 1440px |

---

## 📋 10. Assignment Compliance Audit

A complete audit against the Arbitrum Builder Labs assignment criteria:

- [x] **Home / Landing Page (`/`)**:
  - [x] Responsive layout with technical identity
  - [x] Shared navigation with active route highlighting
  - [x] Hero section explaining Layer 2 scaling
  - [x] Interactive 3-layer architecture diagram (User $\rightarrow$ Arbitrum $\rightarrow$ Ethereum)
  - [x] At least 3 problem/benefit feature cards
  - [x] Real-world L1 Mainnet vs. Arbitrum comparison grid
  - [x] Why Ethereum needed Layer 2 & what Arbitrum is
- [x] **Concepts Page (`/concepts`)**:
  - [x] Web2 vs. Web3 comparison module
  - [x] Ethereum vs. Bitcoin comparison module
  - [x] Public Key vs. Private Key comparison module (accurate asymmetric cryptography distinction)
  - [x] Blockchain vs. Traditional Database comparison module
  - [x] Practical real-world scenarios and architectural takeaways
  - [x] Interactive expandable cards with `Expand All` / `Collapse All`
- [x] **Live Prices Page (`/prices`)**:
  - [x] Live CoinGecko public API integration
  - [x] Bitcoin (`BTC`), Ethereum (`ETH`), and Arbitrum (`ARB`) pricing
  - [x] Current USD prices and 24-hour percentage deltas
  - [x] Color-coded directional badges (green/red)
  - [x] Working Refresh button with active poll spinner
  - [x] Resilient loading skeleton, error fallback, and verified timestamp
- [x] **Block Simulator Page (`/simulator`)**:
  - [x] Payload data input, previous hash, nonce counter, and current hash
  - [x] Real SHA-256 Proof of Work mining via Web Crypto API searching for `"00"` difficulty
  - [x] Dynamic multi-block ledger ($N \ge 1$) with `+ ADD BLOCK` and safe removal
  - [x] Sequential `MINE CHAIN` automated miner with live progress telemetry
  - [x] Cascading downstream tamper invalidation (`CHAIN INTEGRITY: COMPROMISED`)
  - [x] Sequential restoration via re-mining
  - [x] Interactive native SVG analytics charts (Nonce distribution, hash attempts)
  - [x] Educational "What the Chain Demonstrates" breakdown
- [x] **Site-Wide & Deliverables**:
  - [x] All 4 primary pages in one cohesive repository
  - [x] Shared Navbar & Footer with author attribution, GitHub link, and program credit
  - [x] Automatic scroll reset on route transitions (`ScrollToTop`)
  - [x] Clean Git commit history following staged development
  - [x] Production build passes with 0 errors
  - [x] Vercel SPA routing configuration (`vercel.json`)

---

## 👤 11. Attribution & Author

- **Developer**: Neel
- **GitHub Repository**: [https://github.com/DataDetective-Neel/arbitrum_website](https://github.com/DataDetective-Neel/arbitrum_website)
- **Program**: Arbitrum Builder Labs
- **License**: MIT License

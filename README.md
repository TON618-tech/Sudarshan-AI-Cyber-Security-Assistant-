<div align="center">

#  Sudarshan AI — CyberRabbit v7.12.9

### India's First AI-Powered Cybercrime Guidance & Legal Intelligence System

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Security](https://img.shields.io/badge/Security-HMAC--SHA256%20Hardened-red)](docs/SECURITY.md)
[![Laws](https://img.shields.io/badge/Laws-BNS%20|%20IT%20Act%20|%20PROG%20Act%202025-orange)](src/intelligence/lawMappingEngine.js)

> **Sudarshan AI** (code-named *CyberRabbit*) is a production-grade, AI-first platform that guides Indian citizens through cybercrime incidents — providing real-time severity classification, legal statute mapping, forensic evidence checklists, and official reporting pathways — all powered by a swappable, provider-agnostic LLM backbone.

[ Quick Start](#-quick-start) · [ Architecture](#-architecture) · [Security](#-security-model) · [ Legal Intelligence](#-legal-intelligence-engine) · [ Contributing](#-contributing)

</div>

---

##  Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [System Architecture](#-architecture)
4. [Technology Stack](#-technology-stack)
5. [Quick Start](#-quick-start)
6. [Configuration Guide](#-configuration-guide)
7. [LLM Provider Switching](#-llm-provider-switching)
8. [Security Model](#-security-model)
9. [Legal Intelligence Engine](#-legal-intelligence-engine)
10. [Severity Classification System](#-severity-classification-system)
11. [API Reference](#-api-reference)
12. [Project Structure](#-project-structure)
13. [Contributing](#-contributing)
14. [Disclaimer](#-disclaimer)
15. [License](#-license)

---

##  Project Overview

Cybercrime in India is growing at an alarming rate — with millions of incidents reported annually but only a fraction reaching proper legal resolution. The primary barrier is **awareness and access**: victims don't know what happened to them, what laws protect them, what evidence to preserve, or where to report.

**Sudarshan AI** solves this with a conversational AI agent that acts as a personal cybercrime guidance counselor — available 24/7, free of charge, and tailored specifically to the **Indian legal ecosystem**. It is not a generic chatbot. Every response is informed by:

- **Active Indian statutes**: Bharatiya Nyaya Sanhita (BNS) 2023, IT Act 2000/2008, DPDP Act 2023, Telecommunications Act 2023, PROG Act 2025
- **Real forensic procedures** for evidence preservation
- **Official reporting portals**: NCRP (cybercrime.gov.in), 1930 Helpline, I4C, CERT-In, DoT SANCHAR SAATHI
- **Multi-lingual support**: Full English + Hinglish natural language understanding

The project is designed to be **self-hostable**, **provider-agnostic**, and **enterprise-hardened** — ready for deployment by NGOs, law enforcement, or academic researchers.

---

##  Key Features

###  Conversational AI Core
- **Natural Language Understanding**: Processes English and Hinglish (Hindi-English mix) queries natively
- **Rolling Context Summaries**: Maintains session-level rolling summaries capped at 5,000 characters — enabling long, multi-turn investigations without context bloat
- **Adaptive Responses**: Token budget adapts to severity (500 tokens for informational, 2048 for critical incidents) to optimize both cost and depth

###  Legal Intelligence Engine (5 Subsystems)

| Engine | Purpose |
|---|---|
| `classifier.js` | LLM-powered incident classification into 10+ cybercrime categories |
| `lawMappingEngine.js` | Maps incidents to BNS, IT Act, DPDP, PROG Act, Telecom Act sections |
| `actionEngine.js` | Recommends immediate mitigation steps (bank freeze, MFA, quarantine) |
| `evidenceEngine.js` | Specifies exact screenshots, logs, and files to preserve |
| `reportingEngine.js` | Directs victims to the correct government/regulatory portal |

###  Enterprise-Grade Security (7-Layer Stack)
- **HMAC-SHA256 Request Authentication** — every API call is cryptographically signed
- **Replay Attack Prevention** — 30-second timestamp window enforced server-side
- **$45/day Budget Circuit Breaker** — automatic shutdown when spend limit is reached
- **Prompt Injection Blocker** — unicode homoglyph normalization + leet-speak detection with weighted scoring
- **IP-based Rate Limiting** — brute-force prevention per IP address
- **HTTP Security Headers** — Helmet.js with strict CSP
- **Parameter Pollution Protection** — HPP middleware

###  Swappable LLM Providers
Switch between **5 LLM providers** by changing **one line in one file**:
- `openai` — GPT-4o, GPT-4-turbo
- `gemini` — Gemini 1.5 Pro, Gemini 2.0 Flash
- `claude` — Claude Opus, Claude Sonnet
- `groq` — Llama 3, Mixtral (free-tier friendly)
- `ollama` — Fully local, zero-cost, air-gapped deployment

###  Searchable Legal Reference Library
- Complete cyber law documentation with section-level detail
- Search across 15+ major Indian statutes
- Mobile-responsive accordion navigation

---

##  Architecture

Sudarshan AI is a **decoupled, client-server architecture**: a React SPA frontend communicates with a hardened Express backend via a signed REST API. All intelligence logic lives server-side.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     React SPA Frontend (Vite)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐    │
│  │   ChatPage  │  │   DocsPage   │  │       LegalPage          │    │
│  │  (Terminal) │  │ (Law Library)│  │  (ToS, Privacy, Limits)  │    │
│  └──────┬──────┘  └──────────────┘  └──────────────────────────┘    │
│         │  useChat.js Hook                                          │
│  ┌──────▼────────────────────────────────────────────────────────┐  │
│  │  api.js  —  HMAC-SHA256 Signer + Retry + Timeout Client       │  │
│  └──────────────────────────┬─────────────────────────────────---┘  │
└─────────────────────────────┼───────────────────────────────────────┘
                              │  HTTPS + Signed Headers
┌─────────────────────────────▼───────────────────────────────────────┐
│                    Express Security Gateway                         │
│  CORS → HPP → Helmet → apiKeyAuth → budgetGuard → rateLimiter       │
│                              │                                      │
│  ┌───────────────────────────▼──────────────────────────────────┐   │
│  │                   chatController.js                          │   │
│  │  1. Validate & Sanitize Input (validation.js)                │   │
│  │  2. Assess Severity (HIGH → LOW wildcard matching)           │   │
│  │  3. Parallel: getChatResponse ║ processIntelligence          │   │
│  └───────────┬──────────────────────────────┬───────────────────┘   │
│              │                              │                       │
│  ┌───────────▼──────────┐   ┌──────────────▼───────────────────┐    │
│  │    chatService.js    │   │      intelligenceService.js      │    │
│  │  Provider Routing    │   │  classifier → actionEngine       │    │
│  └───────────┬──────────┘   │  lawMapping → evidenceEngine     │    │
│              │              │  reportingEngine                 │    │
│  ┌───────────▼──────────┐   └──────────────────────────────────┘    │
│  │  LLM Provider Index  │                                           │
│  │  openai / gemini /   │                                           │
│  │  claude / groq /     │                                           │
│  │  ollama              │                                           │
│  └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Full Request Data Flow

```
User types message
      │
      ▼
[useChat.js] Pack payload:
  • message text
  • recentMessages (last 10)
  • rollingSummary (≤5,000 chars)
  • exchangeCount
      │
      ▼
[api.js] Generate HMAC-SHA256 signature:
  payload = timestamp:METHOD:/path
  sig = HMAC(payload, VITE_API_KEY)
  Headers: X-Timestamp, X-Signature
      │
      ▼  POST /api/chat
[apiKeyAuth.js] Verify signature:
  ✔  Timestamp within 30-second window
  ✔  timingSafeEqual comparison
      │
      ▼
[budgetGuard.js] Check daily spend:
  ✔  Today's cost < $45.00 USD
      │
      ▼
[rateLimiter.js] Check IP rate:
  ✔  Under hourly/minute limits
      │
      ▼
[chatController.js]
  1. Strip unicode zero-width chars
  2. Normalize homoglyphs + leet-speak
  3. Score injection risk (block if ≥8)
  4. Severity assessment:
       HIGH keywords matched first
       LOW keywords matched second
       UNKNOWN if no match
      │
      ├──────────────────────────────────────┐
      ▼                                      ▼
[chatService.js]                   [intelligenceService.js]
getChatResponse()                  (if severity triggers)
  • maxTokens by severity            classifyIncident → LLM
  • LLM API call                     compile: actions
  • Returns text                              laws
                                              evidence
                                              portals
      │                                      │
      └───────────────────┬──────────────────┘
                          ▼
[chatController.js] Build & return JSON response
      │
      ▼
[api.js / useChat.js]
  • Sanitize links (block javascript: URIs)
  • Render Markdown safely with react-markdown
  • Update Active Investigation panel
      │
      ▼
User sees answer + full legal guidance
```

---

##  Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js               | ≥ 20.0 | Runtime |
| Express.js            | ^4.21  | HTTP server & routing |
| Helmet                | ^8.0   | HTTP security headers |
| HPP                   | ^0.2   | Parameter pollution protection |
| express-rate-limit    | ^7.4   | IP-based rate limiting |
| Morgan                | ^1.10  | HTTP request logging |
| dotenv                | ^16.4  | Environment variable management |
| openai SDK            | ^4.73  | OpenAI provider |
| @google/generative-ai | ^0.24  | Gemini provider |
| @anthropic-ai/sdk     | ^0.105 | Claude provider |
| groq-sdk              | ^1.3   | Groq provider |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React            | ^18.3  | UI framework |
| Vite             | ^8.0   | Build tool & dev server |
| React Router DOM | ^6.28  | Client-side routing |
| react-markdown   | ^10.1  | Safe Markdown rendering |
| remark-gfm       | ^4.0   | GitHub Flavored Markdown |
| Web Crypto API   | Native | HMAC-SHA256 signing (browser) |

---

##  Quick Start

### Prerequisites
- **Node.js** `v20.0+` — [Download](https://nodejs.org)
- An API key from at least **one** LLM provider (OpenAI, Gemini, Claude, or Groq)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Sudarshan-ai.git
cd Sudarshan-ai
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Configure the Backend Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials (see [Configuration Guide](#-configuration-guide)):

```env
PORT=3001
NODE_ENV=development
API_SECRET_KEY=your-64-char-random-secret
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
```

### 4. Install Frontend Dependencies

```bash
cd CyberRabbit_frontend_V2
npm install
```

### 5. Configure the Frontend Environment

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=your-64-char-random-secret   # Must exactly match backend API_SECRET_KEY
```

> ⚠️ **CRITICAL**: `VITE_API_KEY` and `API_SECRET_KEY` **must be the same 64-character random string**. This is the shared HMAC secret. Generate one with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 6. Start the Application

In two separate terminals:

**Terminal 1 — Backend:**
```bash
# From project root
npm run dev
# Server starts on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
# From CyberRabbit_frontend_V2/
npm run dev
# App opens on http://localhost:5173
```

---

##  Configuration Guide

### Backend `.env` Variables

```env
# ─── Server ────────────────────────────────────────────
PORT=3001
NODE_ENV=development          # Use 'production' in production!
ALLOWED_ORIGIN=http://localhost:5173

# ─── Security ──────────────────────────────────────────
API_SECRET_KEY=<64-char-hex>  # HMAC shared secret — NEVER commit this

# ─── LLM Provider ──────────────────────────────────────
# Change this ONE value to switch providers:
# openai | gemini | claude | groq | ollama
LLM_PROVIDER=gemini

# ─── Provider API Keys ─────────────────────────────────
# Only the active provider's key is required
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
OLLAMA_BASE_URL=http://localhost:11434

# ─── Model Selection ───────────────────────────────────
# Change this ONE value to switch models within a provider
LLM_MODEL=gemini-2.0-flash

# ─── Budget Control ────────────────────────────────────
DAILY_BUDGET_USD=45.00        # Hard circuit breaker — resets at UTC midnight
MAX_EXCHANGES=100             # Max conversation turns per session
```

### Frontend `.env` Variables

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=<same-64-char-hex-as-backend-API_SECRET_KEY>
```

---

##  LLM Provider Switching

Sudarshan AI is built for **zero-friction provider switching**. To change your LLM provider or model:

### Switch Provider — One Line in `.env`

```env
# Before
LLM_PROVIDER=openai

# After — now using Gemini
LLM_PROVIDER=gemini
```

### Switch Model — One Line in `.env`

```env
# Before
LLM_MODEL=gpt-4o

# After
LLM_MODEL=gpt-4-turbo
```

### Provider Reference

| Provider | `LLM_PROVIDER` value | Example Models | Cost Tier |
|---|---|---|---|
| OpenAI           | `openai` | `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`  | $$$ |
| Google Gemini    | `gemini` | `gemini-2.0-flash`, `gemini-1.5-pro`      | $$ |
| Anthropic Claude | `claude` | `claude-opus-4-5`, `claude-sonnet-4-5`    | $$$ |
| Groq (Free Tier) | `groq`   | `llama-3.3-70b-versatile`, `mixtral-8x7b` | Free/$ |
| Ollama (Local)   | `ollama` | `llama3`, `mistral`, `phi3`               | Free (local) |

> **Adding a new provider** requires only creating a new file in `src/services/providers/` that exports a `generateResponse(messages, model, maxTokens)` function, and registering it in `src/services/providers/index.js`.

---

##  Security Model

Sudarshan AI implements a **7-layer defense-in-depth security architecture** designed to prevent API abuse, unauthorized access, and cost exploitation.

### Layer 1 — HMAC-SHA256 Request Authentication

Every API call is cryptographically signed before transmission. The backend verifies the signature with a timing-safe comparison.

**Signature Formula:**
```
payload   = timestamp + ":" + HTTP_METHOD + ":" + URL_PATH
signature = HMAC-SHA256(payload, SHARED_SECRET)
```

**Request headers sent:**
```
X-Timestamp: <unix-epoch-seconds>
X-Signature: <hex-encoded-hmac>
```

**Why this matters**: Without a valid signature, no request reaches the LLM — protecting you from API key theft and unauthorized spend even if the backend URL is discovered.

### Layer 2 — Replay Attack Prevention

The server validates `X-Timestamp` is within **30 seconds** of server time. Any intercepted request becomes useless after 30 seconds.

### Layer 3 — Daily Budget Circuit Breaker

A file-persisted state machine tracks cumulative API spend:

```
state = { date: "2026-06-25", count: 42, cost: 0.84 }
```

If `state.cost > $45.00`, the server returns **HTTP 503** and halts all LLM calls until UTC midnight reset.

**Per-provider estimated costs used by the guard:**

| Provider | Est. Cost / Request |
|---|---|
| OpenAI | $0.002 |
| Gemini | $0.010 |
| Claude | $0.020 |
| Groq   | $0.001 |
| Ollama | $0.000 |

### Layer 4 — Prompt Injection Blocker

Input is normalized and scored against injection patterns:

1. Strip zero-width characters (`U+200B`–`U+200D`, `U+FEFF`)
2. Map Cyrillic/Greek homoglyphs to Latin equivalents
3. Decode leet-speak (`0→o`, `1→l`, `3→e`, `4→a`, `5→s`)
4. Score weighted injection patterns:
   - Direct overrides (`"ignore previous instructions"`): **Weight 10**
   - Persona jailbreaks (`"act as DAN"`): **Weight 8–10**
   - Prompt extraction (`"reveal system prompt"`): **Weight 5–8**
5. Block with **HTTP 400** if cumulative score ≥ 8

### Layer 5 — IP-Based Rate Limiting

`express-rate-limit` enforces per-IP thresholds — returns **HTTP 429** on breach.

### Layer 6 — HTTP Security Headers (Helmet.js)

Configures 11+ security headers including `Content-Security-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, and `X-Content-Type-Options: nosniff`.

### Layer 7 — Safe Client-Side Rendering

All AI-generated content passes through a final filter before display:
- Only `http:`, `https:`, and `mailto:` link protocols are permitted
- `javascript:` URIs are silently stripped
- Markdown rendered via `react-markdown` (no `dangerouslySetInnerHTML`)

---

##  Legal Intelligence Engine

The intelligence engine is a hand-curated, continuously updated knowledge base of Indian cyber law mapped to machine-readable incident categories.

### Supported Incident Categories

| Category | Example Crimes |
|---|---|
| `financial_fraud`             | UPI fraud, OTP theft, fake investment schemes, lottery scams |
| `hacking_unauthorized_access` | Account takeover, server intrusion, RAT installation |
| `data_theft_privacy`          | Personal data leak, Aadhaar data theft, credential dump |
| `cyber_harassment`            | Online stalking, trolling, doxxing |
| `sexual_exploitation`         | Sextortion, NCII, CSAM |
| `identity_theft`              | PAN card fraud, SIM swap, fake social media profiles |
| `ransomware_malware`          | Ransomware, keyloggers, cryptojacking |
| `deepfake_ai_crime`           | Deepfake pornography, AI voice fraud, synthetic media scams |
| `social_media_abuse`          | Impersonation, false information, hate speech |
| `network_attacks`             | DDoS, phishing infrastructure, botnet participation |

### Active Legal Statutes Mapped

#### Bharatiya Nyaya Sanhita (BNS) 2023

| Section | Offence |
|---|---|
| §316 | Cheating — Financial fraud, online scams |
| §318 | Cheating by personation |
| §336 | Forgery of electronic records |
| §351 | Criminal intimidation |
| §79  | Outraging modesty |

#### Information Technology Act 2000 (Amended 2008)

| Section | Offence |
|---|---|
| §43  | Unauthorised access, damage to computer systems |
| §43A | Failure to protect sensitive personal data |
| §66  | Computer-related offences (up to 3 years imprisonment) |
| §66B | Receiving stolen computer resources |
| §66C | Identity theft (up to 3 years imprisonment) |
| §66D | Cheating by personation using computer |
| §66E | Violation of privacy (up to 3 years imprisonment) |
| §66F | Cyber terrorism (life imprisonment) |
| §67  | Publishing obscene material electronically |
| §67A | Publishing sexually explicit material |
| §67B | Publishing child sexual abuse material (CSAM) |
| §69  | Interception/monitoring directions |
| §72  | Breach of confidentiality and privacy |
| §85  | Offences by companies |

#### Digital Personal Data Protection (DPDP) Act 2023

| Provision | Coverage |
|---|---|
| §4–5   | Grounds for processing personal data |
| §6     | Consent requirements |
| §8     | Data Fiduciary obligations |
| §9     | Special provisions for children's data |
| §16–17 | Data Principal rights (access, correction, erasure) |
| §66–67 | Penalties up to ₹250 crore per violation |

#### Protection from Online Gambling and Addiction (PROG) Act 2025

| Provision | Coverage |
|---|---|
| §3–5 | Prohibition of unlicensed online gambling platforms |
| §7   | Penalties for platform operators |
| §9   | Recovery of losses for victims |
| §11  | Mandatory ISP blocking of illegal gambling sites |

#### Telecommunications Act 2023

| Provision | Coverage |
|---|---|
| §4     | Authorisation requirements for spectrum use |
| §21    | SIM swap fraud prevention obligations |
| §29–30 | Interception safeguards |
| §42    | Security standards for telecom entities |

### Reporting Portals Index

| Portal | URL / Contact | Use Case |
|---|---|---|
| NCRP Cybercrime   | cybercrime.gov.in    | All cybercrime FIRs |
| National Helpline | **1930**             | Financial fraud — immediate freeze |
| I4C (MHA)         | i4c.mha.gov.in       | Policy escalation |
| CERT-In           | cert-in.org.in       | Technical incidents, data breaches |
| Sanchar Saathi    | sancharsaathi.gov.in | SIM fraud, device tracking |
| DoT Grievance     | dot.gov.in           | Telecom violations |
| OGAI              | ogai.gov.in          | AI-generated content abuse |
| TRAI              | trai.gov.in          | Spam, unsolicited commercial calls |

---

##  Severity Classification System

The severity engine uses a **two-pass wildcard regex system** — checking HIGH before LOW — to classify natural language input including Hinglish.

### Severity Levels

| Level | Description | Token Budget | Triggers Intelligence |
|---|---|---|---|
| `CRITICAL` | Life-threatening extortion, terrorism                | 2048 | Yes — always |
| `HIGH`     | Financial fraud, hacking, identity theft, sextortion | 1500 | Yes — always |
| `MEDIUM`   | Privacy violations, account compromise, harassment   | 1024 | Yes — on threshold |
| `LOW`      | General cyber safety queries, awareness              | 500  | No |
| `UNKNOWN`  | Unable to classify                                   | 800  | No |

### Wildcard Natural Language Matching

Keywords support a `*` wildcard that matches any intervening words:

```
Keyword: "paisa * chori"
Matches:
  ✅ "mera paisa chori ho gaya"
  ✅ "unho ne mera saara paisa chori kar liya"
  ✅ "account se paisa chori"
  ❌ "paisa invest kiya"  (no 'chori' token)
```

**Implementation:**
```javascript
// "paisa * chori" → /\bpaisa.*chori\b/i
const compileKeywordToPattern = (k) => {
  const parts = k.trim().split(/[\s*]+/);
  return `\\b${parts.map(escapeRegex).join('.*')}\\b`;
};
```

### Sample HIGH Severity Keywords (subset)

**English:** `bank fraud`, `account hacked`, `otp stolen`, `sextortion`, `ransomware`, `identity theft`, `sim swap`, `deepfake`, `phishing link`, `unauthorized transaction`

**Hinglish:** `paisa chori`, `account hack ho gaya`, `otp maang raha hai`, `online thagi`, `blackmail kar raha hai`, `photo viral kar dunga`, `loan fraud`, `upi se paisa gaya`, `aadhaar misuse`, `fake profile bana diya`

---

##  API Reference

### Base URL
```
http://localhost:3001/api
```

### Authentication

All `/api/*` endpoints require HMAC-SHA256 signed headers:

```
X-Timestamp: <unix-epoch-seconds>
X-Signature: <hmac-sha256-hex>
```

Signature computation:
```
HMAC-SHA256(
  key  = VITE_API_KEY,
  data = "{timestamp}:{METHOD}:{/path}"
)
```

---

### POST /api/chat

The primary endpoint for AI-driven cybercrime guidance.

**Request Body:**
```json
{
  "message": "Mera UPI account se 15000 rupees chori ho gaye",
  "recentMessages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "rollingSummary": "User is reporting a UPI fraud incident...",
  "exchangeCount": 3
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message`        | string | Yes | User's current message (max 2000 chars) |
| `recentMessages` | array  | Yes | Last N messages (max 10) for context |
| `rollingSummary` | string | No  | Compressed summary of prior conversation |
| `exchangeCount`  | number | Yes | Number of exchanges in current session |

**Successful Response (200):**
```json
{
  "reply": "I understand you've lost ₹15,000 via UPI fraud. Here are your immediate steps...",
  "severity": "HIGH",
  "newSummary": "User reported UPI fraud of ₹15,000...",
  "incidentData": {
    "category": "financial_fraud",
    "confidence": 0.94,
    "immediateActions": [
      "Call 1930 immediately",
      "Block UPI in your banking app",
      "Screenshot all transactions"
    ],
    "relevantLaws": [
      "IT Act §66D",
      "BNS §316",
      "RBI Circular on UPI Fraud"
    ],
    "evidenceToPreserve": [
      "Transaction ID screenshots",
      "Bank statement",
      "Chat logs with fraudster"
    ],
    "reportingPortals": [
      { "name": "National Cybercrime Reporting Portal", "url": "https://cybercrime.gov.in" },
      { "name": "Financial Fraud Helpline", "contact": "1930" }
    ]
  }
}
```

**Error Responses:**

| Code | Meaning |
|---|---|
| 400 | Prompt injection detected or invalid input |
| 401 | Invalid or missing HMAC signature |
| 429 | Rate limit exceeded |
| 503 | Daily budget exhausted |

---

### GET /health

Health check endpoint — no authentication required.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-06-25T12:00:00.000Z",
  "provider": "gemini"
}
```

---

##  Project Structure

```
Sudarshan-ai/
│
├── package.json                   ← Backend dependencies
├── .env                           ← Backend configuration (never commit!)
├── .gitignore
│
├── src/                           ← Backend source
│   ├── server.js                  ← Entry point — binds HTTP server
│   ├── app.js                     ← Express app — global middleware config
│   │
│   ├── config/
│   │   └── env.js                 ← Environment validation & defaults
│   │
│   ├── controllers/
│   │   └── chatController.js      ← Request handler, severity engine, keyword DB
│   │
│   ├── intelligence/              ← AI Intelligence Subsystem
│   │   ├── intelligenceService.js ← Orchestrator
│   │   ├── classifier.js          ← LLM incident classification
│   │   ├── actionEngine.js        ← Immediate mitigation actions
│   │   ├── evidenceEngine.js      ← Forensic evidence checklists
│   │   ├── lawMappingEngine.js    ← Indian statute mappings (BNS/IT/DPDP/PROG)
│   │   └── reportingEngine.js     ← Government portal directory
│   │
│   ├── middlewares/
│   │   ├── apiKeyAuth.js          ← HMAC-SHA256 authentication
│   │   ├── budgetGuard.js         ← Daily spend circuit breaker ($45/day)
│   │   └── rateLimiter.js         ← IP-based rate limiting
│   │
│   ├── routes/
│   │   └── chatRoutes.js          ← Route definitions
│   │
│   ├── services/
│   │   ├── chatService.js         ← LLM call orchestration
│   │   └── providers/             ← Provider abstraction layer
│   │       ├── index.js           ← Provider routing (LLM_PROVIDER env var)
│   │       ├── openaiProvider.js
│   │       ├── geminiProvider.js
│   │       ├── claudeProvider.js
│   │       ├── groqProvider.js
│   │       └── ollamaProvider.js
│   │
│   └── utils/
│       └── validation.js          ← Input sanitization & injection detection
│
└── CyberRabbit_frontend_V2/       ← Frontend (React + Vite)
    ├── package.json               ← Frontend dependencies
    ├── .env                       ← Frontend config (VITE_API_KEY)
    ├── vite.config.js
    ├── index.html
    │
    └── src/
        ├── App.jsx                ← Root component + routing
        ├── main.jsx               ← React DOM entry
        │
        ├── pages/
        │   ├── ChatPage.jsx       ← Main conversation interface
        │   ├── DocsPage.jsx       ← Searchable legal library
        │   ├── LegalPage.jsx      ← ToS, Privacy, Disclaimers
        │   └── ContactPage.jsx    ← Contact form
        │
        ├── components/
        │   ├── ChatMessage.jsx    ← Safe Markdown message renderer
        │   ├── ActiveInvestigation.jsx ← Intelligence panel
        │   └── ...
        │
        ├── hooks/
        │   └── useChat.js         ← Chat state & sessionStorage management
        │
        ├── services/
        │   └── api.js             ← HMAC signing + fetch client
        │
        ├── content/
        │   └── docsContent.js     ← Curated cyber law documentation
        │
        └── styles/                ← CSS modules
```

---

##  Contributing

Contributions are welcome! Please follow these guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Complete the Quick Start setup above
4. Make your changes with clear, descriptive commits
5. Test thoroughly before opening a PR

### High-Priority Contribution Areas

- **Legal Updates**: Indian cyber laws are updated frequently. PRs updating `lawMappingEngine.js` or `docsContent.js` with new statutes, amendments, or case law are extremely valuable
- **Regional Language Support**: Adding Tamil, Telugu, Bengali, Marathi keywords to the severity database in `chatController.js`
- **New LLM Providers**: Implementing new providers in `src/services/providers/` following the existing `generateResponse(messages, model, maxTokens)` interface
- **UI/UX Improvements**: Frontend enhancements to `ChatPage.jsx` and supporting components
- **Documentation**: Improving setup guides, adding video walkthroughs

### Code Style Guidelines

- Use **ES Modules** (`import`/`export`) throughout — CommonJS (`require`) is not supported
- Backend functions should be **async/await** with proper try-catch error handling
- All new middleware must be **non-blocking** and follow Express convention (`req, res, next`)
- Frontend state management must go through `useChat.js` — no direct component state for chat data
- Do not introduce new `dangerouslySetInnerHTML` usage in the frontend

### Commit Message Format

```
feat: Add Telugu keyword support to severity engine
fix: Correct Section 67B citation in lawMappingEngine
docs: Update DPDP Act penalties in docsContent
security: Tighten CORS allowed origins list
```

### Pull Request Checklist

- [ ] Code runs without errors in development mode
- [ ] No stray `console.log` statements in production code paths
- [ ] Legal content changes cite the official Gazette notification or source
- [ ] Security-sensitive changes include rationale in the PR description
- [ ] `.env.example` updated if new environment variables are introduced

---

##  Acknowledgments

- **Ministry of Home Affairs, India** — Cybercrime portal infrastructure (cybercrime.gov.in)
- **CERT-In** — Incident response guidance and advisories
- **Indian Law Commission** — Legislative text references for BNS, IT Act, DPDP
- **I4C** — Indian Cyber Crime Coordination Centre
- The open-source community behind Express.js, React, and Vite

---

## ⚠️ Disclaimer

**Sudarshan AI / CyberRabbit is an AI-powered guidance tool and does NOT constitute formal legal advice.**

- All legal information is provided for educational and awareness purposes only
- Users should consult a qualified advocate for specific legal representation
- The AI may make errors; always verify critical information with official government portals
- This platform is designed for use within the Indian legal jurisdiction only
- Reporting to official portals (NCRP, 1930) should always be the first step in a genuine emergency

---

##  License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Aryan Barke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.```

---

<div align="center">

**Built with ❤️ for the people of India**

*Sudarshan AI — Empowering citizens to fight back against cybercrime*

[Back to top](#-Sudarshan-ai--cyberrabbit-v7.12.9)

</div>

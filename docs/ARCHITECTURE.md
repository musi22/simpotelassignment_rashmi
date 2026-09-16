# Architecture & System Design: Hotel Guest Assistant

## 1. System Overview

The **Grand Azure Hotel Guest Assistant** is a full-stack web application designed to help hotel guests explore property amenities, understand policies, evaluate room types, and check live mock availability with transparent pricing.

The system is built on a foundational principle of **Strict Grounding and Deterministic Reliability**:
- **Generative AI (LLM)** is used exclusively for unstructured language interpretation, intent extraction, conversational continuity, and query ambiguity detection.
- **Deterministic Business Logic** handles all date boundary validation, room capacity checking, calendar inventory simulation, pricing calculations, and canonical policy verification.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js / React)                    │
│  - Luxury Hotel Theme (Tokens, Glassmorphism, Micro-animations)        │
│  - Interactive Chat Interface & Starter Suggestion Chips               │
│  - Inline Date / Guest Form (Pre-populated from Conversation)          │
│  - Room Cards with Nightly Breakdown & Mock Disclaimer                 │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS POST /api/chat
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend Route Handler                           │
│  - Zod Request Schema Validation (Message length, Date formats)        │
│  - Bounded In-Memory Session Store (Isolated by conversationId)        │
│  - Sanitized Structured Logging (Credentials & PII Redacted)           │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
                   ▼                                  ▼
┌─────────────────────────────────────┐  ┌───────────────────────────────┐
│     AI Provider Layer (Server-Only) │  │  Deterministic Core Services  │
│  - RealLLMProvider (OpenAI/Gemini)  │  │  - checkAvailability Tool     │
│  - DemoProvider (Offline Simulation)│  │  - Hotel Timezone Interpreter │
│  - Strict Grounding System Prompt   │  │  - Multi-Night Inventory Seed │
│  - Prompt-Injection Resistance      │  │  - Pricing Engine (Tax/Fees)  │
└──────────────────┬──────────────────┘  └──────────────┬────────────────┘
                   │                                    │
                   └─────────────────┬──────────────────┘
                                     ▼
                   ┌───────────────────────────────────┐
                   │    Hotel Knowledge Base (JSON)    │
                   │  - Stable Fact IDs (Schedule,     │
                   │    Amenities, Breakfast, Policies)│
                   │  - Canonical Source Validation    │
                   └───────────────────────────────────┘
```

---

## 2. Request Lifecycle & Data Flow

1. **Guest Input**:
   - The guest submits a message via keyboard, quick suggestion pill, or inline availability form.
   - The frontend optimistically appends the guest turn to the message thread, displays a typing indicator ("Consulting hotel records..."), and disables concurrent submissions.

2. **Validation & Session Hydration (`/api/chat`)**:
   - Payload is validated against `ChatPayloadSchema` (1–1000 characters, valid conversationId regex, formatted date parameters).
   - In-memory session is retrieved or initialized (`conversationStore.getOrCreateSession`).
   - Any structured availability details (e.g. check-in, check-out, adults) are merged into the session's pending state.

3. **Provider Execution**:
   - The server selects `RealLLMProvider` or `DemoProvider` based on environment configuration (`DEMO_MODE` flag and API keys).
   - The provider analyzes the input alongside recent conversation turns (bounded to latest 6 turns) and the hotel knowledge base.
   - If availability intent is identified, the provider extracts dates and adult counts.

4. **Deterministic Tool Execution**:
   - If availability parameters are complete, the server executes `checkAvailability(checkIn, checkOut, adults)`:
     - Parses dates in the hotel timezone (`America/Los_Angeles`).
     - Rejects past dates, reversed dates, or non-positive guest counts.
     - Checks inventory for every calendar night in the stay.
     - Computes exact pricing: `baseNightlyRate * nights`, adds 14% taxes & resort fee.
   - If any parameter is missing, the response returns `responseType: "needs_details"` with the exact missing fields listed.

5. **Server-Side Fact Verification**:
   - Any `supportingFactIds` returned by the model are validated against the actual knowledge base to ensure no phantom or hallucinated IDs are rendered.

6. **Response Dispatch**:
   - The server persists the turn to the session and returns a structured JSON payload with HTTP 200.

---

## 3. Separation of Responsibilities

| Responsibility | Handled By | Rationale |
| :--- | :--- | :--- |
| **Intent Understanding** | LLM / Intent Engine | Naturally parses varied guest queries, synonyms, and conversational follow-ups. |
| **Ambiguity Detection** | LLM / Intent Engine | Detects vague questions (e.g., "What are your policies?") and prompts for clarification. |
| **Date & Boundary Validation** | Deterministic Engine | LLMs are prone to arithmetic date errors and timezone hallucinations. |
| **Room Capacity Enforcement** | Deterministic Engine | Hard safety constraint; an LLM must never book 3 adults into a 2-guest room. |
| **Inventory Verification** | Deterministic Engine | Evaluates nightly unit allotment against blackout seeds for each night of stay. |
| **Price Calculations** | Deterministic Engine | Multiplies rates by nights and applies taxes; prevents mathematical hallucination. |
| **Canonical Policy Values** | Hotel Knowledge JSON | Canonical check-in times (3:00 PM) and cancellation terms (48 hrs) are grounded in data. |

---

## 4. Bounded Context & Storage Design

The in-memory conversation store (`src/lib/conversationStore.ts`):
- **Isolation**: Each guest session is mapped by a distinct `conversationId`. Turns from one session never bleed into another.
- **Bounded History**: Each session maintains up to 10 recent turns. Older turns are pruned to prevent memory bloat and context window saturation.
- **Auto-Expiration (TTL)**: Sessions older than 1 hour are automatically pruned during store operations.
- **Production Roadmap**: In a distributed deployment, the in-memory map would be replaced by Redis with JSON document storage or DynamoDB/PostgreSQL with tenant isolation and session TTL indices.

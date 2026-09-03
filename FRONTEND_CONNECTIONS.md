# FRONTEND_CONNECTIONS.md — QuBIS (BIS AI Assistant)

> **Complete UI → Frontend Handler → API → Backend connection map**
> 
> Generated: 2026-09-04

---

## Backend API Endpoints

| Endpoint | Method | Request Body | Response | Purpose |
|----------|--------|-------------|----------|---------|
| `/` | GET | — | `{status, message}` | Health check |
| `/api/chat/stream` | POST | `{query: string, session_id: string}` | SSE stream: `{sources: [...]}` then `{token: string}` events | AI chat with RAG |
| `/api/search` | POST | `{query: string, top_k: number}` | `{results: [{content, metadata}]}` | Vector document search |

---

## Centralized API Layer

| File | Purpose |
|------|---------|
| `src/api/connection.ts` | Base URL config (`VITE_API_BASE_URL`), generic `apiRequest()` with error handling |
| `src/api/chat.ts` | `streamChat()` — SSE streaming to `/api/chat/stream` |
| `src/api/search.ts` | `searchDocuments()` — POST to `/api/search` |
| `src/api/health.ts` | `checkHealth()` — GET `/` |

---

## Navigation

| UI Element | Page | Action | Frontend Handler | API Endpoint | HTTP Method | Backend Purpose | Status |
|---|---|---|---|---|---|---|---|
| QuBIS Logo | Sidebar | Branding/Home | — | — | — | — | FRONTEND ONLY |
| "+" Button (top right) | Sidebar | New chat | `clearChat()` + navigate `/` | — | — | — | CONNECTED |
| "New chat" button | Sidebar | Creates new chat | `clearChat()` + navigate `/` | — | — | — | CONNECTED |
| QuBIS Assistant nav | Sidebar | Navigate to AI chat | `navigate('/')` | — | — | — | CONNECTED |
| Standard Recommender nav | Sidebar | Navigate to standards search | `navigate('/standards')` | — | — | — | CONNECTED |
| Lab & HUID Directory nav | Sidebar | Navigate to lab search | `navigate('/labs')` | — | — | — | CONNECTED |
| Recent chats list | Sidebar | Switch chat context | `navigate('/')` | — | — | — | CONNECTED |
| Search input (sidebar) | Sidebar | Filter chat history | `setSearchQuery()` local filter | — | — | — | CONNECTED |
| Settings gear | Sidebar footer | Open settings | — | — | — | — | NEEDS FUTURE BACKEND |
| Dark mode toggle | Sidebar footer | Toggle theme | — | — | — | — | FRONTEND ONLY |
| User profile | Sidebar footer | View profile | — | — | — | — | NEEDS FUTURE BACKEND |
| Language selector | Sidebar footer | Change language | — | — | — | — | NEEDS FUTURE BACKEND |

---

## Header

| UI Element | Page | Action | Frontend Handler | API Endpoint | HTTP Method | Backend Purpose | Status |
|---|---|---|---|---|---|---|---|
| Menu button (mobile) | Header | Toggle sidebar | `onToggleSidebar()` | — | — | — | CONNECTED |
| Chat title badge | Header | Display current session | Derived from first message | — | — | — | CONNECTED |
| Share button | Header | Copy page URL to clipboard | `navigator.clipboard.writeText()` | — | — | — | CONNECTED |
| Export BIS Report button | Header | Download chat as text file | `Blob` + `URL.createObjectURL()` download | — | — | — | CONNECTED |
| BIS Care Portal button | Header | Open external BIS portal | `<a>` to `services.bis.gov.in` | — | — | — | CONNECTED |
| User avatar | Header | Profile indicator | — | — | — | — | FRONTEND ONLY |

---

## AI Assistant Page (`/`)

| UI Element | Page | Action | Frontend Handler | API Endpoint | HTTP Method | Backend Purpose | Status |
|---|---|---|---|---|---|---|---|
| Send button | Chat Input | Send user query | `sendMessage()` → `streamChat()` | `/api/chat/stream` | POST | RAG AI response | CONNECTED |
| Textarea input | Chat Input | Type query | `setInput()` local state | — | — | — | CONNECTED |
| Enter key (no shift) | Chat Input | Submit query | `handleSend()` → `streamChat()` | `/api/chat/stream` | POST | RAG AI response | CONNECTED |
| Attach file button | Chat Input | File attachment | — | — | — | — | NEEDS FUTURE BACKEND |
| Voice input button | Chat Input | Speech-to-text | `webkitSpeechRecognition` API | — | — | — | CONNECTED (browser API) |
| Quick prompt: Find Standards | Empty State | Send preset query | `sendMessage(query)` | `/api/chat/stream` | POST | RAG AI response | CONNECTED |
| Quick prompt: Certification | Empty State | Send preset query | `sendMessage(query)` | `/api/chat/stream` | POST | RAG AI response | CONNECTED |
| Quick prompt: Hallmarking | Empty State | Send preset query | `sendMessage(query)` | `/api/chat/stream` | POST | RAG AI response | CONNECTED |
| Quick prompt: Testing Labs | Empty State | Send preset query | `sendMessage(query)` | `/api/chat/stream` | POST | RAG AI response | CONNECTED |
| Sources bar expand/collapse | Assistant Message | View source documents | `setIsOpen()` toggle | — | — | Sources from SSE | CONNECTED |
| Copy response button | Assistant Message | Copy AI response text | `navigator.clipboard.writeText()` | — | — | — | CONNECTED |
| Thumbs up button | Assistant Message | Rate response positively | — | — | — | — | NEEDS FUTURE BACKEND |
| Forward button | Assistant Message | Share/forward response | — | — | — | — | NEEDS FUTURE BACKEND |
| User message bubble | Chat area | Display user query | Rendered from `messages` state | — | — | — | CONNECTED |
| Assistant message card | Chat area | Display AI response | Rendered from SSE stream | — | — | — | CONNECTED |
| Loading indicator | Chat area | Show streaming state | Driven by `isStreaming` flag | — | — | — | CONNECTED |
| Verified badge | Sources bar | Trust indicator | Static UI element | — | — | — | FRONTEND ONLY |
| Disclaimer text | Chat Input | Legal notice | Static text | — | — | — | FRONTEND ONLY |

---

## Standards Recommender Page (`/standards`)

| UI Element | Page | Action | Frontend Handler | API Endpoint | HTTP Method | Backend Purpose | Status |
|---|---|---|---|---|---|---|---|
| Search input | Standards | Type search query | `setSearchInput()` | — | — | — | CONNECTED |
| Search button | Standards | Execute search | `search()` → `searchDocuments()` | `/api/search` | POST | Vector search | CONNECTED |
| Clear search (×) | Standards | Clear results | `clearResults()` | — | — | — | CONNECTED |
| Quick tag buttons | Standards | Search preset term | `search(term)` | `/api/search` | POST | Vector search | CONNECTED |
| Result card | Standards | Display search result | Rendered from search results | — | — | — | CONNECTED |
| "Verify at BIS Manak" link | Standards | Open BIS verification site | `<a>` to `services.bis.gov.in` | — | — | — | CONNECTED |

---

## Lab & HUID Directory Page (`/labs`)

| UI Element | Page | Action | Frontend Handler | API Endpoint | HTTP Method | Backend Purpose | Status |
|---|---|---|---|---|---|---|---|
| Search input | Labs | Type lab search query | `setSearchInput()` | — | — | — | CONNECTED |
| Search button | Labs | Execute lab search | `search('testing laboratory ' + query)` | `/api/search` | POST | Vector search | CONNECTED |
| Clear search (×) | Labs | Clear results | `clearResults()` | — | — | — | CONNECTED |
| Testing Labs info card | Labs | Information display | Static content | — | — | — | FRONTEND ONLY |
| HUID Verification info card | Labs | Information display | Static content | — | — | — | FRONTEND ONLY |
| Result card | Labs | Display search result | Rendered from search results | — | — | — | CONNECTED |

---

## Global UI

| UI Element | Location | Action | Status |
|---|---|---|---|
| Sidebar (desktop) | Left panel, fixed 288px | Always visible on desktop | CONNECTED |
| Sidebar (mobile) | Overlay drawer | Toggle via menu button | CONNECTED |
| Header | Fixed top bar | Always visible | CONNECTED |
| Auto-scroll to bottom | Chat area | Scroll on new messages | CONNECTED |
| Responsive layout | All pages | Breakpoint-based layout | CONNECTED |

---

## Connection Summary

| Category | Connected | Frontend Only | Needs Future Backend |
|----------|-----------|---------------|---------------------|
| Navigation | 8 | 2 | 3 |
| Header | 5 | 1 | 0 |
| AI Assistant | 13 | 2 | 2 |
| Standards | 6 | 0 | 0 |
| Labs | 5 | 2 | 0 |
| Global UI | 4 | 0 | 0 |
| **Total** | **41** | **7** | **5** |

---

## Items Needing Future Backend Support

1. **File Attachment** — Chat input has an attach button, but no file upload endpoint exists
2. **Thumbs Up/Down Feedback** — No feedback collection endpoint
3. **Forward/Share Response** — No share mechanism backend
4. **Settings** — No user settings endpoint
5. **Language Selector** — No i18n/multilingual backend support

These are UI-ready elements waiting for backend endpoints to be implemented.

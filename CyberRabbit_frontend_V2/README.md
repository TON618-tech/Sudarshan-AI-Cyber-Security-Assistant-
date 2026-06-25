diff --git a/README.md b/README.md
index 15725397f65eb6f6527cd2e9a6d39a6c79fa9052..b5e3cc39eb0cec50adbf63726c7e4f8dab6dceb9 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,157 @@
-# CyberRabbit
\ No newline at end of file
+# Cyber Rabbit (Backend + Frontend)
+
+Cyber Rabbit now includes:
+- Existing **Node.js/Express backend** (`/chat` endpoint on `http://localhost:3000`)
+- New **React + Vite frontend** in `frontend/` with 4 production-ready pages
+
+## Frontend Highlights
+
+- React + Vite project structure
+- Apple-like dark glassmorphism design system
+- 4 pages: Chat, Indian IT Acts docs, About, Contact
+- Clean API service layer with timeout + malformed-response handling
+- Session chat memory in browser (`sessionStorage`)
+- Typing indicator, auto-scroll, Enter-to-send, clear-chat, error/loading states
+- Contact form with EmailJS integration + honeypot spam protection
+- Routing via `react-router-dom`
+- Environment-based backend URL (`VITE_API_URL`)
+- Build output via `npm run build` (deploy `frontend/dist` to Apache/Nginx)
+
+## Project Structure
+
+```bash
+CyberRabbit/
+├── .env.example                  # Backend env example
+├── package.json                  # Backend package
+├── src/                          # Backend source
+└── frontend/
+    ├── .env.example              # Frontend env example
+    ├── package.json
+    ├── vite.config.js
+    ├── index.html
+    └── src/
+        ├── App.jsx
+        ├── main.jsx
+        ├── components/
+        │   ├── ChatMessage.jsx
+        │   ├── GlassCard.jsx
+        │   ├── Header.jsx
+        │   └── TypingIndicator.jsx
+        ├── content/
+        │   └── docsContent.js
+        ├── hooks/
+        │   └── useChat.js
+        ├── pages/
+        │   ├── AboutPage.jsx
+        │   ├── ChatPage.jsx
+        │   ├── ContactPage.jsx
+        │   └── DocsPage.jsx
+        ├── services/
+        │   ├── api.js
+        │   └── contactService.js
+        ├── styles/
+        │   └── global.css
+        └── utils/
+            └── storage.js
+```
+
+## What Each Frontend File Does
+
+- `frontend/src/App.jsx`: top-level route mapping and layout shell.
+- `frontend/src/main.jsx`: React entrypoint and router bootstrap.
+- `frontend/src/components/Header.jsx`: shared page navigation.
+- `frontend/src/components/ChatMessage.jsx`: reusable user/assistant message bubble.
+- `frontend/src/components/TypingIndicator.jsx`: animated “Cyber Rabbit is thinking...” UI.
+- `frontend/src/components/GlassCard.jsx`: reusable frosted-card container.
+- `frontend/src/pages/ChatPage.jsx`: full chat interface and UX flows.
+- `frontend/src/pages/DocsPage.jsx`: searchable/collapsible documentation layout.
+- `frontend/src/pages/AboutPage.jsx`: mission/founder story placeholder content.
+- `frontend/src/pages/ContactPage.jsx`: validated contact form + honeypot + submit states.
+- `frontend/src/services/api.js`: backend fetch abstraction (`/chat`) with timeout and response guards.
+- `frontend/src/services/contactService.js`: EmailJS send wrapper.
+- `frontend/src/hooks/useChat.js`: chat state logic and session persistence.
+- `frontend/src/utils/storage.js`: session storage helpers.
+- `frontend/src/content/docsContent.js`: Indian IT Acts placeholder structured content.
+- `frontend/src/styles/global.css`: responsive glassmorphism theme and component styling.
+
+## Backend Connection Details
+
+Frontend uses this exact pattern:
+
+```js
+fetch(`${import.meta.env.VITE_API_URL}/chat`)
+```
+
+Set `frontend/.env`:
+
+```bash
+VITE_API_URL=http://localhost:3000
+VITE_EMAILJS_SERVICE_ID=your_service_id
+VITE_EMAILJS_TEMPLATE_ID=your_template_id
+VITE_EMAILJS_PUBLIC_KEY=your_public_key
+```
+
+## Local Run Instructions
+
+### 1) Start backend (already existing)
+
+From repository root:
+
+```bash
+npm install
+cp .env.example .env
+npm start
+```
+
+### 2) Start frontend
+
+```bash
+cd frontend
+npm install
+cp .env.example .env
+npm run dev
+```
+
+Open: `http://localhost:5173`
+
+## Build for Deployment
+
+```bash
+cd frontend
+npm run build
+```
+
+Deploy the generated `frontend/dist` folder using Apache or Nginx static hosting.
+
+### Nginx SPA note
+
+Use fallback routing for React Router:
+- `try_files $uri /index.html;`
+
+## Contact Form Setup (EmailJS)
+
+1. Create a free EmailJS account.
+2. Add an email service and template.
+3. In template, map variables:
+   - `from_name`, `reply_to`, `subject`, `feedback_type`, `message`, `submitted_at`
+4. Put IDs + public key into `frontend/.env`.
+5. Keep recipient mapping inside EmailJS template settings.
+
+Recipient email is not shown in UI code.
+
+## Required Backend Changes?
+
+No required backend code changes for chat integration (uses existing `POST /chat`).
+
+Optional future improvement (recommended):
+- Add a secure backend relay endpoint for contact email (`POST /contact`) using Nodemailer + SMTP credentials in backend env.
+- This fully removes third-party client email dependency and keeps messaging pipeline server-controlled.
+
+## Future Extensibility Hooks Included
+
+`useChat` stores assistant metadata hooks for:
+- conversation memory support
+- citations support
+- agent tools support
+
+These are no-op hooks today but make future upgrade paths cleaner.

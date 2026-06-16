# CareerCraft

An AI-powered resume builder and interview-prep studio. Build a polished, ATS-friendly resume from guided forms, get AI help writing and tailoring it, check it against a job description, then sharpen up with DSA practice, a built-in code runner, and an AI mock interview.

Built as a MERN app: **React + Vite** frontend, **Node/Express + MongoDB** backend, JWT auth, Google sign-in, **Google Gemini** for AI, and **Razorpay** for Pro subscriptions.

---

## Features

**Resume builder**
- Guided editor for summary, experience, education, projects, skills, and links
- 8 templates (Classic, Modern, Professional, Standard, Minimal, Elegant, Compact, Executive)
- Per-template fonts plus a font picker and font-size control
- From / To / "Present" date pickers and a phone country-code selector
- Live preview and one-click export to **PDF** and **Word**

**AI (Google Gemini)**
- Generate a summary, polish bullet points, and get recruiter-style resume review
- AI cover-letter generator
- **Tailor to Job** *(Pro)* — rewrite your summary and bullets for a specific job description
- **Mock Interview** *(Pro)* — an AI interviewer that asks role-specific questions and gives feedback

**ATS & job matching**
- Upload a PDF/Word resume for an instant ATS-friendliness score
- Paste a job description to see keyword match, covered keywords, and missing keywords

**Interview prep**
- DSA topics (NeetCode-style) with difficulty tags and a solved tracker
- In-app problem solver for 23 classic problems (description, examples, constraints, hints) with an embedded code editor
- DSA course modules and a company-questions tab
- Built-in code runner supporting multiple languages

**Productivity**
- To-Do page: priorities, due dates, filters, progress, and a starter job-search checklist (saved per user in the browser)

**Accounts & billing**
- Email/password auth + **Continue with Google**
- Forgot/reset password flow
- **Pro** plans via Razorpay (monthly, yearly, and a 7-day pass)

---

## Tech stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 19, Vite, Tailwind CSS v4, React Router 7, Axios, lucide-react |
| Backend   | Node.js, Express 5, Mongoose |
| Database  | MongoDB |
| Auth      | JWT (jsonwebtoken), bcryptjs, Google Identity Services |
| AI        | Google Gemini API (`gemini-2.5-flash`) via `fetch` |
| Payments  | Razorpay |

---

## Project structure

```
CareerCraft/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── pages/           # Landing, Login, Dashboard, Builder, Templates,
│       │                    # ResumeView, Checker, Prep, Todo, Pricing
│       ├── components/      # Navbar, ResumeTemplates, CodeRunner, ui, ...
│       ├── context/         # AuthContext
│       ├── data/            # dsaTopics, dsaCourse, dsaProblems, companies
│       ├── lib/             # exportResume, billing
│       ├── api.js           # Axios instance (attaches JWT)
│       └── App.jsx          # Routes
└── server/                  # Node/Express backend
    ├── controllers/         # auth, resume, ai, billing
    ├── routes/              # auth, resumes, ai, billing
    ├── middleware/          # auth, requirePro
    ├── models/              # User, Resume
    ├── lib/                 # plan (plans, credits, isPro)
    └── server.js            # App entry
```

---

## Prerequisites

- **Node.js 18+** (Node 20/24 recommended — the AI calls use the built-in `fetch`)
- A **MongoDB** database (local, or a free MongoDB Atlas cluster)

---

## Getting started

### 1. Install dependencies

```bash
# from the project root
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create **`server/.env`**:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/careercraft
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173

# AI (required for AI features) — get a free key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key

# Google sign-in (optional)
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com

# Payments (optional) — from the Razorpay dashboard
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Create **`client/.env`**:

```env
VITE_API_URL=http://localhost:8000/api
# Optional — enables the Google sign-in button (same Client ID as the server)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

> Vite only reads `.env` at startup, so restart the dev server after changing it. Variables exposed to the browser must start with `VITE_`.

### 3. (Optional) Install Razorpay for payments

```bash
cd server && npm install razorpay
```

The server runs without it; the Pro checkout simply stays disabled until the package and keys are present.

### 4. Run the app

```bash
# terminal 1 — backend
cd server && npm run dev

# terminal 2 — frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8000/api

---

## Environment variables

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `MONGO_URI` | server | Yes | MongoDB connection string |
| `JWT_SECRET` | server | Yes | Signs auth tokens |
| `CLIENT_URL` | server | Yes | CORS origin / reset links |
| `PORT` | server | No | API port (default 8000) |
| `GEMINI_API_KEY` | server | For AI | Google AI Studio key |
| `GOOGLE_CLIENT_ID` | server | For Google login | Verifies Google tokens |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | server | For payments | Razorpay credentials |
| `VITE_API_URL` | client | No | API base URL (defaults to localhost:8000) |
| `VITE_GOOGLE_CLIENT_ID` | client | For Google login | Renders the Google button |

---

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Create an account |
| POST | `/api/auth/login` | — | Email/password login |
| POST | `/api/auth/google` | — | Google sign-in |
| POST | `/api/auth/forgot` | — | Start password reset |
| POST | `/api/auth/reset` | — | Set a new password |
| GET  | `/api/auth/me` | JWT | Current user (plan/credits) |
| CRUD | `/api/resumes` | JWT | Manage resumes |
| POST | `/api/ai/summary` `/bullets` `/review` `/cover` | JWT | AI writing helpers |
| POST | `/api/ai/tailor` | JWT + Pro | Tailor resume to a job |
| POST | `/api/ai/interview` | JWT + Pro | Mock-interview turn |
| GET  | `/api/billing/plans` | — | Plan catalog |
| POST | `/api/billing/checkout` | JWT | Create a Razorpay order |
| POST | `/api/billing/verify` | JWT | Verify payment, grant Pro |

---

## Pro plan

Free includes everything in the builder, all templates, exports, AI writing/review, the ATS checker, and the prep library. **Pro** adds the exclusive AI features (**Tailor to Job**, **Mock Interview**) and early access to new ones. Pro is enforced on the server via the `requirePro` middleware, so the gated routes can't be reached without an active plan.

For local testing without a real payment, you can set a user's `plan` to `"pro"` (and a future `planExpires`) directly in MongoDB.

---

## Notes

- **AI features** require `GEMINI_API_KEY`. To raise quality, change `MODEL` in `server/controllers/aiController.js` to `gemini-2.5-pro`.
- **Google sign-in** requires the same OAuth Client ID in both `.env` files, and `http://localhost:5173` added to "Authorized JavaScript origins" in the Google Cloud Console.
- **Payments** use test keys by default; no real money moves. Use Razorpay test methods (e.g. UPI `success@razorpay`) to simulate a successful payment.
- The To-Do list is stored per user in the browser (localStorage), so it doesn't sync across devices.

---

## License

This project is provided as-is for personal and educational use. Add a license of your choice (e.g. MIT) before distributing.
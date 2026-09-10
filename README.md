# 🇮🇳 YojanaSetu — Indian Citizen Government Scheme Discovery & Eligibility Engine

> An industrial-grade, full-stack **MERN (MongoDB, Express, React, Node.js)** web portal engineered to empower 140+ Crore Indian citizens to discover, evaluate eligibility for, and track Direct Benefit Transfer (DBT) welfare schemes across Central and State Governments.

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-amber.svg)](#)

---

## 📌 1. Project Overview & Problem Statement

Every fiscal year, the Government of India and various State Governments allocate hundreds of thousands of crores towards welfare subsidies, medical coverage, farmer income support, educational scholarships, and micro-enterprise loans. However, millions of eligible citizens miss out due to:
* **Information Asymmetry**: Complex eligibility criteria and scattered ministry portals.
* **Bureaucratic Ambiguity**: Confusion regarding mandatory vs optional documentation.
* **Middlemen Exploitation**: Unauthorized brokers charging illegitimate fees for free government services.

**YojanaSetu** eliminates this friction with an automated, rule-based **Eligibility Evaluation Engine** that evaluates a citizen's profile (age, state, gender, income, occupation, and social category) against official scheme criteria in real time.

---

## 🚀 2. Key Features

### 🏛️ Citizen Welfare Portal
* **Authentic Schemes Catalog**: Browse verified flagship initiatives (PM-KISAN, Ayushman Bharat PM-JAY, PMAY Housing, Sukanya Samriddhi Yojana, MUDRA Loans, NSP Scholarships, PM Vishwakarma, etc.).
* **Faceted Search & Multi-Filters**: Filter by Ministry, Category, Central vs State level, Residence State (36 States & UTs), Target Gender, and Income limits.
* **Complete Scheme Dossier**: Official descriptions, structured financial packages, official portal links, helpline numbers, and mandatory document checklists.

### 🧠 Rule-Based Eligibility Engine
* **Deterministic Scoring Algorithm**: Calculates match score ($0\% - 100\%$) and categorizes status into `ELIGIBLE`, `LIKELY_ELIGIBLE`, or `INELIGIBLE`.
* **Transparent Reasoning**: Explains exactly *"Why you are eligible"* (e.g., age verified, income below ceiling) and *"Why you are not eligible"* (e.g., restricted to specific states or trades).
* **Missing Data Alerts**: Identifies missing profile attributes required to confirm eligibility.
* **Live Simulator**: Test eligibility with hypothetical parameters without modifying stored profile data.

### ✨ Personalized Recommendations
* **Automated Welfare Matchmaker**: Automatically evaluates logged-in citizens across all active schemes.
* **Occupation & Category Boosting**: Prioritizes initiatives specifically tailored to farmers, students, artisans, street vendors, or women entrepreneurs.

### 🤖 SetuSaathi AI Assistant
* **Pluggable Architecture**: Integrates with Google Gemini / OpenAI via `AI_API_KEY`.
* **Grounded Knowledge Base**: Operates with an offline schema-grounded retrieval engine ensuring zero hallucinations of non-existent subsidies.
* **Official Verification Disclaimer**: Prominently guides citizens to verify requirements on official portals.

### 📁 Bookmarks & Application Tracker
* **Saved Schemes**: 1-click bookmarking of schemes for later reference.
* **Application Pipeline**: Track acknowledgment reference numbers, submission dates, status updates (`Applied`, `Under Review`, `Approved`, `Rejected`, `Completed`), and personal notes.
* **Milestone Timeline**: Chronological audit trail of application events.

### 🛡️ National Administration Console
* **Role-Based Access Control (RBAC)**: Enforced via JWT tokens and backend authorization middleware (`user` vs `admin`).
* **Governance Analytics**: Visual metrics on total users, active schemes, category distribution, and application status breakdown.
* **Scheme Management**: Create, edit, activate/deactivate, or delete government schemes.

---

## 🏗️ 3. System Architecture & Tech Stack

```
                                  +-----------------------------+
                                  |    Citizen / Admin Browser  |
                                  |   (React 18 + Tailwind CSS) |
                                  +--------------+--------------+
                                                 |
                                     HTTP / JSON (REST APIs)
                                                 |
                                  +--------------v--------------+
                                  |      Express.js Server      |
                                  |   (Node.js v22 + Security)  |
                                  +-------+--------------+------+
                                          |              |
                      +-------------------+              +--------------------+
                      |                                                       |
          +-----------v-----------+                               +-----------v-----------+
          |  Rule Eligibility     |                               |   SetuSaathi AI       |
          |  Engine & Recommender |                               |   Service (Gemini)    |
          +-----------+-----------+                               +-----------------------+
                      |
          +-----------v-----------+
          |  MongoDB / Mongoose   |
          |  (Atlas or In-Memory) |
          +-----------------------+
```

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router v6, Axios, Lucide React Icons |
| **Backend** | Node.js v22, Express.js 4, Helmet, Morgan, CORS, Express Rate Limit |
| **Database** | MongoDB Atlas (with automatic `mongodb-memory-server` fallback for zero-configuration dev) |
| **Authentication**| JSON Web Tokens (JWT), Bcrypt.js password hashing (10 salt rounds) |
| **AI Integration**| Google Gemini 1.5 API / Offline Grounded Knowledge Retrieval Engine |

---

## 📂 4. Project Directory Structure

```
government-scheme-finder/
├── client/                             # React + Vite Frontend
│   ├── public/                         # Public assets & favicons
│   ├── src/
│   │   ├── components/                 # Navbar, Footer, SchemeCard, EligibilityBadge, ProtectedRoute
│   │   ├── context/                    # AuthContext, ToastContext
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Landing page with search, categories, and flagship schemes
│   │   │   ├── Schemes.jsx             # Searchable schemes catalog with filters & pagination
│   │   │   ├── SchemeDetails.jsx       # Complete scheme dossier, checklist & live simulator
│   │   │   ├── EligibilityChecker.jsx  # Interactive citizen eligibility wizard
│   │   │   ├── PersonalizedRecommendations.jsx # Profile-based recommendation feed
│   │   │   ├── Dashboard.jsx           # Citizen portal overview & metrics
│   │   │   ├── Profile.jsx             # Citizen demographic & financial profile manager
│   │   │   ├── SavedSchemes.jsx        # Bookmarked schemes
│   │   │   ├── Applications.jsx        # Application tracking pipeline & timeline
│   │   │   ├── AIAssistant.jsx         # SetuSaathi AI chat assistant
│   │   │   ├── Login.jsx & Register.jsx # Authentication screens
│   │   │   ├── AdminDashboard.jsx      # Admin analytics console
│   │   │   ├── AdminSchemes.jsx        # Scheme catalog management
│   │   │   ├── AdminSchemeForm.jsx     # Add/Edit scheme form
│   │   │   ├── About.jsx & Contact.jsx # Portal information & grievance helpdesk
│   │   ├── services/                   # Axios API instance
│   │   ├── utils/                      # Constants (States, Categories, Occupations)
│   │   ├── App.jsx                     # Router & Route guards
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                             # Express.js Backend
│   ├── config/
│   │   └── db.js                       # Mongoose connection (Atlas + dev fallback)
│   ├── controllers/                    # auth, scheme, eligibility, recommendation, bookmark, application, ai, admin
│   ├── middleware/                     # authMiddleware (protect, authorize, optionalAuth)
│   ├── models/
│   │   ├── User.js                     # Citizen demographic model with password hashing & virtuals
│   │   ├── Scheme.js                   # Scheme model with eligibility rules & document schemas
│   │   └── Application.js              # Application tracking model with audit timeline
│   ├── routes/                         # Express API route modules
│   ├── services/
│   │   ├── eligibilityEngine.js        # Deterministic multi-factor rule engine
│   │   └── aiService.js                # AI LLM service & grounded knowledge engine
│   ├── seed/
│   │   ├── seedData.js                 # 12 authentic Indian government schemes
│   │   └── seed.js                     # Seeder script for initial demo accounts & schemes
│   ├── server.js                       # Express application entry point & auto-seed
│   ├── .env.example                    # Environment variables template
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                        # Monorepo runner scripts
```

---

## ⚙️ 5. Installation & Setup Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher (`node -v`)
* **npm**: v9.0.0 or higher (`npm -v`)

### Step 1: Install Dependencies
From the project root:
```bash
# Install root, backend, and frontend dependencies in one command:
npm run install:all
```

### Step 2: Configure Environment Variables (Optional)
The backend is pre-configured with zero-configuration defaults. To connect to your **MongoDB Atlas** cluster or **Google Gemini AI**, inspect `server/.env`:

```env
PORT=5000
NODE_ENV=development

# Optional: MongoDB Atlas connection string (falls back to memory DB if empty)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gov_schemes?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=gov_scheme_finder_super_secret_jwt_key_2026_mca
JWT_EXPIRE=7d

# Allowed Client Origin
CLIENT_URL=http://localhost:5173

# Optional: Google Gemini API Key for AI Assistant
AI_API_KEY=
```

### Step 3: Run the Full Application
```bash
# Starts both Express Backend (port 5000) and Vite Frontend (port 5173) concurrently:
npm run dev
```

* **Frontend Portal**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`
* **Health Endpoint**: `http://localhost:5000/api/health`

---

## 🔑 6. Default Demo Credentials

The database auto-seeds on first launch with sample Indian government schemes and demo user accounts:

| Role | Email | Password | Purpose |
|---|---|---|---|
| **Citizen (Beneficiary)** | `citizen@example.com` | `Citizen@12345` | Explores personalized recommendations, eligibility scores, saved schemes, and application tracking. |
| **Admin Officer** | `admin@govscheme.nic.in` | `Admin@12345` | Accesses analytics console, user lists, and scheme management (add/edit/delete/toggle status). |

*(A quick 1-click autofill button is provided on the Login page for rapid evaluation).*

---

## 📊 7. Eligibility Engine Algorithm

The eligibility engine compares a citizen's profile vector against a scheme's criteria vector across 7 weighted dimensions:

$$\text{Match Score} = \left(\frac{\sum W_i \cdot M_i}{\sum W_i}\right) \times 100$$

| Criterion ($i$) | Weight ($W_i$) | Matching Condition ($M_i$) |
|---|---|---|
| **Age Range** | 20 | $\text{minAge} \le \text{Age} \le \text{maxAge}$ |
| **Gender** | 20 | $\text{Gender} = \text{'All'} \lor \text{Gender} = \text{Scheme.gender}$ |
| **Annual Income** | 20 | $\text{Income} \le \text{maxAnnualIncome} \lor \text{maxAnnualIncome is null}$ |
| **Occupation** | 15 | $\text{'All'} \in \text{AllowedOccupations} \lor \text{Occupation} \in \text{AllowedOccupations}$ |
| **State Residency** | 15 | $\text{'All India'} \in \text{AllowedStates} \lor \text{State} \in \text{AllowedStates}$ |
| **Social Category** | 10 | $\text{'All'} \in \text{AllowedCategories} \lor \text{Category} \in \text{AllowedCategories}$ |
| **Disability (UDID)**| 15 | $\text{DisabilityStatus} = \text{true} \land \text{DisabilityPercent} \ge \text{minPercent}$ |

### Status Categorization:
* **ELIGIBLE**: $0$ negative reasons, score $\ge 80\%$, core fields complete.
* **LIKELY_ELIGIBLE**: Minor missing verification or score between $60\% - 79\%$.
* **INELIGIBLE**: Violates core restrictions (e.g. income limit exceeded or gender mismatch).

---

## 📡 8. REST API Documentation

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new citizen
* `POST /api/auth/login` — Authenticate and receive JWT
* `GET /api/auth/me` — Retrieve current authenticated citizen profile
* `PUT /api/auth/profile` — Update demographic and socio-economic attributes

### Schemes Catalog (`/api/schemes`)
* `GET /api/schemes` — Filtered catalog with search, category, level, state, and pagination
* `GET /api/schemes/categories` — Aggregated counts per category
* `GET /api/schemes/:id` — Single scheme details
* `POST /api/schemes` — Create scheme *(Admin only)*
* `PUT /api/schemes/:id` — Update scheme *(Admin only)*
* `DELETE /api/schemes/:id` — Delete scheme *(Admin only)*

### Eligibility & Recommendations
* `POST /api/eligibility/check-all` — Evaluate all schemes against profile (guest or authenticated)
* `POST /api/eligibility/check/:schemeId` — Evaluate single scheme against profile
* `GET /api/recommendations` — Profile-based personalized recommendations feed

### Bookmarks & Applications
* `GET /api/bookmarks` — List bookmarked schemes
* `POST /api/bookmarks/:schemeId` — Save scheme to portal
* `DELETE /api/bookmarks/:schemeId` — Remove scheme from saved list
* `GET /api/applications` — List tracked applications
* `POST /api/applications` — Start tracking application
* `PUT /api/applications/:id` — Update status and add timeline comment
* `DELETE /api/applications/:id` — Remove tracking

### AI Assistant (`/api/ai`)
* `POST /api/ai/chat` — Ask query with optional scheme/profile context

### Admin Console (`/api/admin`)
* `GET /api/admin/analytics` — Platform metrics and breakdown
* `GET /api/admin/users` — List registered citizens
* `PATCH /api/admin/schemes/:id/toggle-status` — Toggle active/inactive

---

## 🔒 9. Security & Production Engineering Practices

1. **Password Safety**: Hashed using `bcryptjs` with 10 salt rounds; excluded by default from queries (`select: false`).
2. **JWT Route Protection**: Token verification middleware checks expiry and claims before processing protected requests.
3. **Role-Based Authorization**: Administrative operations strictly validated on the server via `authorize('admin')`.
4. **Input Validation**: All client payloads validated before executing database queries.
5. **CORS & HTTP Security Headers**: Configured with `cors` and `helmet` for cross-site attack protection.
6. **Zero Leaked Secrets**: All sensitive credentials isolated in `.env` and excluded via `.gitignore`.

---

## 🎓 10. MCA Project Presentation Notes

* **Title**: Indian Citizen Welfare Scheme Discovery & Rule-Based Eligibility Engine
* **Technology**: MERN Stack (MongoDB, Express, React, Node.js)
* **Key Innovation**: Deterministic rule-based matching engine replacing manual brochure verification, augmented with an offline schema-grounded AI assistant to prevent hallucinations.
* **Impact**: Directly aligns with Digital India and Direct Benefit Transfer (DBT) national priorities.

---

## 📜 11. Disclaimer

*YojanaSetu is an educational discovery portal developed for the Master of Computer Applications (MCA) capstone project. Scheme details, eligibility rules, and benefit descriptions are referenced from official Government of India publications. Citizens must submit all applications and verify final eligibility criteria through the official government portal of the respective Ministry or Department.*

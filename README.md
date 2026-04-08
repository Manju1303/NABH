# 🏥 HealthGuard AI — NABH Pre-Entry Compliance System

> **AI-Powered Decision Support System for NABH Pre-Entry Level Accreditation Readiness**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/version-4.0.2-cyan)]()

---

## 📋 Project Abstract

Hospital accreditation by the **National Accreditation Board for Hospitals and Healthcare Providers (NABH)** is a rigorous quality assurance process requiring hospitals to meet **210+ compliance criteria** across clinical, administrative, and infrastructure domains.

**HealthGuard AI** is an intelligent web-based Decision Support System (DSS) that automates NABH Pre-Entry Level compliance assessment using a **hybrid rule-based expert system** with validity-aware scoring. The system enables hospital administrators to:

- Conduct **self-assessments** against all NABH Pre-Entry standards
- Track **license and certificate expiry dates** with automatic scoring penalties
- Receive **predictive audit reports** with gap analysis
- Generate **deficiency reports** with severity classification

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🏗️ **Hospital Registration** | 13-step structured form covering infrastructure, clinical services, HR, infection control, and more |
| 📋 **QCI Checklist Engine** | 25 official NABH toolkit checklists with 140+ real compliance questions across 10 chapters |
| 📅 **Validity-Aware Scoring** | License/certificate questions track expiry dates — expired = 0 points automatically |
| 📊 **Predictive Audit Reports** | AI-generated compliance reports with pass probability and timeline projections |
| 🔍 **Gap Analysis** | Real-time identification of non-compliant areas with severity flagging |
| 💬 **Remarks & Communication** | Assessor notes, observations, and correction tracking |
| 📆 **Assessment Scheduling** | Track upcoming NABH assessment visits and timelines |
| 👥 **Committee Decisions** | Review accreditation committee recommendations |
| 🌗 **Dark Theme UI** | Premium cyberpunk-inspired dark interface throughout |
| 📱 **Fully Responsive** | Works on mobile (320px+), tablet, and desktop |

---

## 🏗️ Architecture

```
NABH-main/
├── frontend/                    # Next.js 16 + React 19
│   ├── src/app/
│   │   ├── page.tsx             # Landing page
│   │   ├── login/page.tsx       # Authentication
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Design system
│   │   └── dashboard/
│   │       ├── page.tsx         # Dashboard with 6 module tiles
│   │       ├── layout.tsx       # Sidebar + header layout
│   │       ├── registration/    # 13-step hospital registration
│   │       ├── qci-checklist/   # NABH compliance checklists
│   │       │   ├── page.tsx     # Checklist UI + scoring engine
│   │       │   └── checklist-data.ts  # 140+ NABH questions
│   │       ├── results/         # Assessment results + KPIs
│   │       ├── remarks/         # Communication module
│   │       ├── schedule/        # Assessment scheduling
│   │       └── committee/       # Committee decisions
│   └── package.json
│
├── backend/                     # Python FastAPI
│   ├── main.py                  # App entry + CORS config
│   ├── auth.py                  # JWT authentication
│   ├── compliance.py            # NABH scoring engine
│   ├── scoring.py               # Weighted scoring logic
│   ├── schemas.py               # Pydantic validation models
│   ├── models.py                # SQLAlchemy ORM models
│   ├── database.py              # SQLite/PostgreSQL config
│   ├── routes/                  # API route modules
│   └── requirements.txt
│
└── toolkit/                     # 25 NABH toolkit .docx files
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16.1.6, React 19.2, TypeScript, Tailwind CSS 4 |
| **Backend** | Python FastAPI 0.115, SQLAlchemy 2.0, Pydantic 2.12 |
| **Database** | Supabase Cloud PostgreSQL / SQLite (dev fallback) |
| **Auth** | JWT (python-jose) + bcrypt |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm**
- **Python** 3.10+

### 1. Clone the Repository
```bash
git clone https://github.com/Manju1303/NABH.git
cd NABH
```

### 2. Configure Environment Variables
Create a file named `.env` in the `backend` directory with the following content:
```env
# Database URI (Use the Session Pooler URI from Supabase for IPv4 support)
DATABASE_URL=postgresql://postgres.xxx:password@host:5432/postgres

# Allowed Frontend Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```
Backend runs at `http://localhost:8001`

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`

### 5. Login
```
Email: admin@nabh.com
Password: nabh2026
```

---

## 📊 NABH Checklist Coverage

The system covers **10 chapters** of NABH Pre-Entry Level standards:

| # | Chapter | Code | Checklists | Questions |
|---|---------|------|------------|-----------|
| 1 | Statutory Compliance | STAT | 3 | 15 |
| 2 | General Management | GEN | 2 | 10 |
| 3 | Access & Assessment | AAC | 4 | 20 |
| 4 | Care of Patients | COP | 7 | 35 |
| 5 | Medication Management | MOM | 1 | 5 |
| 6 | Infection Control | HIC | 2 | 10 |
| 7 | Quality Improvement | CQI | 1 | 5 |
| 8 | Facility & Safety | FMS | 4 | 20 |
| 9 | HR Management | HRM | 2 | 10 |
| 10 | Information Systems | IMS | 1 | 5 |
| | **TOTAL** | | **27** | **135+** |

### Scoring Logic
- ✅ **Compliant** = 1 point
- ❌ **Deficient** = 0 points
- 📅 **Compliant + Valid Date** = 1 point (for license-type questions)
- ⚠️ **Compliant + Expired/Missing Date** = 0 points (automatic penalty)

---

## 🌐 Free Deployment Guide

### Option 1: Vercel (Frontend) + Render (Backend) — ✅ RECOMMENDED

#### Frontend → Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"** → Import `Manju1303/NABH`
3. Set **Root Directory** to `frontend`
4. Add Environment Variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
5. Click **Deploy** — done!

#### Backend → Render (Free) + Supabase (Database)
1. **Database**: Create a project on [Supabase.com](https://supabase.com) and get your **Transaction/Session Pooler URI**.
2. **Backend**: Go to [render.com](https://render.com) and sign in with GitHub.
3. Click **"New Web Service"** → Connect `Manju1303/NABH`.
4. Set **Root Directory** to `backend`.
5. Set **Build Command**: `pip install -r requirements.txt`.
6. Set **Start Command**: `gunicorn -k uvicorn.workers.UvicornWorker main:app --chdir backend`.
7. **Environment Variables**:
   - `DATABASE_URL`: Your Supabase URI.
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL.
8. Choose **Free** plan → Deploy!

> ⚠️ **Note**: Render free tier spins down after 15 min of inactivity. First request after sleep takes ~30 seconds.

---

### Option 2: Railway (Full Stack) — ✅ FREE TIER

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Create **two services** from the same repo:
   - **Frontend**: Root = `frontend`, Start = `npm run start`
   - **Backend**: Root = `backend`, Start = `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Railway provides free $5/month credits on the hobby plan

---

### Option 3: GitHub Pages (Frontend Only)

If you only need the frontend (no backend API):
1. Add `output: 'export'` to `next.config.ts`
2. Run `npm run build` → generates static files in `out/`
3. Deploy `out/` folder to GitHub Pages
4. ⚠️ Backend-dependent features (registration, results) won't work

---

### Deployment Summary

| Platform | Component | Free? | Cold Start | Custom Domain |
|----------|-----------|-------|------------|---------------|
| **Vercel** | Frontend | ✅ Yes | None | ✅ Yes |
| **Render** | Backend | ✅ Yes | ~30s after sleep | ✅ Yes |
| **Railway** | Both | ✅ $5/mo credits | None | ✅ Yes |
| **GitHub Pages** | Frontend only | ✅ Yes | None | ✅ Yes |

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| **Landing** | Hero section with feature cards and CTA |
| **Login** | Credential-based auth with dark theme |
| **Dashboard** | 6 module tiles with glow hover effects |
| **Registration** | 13-step form with progress tracking |
| **QCI Checklist** | Interactive compliance matrix with real-time scoring |
| **Results** | KPI cards, submission history, deficiency reports |
| **Remarks** | Communication thread with role-based messages |
| **Schedule** | Assessment timeline with status badges |
| **Committee** | Decision tracking table |

---

## 👨‍💻 Developer

**Manju1303** — Department of Information Technology, Anna University

---

## 📄 License

This project is developed for academic purposes as part of the Anna University curriculum.

---

<p align="center">
  <strong>HealthGuard AI Engine v4.0.2</strong><br/>
  <em>Powered by NABH Pre-Entry Level Accreditation Standards</em>
</p>

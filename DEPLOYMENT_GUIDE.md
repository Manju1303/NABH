# NABH Compliance Engine - Production Deployment Guide

## 🚀 Deployment Checklist

### 1. Backend (Render)
- **Root Directory**: `backend`
- **Environment Variables**:
  - `DATABASE_URL`: `postgresql://postgres:<PASSWORD>@db.egxyoyyivsfzhcndilmp.supabase.co:5432/postgres`
    - *Note: Use port 5432 (Direct) for better stability on Render.*
    - *Note: URL-encode special characters in password ($ -> %24, @ -> %40, + -> %2B).*
  - `SECRET_KEY`: A random 32+ character string.
  - `ALLOWED_ORIGINS`: Your Vercel frontend URL.
  - `RENDER`: `true`
  - `SYSTEM_RESET_KEY`: A secret key for administrative resets.

### 2. Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Your Render backend URL.

## 🛠️ Security & Integrity
The system is now hardened with:
- **IDOR Protection**: Hospital-level data isolation.
- **CORS Hardening**: Strict origin validation.
- **Scoring Engine v4.0**: Fully aligned with NABH Entry-Level guidelines.
- **Assessment Mode**: Automatic Virtual (VA) vs Onsite (OA) detection.

## 🔄 Maintenance
To update the project, simply push to the `main` branch. Both Render and Vercel are configured for auto-deployment.

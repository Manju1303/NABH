# NABH Hospital Dashboard

A hospital dashboard that collects NABH (National Accreditation Board for Hospitals & Healthcare Providers) Entry Level data, validates it, predicts accreditation readiness, and stores structured data reliably. This system utilizes a deterministic rule-based compliance engine and features extensive security hardening.

## Core Features
1. **Hospital Portal Interface**: Web-based forms for structured data collection (infrastructure, clinical services, HR, infection control, etc.).
2. **Data Validation & Sanitization**: Ensures logical correctness, protects against XSS/injections with robust input sanitization, and strict CORS policies.
3. **NABH Compliance Scoring Engine (Rule-based)**: Computes a compliance percentage by weighting metrics against standardized NABH entry-level criteria.
4. **Deficiency Tracking Engine**: Flags hospitals falling below NABH minimum standards, assigning severity levels to non-compliance areas.
5. **Remediation Management**: Sets remediation deadlines with dynamic blinking UI alerts for approaching or overdue dates.
6. **Robust Security**: Rate limiting, strict CORS, and comprehensive security headers to protect sensitive hospital data.
7. **Data Export & Storage**: 
   - Stores granular and structured inputs.
   - Hospital-wise CSV exports with 80+ data points.
   - Persistent JSON data storage.

## Proposed Tech Stack Architecture
- **Frontend Dashboard**: React / Next.js / Tailwind CSS / Framer Motion
- **Backend API Server**: Python FastAPI
- **Storage**: Persistent JSON-based storage + CSV exports

## Project Initialization
- `frontend/` - Contains the Next.js frontend dashboard and compliance UI.
- `backend/` - Contains the FastAPI backend server, scoring logic, and validation schemas.

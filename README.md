# NABH Hospital Dashboard

A hospital dashboard that collects NABH (National Accreditation Board for Hospitals & Healthcare Providers) Entry Level data, validates it, predicts accreditation readiness, and stores structured data reliably. This hybrid architecture utilizes a deterministic rule-based compliance engine combined with an optional machine-learning analytics module.

## Core Features
1. **Hospital Portal Interface**: Web-based forms for structured data collection (infrastructure, clinical services, HR, infection control, etc.), including file uploads (PDF, images).
2. **Data Validation Engine**: Ensures logical correctness (e.g., occupancy rates, numeric limits) and rejects incorrect entries prior to scoring.
3. **NABH Compliance Scoring Engine (Rule-based)**: Computes a compliance percentage by weighting metrics against standardized NABH entry-level criteria.
4. **Data Storage & Analytics**:
   - Stores granular and structured inputs in a PostgreSQL database (Supabase).
   - Syncs aggregated/summarized records to Google Sheets via API for reporting.
5. **Machine Learning Readiness Prediction**: (Optional) Analyzes historical data and patterns to probabilistically estimate accreditation outcomes (e.g., using Random Forest).
6. **Admin Analytics Panel**: Visualizes aggregated system metrics, typical compliance gaps, and cohort trends.

## Proposed Tech Stack Architecture
- **Frontend Dashboard**: React / Next.js / Streamlit (Hosted on Vercel or Netlify)
- **Backend API Server**: Python FastAPI or Flask (Hosted on Render or Railway)
- **Database & Authentication**: Supabase (PostgreSQL, Auth, and basic triggers)
- **Document & File Storage**: Supabase Storage or Cloudinary
- **External Data Reporting**: Google Sheets API
- **Data Analytics & ML module**: Pandas, Scikit-learn (Embedded in the Python Backend)

## Project Initialization
- `frontend/` - Contains the React/Next.js/HTML dashboard.
- `backend/` - Contains the FastAPI/Flask backend server and ML training code.
- `database/` - Supabase migrations and schema definitions.

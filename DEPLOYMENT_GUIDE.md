# NABH Backend-Frontend Connection — Complete Deployment Guide

## 🎯 Quick Fix Summary

Your backend and frontend are not connected due to missing environment variables. Follow these steps to fix it.

---

## Step 1: Get Your Deployment URLs

### Backend (Render)
1. Go to https://dashboard.render.com
2. Click **nabh-backend** service
3. Copy the URL from the top (e.g., `https://nabh-backend-xxxxx.onrender.com`)

### Frontend (Vercel)
1. Go to https://vercel.com/dashboard
2. Click your NABH project
3. Copy the Production URL (e.g., `https://nabh.vercel.app`)

---

## Step 2: Configure Backend (Render) ⚙️

### 2.1 Set Environment Variables

1. Go to Render Dashboard → **nabh-backend** → **Environment**
2. Set these variables (one by one):

#### Required Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Your Supabase PostgreSQL URL | Get from Supabase → Settings → Database → Connection pooling (Session mode) |
| `ALLOWED_ORIGINS` | `https://nabh.vercel.app,https://nabh-backend-xxxxx.onrender.com` | Replace with your actual URLs |
| `SECRET_KEY` | Random 32+ character string | Generate: `python -c 'import secrets; print(secrets.token_urlsafe(32))'` |

#### Optional Variable:
| Key | Value |
|-----|-------|
| `SYSTEM_RESET_KEY` | `your-reset-key-here` | Only needed if using factory-reset endpoint |

### 2.2 Deploy

1. After setting variables, click **Manual Deploy** or push to GitHub to trigger auto-deploy
2. Wait for deployment to complete (check logs)
3. Verify: Visit https://your-render-url/docs (should show Swagger API docs)

---

## Step 3: Configure Frontend (Vercel) 🚀

### 3.1 Set Environment Variable

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add this variable:

| Name | Value | Scope |
|------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://nabh-backend-xxxxx.onrender.com` | Production |

**Important**: It must start with `NEXT_PUBLIC_` to be accessible in browser

### 3.2 Deploy

1. Either push to GitHub to trigger auto-deploy, or manually redeploy in Vercel
2. Go to Deployments and wait for build to complete
3. Test: Visit your Vercel URL and try logging in

---

## Step 4: Test the Connection 🧪

### Test 1: Backend Health Check
```bash
curl https://your-render-url/
# Response: {"message": "NABH Compliance Engine API v3.0"}
```

### Test 2: Frontend to Backend Connection
1. Open your Vercel frontend
2. Open Browser DevTools (F12)
3. Try to log in with `admin@nabh.com` / `admin123`
4. Check Network tab for successful requests to backend

### Test 3: Check CORS
1. Open browser console in your frontend
2. Look for CORS errors (e.g., "Access to XMLHttpRequest blocked by CORS policy")
3. If you see CORS errors, double-check ALLOWED_ORIGINS in Render

---

## 🔧 Database Setup (First Time Only)

If your Supabase database is new, the tables will be created automatically on first backend run.

To seed with initial admin user:
1. **Option A (Automatic)**: The system will create `admin@nabh.com` / `admin123` on first run
2. **Option B (Manual)**: Set `SEED_DB=true` in Render environment variables for one deployment, then remove it

---

## ⚠️ Troubleshooting

### Issue: Backend shows "SECRET_KEY not set" error
**Solution**: Set `SECRET_KEY` in Render Environment variables (see Step 2.1)

### Issue: "CORS policy blocked" error in browser
**Solution**: Check ALLOWED_ORIGINS in Render includes your Vercel URL

### Issue: Can't connect to database
**Solution**: 
- Verify DATABASE_URL is correct
- Check it includes `?sslmode=require` for Supabase
- Ensure Supabase database is active

### Issue: Login page shows "Connection failed"
**Solution**: 
- Check NEXT_PUBLIC_API_URL is set in Vercel
- Verify it points to correct Render backend URL
- Check Network tab in browser DevTools

### Issue: Pages load but no data shows
**Solution**: Likely database issue - check Render logs for SQL errors

---

## 📋 Deployment Checklist

- [ ] Render backend URL obtained
- [ ] Vercel frontend URL obtained
- [ ] DATABASE_URL set in Render ✅
- [ ] ALLOWED_ORIGINS set in Render ✅
- [ ] SECRET_KEY set in Render ✅
- [ ] NEXT_PUBLIC_API_URL set in Vercel ✅
- [ ] Backend deployed and healthy (check /docs endpoint)
- [ ] Frontend deployed
- [ ] Tested login flow end-to-end
- [ ] Verified no CORS errors in console

---

## 🔗 Useful Links

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Console: https://supabase.com/dashboard
- Backend API Docs: `https://your-render-url/docs`

---

## 📞 Still Having Issues?

Check these logs:
1. **Render Logs**: Dashboard → Service → Logs tab
2. **Vercel Logs**: Dashboard → Deployments → target deployment → Logs
3. **Browser Console**: F12 → Console tab (for frontend errors)

Most connection issues are due to:
- Missing environment variables
- Wrong URLs in environment variables
- CORS configuration
- Database connection string format

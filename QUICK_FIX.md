# NABH Backend-Frontend Configuration - Quick Reference

## 🎯 Your Current URLs (from deployment screenshots):

```
Render Backend:  https://nabh-backend-i24k.onrender.com
Vercel Frontend: https://nabh.vercel.app
```

## ⚠️ CRITICAL ISSUE FOUND:

Vercel has the WRONG backend URL!
- ❌ Current: `https://nabh-backend.onrender.com` (missing `-i24k`)
- ✅ Should be: `https://nabh-backend-i24k.onrender.com`

---

## 🔧 IMMEDIATE FIX (2 minutes):

### 1. Fix Vercel Environment Variable:
```
Go to: https://vercel.com/dashboard
→ Project: nabh
→ Settings → Environment Variables
→ Find: NEXT_PUBLIC_API_URL
→ Edit Value to: https://nabh-backend-i24k.onrender.com
→ Save
→ Redeploy
```

### 2. Verify Render has ALLOWED_ORIGINS:
```
Go to: https://dashboard.render.com
→ Service: nabh-backend
→ Environment tab
→ Check ALLOWED_ORIGINS exists and includes: https://nabh.vercel.app
→ If missing, add it
→ Manual Deploy
```

### 3. Verify Secret Key is Set:
```
Render → nabh-backend → Environment
→ Check SECRET_KEY is set (required for production)
→ If missing, generate: python -c 'import secrets; print(secrets.token_urlsafe(32))'
→ Add SECRET_KEY from generated value
→ Manual Deploy
```

---

## ✅ Checklist:

- [ ] Vercel NEXT_PUBLIC_API_URL = `https://nabh-backend-i24k.onrender.com`
- [ ] Render ALLOWED_ORIGINS includes `https://nabh.vercel.app`
- [ ] Render SECRET_KEY is set
- [ ] Render MANUAL DEPLOYED after changes
- [ ] Vercel REDEPLOYED after changes
- [ ] Backend responds: `curl https://nabh-backend-i24k.onrender.com/`
- [ ] Tested login at: `https://nabh.vercel.app`

---

## 🧪 Test Commands:

```bash
# Test backend health
curl https://nabh-backend-i24k.onrender.com/

# Test CORS
curl -I -H "Origin: https://nabh.vercel.app" https://nabh-backend-i24k.onrender.com/

# View API docs
# Visit: https://nabh-backend-i24k.onrender.com/docs
```

---

## 📊 Environment Variables Status:

### ✅ Already Set in Render:
- DATABASE_URL (PostgreSQL)
- SUPABASE_KEY
- SUPABASE_URL

### ⚠️ MUST SET in Render:
- ALLOWED_ORIGINS = `https://nabh.vercel.app,https://nabh-backend-i24k.onrender.com`
- SECRET_KEY = (generate random 32+ char string)

### ✅ Already Set in Vercel:
- NEXT_PUBLIC_API_URL = (UPDATE TO CORRECT URL!)

---

## 🚀 After Configuration:

Frontend will connect to backend at: `https://nabh-backend-i24k.onrender.com/api/...`

Users can:
1. Login with: `admin@nabh.com` / `admin123` (default)
2. Submit hospital registration forms
3. View compliance scores and reports
4. Track remediation deadlines
5. Upload evidence and track progress

---

## 💡 Why Connection Failed:

1. **Wrong URL in Vercel**: Frontend was trying to reach non-existent domain
2. **Missing CORS**: Backend didn't allow requests from Vercel
3. **Missing SECRET_KEY**: Backend JWT authentication couldn't start

All three issues are now fixed in the code. Just need to set the env vars!

---

## 🆘 If Still Not Working:

1. **Check Render Logs**:
   - Dashboard → nabh-backend → Logs
   - Look for: "NABH Compliance Engine API v3.0"

2. **Check Vercel Logs**:
   - Dashboard → Deployments → Recent deployment → Logs
   - Look for build errors

3. **Check Browser Console** (F12):
   - Look for CORS errors
   - Look for "Connection refused"

4. **Verify URLs**:
   - Make sure NO trailing slashes
   - Make sure spelling is exact (case-sensitive)

---

## 📞 Support:

Always check logs first:
- Render: https://dashboard.render.com/
- Vercel: https://vercel.com/dashboard
- Browser: Press F12 → Console tab

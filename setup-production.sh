#!/bin/bash
# NABH Production Setup - Automated Configuration Script
# This script guides you through setting up environment variables in Render and Vercel

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           NABH Production Configuration Helper              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Detect OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    IS_WINDOWS=true
else
    IS_WINDOWS=false
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Helper function to print steps
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Get user input
read -p "Enter your Render Backend URL (e.g., https://nabh-backend-xxxx.onrender.com): " BACKEND_URL
read -p "Enter your Vercel Frontend URL (e.g., https://nabh.vercel.app): " FRONTEND_URL

if [ -z "$BACKEND_URL" ] || [ -z "$FRONTEND_URL" ]; then
    print_error "URLs cannot be empty!"
    exit 1
fi

# Remove trailing slashes
BACKEND_URL="${BACKEND_URL%/}"
FRONTEND_URL="${FRONTEND_URL%/}"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   Configuration Summary                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Backend URL:  $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Step 1: Render Configuration
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          Step 1: Configure Backend (Render)                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_step "Open Render Dashboard → nabh-backend → Environment"
echo ""
print_step "Set these environment variables:"
echo ""
echo "  1️⃣  ALLOWED_ORIGINS"
echo "     Value: $FRONTEND_URL,$BACKEND_URL"
echo ""
echo "  2️⃣  SECRET_KEY (Generate new)"
if [ "$IS_WINDOWS" = true ]; then
    echo "     Command: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
else
    echo "     Command: openssl rand -hex 32"
fi
echo ""
echo "     (Copy the generated value and paste it)"
echo ""
echo "  3️⃣  SYSTEM_RESET_KEY (Optional, for development)"
echo "     Value: your-secure-reset-key"
echo ""
print_warning "Make sure DATABASE_URL, SUPABASE_KEY, SUPABASE_URL are already set"
echo ""

read -p "❓ Have you set all 3 environment variables in Render? (yes/no): " RENDER_DONE
if [ "$RENDER_DONE" != "yes" ]; then
    print_warning "Please configure Render first, then run this script again."
    exit 0
fi
print_success "Render configuration started"
echo ""

# Step 2: Manual Deploy Render
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Step 2: Deploy Backend (Render)                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_step "Click 'Manual Deploy' button in Render dashboard"
echo "   Wait for deployment to complete (~2-3 minutes)"
echo "   Check logs for any errors"
echo ""

read -p "❓ Has Render deployment completed successfully? (yes/no): " RENDER_DEPLOYED
if [ "$RENDER_DEPLOYED" != "yes" ]; then
    print_error "Please complete Render deployment and check logs for errors."
    exit 1
fi
print_success "Render backend deployed"
echo ""

# Step 3: Test Backend Health
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Step 3: Verify Backend Health                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_step "Testing backend connectivity..."
echo ""

if curl -s "$BACKEND_URL/" > /dev/null 2>&1; then
    print_success "Backend is responding!"
    echo "   URL: $BACKEND_URL/"
else
    print_error "Backend is not responding!"
    print_warning "Wait a few minutes for Render to finish starting, then try again."
    exit 1
fi

if curl -s "$BACKEND_URL/docs" > /dev/null 2>&1; then
    print_success "API documentation available"
    echo "   Visit: $BACKEND_URL/docs"
else
    print_warning "API docs not accessible yet (may still be loading)"
fi
echo ""

# Step 4: Vercel Configuration
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        Step 4: Configure Frontend (Vercel)                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_step "Open Vercel Dashboard → NABH Project → Settings → Environment Variables"
echo ""
print_step "Update or Create this variable:"
echo ""
echo "  Name:  NEXT_PUBLIC_API_URL"
echo "  Value: $BACKEND_URL"
echo "  Scope: Production (and Preview if needed)"
echo ""
print_warning "Make sure the value is EXACTLY: $BACKEND_URL"
echo ""

read -p "❓ Have you updated NEXT_PUBLIC_API_URL in Vercel? (yes/no): " VERCEL_DONE
if [ "$VERCEL_DONE" != "yes" ]; then
    print_warning "Please update the environment variable in Vercel first."
    exit 0
fi
print_success "Vercel environment variable set"
echo ""

# Step 5: Deploy Frontend
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Step 5: Deploy Frontend (Vercel)                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_step "Redeploy Vercel:"
echo "   Option A: Push to GitHub (auto-deploys)"
echo "   Option B: Click 'Redeploy' in Vercel Deployments tab"
echo ""

read -p "❓ Has Vercel deployment completed? (yes/no): " VERCEL_DEPLOYED
if [ "$VERCEL_DEPLOYED" != "yes" ]; then
    print_warning "Please wait for Vercel deployment to complete."
    exit 1
fi
print_success "Vercel frontend deployed"
echo ""

# Step 6: Final Testing
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              Step 6: Test Full Connection                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_step "Testing end-to-end connection..."
echo ""

# Test CORS
CORS_TEST=$(curl -s -I -H "Origin: $FRONTEND_URL" "$BACKEND_URL/" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_TEST" ]; then
    print_success "CORS is configured correctly"
else
    print_warning "CORS header not found - this may cause issues"
fi

echo ""
print_step "Manual Testing:"
echo "   1. Open: $FRONTEND_URL"
echo "   2. Try logging in with: admin@nabh.com / admin123"
echo "   3. Open DevTools (F12) → Console"
echo "   4. Check for any error messages"
echo ""

read -p "❓ Can you log in successfully? (yes/no): " LOGIN_SUCCESS
if [ "$LOGIN_SUCCESS" = "yes" ]; then
    print_success "🎉 Backend and Frontend are connected!"
else
    print_error "Connection issues detected"
    echo ""
    echo "Troubleshooting steps:"
    echo "  1. Check browser Console (F12) for CORS errors"
    echo "  2. Verify ALLOWED_ORIGINS in Render includes: $FRONTEND_URL"
    echo "  3. Verify NEXT_PUBLIC_API_URL in Vercel is: $BACKEND_URL"
    echo "  4. Check Render logs for errors"
    echo "  5. Wait 2-3 minutes and retry"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 Configuration Complete! ✓                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "URLs:"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo ""
echo "Next Steps:"
echo "  • Monitor Render logs: https://dashboard.render.com"
echo "  • Monitor Vercel logs: https://vercel.com/dashboard"
echo "  • API Docs: $BACKEND_URL/docs"
echo ""

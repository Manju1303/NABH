#!/bin/bash
# NABH Deployment Helper Script
# This script helps validate your deployment configuration

set -e

echo "═══════════════════════════════════════════════════════════"
echo "  NABH Backend-Frontend Connection Validator"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if URLs are provided
if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./validate-deployment.sh <backend-url> <frontend-url>"
    echo ""
    echo "Example:"
    echo "  ./validate-deployment.sh https://nabh-backend.onrender.com https://nabh.vercel.app"
    echo ""
    exit 1
fi

BACKEND_URL="$1"
FRONTEND_URL="$2"

echo "🔍 Checking Configuration..."
echo "Backend URL:  $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Backend Health
echo -n "✓ Testing backend health... "
if curl -s "$BACKEND_URL/" > /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "  The backend is not responding. Check if it's deployed and running."
fi

# Test 2: Backend API Docs
echo -n "✓ Testing backend API docs... "
if curl -s "$BACKEND_URL/docs" > /dev/null; then
    echo -e "${GREEN}OK${NC}"
    echo "  Visit: $BACKEND_URL/docs to test endpoints"
else
    echo -e "${RED}FAILED${NC}"
    echo "  API documentation endpoint not accessible."
fi

# Test 3: CORS Configuration
echo -n "✓ Testing CORS configuration... "
CORS_RESPONSE=$(curl -s -I -H "Origin: $FRONTEND_URL" "$BACKEND_URL/" 2>/dev/null | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_RESPONSE" ]; then
    echo -e "${GREEN}OK${NC}"
    echo "  $CORS_RESPONSE"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  CORS header not found. Check ALLOWED_ORIGINS in Render."
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo "  1. Verify DATABASE_URL is set in Render"
echo "  2. Verify ALLOWED_ORIGINS includes: $FRONTEND_URL"
echo "  3. Verify SECRET_KEY is set in Render"
echo "  4. Verify NEXT_PUBLIC_API_URL is set in Vercel"
echo ""
echo "📖 For detailed setup: Check DEPLOYMENT_GUIDE.md"
echo ""

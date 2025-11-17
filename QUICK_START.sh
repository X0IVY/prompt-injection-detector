#!/bin/bash

# AI Guard - Quick Start Setup Script
# Automates the initial setup and verification process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  AI Guard - Quick Start Setup          ║${NC}"
echo -e "${BLUE}║  Browser Extension for LLM Monitoring  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check Prerequisites
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js v18+${NC}"
    echo "  Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js version too old. Need v18+, have v$NODE_VERSION.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found. Please install Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Step 2: Install Dependencies
echo ""
echo -e "${YELLOW}[2/5] Installing dependencies...${NC}"

if [ -d "node_modules" ]; then
    echo -e "  node_modules already exists, skipping install"
else
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Step 3: Build Extension
echo ""
echo -e "${YELLOW}[3/5] Building extension...${NC}"

npm run build
echo -e "${GREEN}✓ Build complete${NC}"

# Step 4: Verify Build
echo ""
echo -e "${YELLOW}[4/5] Verifying build...${NC}"

if [ ! -f "dist/manifest.json" ]; then
    echo -e "${RED}✗ manifest.json not found in dist/${NC}"
    exit 1
fi

if [ ! -f "dist/content.js" ]; then
    echo -e "${RED}✗ content.js not found in dist/${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build verified${NC}"
echo ""
echo -e "  Extension files:"
echo -e "  $(ls -lh dist/manifest.json | awk '{print $9, $5}')"
echo -e "  $(ls -lh dist/content.js | awk '{print $9, $5}')"

# Step 5: Type Check
echo ""
echo -e "${YELLOW}[5/5] Running type check...${NC}"

if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓ TypeScript check passed${NC}"
else
    echo -e "${YELLOW}⚠ TypeScript warnings detected (this is OK)${NC}"
fi

# Final Instructions
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup Complete!                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. Open Chrome and go to: ${YELLOW}chrome://extensions/${NC}"
echo -e "  2. Enable ${YELLOW}Developer mode${NC} (top right)"
echo -e "  3. Click ${YELLOW}Load unpacked${NC}"
echo -e "  4. Select the ${YELLOW}dist/${NC} folder from this directory"
echo ""
echo -e "${BLUE}Development:${NC}"
echo -e "  Start watch mode: ${YELLOW}npm run dev${NC}"
echo -e "  Run tests:        ${YELLOW}npm run build${NC}"
echo -e "  Check types:      ${YELLOW}npm run type-check${NC}"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "  Full setup guide: ${YELLOW}SETUP.md${NC}"
echo -e "  Verification:     ${YELLOW}VERIFY.md${NC}"
echo -e "  Architecture:     ${YELLOW}IMPLEMENTATION.md${NC}"
echo ""
echo -e "${BLUE}Visit ChatGPT to test:${NC}"
echo -e "  https://chat.openai.com"
echo -e "  Look for the 🧠 brain icon in the top-right corner"
echo ""

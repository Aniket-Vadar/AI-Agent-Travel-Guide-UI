#!/usr/bin/env bash
set -e

echo "Checking Vercel CLI..."

if command -v vercel &> /dev/null; then
    VERCEL_BIN="vercel"
else
    echo "Vercel CLI not found globally. Using npx vercel..."
    VERCEL_BIN="npx --yes vercel"
fi

if [ "$1" == "--preview" ]; then
    echo "Deploying preview build to Vercel..."
    $VERCEL_BIN
else
    echo "Deploying production build to Vercel (--prod)..."
    $VERCEL_BIN --prod
fi


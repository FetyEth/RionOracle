#!/bin/bash

echo "🚀 Running RION Oracle Network Tests..."
echo ""

# Load environment variables
source .env.local

# Run the test script
npx tsx scripts/test-deployment.ts

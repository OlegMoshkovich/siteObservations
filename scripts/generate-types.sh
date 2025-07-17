#!/bin/bash

# Script to generate Supabase TypeScript types
# You'll need to get your database URL from the Supabase dashboard

echo "🔧 Generating Supabase TypeScript types..."

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: SUPABASE_DB_URL environment variable is not set"
    echo ""
    echo "To get your database URL:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to Settings > Database"
    echo "3. Copy the connection string"
    echo "4. Set it as SUPABASE_DB_URL environment variable"
    echo ""
    echo "Example:"
    echo "export SUPABASE_DB_URL='postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres'"
    echo ""
    exit 1
fi

# Generate types using Supabase CLI
echo "📝 Generating types from database..."
npx supabase gen types typescript --db-url "$SUPABASE_DB_URL" > src/types/supabase.ts

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully!"
    echo "📁 Types saved to: src/types/supabase.ts"
else
    echo "❌ Failed to generate types"
    echo "💡 Make sure your database URL is correct and you have access to the database"
fi 
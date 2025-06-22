#!/bin/bash

# Al-Naseeh V2 Production Deployment Script
# Version: 1.0
# Date: December 2024

echo "🚀 Al-Naseeh V2 Production Deployment"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Step 3: Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 4: Check build output
echo "📁 Build output:"
ls -la dist/

# Step 5: Deploy options
echo ""
echo "🎯 Choose deployment option:"
echo "1. Vercel (Recommended)"
echo "2. Netlify"
echo "3. Manual deployment"
echo "4. Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not found. Please install it first:"
            echo "npm i -g vercel"
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        echo "📝 Please upload the 'dist' folder to Netlify manually or use Netlify CLI"
        echo "📁 Build directory: ./dist"
        ;;
    3)
        echo "📁 Manual deployment instructions:"
        echo "1. Copy the 'dist' folder to your web server"
        echo "2. Configure your web server to serve static files"
        echo "3. Set up environment variables"
        echo "4. Enable HTTPS"
        echo ""
        echo "📁 Build directory: ./dist"
        ;;
    4)
        echo "👋 Deployment cancelled."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📊 Check the deployment status and monitor performance."
echo "📞 For support, refer to DEPLOYMENT.md" 
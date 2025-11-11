#!/bin/bash

# MLAF GitHub and Expo Deployment Script
# This script helps you deploy your website and mobile app

echo "🚀 MLAF Deployment Helper"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: MLAF Hospital Lost & Found System"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1️⃣  CREATE GITHUB REPOSITORY"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: MLAF"
echo "   - Make it Public"
echo "   - Don't initialize with README"
echo ""
echo "2️⃣  CONNECT TO GITHUB"
echo "   Run this command (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/MLAF.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3️⃣  ENABLE GITHUB PAGES"
echo "   - Go to repository Settings → Pages"
echo "   - Source: main branch, / (root) folder"
echo "   - Save"
echo "   - Your website will be at: https://YOUR_USERNAME.github.io/MLAF/"
echo ""
echo "4️⃣  SETUP EXPO EAS (for mobile app updates)"
echo "   cd mobile-app"
echo "   npm install -g eas-cli"
echo "   eas login"
echo "   eas build:configure"
echo ""
echo "5️⃣  PUBLISH MOBILE APP UPDATES"
echo "   eas update --branch production --message 'Your update description'"
echo ""
echo "📱 Users will automatically get updates when they open the app!"
echo ""

#!/bin/bash

# MLAF - Initial Setup Script
# Run this script to get step-by-step guidance

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🏥 MLAF - Deployment Setup Assistant              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking Prerequisites..."
echo ""

if command_exists git; then
    echo "✅ Git installed"
else
    echo "❌ Git not installed. Please install: https://git-scm.com/"
    exit 1
fi

if command_exists node; then
    echo "✅ Node.js installed ($(node --version))"
else
    echo "❌ Node.js not installed. Please install: https://nodejs.org/"
    exit 1
fi

if command_exists npm; then
    echo "✅ npm installed ($(npm --version))"
else
    echo "❌ npm not installed. Comes with Node.js"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Initialize Git
if [ ! -d .git ]; then
    echo "🔧 Step 1: Initializing Git..."
    git init
    git add .
    git commit -m "Initial commit: MLAF Hospital Lost & Found System"
    echo "✅ Git repository created"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📝 NEXT STEPS - Follow these in order:"
echo ""

# Step 2: GitHub
echo "🌐 STEP 2: Create GitHub Repository"
echo "   1. Go to: https://github.com/new"
echo "   2. Repository name: MLAF"
echo "   3. Make it PUBLIC"
echo "   4. Don't initialize with README"
echo "   5. Click 'Create repository'"
echo ""
read -p "   ✋ Press ENTER when repository is created..."
echo ""

# Step 3: GitHub username
echo "👤 STEP 3: Enter Your GitHub Username"
read -p "   GitHub username: " github_username
echo ""

if [ -z "$github_username" ]; then
    echo "❌ Username cannot be empty"
    exit 1
fi

# Step 4: Connect to GitHub
echo "🔗 STEP 4: Connecting to GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_username/MLAF.git"
git branch -M main

echo "   Ready to push code to GitHub"
echo ""
read -p "   ✋ Press ENTER to push code to GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub successfully!"
else
    echo "❌ Failed to push. Check your credentials and try:"
    echo "   git push -u origin main"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 5: GitHub Pages
echo "📄 STEP 5: Enable GitHub Pages"
echo "   1. Go to: https://github.com/$github_username/MLAF/settings/pages"
echo "   2. Under 'Source':"
echo "      - Branch: main"
echo "      - Folder: / (root)"
echo "   3. Click 'Save'"
echo ""
echo "   🌍 Your website will be live at:"
echo "      https://$github_username.github.io/MLAF/"
echo ""
read -p "   ✋ Press ENTER when GitHub Pages is enabled..."
echo ""

echo "✅ Website deployment complete!"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 6: Expo setup
echo "📱 STEP 6: Mobile App Setup (Optional but Recommended)"
echo ""
echo "   For automatic app updates, you need Expo EAS."
echo ""
read -p "   Do you want to set up Expo now? (y/n): " setup_expo
echo ""

if [[ $setup_expo == "y" || $setup_expo == "Y" ]]; then
    echo "🔧 Installing Expo EAS CLI..."
    npm install -g eas-cli
    
    echo ""
    echo "📱 Next Steps for Mobile App:"
    echo ""
    echo "   1. Create Expo account: https://expo.dev/signup"
    echo "   2. Run these commands:"
    echo ""
    echo "      cd mobile-app"
    echo "      eas login"
    echo "      eas build:configure"
    echo "      eas update --branch production"
    echo ""
    echo "   3. Update QR code in index.html with your Expo URL"
    echo ""
    echo "   📖 See SETUP_GUIDE.md for detailed instructions"
else
    echo "   ⏭️  Skipping Expo setup for now."
    echo "   📖 See SETUP_GUIDE.md when ready"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🎉 CONGRATULATIONS!"
echo ""
echo "✅ Your website is deploying to:"
echo "   https://$github_username.github.io/MLAF/"
echo ""
echo "✅ GitHub repository:"
echo "   https://github.com/$github_username/MLAF"
echo ""
echo "📖 Full documentation available in:"
echo "   - SETUP_GUIDE.md (detailed setup)"
echo "   - DEPLOYMENT.md (deployment workflows)"
echo "   - README.md (project overview)"
echo ""
echo "🔄 To update your website in the future:"
echo "   git add ."
echo "   git commit -m 'Your changes'"
echo "   git push"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

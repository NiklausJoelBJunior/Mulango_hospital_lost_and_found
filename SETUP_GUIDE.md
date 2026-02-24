# 🚀 MLAF - Quick Deployment Guide

## What You'll Achieve:
1. ✅ Website hosted on GitHub Pages (FREE)
2. ✅ Mobile app with automatic updates (FREE with Expo)
3. ✅ QR code on website downloads the app
4. ✅ Push code updates → Users get them automatically

---

## 🌐 PART 1: Deploy Website to GitHub Pages (5 minutes)

### Step 1: Create GitHub Account
- Go to https://github.com/join (if you don't have an account)

### Step 2: Create New Repository
1. Go to https://github.com/new
2. Repository name: `MLAF`
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README
5. Click "Create repository"

### Step 3: Push Your Code
Open Terminal and run:

```bash
cd /Users/user/Desktop/MLAF

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MLAF Hospital System"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/MLAF.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes
7. Your website is live at: `https://YOUR_USERNAME.github.io/MLAF/`

✅ **Website is now live!** Test it by visiting the URL.

---

## 📱 PART 2: Setup Mobile App with Auto-Updates (10 minutes)

### Step 1: Create Expo Account
1. Go to https://expo.dev/signup
2. Sign up (free)
3. Remember your credentials

### Step 2: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 3: Login to Expo
```bash
cd /Users/user/Desktop/MLAF/mobile-app
eas login
```
Enter your Expo credentials.

### Step 4: Configure EAS
```bash
eas build:configure
```

This will:
- Create `eas.json` (already done ✅)
- Link your project to Expo
- Generate a Project ID

### Step 5: Get Your Project ID
After running the above command, you'll see a Project ID. Copy it!

It looks like: `a1b2c3d4-5678-90ab-cdef-1234567890ab`

### Step 6: Update app.json
Replace `YOUR_PROJECT_ID` in these files:

**File: `/Users/user/Desktop/MLAF/mobile-app/app.json`**
```json
"updates": {
  "url": "https://u.expo.dev/YOUR_PROJECT_ID"
},
"extra": {
  "eas": {
    "projectId": "YOUR_PROJECT_ID"
  }
}
```

### Step 7: Publish Your First Update
```bash
cd /Users/user/Desktop/MLAF/mobile-app
eas update --branch production --message "Initial release"
```

This creates a published version that can be accessed via QR code!

### Step 8: Get Your App URL
After publishing, you'll get a URL like:
```
exp://u.expo.dev/YOUR_PROJECT_ID?channel-name=production
```

### Step 9: Update QR Code on Website
Edit `/Users/user/Desktop/MLAF/index.html` and find the QR code section:

```javascript
// Around line 180, replace the QR code URL
const qr = new QRCode(document.getElementById("qrcode"), {
  text: "exp://u.expo.dev/YOUR_PROJECT_ID?channel-name=production",
  width: 200,
  height: 200,
  colorDark: "#0e7490",
  colorLight: "#ffffff",
});
```

### Step 10: Push Updated Website
```bash
cd /Users/user/Desktop/MLAF
git add .
git commit -m "Update QR code with Expo app URL"
git push
```

Wait 1-2 minutes for GitHub Pages to update.

✅ **Mobile app with auto-updates is ready!**

---

## 🔄 How to Push Updates (Daily Workflow)

### For Website Changes:
```bash
cd /Users/user/Desktop/MLAF
git add .
git commit -m "Describe your changes"
git push
```
→ Website updates automatically in 1-2 minutes

### For Mobile App Changes:
```bash
cd /Users/user/Desktop/MLAF/mobile-app
eas update --branch production --message "Fixed bug / Added feature"
```
→ Users get updates within 24 hours (next time they open the app)

**Important:** Users DON'T need to download anything new from the app store!

---

## 📱 How Users Get The App

### Option 1: Development (Expo Go) - Instant Testing
1. User scans QR code on your website
2. Opens in Expo Go app (they need to download Expo Go first)
3. App loads instantly
4. **Pros:** Free, instant testing
5. **Cons:** Requires Expo Go app

### Option 2: Standalone App (Recommended for Production)
1. Build APK/IPA files:
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```
2. Distribute via:
   - **Google Play Store** (Android)
   - **Apple App Store** (iOS)
   - **Direct Download** (Android APK only)
3. Users install once from app store
4. All future updates delivered automatically via EAS Update!

---

## 💰 Costs

| Service | Cost | What You Get |
|---------|------|--------------|
| GitHub Pages | **FREE** | Website hosting |
| Expo EAS Free Tier | **FREE** | Unlimited updates, 30 builds/month |
| Expo EAS Production | $29/month | Unlimited builds, faster |
| Google Play Store | $25 one-time | Publish Android apps |
| Apple App Store | $99/year | Publish iOS apps |

**For your use case: Everything can be FREE!**

---

## 🎯 Quick Reference

### Publish Mobile App Update:
```bash
cd /Users/user/Desktop/MLAF/mobile-app
eas update --branch production --message "Your update"
```

### Update Website:
```bash
cd /Users/user/Desktop/MLAF
git add .
git commit -m "Your changes"
git push
```

### Build Standalone Apps:
```bash
# Android
eas build --platform android --profile production

# iOS  
eas build --platform ios --profile production
```

### Check Build Status:
```bash
eas build:list
```

---

## 🆘 Troubleshooting

### "Git not initialized"
```bash
cd /Users/user/Desktop/MLAF
git init
```

### "Remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/MLAF.git
```

### "EAS not installed"
```bash
npm install -g eas-cli
```

### "Project not configured"
```bash
cd mobile-app
eas build:configure
```

---

## ✅ Success Checklist

- [ ] GitHub account created
- [ ] Repository created and code pushed
- [ ] GitHub Pages enabled
- [ ] Website is live
- [ ] Expo account created
- [ ] EAS CLI installed
- [ ] Mobile app configured with Project ID
- [ ] First EAS update published
- [ ] QR code on website points to app
- [ ] Tested: Scan QR code → App opens

---

## 🎉 You're Done!

Your system is now:
- ✅ Website live on GitHub Pages
- ✅ Mobile app with QR code access
- ✅ Automatic updates for both platforms
- ✅ Zero monthly costs (if using free tiers)

**Next time you make changes:**
1. Edit your code
2. For website: `git push`
3. For mobile app: `eas update`
4. Done! 🚀

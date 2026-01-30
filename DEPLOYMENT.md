# MLAF Deployment Guide

## 🌐 Website Deployment (GitHub Pages)

### Step 1: Create GitHub Repository
1. Go to GitHub.com and create a new repository named `MLAF` or `mlaf-hospital-system`
2. Keep it public (required for free GitHub Pages)
3. Don't initialize with README (we already have one)

### Step 2: Push Code to GitHub
```bash
cd /Users/user/Desktop/MLAF
git init
git add .
git commit -m "Initial commit: MLAF Hospital Lost & Found System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/MLAF.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Select "/ (root)" folder
5. Click Save
6. Your website will be available at: `https://YOUR_USERNAME.github.io/MLAF/`

### Step 4: Update QR Code in index.html
After GitHub Pages is live, update the QR code to point to your Expo app:
- For Expo Go: Use your published Expo app URL
- For custom builds: Use your app store URLs

---

## 🖥️ Backend Deployment (Render)

The backend is a Node.js/Express server that requires a database. Render is the easiest way to host it for free.

### Step 1: Push to GitHub
If you followed the "Website Deployment" steps above, your backend code is already on GitHub!

### Step 2: Deploy to Render
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file I created.
5. Click **Apply**.

### Step 3: Configure Environment Variables
In the Render Dashboard for your new Web Service:
1. Go to **Environment**.
2. Add your **MONGO_URI** (from MongoDB Atlas).
3. Add your **JWT_SECRET** (any long random string).
4. Add **ADMIN_PASS** (the password for your first admin account).

### Step 4: Link Mobile App to Render
1. Once deployed, copy your Render URL (e.g., `https://mlaf-backend.onrender.com`).
2. Open `mobile-app/src/config.js`.
3. Replace `'YOUR_RENDER_URL'` with your actual Render URL.
4. Save and run `eas update --branch production` (or restart Expo) to apply the change.

---

## 📱 Mobile App Deployment (Expo EAS)

### Option A: Expo Go (Development/Testing)
Users scan QR code and open in Expo Go app.

**Pros:**
- Free
- Instant updates
- No app store approval needed

**Cons:**
- Requires Expo Go app installed
- Limited to Expo SDK features
- Not a standalone app

### Option B: Expo EAS Build + Updates (RECOMMENDED)
Create standalone apps with over-the-air (OTA) updates.

#### Setup EAS (One-time)
```bash
cd mobile-app
npm install -g eas-cli
eas login
eas build:configure
```

#### Configure app.json for Updates
```json
{
  "expo": {
    "name": "MLAF",
    "slug": "mlaf-hospital",
    "version": "1.0.0",
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "android": {
      "package": "com.yourhospital.mlaf"
    },
    "ios": {
      "bundleIdentifier": "com.yourhospital.mlaf"
    }
  }
}
```

#### Build Apps
```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

#### Publish Updates (Users get automatically)
```bash
# After making code changes
eas update --branch production --message "Updated icons and UI"
```

#### How Updates Work:
1. User downloads app from App Store/Google Play (one time)
2. You run `eas update` when you push code changes
3. Next time user opens the app, it automatically downloads updates
4. No need to re-download from app store!

---

## 🔄 Continuous Deployment Workflow

### Website (Automatic)
Every time you push to GitHub:
```bash
git add .
git commit -m "Update website content"
git push
```
→ GitHub Pages automatically updates in 1-2 minutes

### Mobile App (Automated via GitHub Actions)
Every time you push to the `main` branch, GitHub will automatically:
1. Build a new Android APK.
2. Create a new "Release" on GitHub.
3. Update the download link on your website.

**To check build status:**
Go to your GitHub repository → **Actions** tab.

**To download the APK:**
Visit your website and click **Download App** or go to your GitHub repository → **Releases**.

---

## 📊 Update Types

### Major Updates (Requires New Build)
- Changing native code
- Adding new native modules
- Updating Expo SDK version
- Changing app.json configuration

**Command:** `eas build --platform all`

### Minor Updates (OTA via EAS Update)
- UI changes (what you just did with icons!)
- JavaScript/React code changes
- Bug fixes
- Feature additions (without native code)

**Command:** `eas update --branch production`

---

## 💰 Pricing

### GitHub Pages: FREE ✅

### Expo EAS:
- **Free tier:** Unlimited OTA updates, 30 builds/month
- **Production tier:** $29/month (unlimited builds, priority support)

For your use case: **Free tier is sufficient!**

---

## 🎯 Quick Start Commands

```bash
# 1. Initialize Git (if not done)
cd /Users/user/Desktop/MLAF
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/MLAF.git
git push -u origin main

# 3. Setup EAS for mobile app
cd mobile-app
npm install -g eas-cli
eas login
eas build:configure

# 4. Publish your first update
eas update --branch production
```

---

## 📱 QR Code Setup

### For Website QR Code:
After setting up EAS, update `index.html`:

```javascript
// Replace the QR code generation with your Expo app URL
const qr = new QRCode(document.getElementById("qrcode"), {
  text: "exp://u.expo.dev/YOUR_PROJECT_ID", // or your published URL
  width: 200,
  height: 200
});
```

### For Distribution:
1. **Development:** QR code → Expo Go app
2. **Production:** App Store/Google Play links
3. **Beta Testing:** TestFlight (iOS) / Internal Testing (Android)

---

## 🚀 Next Steps

1. ✅ Create GitHub account (if needed)
2. ✅ Create Expo account at expo.dev
3. ✅ Push code to GitHub
4. ✅ Enable GitHub Pages
5. ✅ Configure EAS for mobile app
6. ✅ Build first version
7. ✅ Test OTA updates
8. ✅ Submit to app stores (optional)

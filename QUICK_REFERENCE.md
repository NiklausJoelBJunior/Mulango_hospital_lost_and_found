# ⚡ MLAF - Quick Command Reference

## 🚀 First Time Setup

```bash
# 1. Run automated setup
cd /Users/user/Desktop/MLAF
./setup.sh

# 2. Or manual setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/MLAF.git
git push -u origin main

# 3. Setup mobile app updates
cd mobile-app
npm install -g eas-cli
eas login
eas build:configure
eas update --branch production
```

---

## 🌐 Website Updates

```bash
# Make changes to index.html or other files, then:
git add .
git commit -m "Your change description"
git push
```

**Result:** Website updates at `https://YOUR_USERNAME.github.io/MLAF/` in 1-2 minutes

---

## 📱 Mobile App Updates

```bash
# After making changes to mobile-app/src/ files:
cd mobile-app
eas update --branch production --message "Your change description"
```

**Result:** All users get updates within 24 hours (next app launch)

---

## 🏗️ Build New App Version

```bash
cd mobile-app

# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production

# Both
eas build --platform all --profile production
```

---

## 🔍 Check Status

```bash
# Check build status
eas build:list

# Check update status
eas update:list --branch production

# Check project info
eas project:info
```

---

## 🧪 Testing Locally

```bash
# Website
open index.html

# Mobile app
cd mobile-app
npm start
# Scan QR code with Expo Go app
```

---

## 🆘 Common Issues

### Reset Git Remote
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/MLAF.git
```

### Clear Build Cache
```bash
cd mobile-app
rm -rf node_modules .expo
npm install
```

### Force Update App
```bash
cd mobile-app
eas update --branch production --message "Force update" --clear-cache
```

### Reinstall EAS CLI
```bash
npm uninstall -g eas-cli
npm install -g eas-cli
eas login
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Website landing page |
| `mobile-app/app.json` | App configuration |
| `mobile-app/eas.json` | Build configuration |
| `mobile-app/src/screens/` | App screens |
| `.gitignore` | Files to ignore |

---

## 🔗 Important URLs

- **GitHub Repository:** `https://github.com/YOUR_USERNAME/MLAF`
- **Website:** `https://YOUR_USERNAME.github.io/MLAF/`
- **Expo Dashboard:** `https://expo.dev/accounts/YOUR_USERNAME/projects/mlaf-app`
- **EAS Builds:** `https://expo.dev/accounts/YOUR_USERNAME/projects/mlaf-app/builds`

---

## 📞 Get Help

- **Full Setup:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **README:** [README.md](README.md)
- **Expo Docs:** https://docs.expo.dev/

---

## ✅ Daily Checklist

- [ ] Make code changes
- [ ] Test locally (`npm start` or `open index.html`)
- [ ] Commit to Git (`git add . && git commit -m "..."`)
- [ ] Push to GitHub (`git push`) for website
- [ ] OR push to Expo (`eas update`) for mobile app
- [ ] Verify updates are live

---

**💡 Tip:** Bookmark this file for quick reference!

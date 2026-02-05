# 🚀 MLAF Quick Start Guide

Get up and running with MLAF in minutes!

## 📱 Mobile App (React Native)

### Step 1: Start the App

```bash
cd mobile-app
npm start
```

### Step 2: View on Your Device

Choose one option:

**Option A: Physical Device**
1. Install "Expo Go" app from App Store or Google Play
2. Scan the QR code shown in the terminal

**Option B: iOS Simulator** (macOS only)
```bash
npm run ios
```

**Option C: Android Emulator**
```bash
npm run android
```

**Option D: Web Browser**
```bash
npm run web
```

---

## 🌐 Website (Landing Page)

### Option 1: Direct Open
```bash
cd /Users/user/Desktop/MLAF
open index.html
```

### Option 2: Live Server (Recommended)
If you have VS Code with Live Server extension:
1. Right-click on `index.html`
2. Select "Open with Live Server"

### Option 3: Simple HTTP Server
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server
```

Then open: http://localhost:8000

---

## 🎨 Customization Checklist

### Website
- [ ] Update app download URL (line ~395 in index.html)
- [ ] Change contact information (phone, email, location)
- [ ] Add real app store links
- [ ] Replace placeholder content
- [ ] Add your hospital logo

### Mobile App
- [ ] Configure app name in app.json
- [ ] Update bundle identifiers
- [ ] Add custom app icon
- [ ] Configure splash screen
- [ ] Set up backend API endpoints

---

## 📦 What's Included

### Mobile App Screens
✅ Home Screen - Dashboard with quick actions
✅ Search Screen - Find lost items
✅ Report Lost Screen - Submit lost item reports
✅ My Reports Screen - Track your reports
✅ Profile Screen - User settings

### Website Sections
✅ Hero section with medical image
✅ Features showcase (6 features)
✅ Download section with QR code
✅ How it works (4 steps)
✅ Contact form
✅ Professional footer

---

## 🎯 Next Steps

1. **Test the App**
   - Start the mobile app and test all screens
   - Open the website and scan the QR code

2. **Customize**
   - Update branding and colors
   - Add real content and images
   - Configure contact information

3. **Connect Backend**
   - Set up API endpoints
   - Implement authentication
   - Add database integration

4. **Deploy**
   - Website: Deploy to Netlify/Vercel
   - Mobile App: Build with EAS and submit to stores

---

## 🆘 Troubleshooting

### Mobile App Won't Start
```bash
cd mobile-app
rm -rf node_modules
npm install
npm start
```

### QR Code Not Working
Make sure you have Expo Go app installed and your phone is on the same network as your computer.

### Website Not Loading Properly
Check browser console for errors. Make sure you have internet connection (Tailwind CSS loads from CDN).

---

## 📞 Need Help?

- Check README.md files for detailed documentation
- Email: support@mlaf.com
- Phone: +1 (555) 123-4567

**Happy Coding! 🎉**

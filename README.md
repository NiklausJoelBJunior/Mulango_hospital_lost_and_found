# 🏥 MLAF - Medical Lost and Found

A comprehensive hospital lost and found management system with a responsive website and React Native mobile application.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-lightgrey)

---

## 🚀 Quick Start

### Automated Setup (Recommended)
```bash
cd /Users/user/Desktop/MLAF
./setup.sh
```
This interactive script will guide you through:
- ✅ Git initialization
- ✅ GitHub repository creation
- ✅ Code deployment
- ✅ GitHub Pages setup
- ✅ Expo configuration (optional)

### Manual Setup
See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed step-by-step instructions.

---

## 📁 Project Structure

```
MLAF/
├── index.html              # Landing page with QR code
├── mobile-app/            # React Native app
│   ├── src/
│   │   ├── screens/       # App screens (6 total)
│   │   ├── navigation/    # Navigation setup
│   │   └── components/    # Reusable components
│   ├── app.json          # Expo configuration
│   ├── eas.json          # EAS Build configuration
│   └── package.json      # Dependencies
├── SETUP_GUIDE.md        # 📖 Detailed setup instructions
├── DEPLOYMENT.md         # 🚀 Deployment workflows
├── setup.sh              # 🤖 Automated setup script
└── README.md             # This file
```

---

## ✨ Features

### 🌐 Website
- Modern, responsive design with hospital theme (cyan/teal)
- QR code for instant mobile app download
- Feature highlights and how-it-works section
- Contact form integration
- Fast loading, hosted on GitHub Pages (FREE)

### 📱 Mobile App

#### For Users:
- 👀 Browse lost items with photos
- 📦 Post found items with camera/gallery upload
- 🔍 Search and filter by category, location, date
- 📞 Contact information for claims
- 👤 User profile and settings

#### For Admins:
- 🔐 Secure admin login
- ✅ Review and approve/reject submissions
- 📊 Dashboard with pending items count
- 👥 View submitter contact information
- 🔄 Real-time item management

#### Technical Features:
- 🔄 **Over-the-Air Updates** via Expo EAS
- 📱 Works on iOS and Android
- 🎨 Professional vector icons
- 📸 Image upload capability
- 🌓 Smooth navigation
- ⚡ Fast performance

---

## 🌐 Deployment

### Website → GitHub Pages (FREE)
Your website will be live at: `https://YOUR_USERNAME.github.io/MLAF/`

**To update:**
```bash
git add .
git commit -m "Update website content"
git push
```
Website updates automatically in 1-2 minutes!

### Mobile App → Expo EAS Updates (FREE)
**To push updates to all users:**
```bash
cd mobile-app
eas update --branch production --message "Bug fixes and improvements"
```
Users get updates automatically on next app launch! No app store resubmission needed!

---

## 🛠️ Tech Stack

### Website
- **HTML5** - Structure
- **Tailwind CSS** - Styling (CDN)
- **QRCode.js** - QR code generation
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter)

### Mobile App
- **React Native** 0.81.5 - Framework
- **Expo SDK** ~54.0 - Development platform
- **React Navigation** - Routing
- **@expo/vector-icons** - Professional icons (Ionicons, MaterialIcons, FontAwesome5)
- **expo-image-picker** - Camera & gallery access
- **expo-updates** - Over-the-air updates
- **react-native-safe-area-context** - Safe areas

---

## 📱 Mobile App Screens

| Screen | Purpose | Features |
|--------|---------|----------|
| **Home** | Dashboard | Recent items, quick actions, stats |
| **Search** | Find items | Filters, categories, search bar |
| **Post Item** | Submit found items | Form, image upload, validation |
| **Profile** | User settings | Menu, preferences, logout |
| **Admin Login** | Secure access | Demo credentials display |
| **Admin Dashboard** | Manage items | Approve/reject, contact info |

---

## 🎯 User Flow

### For Regular Users:
1. 📱 Scan QR code on website → Download app
2. 🔍 Browse lost items or search
3. 📦 Found something? Post it with photo
4. ⏳ Admin reviews and approves
5. ✅ Item appears in public feed

### For Admins:
1. 🔐 Login with credentials
2. 📊 View pending items dashboard
3. ✅ Review details and contact info
4. ✓ Approve or ✕ Reject
5. 🔔 Submitter gets notified

---

## 📊 Update Strategy

### 🔄 Minor Updates (OTA via EAS Update)
Perfect for:
- UI changes (icons, colors, layouts)
- Bug fixes
- New features (JavaScript only)
- Text updates

**Command:**
```bash
eas update --branch production --message "Your update"
```

**Users get updates:** Within 24 hours (next app launch)

### 🏗️ Major Updates (New Build Required)
Needed for:
- Native module changes
- Expo SDK version upgrades
- Build configuration changes
- New permissions

**Command:**
```bash
eas build --platform all --profile production
```

**Users get updates:** Via app store update

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier | What You Get |
|---------|-----------|-----------|--------------|
| **GitHub Pages** | ✅ Unlimited | N/A | Website hosting |
| **Expo EAS** | ✅ 30 builds/month<br>Unlimited updates | $29/month<br>Unlimited builds | App hosting & updates |
| **Google Play** | N/A | $25 one-time | Android distribution |
| **Apple App Store** | N/A | $99/year | iOS distribution |

**💡 You can start 100% FREE and upgrade only when needed!**

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Complete setup walkthrough with screenshots |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deployment strategies and workflows |
| **[QUICK_START.md](QUICK_START.md)** | Quick reference guide |
| **[mobile-app/README.md](mobile-app/README.md)** | Mobile app technical details |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Project overview |

---

## 🔐 Demo Credentials

**Admin Login:**
```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT:** Change these credentials in production!

Edit: `/Users/user/Desktop/MLAF/mobile-app/src/screens/AdminLoginScreen.js`

---

## 🚀 Getting Started (3 Options)

### Option 1: Automated (Easiest)
```bash
./setup.sh
```

### Option 2: Manual GitHub + Expo
Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Option 3: Local Development Only
```bash
# Website
open index.html

# Mobile App
cd mobile-app
npm install
npm start
```

---

## 🔄 Daily Workflow

### Making Changes to Website:
1. Edit `index.html` or other files
2. Test locally: `open index.html`
3. Deploy:
   ```bash
   git add .
   git commit -m "Describe changes"
   git push
   ```
4. ✅ Live in 1-2 minutes!

### Making Changes to Mobile App:
1. Edit files in `mobile-app/src/`
2. Test: `npm start` and scan QR code
3. Deploy:
   ```bash
   cd mobile-app
   eas update --branch production --message "Describe changes"
   ```
4. ✅ Users get updates within 24 hours!

---

## 🎨 Customization

### Change Hospital Name/Branding:
- Edit `index.html` - Update text and hospital name
- Edit `mobile-app/app.json` - Update app name
- Replace logo in `mobile-app/assets/`

### Change Colors:
- Website: Edit Tailwind colors in `index.html`
- Mobile: Edit colors in each screen's StyleSheet
- Primary color: `#0e7490` (cyan/teal)

### Add Features:
- See `mobile-app/src/screens/` for examples
- Add new screens in `mobile-app/src/screens/`
- Update navigation in `mobile-app/src/navigation/AppNavigator.js`

---

## 🆘 Troubleshooting

### Website not showing on GitHub Pages?
1. Check Settings → Pages is enabled
2. Wait 2-3 minutes for deployment
3. Clear browser cache

### Mobile app not updating?
```bash
cd mobile-app
eas update --branch production --message "Force update"
```

### EAS CLI errors?
```bash
npm install -g eas-cli@latest
eas login
```

### Build failures?
```bash
cd mobile-app
rm -rf node_modules
npm install
eas build --platform android --profile production
```

---

## ✨ Roadmap

### Planned Features:
- [ ] 🔔 Push notifications for new items
- [ ] 📧 Email notifications
- [ ] 🗄️ Backend API integration
- [ ] 💾 Database (Firebase/Supabase)
- [ ] 🌍 Multi-language support
- [ ] 🔍 Advanced search filters
- [ ] 📊 Analytics dashboard
- [ ] 🖼️ Multiple image uploads
- [ ] 💬 In-app messaging
- [ ] ⭐ Item rating system

---

## 🤝 Contributing

This is a hospital internal project. For feature requests or bug reports, contact your IT department.

---

## 📄 License

MIT License - Free to use and modify for your hospital's needs.

---

## 🙏 Acknowledgments

- Built with ❤️ for healthcare workers
- Icons by Expo Vector Icons
- UI inspiration from modern hospital systems
- QR code by QRCode.js

---

## 📞 Support

- 📖 **Documentation:** See files listed above
- 🐛 **Issues:** Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
- 💬 **Questions:** Contact IT administrator
- 🚀 **Updates:** Follow [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

**🏥 Making lost items found, one scan at a time!**

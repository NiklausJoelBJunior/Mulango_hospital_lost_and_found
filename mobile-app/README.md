# MLAF Mobile App

A React Native mobile application for the Medical Lost and Found (MLAF) system built with Expo.

## Features

- 🏠 **Home Screen**: Dashboard with quick actions, stats, and recent found items
- 🔍 **Search**: Advanced search with category filters to find lost items
- 📋 **Report Lost**: Easy form to report lost items
- 📱 **My Reports**: Track all your lost item reports and their status
- 👤 **Profile**: User profile and settings management

## Tech Stack

- **React Native** with Expo
- **React Navigation** for navigation
- **Bottom Tab Navigation** for main screens
- **Stack Navigation** for modal screens

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your phone (for testing)

### Installation

1. Navigate to the mobile-app directory:
```bash
cd mobile-app
```

2. Install dependencies (if not already installed):
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

This will open Expo DevTools in your browser.

#### Run on Different Platforms

- **iOS Simulator** (macOS only):
```bash
npm run ios
```

- **Android Emulator**:
```bash
npm run android
```

- **Web Browser**:
```bash
npm run web
```

- **Physical Device**:
  1. Install the Expo Go app from App Store or Google Play
  2. Scan the QR code shown in the terminal or Expo DevTools

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/           # App screens
│   │   ├── HomeScreen.js
│   │   ├── SearchScreen.js
│   │   ├── ReportLostScreen.js
│   │   ├── MyReportsScreen.js
│   │   └── ProfileScreen.js
│   ├── components/        # Reusable components
│   └── navigation/        # Navigation setup
│       └── AppNavigator.js
├── assets/               # Images, fonts, etc.
├── App.js               # Main app component
└── package.json         # Dependencies
```

## Color Theme

The app uses a hospital-friendly color scheme:
- Primary: `#0e7490` (Cyan/Teal)
- Background: `#f5f5f5` (Light Gray)
- White: `#ffffff`
- Text: `#333333`

## Features Overview

### Home Screen
- Welcome header with app branding
- Search bar for quick item lookup
- Quick action buttons (Report Lost, Search, My Reports)
- Statistics display (Items Found, Items Returned)
- Recent found items list
- Help section with contact support

### Search Screen
- Advanced search with text input
- Category filtering (All, Electronics, Personal, Accessories, Documents)
- Item cards with claim buttons
- Empty state when no results found

### Report Lost Screen
- Item name input
- Category selection (Electronics, Personal Items, Accessories, Documents, Other)
- Description text area
- Last seen location input
- Submit and cancel buttons
- Helpful tips for users

### My Reports Screen
- List of all reported items
- Status tracking (Searching, Match Found, Claimed)
- Match count display
- View match details button

### Profile Screen
- User profile header with avatar
- Statistics (Reports, Found, Claimed)
- Menu items for various settings
- Logout option

## Next Steps

- [ ] Connect to backend API
- [ ] Add authentication
- [ ] Implement image upload for items
- [ ] Add push notifications
- [ ] Implement real-time updates
- [ ] Add location services
- [ ] Integrate QR code scanning

## Support

For issues or questions, contact: support@mlaf.com

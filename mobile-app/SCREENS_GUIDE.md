# 📱 MLAF Mobile App - Screen Guide

Quick reference for all screens in the MLAF mobile application.

---

## 🏠 Home Screen
**File**: `src/screens/HomeScreen.js`

### Features
- Welcome header with MLAF branding
- Search bar for quick lookups
- 3 Quick action buttons:
  - 📋 Report Lost
  - 🔎 Search Items
  - 📱 My Reports
- Statistics cards (Items Found, Items Returned)
- Recent found items list
- Help section with contact button

### Navigation
- Tapping "Report Lost" → Opens Report Lost Screen (modal)
- Tapping "Search Items" → Goes to Search tab
- Tapping "My Reports" → Goes to My Reports tab
- Item cards → Can be tapped for details (future feature)

---

## 🔍 Search Screen
**File**: `src/screens/SearchScreen.js`

### Features
- Search input field
- Category filter chips:
  - All
  - Electronics
  - Personal
  - Accessories
  - Documents
- Filtered results count
- Item cards with:
  - Item icon
  - Item name
  - Category badge
  - Location
  - Date found
  - "Claim" button
- Empty state when no results

### Functionality
- Real-time search filtering
- Category selection
- Combined search + category filtering
- Claim button (alerts - future: implement claim flow)

---

## 📋 Report Lost Screen
**File**: `src/screens/ReportLostScreen.js`

### Features
- Beautiful header with icon
- Form fields:
  - Item Name (required)
  - Category selection (required):
    - Electronics
    - Personal Items
    - Accessories
    - Documents
    - Other
  - Description (optional, multiline)
  - Last Seen Location (required)
- Info box with helpful tip
- Submit button
- Cancel button

### Functionality
- Form validation
- Alert on successful submission
- Returns to previous screen after submission
- Category buttons highlight when selected

---

## 📱 My Reports Screen
**File**: `src/screens/MyReportsScreen.js`

### Features
- Header with title and subtitle
- List of user's reports with:
  - Item icon
  - Item name
  - Report date
  - Status badge (color-coded):
    - 🟡 Searching (yellow)
    - 🟢 Match Found (green)
    - 🔵 Claimed (blue)
  - Matches found count
  - "View Match Details" button (when match found)
- Empty state when no reports

### Status Colors
- **Searching**: Yellow background, brown text
- **Match Found**: Green background, dark green text
- **Claimed**: Blue background, dark blue text

---

## 👤 Profile Screen
**File**: `src/screens/ProfileScreen.js`

### Features
- Profile header with:
  - Avatar (initials)
  - User name
  - Email address
- Statistics card:
  - Reports count
  - Found items count
  - Claimed items count
- Menu items:
  - 👤 Edit Profile
  - 🔔 Notifications
  - 🔒 Privacy & Security
  - ❓ Help & Support
  - 📄 Terms & Conditions
  - ℹ️ About MLAF
- Log Out button
- Version number

### Functionality
- Menu items tappable (future: implement each section)
- Log out button (future: implement authentication)
- Clean, organized settings layout

---

## 🎨 Design Consistency

### Colors
All screens use the same hospital theme:
- **Primary**: `#0e7490` (Teal/Cyan)
- **Background**: `#f5f5f5` (Light Gray)
- **Cards**: `#ffffff` (White)
- **Text Primary**: `#333333`
- **Text Secondary**: `#666666`
- **Text Tertiary**: `#999999`

### Components
- **Card Style**: White background, rounded corners (15px), subtle shadow
- **Buttons**: Rounded (12-20px), teal background, white text
- **Icons**: Emoji-based for consistency and fun
- **Typography**: Clean, hierarchy-based sizing

### Navigation
- **Bottom Tabs**: 4 main screens (Home, Search, My Reports, Profile)
- **Modal**: Report Lost screen opens as modal
- **Tab Icons**: Emoji-based
- **Active State**: Teal color (#0e7490)

---

## 🔄 Navigation Flow

```
Main App
├── Bottom Tabs
│   ├── Home Tab (🏠)
│   │   └── Quick Actions → Report Lost (Modal)
│   │                    → Search Tab
│   │                    → My Reports Tab
│   ├── Search Tab (🔍)
│   ├── My Reports Tab (📋)
│   └── Profile Tab (👤)
└── Modal Screens
    └── Report Lost Screen
```

---

## 📊 Data Structure Examples

### Item Object
```javascript
{
  id: 1,
  name: 'Black Wallet',
  category: 'Personal',
  location: 'ER - Room 203',
  date: '2 hours ago',
  status: 'Found'
}
```

### Report Object
```javascript
{
  id: 1,
  name: 'Black Wallet',
  status: 'Searching', // or 'Match Found', 'Claimed'
  date: 'Nov 10, 2025',
  matches: 0
}
```

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Image upload for items
- [ ] Push notifications
- [ ] Real-time chat with staff
- [ ] QR code scanning
- [ ] Map integration for locations
- [ ] Photo matching AI
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode
- [ ] Analytics dashboard

### Technical Improvements
- [ ] State management (Redux/Context)
- [ ] API integration
- [ ] Authentication (JWT)
- [ ] Error handling
- [ ] Loading states
- [ ] Pagination
- [ ] Image caching
- [ ] Push notifications setup

---

## 📝 Notes for Development

### Adding New Screens
1. Create screen file in `src/screens/`
2. Import in `AppNavigator.js`
3. Add to navigation stack or tabs
4. Follow existing design patterns

### Styling Best Practices
- Use StyleSheet.create() for performance
- Keep colors in theme object
- Reuse common styles
- Follow 4px grid system
- Use consistent spacing (15-20px padding)

### Component Structure
- Functional components with hooks
- PropTypes for type checking (future)
- Commented code for clarity
- Semantic naming

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0

# Tori - Business Management and Appointments System
---

## About the Project

**Tori** enables users to search for businesses and book appointments, all in one place.

- Advanced search features for quick appointment booking
- Built from initiation to deployment using industry best practices
- Integration with Firebase (Auth, Firestore, Storage, Functions, Messaging)
- UI/UX designed using Figma
- Managed as a team project using industry workflow tools

## Table of Contents

- [About the Project](#about-the-project)
- [Screenshots](#screenshots)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Running the App](#running-the-app)
- [Features](#features)
- [Project Structure](#project-structure)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Screenshots

### Customer Flow

Flow of screens from the customer perspective (general flow shown; some screens may have changed in later versions):

<div align="center">
  <img src="screenshots/customer/Customer2-1.png" alt="Customer Flow Part 1" width="800"/>
  <img src="screenshots/customer/Customer2-2.png" alt="Customer Flow Part 2" width="800"/>
</div>

- Welcome Screen
- Register/Login
- Customer HomePage
- Advanced Search Filters
- Quick Appointment Page
- My Appointments
- Saved/Favorite Businesses
- Business Page
- Appointment in SalonDetails

### Business Flow

Flow of screens from the business’s perspective:

<div align="center">
  <img src="screenshots/business/Business2-1.png" alt="Business Flow Part 1" width="800"/>
  <img src="screenshots/business/Business2-2.png" alt="Business Flow Part 2" width="800"/>
  <img src="screenshots/business/Business2-3.png" alt="Business Flow Part 3" width="800"/>
  <img src="screenshots/business/Business2-4.png" alt="Business Flow Part 4" width="800"/>
  <img src="screenshots/business/Business2-5.png" alt="Business Flow Part 5" width="800"/>
</div>

- Business Registration Steps
- Business Dashboard
- Business Calendar and Appointments Management
- Business Settings
- Stats Page

---

## System Requirements

- **Node.js** v22.11.0 or higher  
- **npm** v11.1.0 or higher  
- **React Native** development environment  
- **Android Studio** (for Android development)  
- **Xcode** (for iOS development, macOS only)  
- **Firebase** project setup (Auth, Firestore, Storage, Functions, Messaging)  

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/SamuraiPolix/Tori.git
    cd Tori
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

---

## Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com)
2. Add your Android and iOS apps to the Firebase project
3. Download and place the configuration files:
    - `google-services.json` for Android → place in `src/services/`
    - `GoogleService-Info.plist` for iOS → place in `src/services/`
4. Enable these Firebase services:
    - Authentication
    - Cloud Firestore
    - Cloud Storage

---

## Running the App

### Android

```bash
# Start Metro bundler
npm start

# In a new terminal, run on Android
npm run android
```

### iOS

```bash
# Start Metro bundler
npm start

# In a new terminal, run on iOS
npm run ios
```

---

## Running Multiple Emulators

To test both business and customer flows at the same time, you can run two emulators simultaneously.

### Start Multiple Emulators

**Using Command Line:**
```bash
# List devices
emulator -list-avds
# Start first emulator
emulator -avd <Emulator_Name_1> &
# Start second emulator
emulator -avd <Emulator_Name_2> &
```

**Using Android Studio:**
- Open Device Manager and start or duplicate an emulator.
- Launch two emulators from there.

**Verify Running Devices:**
```bash
adb devices
```
You should see output similar to:
```
List of devices attached
emulator-5554   device
emulator-5556   device
```

### Launch the App on Both Emulators
In separate terminals:

```bash
# First instance (e.g., business view)
npx expo start --port 8082

# Second instance (e.g., customer view)
npx expo start --port 8083
```
You can then select each device using the appropriate shortcut or via Expo Go.

---

## Features

- 📅 Appointment Management
- 👥 Customer Management
- 💇‍♂️ Service Management
- 📊 Business Analytics
- ⚙️ Business Settings
- 🔔 Push Notifications

---

## Project Structure

```
Tori/
├── src/
│   ├── components/      # Reusable components
│   ├── screens/         # Screen components
│   ├── services/        # API and service functions
│   ├── styles/          # Global styles
│   └── assets/          # Images, fonts, etc.
├── android/             # Android-specific files
├── ios/                 # iOS-specific files
└── package.json         # Project dependencies
```

---

## Development Notes

- Built with React Native for cross-platform support
- Firebase is used as the backend (Auth, Firestore, Storage, Functions, Messaging)
- UI/UX designed for both LTR and RTL (Hebrew)
- Follows modern React best practices (hooks, functional components)

---

## Troubleshooting

**If issues occur:**

- Clear Metro Bundler cache:
    ```bash
    npm start -- --reset-cache
    ```
- Clean and rebuild Android:
    ```bash
    cd android
    ./gradlew clean
    cd ..
    npm run android
    ```
- Clean and rebuild iOS:
    ```bash
    cd ios
    pod deintegrate
    pod install
    cd ..
    npm run ios
    ```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to your branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**For any questions or suggestions, please open an issue on the GitHub repository.**


```markdown
# 🚶 Walk Tracker App

A React Native application to track walking routes using GPS and display them on an interactive map. Built as part of a React Native developer hiring assignment.

---

## 📱 Features

### ✅ Core Functionality
- Start/Stop walk tracking
- Live walking duration timer
- Records GPS coordinates every 5–10 seconds
- Displays walking path using polylines
- Saves completed walks to local storage (AsyncStorage)
- Lists previous walks with duration and date
- Tap any walk to view its path on map

---

## 🧱 Tech Stack

- **React Native** (latest version) with **TypeScript**
- **react-navigation** for screen navigation
- **react-native-maps** with **Google Maps**
- **@react-native-async-storage/async-storage** for data persistence
- **React Hooks** for state management

---

## 📂 Project Structure

```

walk-tracker-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Home, Saved Walks, Walk Detail
│   ├── hooks/            # Custom hooks (e.g. useWalkTracking)
│   ├── services/         # Location & storage services
│   ├── utils/            # Utility functions like distance calc, formatting
│   └── types/            # Type definitions
├── android/
├── ios/
├── README.md
├── package.json
└── screenshots/

````

---

## 📸 Screenshots

*(Add your screenshots in `/screenshots` folder and link here)*

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/walk-tracker-app.git
cd walk-tracker-app
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Google Maps

* Get a **Google Maps API Key**
* Add it to:

  * `android/app/src/main/AndroidManifest.xml`
  * `ios/<project>/AppDelegate.m` or `AppDelegate.swift`

### 4. Run the App

**Android**

```bash
npx react-native run-android
```

**iOS**

```bash
npx pod-install
npx react-native run-ios
```

---

## 📌 Architecture & Design Decisions

* **Hooks-first approach** for simplicity and separation of concerns.
* **No Redux**: kept state management simple using `useState` and `useContext`.
* Polyline path drawn using `react-native-maps` during walk session.
* Used `AsyncStorage` for offline-first saved walk data.

---

## 📦 Known Limitations

* Location tracking stops if app is killed or backgrounded (as per requirements).
* No backend or cloud sync.
* Distance calculation is basic (straight-line between points).

---

## 🧪 Testing Instructions

* Start the app and allow location permissions.
* Tap **Start** to begin tracking.
* Walk for a bit; route will appear as polyline.
* Tap **Stop** to save the walk.
* Navigate to **Saved Walks** to view list and tap to re-view a route.

---

## 🔥 Bonus Features Implemented

* [x] Distance calculation during walk
* [x] Walk statistics (total distance, time, etc.)
* [x] Start/End markers on map
* [x] Smooth UI animations

---

## 📦 Deliverables

* ✅ Complete Source Code
* ✅ Screenshots / APK Demo
* ✅ Setup Instructions (this README)
* ✅ Clear Folder Structure

---

## 🙋‍♂️ Questions?

Feel free to reach out if any setup issues arise or clarification is needed!

---

> Built with ❤️ for walking and clean code.

```

---

Let me know if you’d like me to [generate a sample APK build guide](f) or help with [adding screenshots to the README](f).
```

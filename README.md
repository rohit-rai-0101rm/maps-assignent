# Walk Tracker App

A React Native app to track walking routes using GPS and display them on an interactive map using Google Maps. Demonstrates GPS tracking, polyline rendering, and local storage with AsyncStorage.

---

## Features

### Home Screen

* Google Map showing user's current location
* Start/Stop walk tracking
* Walk duration timer
* Polyline route drawn in real time

### Saved Walks Screen

* List of saved walks with timestamp and duration
* Tap any walk to view its route on map

### GPS + Local Storage

* Requests location permissions
* Tracks coordinates every 5–10 seconds
* Saves each completed walk to AsyncStorage

---

## Tech Stack

* React Native (latest stable)
* TypeScript
* React Navigation
* react-native-maps (Google Maps)
* @react-native-async-storage/async-storage
* React hooks (`useState`)

---

## Architecture Decisions

* TypeScript: For type safety and scalability
* Local State: Kept minimal with React hooks
* Persistent Storage: AsyncStorage used for simple walk data
* Maps: Google Maps via `react-native-maps`

---

## Repository Structure

```
MapsAssignment/
├── src/
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── types/
├── android/
├── ios/
├── README.md
├── package.json
└── screenshots/
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:rohit-rai-0101rm/maps-assignent.git
cd walk-tracker-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Add Google Maps API Key

#### Android

Add inside `android/app/src/main/AndroidManifest.xml` under `<application>`:

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

#### iOS

In `AppDelegate.mm`, add:

```objc
#import <GoogleMaps/GoogleMaps.h>
```

Then inside `didFinishLaunchingWithOptions:`:

```objc
[GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
```

Then:

```bash
cd ios && pod install && cd ..
```

### 4. Run the App

```bash
npx react-native run-android
# or
npx react-native run-ios
```

---

## Testing Instructions

1. Ensure location permissions are granted.
2. Press Start Walk to begin tracking.
3. Move around; the route will be drawn as a polyline.
4. Press Stop Walk to save.
5. Go to Saved Walks to view past sessions.

---

## Recommended Devices/Simulators

* Android: Pixel 4+ (API 30+), GPS-enabled emulator or real device
* iOS: iPhone 11+ (iOS 14+), preferably a physical device (for accurate GPS)
* Make sure the emulator/simulator has location services enabled

---



## Known Limitations

* No background location tracking
* Basic error messages (e.g., "Location unavailable")
* Minimalist UI (focus was on functionality)

---



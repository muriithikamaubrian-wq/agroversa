# Packaging AgroVersa as an app

Easiest first. Paths 1 and 2 need no coding tools.

## 1. Install from a web address (phone and PC)
The build already includes the files that make the app installable (`manifest.webmanifest`, `sw.js`, icons).

1. Put the app on a secure (https) address. The simplest free way is GitHub Pages:
   - Push this repository to GitHub (the workflow in `.github/workflows/pages.yml` is already included).
   - On GitHub open **Settings > Pages** and set **Source** to **GitHub Actions**.
   - After the next push the address is `https://YOUR-USERNAME.github.io/agroversa/`.
   - No GitHub? Drag the `dist` folder onto netlify.com/drop for an https address.
2. Install it:
   - **Android (Chrome):** menu, then **Install app** (or **Add to Home screen**).
   - **iPhone (Safari):** Share, then **Add to Home Screen**.
   - **Windows or Mac (Edge or Chrome):** click the install icon at the right of the address bar, then **Install**.

It opens like a normal app, in its own window, and works offline after the first visit. New builds replace the old one the next time the app is opened with internet.

## 2. Android app file or Windows package without code
Go to pwabuilder.com, enter your https address, and choose **Package for stores**. It produces an Android package and a Windows package from the installable app above.

## 3. Android .apk with Capacitor
Needs Android Studio.
```
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npm run build
npx cap sync android
npx cap open android
```
In Android Studio choose **Build > Build APK(s)**. `capacitor.config.json` is already set up (app id `com.agroversa.app`, web folder `dist`).

## 4. Windows installer (.exe) with Tauri
Needs Rust (rustup.rs) and Visual Studio Build Tools with the C++ workload. WebView2 is already on Windows 10 and 11.
```
npm install -D @tauri-apps/cli
npx tauri init
npx tauri build
```
When `tauri init` asks: app name `AgroVersa`, frontend files `../dist`, dev URL `http://localhost:3000`, build command `npm run build`. The installer is created in `src-tauri/target/release/bundle/`.

## 5. iPhone App Store
Needs a Mac with Xcode and an Apple developer account. Use Capacitor (`@capacitor/ios`) the same way as Android. Without that, use **Add to Home Screen** from path 1.

## Good to know
- Fingerprint sign-in and device notifications need an https address or `localhost`. They work in the installed web app (path 1). In the Capacitor and Tauri wrappers they may need native plugins.
- Data is kept on each device. An installed copy and a browser tab on different addresses do not share records, and there is no sync between devices yet.
- Notifications reach the device only while the app is open or running in the background. Alerts with the app closed need the native Android app.

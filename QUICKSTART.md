# 🚀 On-Demand Service App - Quick Start Guide

This guide will help you run the project on your computer in just a few simple steps.

---

## 🛠️ Step 0: What you need
Before starting, make sure you have these installed:
1. **Node.js** (Download from [nodejs.org](https://nodejs.org/))
2. **VS Code** (Your code editor)

---

## 🏗️ Step 1: Set up the Backend (The Brain)
The backend manages all the data.

1. Open a terminal in the `backend` folder.
2. Type `npm install` and press Enter (wait for it to finish).
3. Type `npx prisma migrate dev --name init` to set up the database.
4. Type `npm run dev` to start the backend.
   * *Keep this window open!*

---

## 🎨 Step 2: Set up the Admin Panel (The Dashboard)
The admin panel is where you manage users and services.

1. Open a **new** terminal in the `admin-panel` folder.
2. Type `npm install` and press Enter.
3. Type `npm run dev` to start the panel.
4. Open your browser and go to `http://localhost:5173`.
   * *Keep this window open!*

---

## 📱 Step 3: Set up the Mobile App (The User App)
This is the app customers use.

1. Open a **third** terminal in the `mobile-app` folder.
2. Type `npm install` and press Enter.
3. Type `npx expo start` to start the app.
4. **To see the app:**
   * **On Phone:** Download "Expo Go" from Play Store/App Store. Scan the QR code shown in your terminal.
   * **On Computer:** Press `w` to open it in your web browser.

---

## ✅ You are all set!
Now you have the **Backend**, **Admin Panel**, and **Mobile App** all running at the same time. Happy testing! 🚀

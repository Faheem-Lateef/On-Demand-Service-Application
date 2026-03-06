# Deployment Guide

This guide explains how to deploy each component of the On-Demand Service Application to production.

## 1. Database Deployment (Railway / Supabase)
1. Create a project on [Railway](https://railway.app/) or [Supabase](https://supabase.com/).
2. Provision a MySQL or PostgreSQL database. (If switching to Postgres from MySQL, update the Prisma schema `provider = "postgresql"`).
3. Copy the production connection string.
4. From your local terminal with the production url in your `.env`:
   ```bash
   npx prisma migrate deploy
   ```

## 2. Backend Deployment (Render / Heroku)
1. Sign up for [Render](https://render.com/).
2. Click **New Web Service** and connect this GitHub repository.
3. Configure the settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Add the following Environment Variables:
   - `DATABASE_URL` (From step 1)
   - `JWT_SECRET` (A strong randomly generated 64-byte hex string)
   - `PORT` = `3000`

## 3. Web Admin Panel Deployment (Vercel)
1. Sign up for [Vercel](https://vercel.com).
2. Click **Add New Project** and import the GitHub repo.
3. Edit the project's **Root Directory** settings to be `admin-panel`.
4. Vercel automatically detects Next.js.
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `<Your-Render-Backend-URL>/api`
6. Click **Deploy**.

## 4. Mobile App Deployment (Expo EAS)
1. Set up your Expo account and install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. Navigate to `mobile-app` and initialize the project:
   ```bash
   eas build:configure
   ```
3. Update `src/lib/api.ts` to use your production Backend URL instead of the local IP.
4. Build for Android/iOS:
   ```bash
   eas build -p android --profile preview
   # or
   eas build -p ios --profile preview
   ```
5. You can submit the resulting artifacts directly to app stores:
   ```bash
   eas submit -p android
   ```

---
name: verify-stack
description: Verify dependencies and tech stack sanity across the monorepo-like structure.
---

# Verify Stack Skill

This skill allows the agent to check the health of the project structure and dependencies.

### Instructions:
1. Navigate to the `backend` folder and check `package.json` for Express, Prisma, and TypeScript.
2. Navigate to the `mobile-app` folder and check `package.json` for Expo and React Native.
3. Navigate to the `admin-panel` folder and check `package.json` for Next.js and Tailwind CSS.
4. Ensure `node_modules` are properly aligned or if `npm install` needs to be run in any of the subdirectories.

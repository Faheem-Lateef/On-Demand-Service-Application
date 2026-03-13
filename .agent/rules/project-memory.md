---
description: always-on activation covering our tech stack, coding standards, and key architectural decisions
alwaysOn: true
---

# Project Memory & Architecture

This Memory Bank contains the core facts about the On-Demand Service Application workspace.

## Tech Stack Overview
- **Backend (API)**: Node.js, Express, TypeScript, Prisma ORM, MariaDB.
- **Mobile App**: React Native (Expo), TypeScript, React Navigation, React Query, Axios.
- **Admin Panel**: Next.js, React, Tailwind CSS, React Query, Axios.

## Architecture & Communication
- REST API exposed by Express backend.
- Mobile and Admin frontend communicate via Axios & React Query for caching/data-fetching.
- JWT-based authentication via `jsonwebtoken` and `bcrypt`.
- Input validation on Backend via Zod.

## Coding Standards
- TypeScript is required across all 3 sub-projects (Strict Mode).
- ESLint and Prettier are configured for maintaining code quality.
- Backend tests are written in Jest (`ts-jest`).
- Use React functional components with hooks.
- Handle async errors in Express using `express-async-handler`.

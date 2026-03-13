---
description: Standard Code Review Workflow
---

# Code Review Workflow

Follow these steps when reviewing code in this repository:

1. **Verify TypeScript Compilation**
   Ensure all TypeScript files compile without errors.
   
2. **Run Linter and Formatter**
   Check for any ESLint or Prettier violations.
   Run in backend:
   // turbo
   `cd backend && npm run lint`

3. **Check Best Practices**
   - Ensure proper typing is used (avoid `any`).
   - For backend: Verify error handling via `express-async-handler`.
   - For frontend: Verify React Query is used for data fetching instead of plain `useEffect`.

4. **Review Security**
   - Verify JWT logic and route protection.
   - Use Zod schemas for all input validations.

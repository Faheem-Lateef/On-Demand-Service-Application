---
description: Standard Testing Workflow
---

# Testing Workflow

Follow these steps to run the test suite:

1. **Backend Tests**
   Navigate to the backend directory and run the Jest test suite.
   // turbo
   `cd backend && npm run test`

2. **Verify Mocks & Database**
   Ensure that Prisma models are mocked in tests or that a separated test database is targeted to avoid mutating real data.

3. **Check Code Coverage**
   Verify all major services (like `bookingService.ts`) have their core functions covered by unit tests.

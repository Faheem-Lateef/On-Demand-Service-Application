# Phase 2: Database Design Checklist

## 1. ORM & Database Setup
- [ ] Initialize Prisma ORM in `backend/`
- [ ] Configure database connection in `.env` (MySQL)

## 2. Schema Definition
- [ ] Define `User` model (Roles: Admin, Provider, Customer)
- [ ] Define `Category` model
- [ ] Define `Service` model
- [ ] Define `Booking` model
- [ ] Setup model relationships (Customer has many bookings, Service belongs to category, etc.)

## 3. Database Migration
- [ ] Generate and run initial migration
- [ ] Verify tables are created in the database

## 4. Seeding
- [ ] Create a seed script for initial roles and demo services
- [ ] Run seed script and verify data

# On-Demand Service Application - System Diagrams

This document contains detailed architectural diagrams explaining the data flow and structure of the On-Demand Service platform. These diagrams are designed for technical interviews, system documentation, and architecture reviews.

## 1. High-Level System Architecture
This diagram illustrates the layered request lifecycle from the client applications through the API gateway down to the database. It highlights the strict Separation of Concerns (Controller -> Service -> DB).

```mermaid
graph TD
    classDef client fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,color:#0f172a;
    classDef api fill:#eef2ff,stroke:#6366f1,stroke-width:2px,color:#312e81;
    classDef db fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d;
    classDef utility fill:#fff1f2,stroke:#f43f5e,stroke-width:2px,color:#881337;

    subgraph "Frontend / Client Layer"
        MA["📱 Mobile App<br/>(React Native / Expo)<br/>Context API & Axios"]:::client
        AP["💻 Admin Panel<br/>(Next.js / Web)<br/>Tailwind & LocalStorage"]:::client
    end

    subgraph "Backend - Node.js/Express (API Gateway)"
        Router{"🚦 Express Router<br/>(Path Matching)"}:::api
        
        MW_Auth["🛡️ Auth Middleware<br/>(JWT Verify & Role Check)"]:::api
        MW_Zod["✅ Zod Validation<br/>(Payload Schema Check)"]:::api
        
        Controllers["🎛️ Controllers<br/>(Extract Req/Res & Catch Errors)"]:::api
        Services["🧠 Services<br/>(Core Business Logic)"]:::api
        
        ErrHandler["🚨 Global Error Handler<br/>(Normalizes AppErrors)"]:::utility
    end

    subgraph "Data Persistence Layer"
        Prisma["⚙️ Prisma Client<br/>(Type-Safe Queries & $transactions)"]:::db
        MariaDB[("🗄️ MariaDB<br/>(Relational Storage)")]:::db
    end

    %% Flow completely defined
    MA -- HTTP Request + JWT --> Router
    AP -- HTTP Request + JWT --> Router
    
    Router --> MW_Auth
    MW_Auth --> MW_Zod
    MW_Zod --> Controllers
    Controllers --> Services
    Services --> Prisma
    Prisma --> MariaDB
    
    %% Error Flow
    Controllers -. Throws Error .-> ErrHandler
    Services -. Throws Error .-> ErrHandler
    Prisma -. DB Constraint Error .-> ErrHandler
```

---

## 2. Authentication & Secure Token Rotation Flow
This sequence details how the system handles secure logins and automatic (silent) token refreshes when the short-lived access token expires.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (App)
    participant Axios as Axios Client (Interceptors)
    participant Auth as Auth Controller
    participant DB as MariaDB

    User->>Axios: Enters Credentials (Login)
    Axios->>Auth: POST /api/auth/login
    Auth->>Auth: bcrypt.compare(password)
    Auth->>Auth: sign(AccessToken, 15m) & sign(RefreshToken, 7d)
    Auth->>DB: Store SHA-256 Hash of RefreshToken (Server Revocation)
    Auth-->>Axios: Return tokens
    Axios->>User: Renders Home Screen
    
    Note over User, DB: ... 20 minutes later ...
    
    User->>Axios: Clicks "My Bookings"
    Axios->>Auth: GET /api/bookings (attaches Expired AccessToken)
    Auth-->>Axios: 401 Unauthorized
    
    Note over Axios: Response Interceptor traps 401<br/>Suspends original request
    
    Axios->>Auth: POST /api/auth/refresh (attaches original RefreshToken)
    Auth->>DB: Validate hash against stored RefreshToken hash
    Auth->>Auth: Generate NEW AccessToken & NEW RefreshToken
    Auth->>DB: Update DB with NEW RefreshToken hash
    Auth-->>Axios: Return new tokens
    
    Note over Axios: Interceptor resumes suspended request
    
    Axios->>Auth: GET /api/bookings (attaches NEW AccessToken)
    Auth-->>Axios: 200 OK (Booking Data)
    Axios->>User: Renders Data without interrupt
```

---

## 3. Provider Onboarding & Admin Approval Flow
Demonstrates the separation of provider creation and public visibility using administrative database flags.

```mermaid
sequenceDiagram
    autonumber
    actor Prov as Unverified Provider
    participant API as User / Auth API
    participant DB as DB (User Table)
    actor Admin as Platform Admin
    actor Cust as Customer Browsing

    Prov->>API: POST /api/auth/register (role: PROVIDER)
    API->>DB: INSERT User (role: PROVIDER, providerStatus: 'PENDING')
    API-->>Prov: Registered but Invisible
    
    Note over Cust, DB: Start of Customer Journey
    Cust->>API: GET /api/users/providers
    API->>DB: SELECT * FROM User WHERE providerStatus = 'APPROVED'
    DB-->>API: Returns empty/other providers
    API-->>Cust: Unverified provider hidden from UI
    
    Note over Admin, DB: Start of Admin Journey
    Admin->>API: GET /api/users/providers/pending
    API->>DB: SELECT * FROM User WHERE providerStatus = 'PENDING'
    DB-->>API: Returns Unverified Provider
    API-->>Admin: Rendered in Next.js Approval Dashboard
    
    Admin->>API: PATCH /api/users/providers/:id/approve
    API->>DB: UPDATE User SET providerStatus = 'APPROVED'
    API-->>Admin: Approval Success
    
    Note over Cust, DB: Customer checks app again
    Cust->>API: GET /api/users/providers
    API->>DB: SELECT * FROM User WHERE providerStatus = 'APPROVED'
    DB-->>API: Returns newly verified provider
    API-->>Cust: Provider is now bookable!
```

---

## 4. Comprehensive Booking & Job Execution Flow
A visual walkthrough of the 'Open Marketplace' booking system. It tracks state mutations (`PENDING` -> `ACCEPTED` -> `COMPLETED`) and emphasizes Atomicity with Prisma Transactions.

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant API as Booking Service
    participant DB as Prisma (MariaDB)
    actor P as Professional

    C->>API: POST /api/bookings (serviceId, time, location)
    
    rect rgb(240, 253, 244)
        Note over API, DB: ATOMIC TRANSACTION START
        API->>DB: 1. INSERT Booking (status: 'PENDING', providerId: NULL)
        API->>DB: 2. INSERT Notification (For matching providers)
        Note over API, DB: ATOMIC TRANSACTION END
    end
    API-->>C: Booking Created - Waiting for Professional
    
    Note over P: Provider opens "Available Jobs" screen
    P->>API: GET /api/bookings/my-bookings (role: PROVIDER)
    API->>DB: SELECT WHERE providerId IS NULL AND status = 'PENDING'
    DB-->>API: Returns open job
    API-->>P: Job Card Rendered
    
    P->>API: PATCH /api/bookings/:id/accept
    
    rect rgb(240, 253, 244)
        Note over API, DB: ATOMIC TRANSACTION START
        API->>DB: 1. UPDATE Booking (status: 'ACCEPTED', providerId: Professional_ID)
        API->>DB: 2. INSERT Notification (Alert Customer: "Job Accepted!")
        Note over API, DB: ATOMIC TRANSACTION END
    end
    API-->>P: Job successfully claimed
    
    Note over C, P: Service takes place at the customer's location
    
    P->>API: PATCH /api/bookings/:id/status (COMPLETED)
    API->>DB: UPDATE Booking (status: 'COMPLETED')
    API-->>P: Job Closed
```

---

## 5. ERD (Entity Relationship Diagram)
Visual representation of the relational data schema in MariaDB.

```mermaid
erDiagram
    USER ||--o{ BOOKING : "creates (as CUSTOMER)"
    USER ||--o{ BOOKING : "claims (as PROVIDER)"
    USER ||--o{ NOTIFICATION : receives
    CATEGORY ||--o{ SERVICE : contains
    CATEGORY ||--o{ USER : "categorizes (PROVIDERS)"
    SERVICE ||--o{ BOOKING : includes

    USER {
        UUID id PK
        String name
        Role role "ADMIN, CUSTOMER, PROVIDER"
        ProviderStatus providerStatus "PENDING, APPROVED, REJECTED"
        UUID categoryId FK "Nullable"
        String refreshToken "Hashed"
    }

    BOOKING {
        UUID id PK
        DateTime scheduledAt
        BookingStatus status "PENDING, ACCEPTED, REJECTED, COMPLETED"
        Decimal totalAmount
        String address
        UUID customerId FK
        UUID providerId FK "Nullable (Open Job)"
        UUID serviceId FK
    }

    SERVICE {
        UUID id PK
        String name
        Decimal price
        UUID categoryId FK
    }
```

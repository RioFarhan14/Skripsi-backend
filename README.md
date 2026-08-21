# Futsal Booking API

REST API and core backend for the **Futsal Booking System**.

The backend manages authentication, futsal field data, reservations, payments, memberships, notifications, and administrative operations.

It serves both:

* Flutter customer application
* React administration dashboard

> **Status:** Legacy V1 / Modernization Baseline
> This repository is the primary focus of the Futsal Booking System architecture modernization.

---

## Overview

The Futsal Booking API was originally developed as the backend for a university thesis project designed to replace manual futsal reservations with a digital booking system.

The API coordinates the main business processes of the platform:

```text
Authentication
Booking
Payment
Membership
Notification
Field Management
Reporting
```

---

## System Architecture

```text
                Flutter Mobile App
                       │
                       │
                       ▼
              Node.js / Express API
                       ▲
                       │
                       │
                React Admin Dashboard

                       │
                       ▼
                  Prisma ORM
                       │
                       ▼
                    MySQL

External Services
├── Midtrans
└── Firebase
```

---

## Main Responsibilities

### Authentication

The API manages:

* User registration
* User login
* Authentication tokens
* Logout
* User profile
* Administrative authentication

---

## Field / Product Management

The backend provides futsal field and membership product data.

Responsibilities include:

* Retrieve available fields
* Retrieve membership products
* Manage product information
* Manage pricing
* Store product image references

---

## Booking

The booking module manages:

* Booking creation
* Schedule validation
* Field availability
* Booking rescheduling
* Booking status
* Booking history

Booking statuses include:

```text
PENDING
BOOKED
ONGOING
COMPLETED
CANCELLED
```

---

## Transactions and Payments

Transactions are integrated with **Midtrans**.

General flow:

```text
Client
  ↓
Create Transaction
  ↓
Backend
  ↓
Midtrans Snap
  ↓
Customer Payment
  ↓
Midtrans Webhook
  ↓
Backend Updates Transaction
  ↓
Booking / Membership Updated
```

Transaction statuses include:

```text
PENDING
PAID
EXPIRED
CANCELLED
```

---

## Membership

Membership functionality includes:

* Membership purchases
* Membership activation
* Membership expiration
* Membership extension
* Booking discounts for active members

---

## Notifications

The backend manages application notifications and integrates with Firebase for push notification functionality.

Notifications may include:

* Upcoming booking reminders
* Payment information
* Booking status updates
* Other application events

---

## Scheduled Jobs

The original V1 backend uses scheduled jobs for time-based operations such as:

```text
Booked
  ↓
Ongoing
  ↓
Completed
```

and other booking or notification-related processing.

The scheduler is currently executed together with the API process.

This will be separated during the cloud modernization process to support horizontally scaled deployments.

---

## Technology Stack

| Technology    | Purpose                          |
| ------------- | -------------------------------- |
| Node.js       | Backend runtime                  |
| Express.js    | REST API framework               |
| Prisma ORM    | Database access                  |
| MySQL         | Relational database              |
| Joi           | Request validation               |
| Jest          | Automated testing                |
| Supertest     | API integration testing          |
| Midtrans      | Payment gateway                  |
| Firebase      | Push notification infrastructure |
| Winston       | Logging                          |
| node-schedule | Scheduled tasks                  |

---

## Current Project Structure

The original backend already separates several technical layers:

```text
src/
├── controller/
├── service/
├── validation/
├── middleware/
├── helpers/
├── routes/
└── utils/
```

This provides a useful foundation, therefore the backend is planned for **refactoring rather than a complete rewrite**.

---

# Modernization Strategy

The backend will be modernized incrementally.

The goal is:

```text
Legacy Backend
      ↓
Reliable Monolith
      ↓
Modular Monolith
      ↓
Containerized Application
      ↓
AWS Deployment
      ↓
Event-Driven Architecture
      ↓
Selective Microservices
```

Microservices are intentionally **not** the first step.

---

## Phase 1 — Reliability and Correctness

Before changing the architecture, critical business processes will be strengthened.

Priority improvements:

### Payment Idempotency

Duplicate Midtrans webhook requests must not create duplicate side effects.

Target behavior:

```text
Payment Webhook
      ↓
Validate Signature
      ↓
Find Transaction
      ↓
Already PAID?
   /         \
 YES          NO
  ↓            ↓
Return       Process Once
```

A duplicate settlement must not:

* Extend membership twice
* Confirm a booking twice
* Generate duplicate side effects

---

### Database Transactions

Multi-step database operations should be atomic.

Example:

```text
Create Transaction
        +
Create Transaction Detail
```

If one operation fails, the entire operation should roll back.

Prisma transactions will be introduced where appropriate.

---

### Booking Concurrency

The booking system must prevent two users from successfully reserving the same overlapping time slot.

Expected behavior:

```text
User A requests 19:00
User B requests 19:00
        ↓
Only one succeeds
```

---

### Identifier Generation

Concurrency-sensitive ID generation based on retrieving the previous record and adding `+1` will be replaced with safer identifiers.

Possible alternatives include:

* Database-generated IDs
* UUID
* UUIDv7
* ULID

---

## Phase 2 — Automated Testing

Business-critical flows will receive stronger automated coverage.

Target areas:

```text
tests/
├── auth/
├── booking/
├── payment/
├── membership/
└── transaction/
```

Important scenarios include:

* Valid login
* Invalid login
* Unauthorized requests
* Booking conflict
* Booking overlap
* Concurrent booking requests
* Successful payment
* Duplicate payment webhook
* Invalid webhook signature
* Expired transaction
* Membership extension
* Membership discount calculation

The goal is not 100% code coverage.

The goal is protecting important **business invariants**.

---

## Phase 3 — Modular Monolith

The backend will gradually move toward domain-oriented modules.

Target:

```text
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── catalog/
│   ├── booking/
│   ├── payment/
│   ├── membership/
│   ├── notification/
│   └── reporting/
│
├── infrastructure/
│   ├── database/
│   ├── midtrans/
│   ├── firebase/
│   └── logging/
│
└── shared/
    ├── errors/
    ├── middleware/
    ├── validation/
    └── utils/
```

The purpose is to establish domain boundaries before extracting services.

---

## Phase 4 — API V2

A cleaner API contract will be introduced.

Example:

```text
/api/v2
```

Potential resource structure:

```http
POST /auth/login
POST /auth/logout
GET  /auth/me

GET  /fields
GET  /fields/:id

GET    /bookings
POST   /bookings
GET    /bookings/:id
PATCH  /bookings/:id/schedule

POST /payments
GET  /payments/:id

GET /memberships/plans
GET /memberships/me

GET   /notifications
PATCH /notifications/:id/read
```

API V2 will focus on:

* Consistent naming
* Consistent HTTP status codes
* Standardized responses
* Standardized error responses
* API documentation

---

## Phase 5 — OpenAPI Documentation

The API contract will be documented using OpenAPI / Swagger.

```text
                   OpenAPI
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       Backend      Flutter      Admin
```

This provides a shared contract between all applications.

---

## Phase 6 — Containerization

The backend will be containerized using Docker.

Target local architecture:

```text
Docker Compose
├── API
└── MySQL
```

Application configuration will be environment-based.

Sensitive configuration must not be hardcoded into source code.

---

## Phase 7 — AWS Deployment

The first AWS deployment will intentionally remain a **modular monolith**.

Target architecture:

```text
Internet
   ↓
HTTPS
   ↓
API Gateway / ALB
   ↓
Amazon ECS Fargate
   ↓
Amazon RDS MySQL
```

Supporting services may include:

* Amazon ECR
* Amazon S3
* AWS Secrets Manager
* Amazon CloudWatch
* Application Load Balancer

---

## Phase 8 — Infrastructure as Code

AWS infrastructure will gradually be managed using **Terraform**.

Example structure:

```text
infrastructure/
└── terraform/
    ├── modules/
    └── environments/
        ├── dev/
        └── prod/
```

---

## Phase 9 — CI/CD

GitHub Actions will automate:

```text
Git Push
   ↓
Lint
   ↓
Tests
   ↓
Docker Build
   ↓
Push to Amazon ECR
   ↓
Deploy to Amazon ECS
```

---

## Phase 10 — Observability

The cloud version will include improved:

* Structured logging
* Request IDs
* Metrics
* Error monitoring
* Health checks
* CloudWatch monitoring
* Distributed tracing where appropriate

---

## Phase 11 — Event-Driven Architecture

Selected workflows will move toward asynchronous communication.

Example:

```text
PaymentSucceeded
       ↓
Amazon EventBridge
       ↓
Amazon SQS
      / \
     /   \
Booking   Notification
Worker      Worker
```

Potential events include:

```text
PaymentSucceeded
PaymentExpired
BookingCreated
BookingConfirmed
BookingCancelled
MembershipActivated
```

---

## Phase 12 — Selective Microservices

Microservices will only be introduced after domain boundaries are proven inside the modular monolith.

Potential extraction order:

```text
Modular Monolith
       ↓
Notification Service
       ↓
Payment Service
       ↓
Booking Service
```

The objective is not to maximize the number of services.

The objective is to learn and implement appropriate distributed-system patterns.

---

## Related Repositories

### Flutter Mobile Application

`RioFarhan14/futsal-booking-user-app`

Customer-facing Android application.

### React Admin Dashboard

`RioFarhan14/futsal-booking-admin`

Administration interface for managing system operations.

---

## Running the Backend

Install dependencies:

```bash
npm install
```

Configure the required environment variables.

Run the application using the available project script.

Database access requires a configured MySQL database and Prisma connection.

---

## Engineering Goals

The modernization of this backend is intended to demonstrate practical knowledge in:

* Backend engineering
* REST API design
* Database consistency
* Concurrency handling
* Payment processing
* Automated testing
* Software architecture
* Docker
* CI/CD
* AWS
* Infrastructure as Code
* Observability
* Event-driven systems
* Distributed systems
* Microservices

---

## Version

### v1.0.0 — Legacy Thesis Release

Original backend implementation developed for the university thesis project.

This release is preserved as the architecture baseline before modernization.

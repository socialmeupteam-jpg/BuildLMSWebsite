# SocialMeUp Academy LMS — PHASES.md

## 1. Purpose

This document defines the official development roadmap for the SocialMeUp Academy LMS.

Development must proceed phase-by-phase.

Each phase should produce a stable, testable, and reviewable increment of the system.

The project must not jump directly into advanced features before the foundational architecture is secure.

---

# 2. Development Philosophy

The LMS must be developed in this order:

```text
Foundation
    ↓
Infrastructure
    ↓
Authentication
    ↓
Authorization
    ↓
Database Security
    ↓
Core Academic System
    ↓
Payments
    ↓
Communication
    ↓
Reporting
    ↓
Hardening
    ↓
Deployment
    ↓
AI
    ↓
Future Scalability
```

Security and data integrity take priority over feature quantity.

---

# 3. Phase 0 — Project Preparation & Architecture Lock

## Objective

Establish the project foundation before writing feature code.

## Tasks

- Confirm project requirements.
- Review `MEMORY.md`.
- Review `RULES.md`.
- Review `SYSTEM_ARCHITECTURE.md`.
- Review PRD.
- Confirm TypeScript-first architecture.
- Confirm Supabase PostgreSQL as database.
- Confirm Supabase Auth.
- Confirm Supabase Storage.
- Confirm Razorpay.
- Confirm Vercel + Railway deployment strategy.
- Establish Git repository.
- Establish development workflow.
- Establish environment strategy.

## Deliverables

```text
Architecture baseline
Repository
Development conventions
Environment strategy
Git workflow
Documentation baseline
```

## Exit Criteria

- Architecture is understood.
- Technology stack is locked.
- No major unresolved architecture conflict exists.

---

# 4. Phase 1 — Repository & Development Infrastructure

## Objective

Create the production-ready project foundation.

## Frontend

Set up:

- React
- TypeScript
- Vite
- React Router
- CSS Modules
- ESLint
- TypeScript strict checking
- Formatting/linting strategy
- Environment configuration

## Backend

Set up:

- Node.js
- Express
- TypeScript
- Environment configuration
- Error handling
- Request IDs
- Logging
- API versioning

## Structure

Frontend:

```text
src/
├── app/
├── components/
├── features/
├── layouts/
├── pages/
├── routes/
├── hooks/
├── services/
├── api/
├── contexts/
├── utils/
├── constants/
├── types/
├── styles/
└── assets/
```

Backend:

```text
src/
├── app/
├── config/
├── modules/
├── middleware/
├── integrations/
├── jobs/
├── validators/
├── types/
└── shared/
```

## Exit Criteria

- Frontend runs.
- Backend runs.
- TypeScript passes.
- Linting passes.
- Production build passes.
- Environment configuration works.

---

# 5. Phase 2 — Supabase Foundation

## Objective

Establish Supabase as the core backend infrastructure.

## Tasks

Configure:

- Supabase project
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Database environments
- Server-side Supabase client
- Frontend Supabase client where appropriate

## Security

Establish:

- Public/anon key handling
- Service-role key handling
- Environment variables
- Secure backend credentials
- RLS strategy

## Important Rule

The Supabase service-role key must never reach the frontend.

## Exit Criteria

- Backend can securely communicate with Supabase.
- Frontend can authenticate through approved mechanisms.
- Secrets are not exposed.
- Supabase connection is validated.

---

# 6. Phase 3 — Database Architecture

## Objective

Build the PostgreSQL data foundation.

## Core Domains

Create database structures for:

```text
Identity
Profiles
Roles
Permissions
Courses
Modules
Lessons
Resources
Batches
Enrollments
Progress
Attendance
Assignments
Submissions
Assessments
Questions
Attempts
Grades
Feedback
Fees
Invoices
Payments
Certificates
Conversations
Messages
Notifications
Grievances
Reports
Audit Logs
Settings
```

## Database Requirements

Use:

- UUID primary keys
- Foreign keys
- Unique constraints
- Check constraints
- Not-null constraints
- Timestamps
- Appropriate indexes

## Exit Criteria

- Core schema is established.
- Relationships are defined.
- Constraints are defined.
- Index strategy is documented.
- No unnecessary duplicate data structures exist.

---

# 7. Phase 4 — RLS & Database Security

## Objective

Secure the database before exposing sensitive application functionality.

## Tasks

Implement and verify RLS for sensitive tables.

Access rules should consider:

```text
Authenticated User
        ↓
Role
        ↓
Permission
        ↓
Ownership
        ↓
Relationship
        ↓
Academic Assignment
```

## Required Scenarios

Test:

- Student → own data
- Student → another student's data
- Parent → linked student
- Parent → unrelated student
- Trainer → assigned student
- Trainer → unrelated student
- Admin → permission-based access

## Exit Criteria

- Sensitive tables have appropriate RLS.
- IDOR scenarios are blocked.
- Unauthorized database reads/writes fail.
- Service-role access remains server-only.

---

# 8. Phase 5 — Authentication

## Objective

Implement secure user authentication.

## Features

- Registration
- Login
- Logout
- Session management
- Password reset
- Email verification where required
- Suspended account handling
- Authentication state persistence

## Supabase

Use Supabase Auth as the authentication provider.

## Frontend

Implement:

- Auth context/state
- Protected routes
- Session-aware navigation
- Loading state
- Authentication errors

## Important Rule

Protected routes are UX protection only.

They do not replace backend authorization or RLS.

## Exit Criteria

All authentication flows work correctly.

---

# 9. Phase 6 — User Profiles & RBAC

## Objective

Build the user identity and authorization model.

## Roles

```text
STUDENT
PARENT
TRAINER
ADMIN
```

## Features

- User profiles
- Role assignment
- Permissions
- Parent-student relationships
- Trainer assignments
- Admin permissions

## Parent Relationship

Parent access must depend on an explicit relationship.

## Trainer Scope

Trainer access must depend on actual academic assignment.

## Exit Criteria

- Roles work.
- Permissions work.
- Parent relationships work.
- Trainer relationships work.
- Unauthorized privilege escalation is blocked.

---

# 10. Phase 7 — Application Shell & Dashboard System

## Objective

Create the common LMS UI foundation.

## Components

Build reusable components such as:

- Sidebar
- Navbar
- Header
- Breadcrumbs
- Cards
- Tables
- Modals
- Forms
- Buttons
- Inputs
- Selects
- Pagination
- Loaders
- Empty states
- Error states
- Toasts

## Dashboards

Create role-aware dashboard foundations for:

- Student
- Parent
- Trainer
- Admin

## Exit Criteria

- Responsive shell works.
- Navigation works.
- Role-aware UI works.
- Accessibility baseline exists.

---

# 11. Phase 8 — Course Management

## Objective

Build the course management system.

## Features

- Course creation
- Course editing
- Course publishing
- Course listing
- Course discovery
- Modules
- Lessons
- Resources
- Course metadata

## Access

Admin/trainer permissions must be enforced.

Students only access authorized course content.

## Exit Criteria

- Courses can be created.
- Courses can be organized.
- Authorized users can access content.
- Unauthorized access is blocked.

---

# 12. Phase 9 — Batch & Enrollment Management

## Objective

Connect students with courses and batches.

## Features

- Batch creation
- Trainer assignment
- Student enrollment
- Enrollment status
- Course membership
- Enrollment history

## Security

Students must only access their own enrollments.

Trainers must only access authorized batches.

## Exit Criteria

- Enrollment lifecycle works.
- Batch relationships work.
- Authorization works.
- Database relationships are consistent.

---

# 13. Phase 10 — Learning & Progress

## Objective

Build the learning experience.

## Features

- Lesson viewing
- Course progress
- Module progress
- Lesson completion
- Progress tracking
- Learning history

## Requirements

Progress must be associated with the correct:

- Student
- Course
- Module
- Lesson

## Exit Criteria

Students can reliably track learning progress.

---

# 14. Phase 11 — Attendance

## Objective

Implement academic attendance.

## Features

- Attendance sessions
- Attendance marking
- Attendance history
- Student attendance view
- Trainer attendance management
- Attendance reports

## Authorization

Trainer can only modify attendance within authorized academic scope.

Student can only view their own attendance.

Parent can view attendance only when authorized.

## Exit Criteria

- Attendance is accurate.
- Unauthorized modifications are blocked.
- Attendance history is available.

---

# 15. Phase 12 — Assignments

## Objective

Implement assignment lifecycle.

## Features

- Assignment creation
- Instructions
- Due dates
- Attachments
- Student submissions
- Submission status
- Trainer feedback
- Submission history

## Storage

Use Supabase Storage for assignment files.

Private submissions must remain private.

## Exit Criteria

Complete assignment workflow works securely.

---

# 16. Phase 13 — Assessments & Quizzes

## Objective

Build assessment functionality.

## Features

- Assessment creation
- Question management
- Options
- Attempt management
- Submission
- Scoring
- Results

## Security

Protect:

- Question data
- Answer keys
- Attempt data
- Results

Do not expose answer keys unnecessarily.

## Exit Criteria

Students can take assessments and receive authorized results.

---

# 17. Phase 14 — Grading & Feedback

## Objective

Build academic grading.

## Features

- Grade entry
- Grade calculation
- Feedback
- Student results
- Trainer grading
- Grade history

## Security

Grades are sensitive academic data.

Access must be scoped by:

- Student
- Trainer
- Parent relationship
- Course/batch

## Audit

Important grade changes must be auditable.

## Exit Criteria

- Grades are correct.
- Unauthorized grade modification is blocked.
- Grade history is traceable.

---

# 18. Phase 15 — Fees & Invoices

## Objective

Build financial management before payment integration.

## Features

- Fee structures
- Student fees
- Invoices
- Due dates
- Payment status
- Outstanding balances
- Payment history

## Important Rule

Financial state must come from authoritative backend/database records.

## Exit Criteria

The LMS can accurately represent financial obligations.

---

# 19. Phase 16 — Razorpay Payment Integration

## Objective

Implement secure online payments.

## Flow

```text
Student
   ↓
Frontend
   ↓
Backend
   ↓
Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment
   ↓
Webhook / Verification
   ↓
Backend
   ↓
Supabase PostgreSQL
   ↓
Enrollment State
```

## Features

- Order creation
- Checkout
- Signature verification
- Webhook verification
- Payment records
- Idempotency
- Duplicate event handling
- Failed payment handling
- Refund handling
- Reconciliation

## Critical Rule

Frontend payment success must never independently activate paid enrollment.

## Exit Criteria

Payment state is server-authoritative and auditable.

---

# 20. Phase 17 — Certificates

## Objective

Implement certificate generation and verification.

## Flow

```text
Course Completion
        ↓
Eligibility
        ↓
Certificate Record
        ↓
Certificate Generation
        ↓
Supabase Storage
        ↓
Student Access
```

## Features

- Certificate eligibility
- Certificate number
- Certificate generation
- Certificate storage
- Student download/view
- Verification reference
- Reissue handling where approved

## Exit Criteria

Certificates are authoritative, secure, and auditable.

---

# 21. Phase 18 — Messaging

## Objective

Build secure communication.

## Features

- Conversations
- Messages
- Authorized participants
- Read/unread state
- Basic real-time updates where required

## Security

Users cannot access conversations simply by knowing a conversation ID.

Access depends on conversation membership.

## Exit Criteria

Only authorized participants can access messages.

---

# 22. Phase 19 — Notifications

## Objective

Build notification infrastructure.

## MVP Channels

- In-app
- Email

## Notification Events

Examples:

- Enrollment
- Payment
- Assignment
- Submission
- Grade
- Attendance
- Certificate
- Grievance
- Announcement
- Security events

## Exit Criteria

Important LMS events can generate appropriate notifications.

---

# 23. Phase 20 — Grievance Management

## Objective

Implement grievance handling.

## Lifecycle

```text
OPEN
 ↓
ASSIGNED
 ↓
IN_PROGRESS
 ↓
RESOLVED
 ↓
CLOSED
```

## Features

- Create grievance
- Assign grievance
- Status changes
- Comments
- Attachments
- Resolution
- History

## Security

Private grievance information must only be accessible to authorized participants.

## Exit Criteria

Grievance lifecycle is complete and auditable.

---

# 24. Phase 21 — Announcements

## Objective

Build academic/administrative announcements.

## Features

- Create announcement
- Publish announcement
- Audience targeting
- Student visibility
- Trainer visibility
- Parent visibility
- Admin management

## Exit Criteria

Announcements reach only their intended audience.

---

# 25. Phase 22 — Reporting

## Objective

Build operational reporting.

## Reports

### Student

- Progress
- Attendance
- Grades
- Assignments
- Payments
- Certificates

### Course

- Enrollment
- Progress
- Completion
- Performance

### Trainer

- Assigned students
- Course performance
- Attendance
- Assignment performance

### Admin

- Students
- Courses
- Enrollment
- Attendance
- Revenue
- Payments
- Certificates
- Trainers
- Grievances

## Architecture

Use PostgreSQL/Supabase for MVP reporting.

Do not introduce an analytics warehouse prematurely.

---

# 26. Phase 23 — Audit System

## Objective

Implement production audit logging.

## Audit Events

Track important actions such as:

- Role changes
- Permission changes
- Grade changes
- Payments
- Refunds
- Certificate issuance
- Account suspension
- Parent linking
- Sensitive profile changes
- Admin configuration
- Grievance actions

## Audit Data

Where appropriate:

```text
actorId
action
resourceType
resourceId
timestamp
requestId
IP
userAgent
metadata
```

## Exit Criteria

Sensitive business operations are traceable.

---

# 27. Phase 24 — API Hardening

## Objective

Harden the backend API.

## Tasks

- Authentication middleware
- Authorization middleware
- Permission checks
- Request validation
- Rate limiting where appropriate
- Request IDs
- Structured errors
- Security headers
- CORS configuration
- Input sanitization/validation
- Safe logging

## Exit Criteria

Unauthorized and malformed requests are handled safely.

---

# 28. Phase 25 — Frontend Security & UX Hardening

## Objective

Ensure frontend behavior is production-quality.

## Tasks

- Protected routes
- Unauthorized pages
- Error boundaries
- Loading states
- Empty states
- Form validation
- Session handling
- Accessibility
- Responsive design
- Keyboard navigation
- Focus management

## Exit Criteria

The frontend behaves correctly under:

- Loading
- Success
- Empty
- Error
- Unauthorized
- Expired session

conditions.

---

# 29. Phase 26 — Testing

## Objective

Validate the system before production deployment.

## Authentication Tests

Test:

- Registration
- Login
- Logout
- Password reset
- Session expiry
- Suspended users

## Authorization Tests

Test:

- Student isolation
- Parent isolation
- Trainer isolation
- Admin permissions
- IDOR
- Privilege escalation
- Unauthorized API access

## Database Tests

Test:

- Foreign keys
- Constraints
- Transactions
- RLS
- Ownership
- Relationships

## Payment Tests

Test:

- Successful payment
- Failed payment
- Duplicate webhook
- Invalid signature
- Delayed webhook
- Refund
- Reconciliation

## Academic Tests

Test:

- Enrollment
- Progress
- Attendance
- Assignment
- Submission
- Assessment
- Grading
- Certificate

## Exit Criteria

Critical workflows pass testing.

---

# 30. Phase 27 — Performance Optimization

## Objective

Optimize only after correctness and security are established.

## Frontend

Use:

- Lazy loading
- Code splitting
- Optimized assets
- Debounced search
- Efficient rendering

## Backend

Use:

- Pagination
- Efficient queries
- Proper indexes
- Response optimization
- Appropriate caching

## Database

Analyze:

- Slow queries
- Missing indexes
- N+1 queries
- Unnecessary joins
- Unbounded queries

## Exit Criteria

Major performance bottlenecks are addressed based on measurement.

---

# 31. Phase 28 — Observability

## Objective

Make production behavior observable.

## Implement

- Structured logging
- Error tracking
- Request IDs
- API monitoring
- Database monitoring
- Payment monitoring
- Authentication monitoring

## Exit Criteria

Production failures can be diagnosed efficiently.

---

# 32. Phase 29 — Deployment

## Objective

Deploy the LMS safely.

## Architecture

```text
Frontend
    ↓
Vercel

Backend
    ↓
Railway

Database
    ↓
Supabase

Authentication
    ↓
Supabase Auth

Storage
    ↓
Supabase Storage

Payments
    ↓
Razorpay
```

## Domains

```text
socialmeupacademy.in
lms.socialmeupacademy.in
api.lms.socialmeupacademy.in
```

## Exit Criteria

- Production frontend deployed.
- Production backend deployed.
- Supabase production configured.
- Environment variables configured securely.
- HTTPS enabled.
- CORS configured.
- Payment webhooks configured.
- Storage permissions verified.

---

# 33. Phase 30 — CI/CD

## Objective

Automate quality and deployment workflows.

## Pipeline

```text
Feature Branch
      ↓
Pull Request
      ↓
Lint
      ↓
Type Check
      ↓
Tests
      ↓
Build
      ↓
Security Checks
      ↓
Staging
      ↓
QA
      ↓
Production
```

## Exit Criteria

Broken code should not reach production through the normal deployment path.

---

# 34. Phase 31 — Backup & Disaster Recovery

## Objective

Ensure recoverability.

## Protect

- PostgreSQL data
- Student records
- Course content
- Assignment submissions
- Certificates
- Important configuration

## Define

- RPO
- RTO
- Backup schedule
- Recovery procedure
- Incident procedure

## Exit Criteria

A documented recovery process exists and is tested.

---

# 35. Phase 32 — Production Security Audit

## Objective

Perform a final security review.

## Review

### Authentication

- Session security
- Password handling
- Account suspension
- Token handling

### Authorization

- RBAC
- Permissions
- RLS
- Ownership
- Relationships
- IDOR

### Storage

- Private buckets
- Signed URLs
- File authorization
- Upload validation

### Payments

- Signature verification
- Webhooks
- Idempotency
- Refunds

### Secrets

- Environment variables
- Service-role key
- Razorpay secret
- AI keys
- Email credentials

### APIs

- Input validation
- Rate limiting
- CORS
- Error handling
- Request IDs

## Exit Criteria

No known critical security issue remains unresolved.

---

# 36. Phase 33 — AI Foundation

## Objective

Introduce AI only after the core LMS is stable.

AI is an extension of the LMS.

It must not become a dependency for core functionality.

## Initial AI Capabilities

Potential features:

- Student chatbot
- Learning assistance
- Course FAQ
- Content discovery
- Study assistance
- Basic personalized guidance

## Architecture

```text
Student
   ↓
Chat UI
   ↓
Backend
   ↓
Authentication
   ↓
Authorization
   ↓
Allowed Data Retrieval
   ↓
AI Provider
   ↓
Response
```

## Exit Criteria

AI operates within the existing security model.

---

# 37. Phase 34 — AI Security

## Objective

Secure AI data access.

## Rules

AI must never:

- Decide permissions
- Decide payment success
- Approve enrollment
- Issue certificates
- Assign final grades
- Bypass RLS
- Access unrestricted database data

## Data Minimization

Only send necessary authorized information to the AI provider.

## Exit Criteria

AI cannot bypass application authorization.

---

# 38. Phase 35 — Realtime Improvements

## Objective

Expand real-time functionality where it provides meaningful value.

Potential features:

- Real-time messaging
- Notifications
- Attendance updates
- Live activity
- Admin monitoring

Use Socket.io only where required.

Do not introduce realtime complexity unnecessarily.

---

# 39. Phase 36 — Background Jobs

## Objective

Move long-running tasks out of synchronous request paths.

Potential jobs:

- Email delivery
- Certificate generation
- Large report generation
- Payment reconciliation
- Reminders
- Bulk operations

A queue/worker system should only be introduced when workload requires it.

---

# 40. Phase 37 — Caching

## Objective

Improve performance when actual usage requires it.

Potential technologies:

- Redis

Potential use cases:

- High-frequency reads
- Rate limiting
- Distributed coordination
- Background job infrastructure

Do not cache sensitive authorization decisions casually.

---

# 41. Phase 38 — Advanced Analytics

## Objective

Introduce advanced analytics only after sufficient data volume and reporting requirements exist.

Potential capabilities:

- Learning analytics
- Student performance trends
- Course completion analytics
- Trainer performance
- Revenue analytics
- Predictive insights

A separate analytics warehouse should only be introduced when justified.

---

# 42. Phase 39 — Advanced Communication

Future communication channels may include:

- WhatsApp
- SMS
- Push notifications

Providers must be selected based on:

- Cost
- Reliability
- API quality
- Compliance
- Delivery rates
- Operational requirements

---

# 43. Phase 40 — Mobile Application

Potential future platform:

```text
Web LMS
    +
Mobile Application
```

Possible mobile features:

- Course learning
- Attendance
- Assignments
- Notifications
- Messaging
- AI assistant

The backend API should remain reusable.

---

# 44. Phase 41 — Multi-Branch Expansion

If SocialMeUp Academy expands to multiple physical branches, architecture may evolve to support:

- Branches
- Branch administrators
- Branch trainers
- Branch-specific students
- Branch reporting
- Branch-specific courses/batches

This should be introduced only when business requirements exist.

---

# 45. Phase 42 — Multi-Tenancy

Multi-tenancy is a future capability.

Do not implement complex multi-tenancy prematurely.

If required later, evaluate:

- Tenant isolation
- RLS
- Data partitioning
- Tenant-aware APIs
- Storage isolation
- Billing
- Administration

A formal ADR must be created before implementation.

---

# 46. Phase 43 — Selective Service Extraction

If the modular monolith reaches a point where independent services are justified, consider extracting only appropriate domains.

Potential candidates:

- Payments
- Notifications
- AI
- Reporting
- File processing
- Background jobs

Do not convert the entire LMS into microservices without a clear requirement.

---

# 47. Phase 44 — Scale Readiness

At higher scale, evaluate:

```text
Database optimization
        ↓
Indexes
        ↓
Query optimization
        ↓
Connection management
        ↓
Caching
        ↓
Background workers
        ↓
Multiple API instances
        ↓
Read replicas
        ↓
Analytics separation
        ↓
Selective service extraction
```

Scale based on actual bottlenecks.

---

# 48. MVP Definition

The MVP should contain:

### Foundation

- React
- TypeScript
- Vite
- Express
- TypeScript backend
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

### Security

- Authentication
- RBAC
- Permissions
- RLS
- Ownership checks
- Relationship checks

### Academic

- Courses
- Modules
- Lessons
- Enrollment
- Progress
- Attendance
- Assignments
- Submissions
- Assessments
- Grades
- Feedback

### Financial

- Fees
- Invoices
- Razorpay payments
- Payment verification

### Certification

- Certificates
- Verification

### Communication

- Notifications
- Basic messaging
- Announcements

### Support

- Grievances

### Administration

- Reports
- Audit logs

---

# 49. Features Deferred From MVP

Do not block MVP on:

- Kafka
- Complex event streaming
- Redis
- Advanced analytics warehouse
- Microservices
- Mobile application
- WhatsApp
- SMS
- Advanced AI infrastructure
- Multi-tenancy
- Multi-branch architecture
- Complex distributed systems

These should be implemented only when justified.

---

# 50. Phase Completion Rule

A phase is complete only when:

```text
Implementation
+
TypeScript Type Safety
+
Validation
+
Authorization
+
Database/RLS
+
Error Handling
+
Loading/Empty States
+
Testing
+
Responsive UI
+
Accessibility
```

are addressed where applicable.

A UI-only implementation does not automatically mean the phase is complete.

---

# 51. Phase Dependency Rules

Phases should generally follow this dependency order:

```text
Phase 0
  ↓
Phase 1
  ↓
Phase 2
  ↓
Phase 3
  ↓
Phase 4
  ↓
Phase 5
  ↓
Phase 6
  ↓
Phase 7
  ↓
Core LMS Features
  ↓
Payments
  ↓
Certificates
  ↓
Communication
  ↓
Reporting
  ↓
Security Hardening
  ↓
Deployment
  ↓
AI
  ↓
Future Scale
```

Do not implement advanced features by bypassing foundational security.

---

# 52. AI Coding Agent Phase Rules

When an AI coding agent receives a feature request:

1. Identify the relevant phase.
2. Check whether prerequisite phases are complete.
3. Read the relevant architecture documentation.
4. Inspect the current repository.
5. Identify affected frontend modules.
6. Identify affected backend modules.
7. Identify affected Supabase tables.
8. Identify affected RLS policies.
9. Identify affected APIs.
10. Implement the smallest complete change.
11. Run TypeScript checks.
12. Run tests.
13. Verify security.
14. Verify responsive/accessibility behavior.
15. Report architectural impact.

---

# 53. Do Not Skip Prerequisites

Examples:

Do NOT build payments before:

- Authentication
- Authorization
- Database
- Fees/invoices
- Secure backend

Do NOT build certificates before:

- Course progress
- Completion rules
- Eligibility logic

Do NOT build AI database access before:

- Authentication
- Authorization
- RLS
- Backend retrieval layer

---

# 54. Phase Prioritization

When multiple tasks are requested, prioritize:

```text
1. Security
2. Data Integrity
3. Authentication
4. Authorization
5. Core Business Logic
6. Database Correctness
7. API Reliability
8. User Experience
9. Performance
10. Advanced Features
```

Do not prioritize visual polish over critical security defects.

---

# 55. Recommended Implementation Sequence

The recommended practical implementation sequence is:

```text
01. Project Setup
02. TypeScript Configuration
03. Supabase Setup
04. Database Schema
05. RLS
06. Authentication
07. RBAC + Permissions
08. Application Shell
09. Dashboards
10. Courses
11. Batches
12. Enrollment
13. Learning Progress
14. Attendance
15. Assignments
16. Assessments
17. Grading
18. Fees + Invoices
19. Razorpay
20. Certificates
21. Messaging
22. Notifications
23. Announcements
24. Grievances
25. Reports
26. Audit Logs
27. Security Hardening
28. Testing
29. Performance
30. Deployment
31. CI/CD
32. Backup/DR
33. AI
34. Realtime Enhancements
35. Background Jobs
36. Caching
37. Advanced Analytics
38. Mobile
39. Multi-Branch
40. Multi-Tenancy
41. Selective Service Extraction
42. Scale Optimization
```

---

# 56. Final Development Principle

The LMS must not be built as a collection of disconnected pages.

Every feature must connect:

```text
UI
 ↓
Typed Frontend Logic
 ↓
API
 ↓
Authentication
 ↓
Authorization
 ↓
Business Logic
 ↓
Supabase PostgreSQL
 ↓
RLS / Constraints
 ↓
Audit / Observability
```

The application should remain secure and maintainable at every phase.

---

# 57. Final Rule

**Complete the foundation before accelerating the features.**

The SocialMeUp Academy LMS should evolve from:

```text
Secure Foundation
```

to:

```text
Complete LMS
```

to:

```text
AI-Powered LMS
```

to:

```text
Scalable Academy Platform
```

without compromising:

**Security + Privacy + Data Integrity + Type Safety + Maintainability + Performance + Accessibility.**

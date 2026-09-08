# SocialMeUp Academy LMS — Production-Ready System Architecture

**Version:** 1.0  
**Status:** Production Architecture Baseline  
**Product:** SocialMeUp Academy LMS

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Goals](#2-architecture-goals)
3. [Architecture Principles](#3-architecture-principles)
4. [System Context](#4-system-context)
5. [High-Level Architecture](#5-high-level-architecture)
6. [Container Architecture](#6-container-architecture)
7. [Component Architecture](#7-component-architecture)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Backend Architecture](#9-backend-architecture)
10. [Domain Module Architecture](#10-domain-module-architecture)
11. [Authentication Architecture](#11-authentication-architecture)
12. [Authorization Architecture](#12-authorization-architecture)
13. [RBAC Architecture](#13-rbac-architecture)
14. [Supabase Architecture](#14-supabase-architecture)
15. [RLS Architecture](#15-rls-architecture)
16. [Database Architecture](#16-database-architecture)
17. [Storage Architecture](#17-storage-architecture)
18. [Learning Architecture](#18-learning-architecture)
19. [Enrollment Architecture](#19-enrollment-architecture)
20. [Attendance Architecture](#20-attendance-architecture)
21. [Assignment Architecture](#21-assignment-architecture)
22. [Assessment Architecture](#22-assessment-architecture)
23. [Grading Architecture](#23-grading-architecture)
24. [Payment Architecture](#24-payment-architecture)
25. [Certificate Architecture](#25-certificate-architecture)
26. [Communication Architecture](#26-communication-architecture)
27. [Notification Architecture](#27-notification-architecture)
28. [Grievance Architecture](#28-grievance-architecture)
29. [Reporting Architecture](#29-reporting-architecture)
30. [Audit Architecture](#30-audit-architecture)
31. [API Architecture](#31-api-architecture)
32. [Event & Background Job Architecture](#32-event--background-job-architecture)
33. [Caching Architecture](#33-caching-architecture)
34. [Security Architecture](#34-security-architecture)
35. [Threat Model](#35-threat-model)
36. [Trust Boundaries](#36-trust-boundaries)
37. [Data Privacy](#37-data-privacy)
38. [Observability](#38-observability)
39. [Performance Architecture](#39-performance-architecture)
40. [Scalability](#40-scalability)
41. [Resilience & Failure Handling](#41-resilience--failure-handling)
42. [Data Consistency](#42-data-consistency)
43. [Deployment Architecture](#43-deployment-architecture)
44. [Domain Architecture](#44-domain-architecture)
45. [Environment Architecture](#45-environment-architecture)
46. [CI/CD](#46-cicd)
47. [Backup & Disaster Recovery](#47-backup--disaster-recovery)
48. [Third-Party Integrations](#48-third-party-integrations)
49. [AI Extension Architecture](#49-ai-extension-architecture)
50. [Frontend Design System Architecture](#50-frontend-design-system-architecture)
51. [Responsive Architecture](#51-responsive-architecture)
52. [Accessibility Architecture](#52-accessibility-architecture)
53. [MVP Architecture](#53-mvp-architecture)
54. [Future Architecture](#54-future-architecture)
55. [Cost-Aware Architecture](#55-cost-aware-architecture)
56. [Recommended Project Structure](#56-recommended-project-structure)
57. [Architecture Decision Records](#57-architecture-decision-records)
58. [Technology Decision Matrix](#58-technology-decision-matrix)
59. [System Sequence Diagrams](#59-system-sequence-diagrams)
60. [Production Security Checklist](#60-production-security-checklist)
61. [Development Handoff](#61-development-handoff)
62. [Final Recommended Architecture](#62-final-recommended-architecture)
63. [Final Architectural Contract](#63-final-architectural-contract)

---

## Architecture Status Legend

### Confirmed Requirements

The following are treated as confirmed product requirements:

- Four primary roles:
  - `STUDENT`
  - `PARENT`
  - `TRAINER / TEACHER`
  - `ADMIN`
- Online and offline learning
- Course catalog
- Course enrollment
- Learning progress
- Attendance
- Assignments
- Assignment submissions
- Grading and feedback
- Quizzes and examinations
- Fees
- Payments
- Certificates
- Messaging
- Announcements
- Notifications
- Grievances
- Reports
- Audit logs
- Future AI chatbot
- React + Vite frontend
- Node.js + Express backend
- Supabase
- PostgreSQL
- Supabase Auth
- PostgreSQL RLS
- Supabase Storage
- Razorpay
- Independent LMS deployment
- Existing public academy website remains separate

The architecture establishes four primary panels and the major academic, financial, communication, reporting, and audit capabilities.

### Architectural Decisions

- Modular monolith for V1
- REST API
- PostgreSQL as system of record
- Supabase Auth for identity
- RLS as database-level defense
- Backend authorization for business rules
- LMS deployed on its own subdomain
- Vercel for frontend
- Railway for initial backend
- Supabase Storage for files
- Razorpay for payments
- Background processing introduced incrementally
- No premature microservices
- No mandatory Redis/Kafka for MVP

### Recommendations

Recommendations are architecture-level choices intended to improve:

- Security
- Maintainability
- Reliability
- Scalability
- Cost efficiency
- Developer productivity

### Assumptions

Where the product specification does not explicitly define behavior, this architecture uses conservative assumptions and marks them for later confirmation.

### Open Questions

Business decisions that should be finalized before implementation are explicitly marked as **Open Question**.

---

# 1. Executive Summary

SocialMeUp Academy LMS should be implemented as a **secure modular monolith**.

The system should maintain a strict separation between:

- Public Marketing Website
- LMS Frontend
- LMS Business API
- Authentication
- PostgreSQL Database
- File Storage
- Payment Infrastructure
- External Communication Services
- Future AI Services

The existing public website should remain independent from the LMS.

### Recommended Topology

```text
INTERNET
    |
    +----------------------+----------------------+
    |                                             |
    v                                             v
Public Marketing Website                    LMS Application
socialmeupacademy.in                       lms.socialmeupacademy.in
                                                   |
                                                   v
                                            React + Vite
                                                   |
                                                   v
                                            Supabase Auth
                                                   |
                                            Authenticated Session
                                                   |
                                                   v
                                      Node.js + Express API
                                         Modular Monolith
                                                   |
                     +-----------------------------+-----------------------------+
                     |                             |                             |
                     v                             v                             v
              Domain Modules                Integrations                 Background Jobs
                     |                             |                             |
                     +-----------------------------+-----------------------------+
                                                   |
                                                   v
                                           Supabase Platform
                                      +------------+------------+
                                      |            |            |
                                      v            v            v
                                     Auth      PostgreSQL     Storage + RLS
                                                   |
                                      +------------+------------+
                                      |                         |
                                      v                         v
                                  Razorpay               Email Provider
                                                                  |
                                                           Future SMS/WhatsApp
```

The architecture explicitly separates the public website, LMS frontend, business API, authentication, PostgreSQL, storage, and external integrations.

---

# 2. Architecture Goals

The architecture prioritizes:

- Security
- Privacy
- Data integrity
- Reliability
- Maintainability
- Performance
- Scalability
- Cost efficiency

### Primary Objectives

1. Prevent unauthorized student-data access.
2. Prevent cross-student data leakage.
3. Enforce authorization at multiple layers.
4. Keep business logic server-authoritative.
5. Keep payment confirmation server-authoritative.
6. Protect academic records from unauthorized modification.
7. Preserve audit history.
8. Keep the public website independent from LMS releases.
9. Support online and offline education.
10. Support future mobile applications.
11. Support future AI capabilities.
12. Scale without prematurely adopting microservices.

> **Core principle:** Optimize for correctness before complexity.

---

# 3. Architecture Principles

| Principle | Application |
|---|---|
| Security by design | Auth + RBAC + API authorization + RLS |
| Least privilege | Users receive minimum required access |
| Defense in depth | Frontend + API + service + DB |
| Separation of concerns | UI, API, business logic and persistence separated |
| Data integrity | PostgreSQL constraints and transactions |
| API-first | Business workflows exposed through REST |
| Domain ownership | Each module owns its business behavior |
| Auditability | Sensitive operations recorded |
| Observability | Logs, metrics and error tracking |
| Statelessness | API instances remain horizontally scalable |
| Cost efficiency | Managed infrastructure first |
| Simplicity | Modular monolith before microservices |
| Fail-safe behavior | Failed dependencies never create false success |
| Server authority | Client never controls sensitive business state |

---

# 4. System Context

```text
+-----------+
| Student   |
+-----+-----+
      |
+-----v-----+
| Parent    |
+-----+-----+
      |
+-----v------+
| Trainer    |
+-----+------+
      |
+-----v------+
| Admin      |
+-----+------+
      |
     HTTPS
      |
      v
+----------------------------+
| SocialMeUp Academy LMS     |
| React + Vite               |
+-------------+--------------+
              |
       +------+------+
       |             |
       v             v
Supabase Auth     Node API
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
   Razorpay       Email        Future AI
                     |
                     v
              Supabase Platform
              +------+------+
              |      |      |
              v      v      v
             Auth Postgres Storage + RLS
```

### System Responsibilities

| System | Responsibility |
|---|---|
| Public Website | Marketing |
| Supabase Auth | Identity/session |
| Node API | Business logic |
| PostgreSQL | System of record |
| Supabase Storage | Files |
| Razorpay | Payments |
| Email Provider | Transactional communication |
| SMS | Future |
| WhatsApp | Future |
| AI Provider | Future AI assistant |

---

# 5. High-Level Architecture

## Architectural Style

**Decision: Modular Monolith**

The backend is one deployable application internally divided into independent domain modules.

```text
Express Application
|
+-- Auth
+-- Users
+-- Roles & Permissions
+-- Students
+-- Parents
+-- Trainers
+-- Courses
+-- Enrollment
+-- Learning
+-- Attendance
+-- Assignments
+-- Assessments
+-- Grading
+-- Payments
+-- Certificates
+-- Messaging
+-- Notifications
+-- Grievances
+-- Reporting
+-- Audit
+-- Administration
```

Each module owns:

- Routes
- Controllers
- Services
- Repository/data access
- Validation
- Authorization rules
- Domain events where required

Microservices are explicitly deferred for MVP.

---

# 6. Container Architecture

## Frontend

**React + Vite**

Responsibilities:

- UI
- Routing
- Session state
- Role-aware UX
- Forms
- API communication
- Client validation
- Loading states
- Error states
- Accessibility

## Backend

**Node.js + Express**

Responsibilities:

- Business logic
- Authorization
- API
- Payment verification
- Webhooks
- Transactions
- Reporting
- Integrations
- Audit logging

## Database

**Supabase PostgreSQL**

Responsibilities:

- Persistent data
- Relationships
- Constraints
- Transactions
- Indexes
- RLS

## Storage

**Supabase Storage**

Responsibilities:

- Course resources
- Assignment files
- Certificates
- Profile images
- Student documents

---

# 7. Component Architecture

## Frontend

```text
Frontend
|
+-- App Shell
+-- Authentication
+-- Shared UI
+-- Student App
+-- Parent App
+-- Trainer App
+-- Admin App
+-- API Client
+-- State Management
+-- Route Guards
+-- Permission Handling
+-- Error Boundary
+-- Accessibility Layer
```

## Backend

```text
Backend
|
+-- API Layer
+-- Authentication Middleware
+-- Authorization Middleware
+-- Validation
+-- Domain Modules
+-- Service Layer
+-- Data Access Layer
+-- Integrations
+-- Background Jobs
+-- Audit Layer
+-- Observability
+-- Error Handling
```

---

# 8. Frontend Architecture

## Recommended Routes

```text
/login
/register
/forgot-password
/reset-password

/student/*
/parent/*
/trainer/*
/admin/*
```

## Route Hierarchy

```text
App
|
+-- Public Routes
|
+-- Authentication Routes
|
+-- Protected Route
|
+-- Role Guard
|
+-- Permission Guard
|
+-- Student Layout
+-- Parent Layout
+-- Trainer Layout
+-- Admin Layout
```

Frontend authentication state should contain:

```text
session
userId
profile
roles
permissions
accountStatus
loading
```

The frontend may use role information for navigation and UX.

> **Security rule:** Frontend state must never be treated as a security boundary.

---

# 9. Backend Architecture

## Request Lifecycle

```text
HTTP Request
    |
    v
Request ID
    |
    v
Security Middleware
    |
    v
Authentication
    |
    v
Authorization
    |
    v
Validation
    |
    v
Route
    |
    v
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
PostgreSQL
```

### Route Layer

Responsible for:

- HTTP methods
- URL mapping
- Middleware attachment

Routes contain no business logic.

### Controller

Responsible for:

- Reading validated input
- Calling services
- Returning responses

### Service

Responsible for:

- Business rules
- Authorization decisions
- Transactions
- Workflows
- Cross-module coordination

### Repository

Responsible for:

- Database access
- Queries
- Persistence

---

# 10. Domain Module Architecture

| Module | Responsibility |
|---|---|
| Auth | Authentication integration |
| Users | User lifecycle |
| Roles | RBAC |
| Students | Student records |
| Parents | Parent records |
| Trainers | Trainer records |
| Courses | Course catalog |
| Enrollment | Course enrollment |
| Learning | Progress |
| Attendance | Attendance |
| Assignments | Assignment lifecycle |
| Assessments | Quiz/exam |
| Grading | Scores/feedback |
| Payments | Fees/payment |
| Certificates | Certification |
| Messaging | Conversations |
| Notifications | Notifications |
| Grievances | Support tickets |
| Reporting | Reports |
| Audit | Audit logs |
| Administration | Platform settings |

## Module Dependency Rule

```text
Module A
   |
   v
Service Interface
   |
   v
Module B
```

Avoid:

```text
A -> B -> C -> A
```

**Circular dependencies are prohibited.**

---

# 11. Authentication Architecture

Supabase Auth owns:

- Identity
- Password authentication
- Session
- Email verification
- Password recovery

Application database owns:

- Profile
- Roles
- Permissions
- Account status
- Student relationships
- Parent relationships
- Trainer assignments
- Registration

## Registration Flow

```text
User
 |
 v
Registration
 |
 v
Supabase Auth
 |
 v
Email Verification
 |
 v
Identity Created
 |
 v
Profile Created
 |
 v
Role Assigned
 |
 v
Dashboard
```

## Account Lifecycle

```text
REGISTERED
    |
    v
PENDING_VERIFICATION
    |
    v
ACTIVE
    |
    +----> SUSPENDED
    |
    +----> DEACTIVATED
```

Supported operations:

- Register
- Login
- Logout
- Session restoration
- Email verification
- Password reset
- Password change
- Account suspension
- Account deactivation

---

# 12. Authorization Architecture

Authorization is layered.

## Layer 1 — Frontend

```text
ProtectedRoute
RoleGuard
PermissionGuard
```

Purpose:

- UX
- Navigation
- Feature visibility

**Not security.**

## Layer 2 — API

Check:

- Valid JWT?
- Authenticated?
- Account active?
- Role allowed?
- Permission allowed?

## Layer 3 — Business Service

Check contextual ownership.

Example:

```text
TRAINER

- attendance.mark
- Assigned Course
- Assigned Batch
```

## Layer 4 — PostgreSQL RLS

Database independently enforces access.

### Final Model

```text
Frontend
   |
   v
API Authorization
   |
   v
Business Authorization
   |
   v
PostgreSQL RLS
```

---

# 13. RBAC Architecture

## Recommended Entities

```text
profiles
roles
permissions
role_permissions
user_roles
```

## Relationship

```text
Profile
   |
   v
User Role
   |
   v
Role
   |
   v
Role Permissions
   |
   v
Permission
```

## Primary Roles

- `STUDENT`
- `PARENT`
- `TRAINER`
- `ADMIN`

## Future Roles

- `SUPER_ADMIN`
- `ACCOUNTANT`
- `SUPPORT_STAFF`
- `CONTENT_MANAGER`

Permissions should be action-oriented.

Examples:

```text
course.create
course.update
student.read
attendance.mark
assignment.grade
payment.read
payment.refund
certificate.issue
report.export
```

---

# 14. Supabase Architecture

Supabase provides:

```text
Supabase
|
+-- Authentication
+-- PostgreSQL
+-- RLS
+-- Storage
```

## Recommended Request Pattern

```text
React
  |
  v
Node API
  |
  v
Supabase / PostgreSQL
```

Direct frontend Supabase usage should be limited primarily to:

- Authentication
- Controlled storage operations
- Carefully designed realtime operations

Business-critical workflows should pass through the API.

Examples:

- Payment confirmation
- Enrollment activation
- Grade changes
- Certificate issuance
- Admin actions
- Financial operations

## Critical Rule

The Supabase service-role credential:

- Must never reach browser code.
- Must never be placed in public frontend environment variables.
- Must only be used in trusted server-side execution.

---

# 15. RLS Architecture

RLS is the final database defense.

## Student

Student can access:

- Own profile
- Own enrollment
- Own progress
- Own attendance
- Own submissions
- Own grades
- Own payments
- Own certificates

Student cannot access another student's records.

## Parent

Parent access requires:

```text
Parent
 |
 +-- Active Parent-Student Relationship
 |
 +-- Approved Permission
```

Potential permissions:

- `VIEW_PROGRESS`
- `VIEW_ATTENDANCE`
- `VIEW_GRADES`
- `VIEW_PAYMENTS`

## Trainer

Trainer access must be relationship-based:

```text
Trainer
 |
 v
Assigned Course
 |
 v
Assigned Batch
 |
 v
Enrolled Students
```

## Admin

Admin access remains permission-based.

Avoid:

```text
ADMIN = unrestricted forever
```

Prefer:

```text
Role
 |
 +-- Permission
 +-- Audit
 +-- Business Context
```

## IDOR Protection

Never authorize solely from URL IDs.

Example:

```http
GET /students/123
```

must answer:

> Can the current user access student `123`?

At:

- API layer
- Service layer
- Database/RLS layer where applicable

---

# 16. Database Architecture

PostgreSQL is the **system of record**.

## Identity

```text
profiles
roles
permissions
role_permissions
user_roles
```

## Profiles

```text
student_profiles
parent_profiles
trainer_profiles
admin_profiles
parent_students
```

## Academic

```text
courses
course_modules
lessons
lesson_resources
batches
course_trainers
enrollments
lesson_progress
attendance
```

## Assessment

```text
assignments
assignment_submissions
quizzes
questions
quiz_attempts
answers
grades
feedback
```

## Finance

```text
fee_structures
invoices
payments
```

## Certificates

```text
certificate_templates
certificates
```

## Communication

```text
conversations
messages
announcements
notifications
notification_preferences
```

## Support

```text
grievances
grievance_comments
grievance_attachments
grievance_assignments
```

## Platform

```text
audit_logs
system_settings
```

## Database Rules

Use:

- UUID primary keys
- Foreign keys
- Unique constraints
- `NOT NULL` constraints
- `CHECK` constraints
- Appropriate indexes
- Transactions
- Explicit timestamps
- Soft deletion only where appropriate

---

# 17. Storage Architecture

## Recommended Buckets

| Bucket | Visibility |
|---|---|
| `course-assets` | Controlled/private |
| `assignment-submissions` | Private |
| `certificates` | Private |
| `profile-images` | Controlled |
| `student-documents` | Strictly private |

## File Path

Do not use user-provided filenames as identity.

Recommended:

```text
{environment}/{entity}/{entity-id}/{generated-uuid}
```

Example:

```text
production/
assignment-submissions/
submission-id/
generated-uuid
```

Validate:

- MIME type
- Size
- Extension
- Ownership
- Destination
- Authorization

Use short-lived signed URLs for private files.

Sensitive storage requirements:

- Assignment submissions: private
- Certificates: private
- Student documents: private

---

# 18. Learning Architecture

## Learning Hierarchy

```text
Course
   |
   v
Course Module
   |
   v
Lesson
   |
   v
Lesson Resource
   |
   v
Student Completion
   |
   v
Progress
```

Track:

- Lesson completion
- Module completion
- Course completion
- Last accessed lesson
- Progress percentage

## Initial Calculation

```text
Completed Required Lessons
-------------------------- x 100
Total Required Lessons
```

Later, course completion rules can become configurable.

---

# 19. Enrollment Architecture

```text
Student
   |
   v
Course Selection
   |
   v
Eligibility Check
   |
   v
Enrollment
   |
   +---- No Payment ----> ACTIVE
   |
   +---- Payment Required
              |
              v
       PAYMENT_PENDING
              |
              v
        Payment Success
              |
              v
            ACTIVE
```

## Recommended States

```text
PENDING
PAYMENT_PENDING
ACTIVE
SUSPENDED
COMPLETED
CANCELLED
```

Enrollment activation must be server-authoritative.

> Paid enrollment cannot become active based solely on frontend state.

---

# 20. Attendance Architecture

Support:

- Online classes
- Offline classes
- Student attendance
- Trainer attendance management

## Statuses

```text
PRESENT
ABSENT
LATE
EXCUSED
```

## Conceptual Structure

```text
Attendance Session
       |
       v
Attendance Record
```

Attendance should be associated with:

- Student
- Course
- Batch
- Trainer
- Session/date

### Assumption

Online and offline classes require a session-level abstraction.

**Open Question:** Finalize the exact session/batch attendance model during database implementation.

---

# 21. Assignment Architecture

## Workflow

```text
Trainer
   |
   v
Create Assignment
   |
   v
Assigned Course/Batch
   |
   v
Student
   |
   v
Submission
   |
   v
Trainer Review
   |
   v
Grade + Feedback
   |
   v
Notification
```

## Entities

- Assignment
- AssignmentSubmission
- Grade
- Feedback

Students can access only their submissions.

Trainers can access submissions for their assigned courses/batches.

Assignment files remain private.

---

# 22. Assessment Architecture

## Entities

```text
Quiz
Question
QuizAttempt
Answer
Result
```

Support:

- MCQ
- Multiple-answer
- True/False
- Short-answer
- Timers
- Attempt limits
- Question randomization
- Auto-grading
- Manual grading

## Integrity Rule

The browser must never determine the authoritative result.

Server validates:

- Attempt
- Time
- Questions
- Answers
- Scoring
- Attempt limit

Then persists the final result.

---

# 23. Grading Architecture

```text
Submission
   |
   v
Evaluation
   |
   v
Grade
   |
   v
Feedback
```

Grade should contain:

- Score
- Maximum score
- Status
- Evaluator
- Evaluation timestamp
- Feedback reference

Grade modifications must be audited.

Sensitive grade history should not be silently overwritten.

---

# 24. Payment Architecture

```text
Student
   |
   v
Enrollment Request
   |
   v
Invoice
   |
   v
Backend Creates Razorpay Order
   |
   v
Razorpay Checkout
   |
   v
Payment
   |
   v
Backend Verification
   |
   v
Webhook
   |
   v
Signature Verification
   |
   v
Idempotency Check
   |
   v
Database Transaction
   |
   +--> Payment Recorded
   |
   +--> Enrollment Activated
```

## Payment States

```text
CREATED
PENDING
AUTHORIZED
PAID
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

### Never Trust

```text
Frontend payment success
```

### Trust

```text
Backend verification
Verified webhook
Database transaction
Idempotency
```

Store unique external identifiers:

- Razorpay Order ID
- Razorpay Payment ID
- Webhook Event ID

Duplicate webhook events must not produce duplicate enrollment activation.

---

# 25. Certificate Architecture

```text
Course Completion
   |
   v
Eligibility Rules
   |
   v
Certificate Eligible
   |
   v
Certificate Number
   |
   v
PDF Generation
   |
   v
Private Storage
   |
   v
Student Download
   |
   v
Public Verification
```

## Entities

```text
certificate_templates
certificates
```

Certificate generation should happen server-side or through a trusted background process.

Certificate must contain:

- Certificate number
- Student reference
- Course reference
- Issue date
- Verification reference

Public verification must reveal minimal information.

---

# 26. Communication Architecture

## Entities

```text
conversations
messages
announcements
notifications
```

Supported communication:

- Student ↔ Trainer
- Parent ↔ Trainer
- Admin → Student
- Admin → Parent
- Admin → Trainer

Conversation access must be participant-based.

Never allow:

```http
GET /conversations/:id
```

to automatically grant access.

The user must actually belong to or be authorized for the conversation.

---

# 27. Notification Architecture

## Entities

```text
notifications
notification_preferences
```

## Channels

- In-App
- Email
- SMS
- WhatsApp

### MVP

Use:

- In-app notifications
- Transactional email

### Postpone

- SMS
- WhatsApp

unless business requirements make them mandatory.

## Potential Triggers

- Enrollment
- Payment
- Assignment creation
- Assignment submission
- Grade publication
- Attendance events
- Certificate issuance
- Grievance updates
- Announcements
- Password/security events

---

# 28. Grievance Architecture

## Workflow

```text
User
 |
 v
Create Grievance
 |
 v
OPEN
 |
 v
Assigned
 |
 v
IN_PROGRESS
 |
 v
RESOLVED
 |
 v
CLOSED
```

## Entities

```text
grievances
grievance_comments
grievance_attachments
grievance_assignments
```

Every important status transition should be auditable.

---

# 29. Reporting Architecture

Initial reporting should use PostgreSQL.

## Reports

- Students
- Enrollments
- Attendance
- Courses
- Progress
- Grades
- Payments
- Revenue
- Certificates
- Trainer activity
- Grievances

## Features

- Pagination
- Filtering
- Sorting
- Date ranges
- CSV export

Do not introduce a separate analytics warehouse during MVP.

Introduce one when:

- Reporting impacts transactional performance.
- Historical data becomes large.
- Advanced BI becomes a product requirement.

---

# 30. Audit Architecture

Audit logs are mandatory for sensitive operations.

## Fields

```text
actor_id
action
resource_type
resource_id
timestamp
ip_address
user_agent
metadata
```

Audit:

- Role changes
- Permission changes
- Account suspension
- Grade modifications
- Payment operations
- Refunds
- Certificate issuance
- Parent/student linking
- Sensitive profile changes
- Admin configuration
- Grievance status changes

Audit logs should be append-oriented.

They should not be casually edited or deleted.

---

# 31. API Architecture

## Base

```text
/api/v1
```

## Recommended Resources

```text
/auth
/users
/students
/parents
/trainers
/admin
/courses
/enrollments
/learning
/attendance
/assignments
/assessments
/grades
/payments
/certificates
/messages
/notifications
/grievances
/reports
```

## HTTP Semantics

| Method | Purpose |
|---|---|
| GET | Read |
| POST | Create/action |
| PATCH | Partial update |
| DELETE | Controlled deletion |

## Pagination

```text
?page=1&pageSize=20
```

Use cursor pagination for high-volume datasets when appropriate.

## Filtering

```text
?status=ACTIVE
```

## Sorting

```text
?sortBy=createdAt&sortOrder=desc
```

## Standard Response Envelope

### Success

```json
{
  "data": {},
  "meta": {}
}
```

### Error

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "requestId": "request-id"
  }
}
```

Never return stack traces to clients.

---

# 32. Event & Background Job Architecture

## Synchronous

Keep synchronous:

- Login
- Profile updates
- Basic CRUD
- Lesson completion
- Small queries

## Asynchronous

Use background processing for:

- Email
- Certificate generation
- Large report generation
- Reminders
- Payment reconciliation
- Bulk enrollment
- File processing

MVP should avoid unnecessary queue infrastructure.

## Scale-Up Model

```text
API
 |
 v
Queue
 |
 +-- Worker 1
 +-- Worker 2
 +-- Worker 3
```

Introduce a dedicated queue when:

- Job volume increases.
- Retries become important.
- Jobs need durable execution.
- Multiple workers are required.

---

# 33. Caching Architecture

Potentially cache:

- Public course catalog
- Course categories
- Non-sensitive configuration
- Dashboard aggregates

Do not casually cache:

- Payments
- Permissions
- Sensitive student records
- Authorization decisions

Redis becomes useful when the system needs:

- Distributed caching
- High-volume rate limiting
- Job queues
- Shared sessions
- High traffic

MVP should not depend on Redis unless an actual requirement emerges.

---

# 34. Security Architecture

## Security Layers

```text
Supabase Authentication
        |
        v
       RBAC
        |
        v
Permission Authorization
        |
        v
API Validation
        |
        v
Business Authorization
        |
        v
PostgreSQL RLS
        |
        v
Secure Storage
```

## API Middleware

```text
Request ID
   |
Security Headers
   |
Rate Limiting
   |
Authentication
   |
Authorization
   |
Validation
   |
Controller
   |
Error Handler
```

## Security Controls

- HTTPS
- Secure headers
- CORS allowlist
- Rate limiting
- Input validation
- Output encoding
- RLS
- RBAC
- Permission checks
- Ownership checks
- Audit logging
- Secret management
- Secure file access
- Webhook verification
- Error monitoring

---

# 35. Threat Model

| Threat | Mitigation |
|---|---|
| Account takeover | Secure auth + rate limiting |
| Credential stuffing | Rate limiting + monitoring |
| IDOR | Ownership checks + RLS |
| Privilege escalation | Server-side RBAC |
| SQL injection | Parameterized access |
| XSS | Output encoding + CSP |
| CSRF | Appropriate CSRF controls |
| File abuse | MIME/size validation |
| Payment manipulation | Backend verification |
| Webhook spoofing | Signature verification |
| Session theft | Secure session handling |
| Token leakage | Never expose secrets |
| Insider misuse | Least privilege + audit |
| Data leakage | API authorization + RLS |

---

# 36. Trust Boundaries

```text
UNTRUSTED
   |
Browser Input
   |
HTTPS
   |
   v
React Application
   |
Authenticated Request
   |
   v
Node API
   |
Authorization Boundary
   |
   v
Supabase
   / \
  /   \
 v     v
PostgreSQL   Storage + RLS
```

## External Boundaries

```text
Node API
 |
 +-- Razorpay
 +-- Email Provider
 +-- Future WhatsApp
 +-- Future SMS
 +-- Future AI
```

Never trust:

- Browser input
- Frontend role state
- Client payment success
- Unverified webhook
- AI-generated authorization decisions

---

# 37. Data Privacy

Privacy principles:

- Data minimization
- Purpose limitation
- Least privilege
- Retention limits
- Controlled exports
- Restricted documents
- Minimal public verification

Use soft deletion where:

- Recovery is required.
- Auditability is required.
- Business history must be retained.

Permanent deletion should be used where appropriate and legally required.

Sensitive student documents must never become publicly accessible merely because the URL is known.

---

# 38. Observability

## Error Tracking

Use Sentry or equivalent.

## Structured Logs

JSON logging should contain:

```text
requestId
timestamp
endpoint
latency
status
userId where appropriate
```

Never log:

- Passwords
- Access tokens
- Refresh tokens
- Payment secrets
- Sensitive personal information

## Monitoring

Monitor:

- API latency
- Error rate
- Authentication failures
- Database performance
- Storage usage
- Payment failures
- Webhook failures
- Background jobs

---

# 39. Performance Architecture

## Suggested Targets

| Area | Target |
|---|---|
| Initial LMS load | < 3 sec on reasonable connection |
| Normal API | Prefer < 500ms |
| Common DB query | Prefer < 200ms |
| Dashboard | Progressive loading |
| Large lists | Pagination |
| Course content | Lazy loading |

## Techniques

- Route-level code splitting
- React lazy loading
- Pagination
- Database indexes
- Optimized images
- CDN-backed storage
- Minimal JavaScript bundles
- Avoid unnecessary rerenders
- Debounced search
- Progressive dashboard loading

---

# 40. Scalability

| Scale | Recommended Evolution |
|---|---|
| ~100 users | Single backend instance |
| ~1,000 users | Monitoring, query optimization, index tuning, controlled caching |
| ~10,000 users | Multiple API instances, workers, CDN optimization, stronger caching |
| ~100,000+ users | Redis, dedicated queues, read replicas, analytics separation, selective service extraction |

Do not build this infrastructure before it is required.

---

# 41. Resilience & Failure Handling

## Supabase Unavailable

- Fail safely.
- Do not use stale authorization.
- Show controlled service error.

## Razorpay Unavailable

- Keep payment pending.
- Do not activate paid enrollment.

## Email Unavailable

- Persist notification intent.
- Retry later.

## Storage Unavailable

- Fail upload safely.
- Do not create false submission success.

## Webhook Delayed

- Keep payment pending.
- Reconcile later.

## Duplicate Webhook

- Process idempotently.

Every external dependency should have:

- Timeout
- Error handling
- Safe retry
- Logging
- Monitoring

---

# 42. Data Consistency

Use PostgreSQL transactions for:

- Payment confirmation + enrollment activation
- Certificate issuance
- Bulk enrollment
- Grade updates
- Parent linking
- Role changes

## Transaction Pattern

```text
BEGIN
  |
  v
Validate State
  |
  v
Update Related Records
  |
  v
Write Audit Record
  |
  v
COMMIT
```

If critical processing fails:

```text
ROLLBACK
```

Financial and academic state must never be partially updated.

---

# 43. Deployment Architecture

## Production

```text
Public Website
socialmeupacademy.in
        |
        v
Existing Hosting


LMS
lms.socialmeupacademy.in
        |
        v
Vercel
React + Vite
        |
        v
api.lms.socialmeupacademy.in
        |
        v
Railway
Node + Express
        |
        v
Supabase
Auth + PostgreSQL + Storage
        |
        v
Razorpay
```

### MVP

- Vercel
- Railway
- Supabase

### Scale-Up

- Vercel
- AWS where justified
- Supabase

AWS should only be introduced when requirements justify additional networking, VPC, services, or infrastructure control.

---

# 44. Domain Architecture

Two possibilities:

### Option A

```text
socialmeupacademy.in/lms
```

### Option B

```text
lms.socialmeupacademy.in
```

## Decision

Use:

```text
lms.socialmeupacademy.in
```

Advantages:

- Independent deployment
- Independent caching
- Cleaner routing
- Operational separation
- Easier scaling
- Reduced risk to public website

Public website should provide:

- Login
- Register
- Student Portal links

into the LMS.

---

# 45. Environment Architecture

## Development

```text
Frontend: localhost
API: localhost
Database: Development Supabase
```

## Staging

```text
LMS: staging subdomain
API: staging API
Database: Separate Supabase project
```

## Production

```text
LMS: lms.socialmeupacademy.in
API: api.lms.socialmeupacademy.in
Database: Production Supabase project
```

Never share:

- Production service credentials
- Production Razorpay secrets
- Production database credentials

with development environments.

## Design System Note

The existing architecture baseline contains a generic purple/pink token system.

For SocialMeUp Academy, this should be treated as a design recommendation requiring reconciliation, not a hard product requirement.

### Recommended Brand Tokens

```text
Primary: #007991
CTA / Accent: #FF9635
```

Use:

- Neutral backgrounds
- White surfaces
- Neutral text
- Semantic success/warning/error colors
- Teal for primary brand actions
- Orange for important CTAs

Do not introduce unrelated purple/pink branding into the SocialMeUp Academy LMS unless the product owner explicitly approves a rebrand.

---

# 46. CI/CD

## Recommended Pipeline

```text
Feature Branch
      |
      v
Pull Request
      |
      v
Lint
      |
      v
Static Checks
      |
      v
Unit Tests
      |
      v
Security Checks
      |
      v
Build
      |
      v
Deploy Staging
      |
      v
QA / Approval
      |
      v
Production
```

## Branch Strategy

```text
main
 |
 +-- Production

develop
 |
 +-- Staging

feature/*
 |
 +-- Feature development
```

Production deployments should require:

- Passing tests
- Successful build
- Review
- Environment validation

---

# 47. Backup & Disaster Recovery

## Database

- Use Supabase backup capabilities.
- Define backup frequency.
- Define recovery process.
- Enable point-in-time recovery where available/appropriate.

Storage strategy must protect:

- Certificates
- Student documents
- Assignment submissions
- Important course assets

Define:

- **RPO** = Maximum acceptable data loss
- **RTO** = Maximum acceptable recovery time

### Open Question

Business owner must explicitly approve:

- RPO target
- RTO target
- Backup retention
- Disaster recovery test frequency

---

# 48. Third-Party Integrations

| Integration | Purpose | MVP |
|---|---|---|
| Supabase | Auth/DB/Storage | Required |
| Razorpay | Payments | Required |
| Email | Notifications | Required |
| SMS | Notifications | Future |
| WhatsApp | Communication | Future |
| Video platform | Learning | Optional |
| AI provider | AI assistant | Future |

Every integration requires:

- Timeout
- Error handling
- Safe retries
- Monitoring
- Secret management
- Failure-state handling

---

# 49. AI Extension Architecture

Future AI architecture:

```text
Student
   |
   v
LMS Chat UI
   |
   v
Chat API
   |
   v
Authentication
   |
   v
Authorization
   |
   v
Allowed Data Retrieval
   |
   v
AI Provider
   |
   v
Response
```

## Critical Rule

AI must never receive unrestricted database access.

Instead:

```text
AI Request
   |
   v
Backend
   |
   v
Permission Validation
   |
   v
Allowed Data Retrieval
   |
   v
Minimal Context
   |
   v
AI Model
   |
   v
Validated Response
```

AI must not decide:

- User permissions
- Payment status
- Certificate eligibility
- Final grades
- Enrollment authorization

AI can assist with:

- Course questions
- Learning explanations
- Study recommendations
- Content discovery
- FAQ
- Academic assistance

---

# 50. Frontend Design System Architecture

## Typography

Recommended:

**Inter**

- 400 — Regular
- 500 — Medium
- 600 — Semibold
- 700 — Bold

## Brand

```text
Primary: #007991
Accent: #FF9635
```

## Semantic Tokens

- Background
- Surface
- Surface Elevated
- Text Primary
- Text Secondary
- Text Muted
- Border
- Success
- Warning
- Error
- Info
- Disabled

## Design Principles

- Consistent spacing
- Consistent border radius
- Consistent elevation
- Reusable buttons
- Reusable inputs
- Reusable tables
- Reusable modal
- Reusable cards
- Reusable status badges
- Consistent loading states
- Consistent empty states
- Consistent error states

Avoid scattered hard-coded design values.

Use centralized design tokens.

---

# 51. Responsive Architecture

## Breakpoints

| Device | Width |
|---|---|
| Mobile | < 640px |
| Tablet | 640–1023px |
| Desktop | 1024px+ |
| Large Desktop | 1280px+ |

Role dashboards should support:

- Collapsible sidebar
- Mobile navigation
- Responsive tables
- Horizontal table scrolling where necessary
- Responsive filters
- Touch-friendly controls
- Responsive cards
- Responsive forms
- Mobile-friendly dialogs

Use mobile-first design for student and parent experiences.

---

# 52. Accessibility Architecture

Target:

**WCAG 2.2 AA where practical**

Requirements:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Proper labels
- Screen-reader support
- Sufficient contrast
- Accessible modal dialogs
- Accessible tables
- Clear form errors
- Accessible notifications
- Reduced-motion consideration
- Logical focus order

> Never communicate important information through color alone.

---

# 53. MVP Architecture

MVP should contain:

### Identity & Access

- Authentication
- Roles
- Profiles
- RLS

### Learning

- Courses
- Course Modules
- Lessons
- Enrollment
- Learning Progress

### Attendance

- Attendance

### Assignments

- Assignments
- Submissions
- Grading

### Assessment

- Basic Assessments

### Finance

- Fees
- Invoices
- Payments

### Certification

- Certificates

### Communication

- Notifications
- Basic Messaging

### Support

- Grievances

### Operations

- Reports
- Audit Logs

## Not Initially Required

- Microservices
- Redis
- Kafka
- Advanced Analytics Warehouse
- Dedicated AI Infrastructure
- WhatsApp
- SMS
- Multi-Tenant Architecture
- Complex Event Streaming

---

# 54. Future Architecture

Future additions may include:

- Redis
- Queue Workers
- Advanced Search
- Analytics Warehouse
- AI Chatbot
- Mobile Apps
- Live Classes
- WhatsApp
- SMS
- Multi-branch
- Multi-tenancy
- Selective Microservices

Potential evolution:

```text
                    API
                     |
          +----------+----------+
          |          |          |
          v          v          v
      PostgreSQL   Redis      Queue
                               |
                     +---------+---------+
                     |         |         |
                     v         v         v
                  Worker    Worker    Worker
```

These should be introduced only when real usage justifies them.

---

# 55. Cost-Aware Architecture

| Component | MVP Decision | Complexity |
|---|---|---|
| Vercel | Recommended | Low |
| Railway | Recommended | Low |
| Supabase | Required | Low |
| Razorpay | Required | Medium |
| Email | Recommended | Low |
| Redis | Postpone | Medium |
| Queue | Postpone | Medium |
| Microservices | Postpone | High |
| AWS complex infrastructure | Postpone | High |

> **Principle:** Buy complexity only when the business needs it.

---

# 56. Recommended Project Structure

## Frontend

```text
frontend/
└── src/
    ├── app/
    ├── components/
    │   ├── common/
    │   └── ui/
    ├── features/
    │   ├── auth/
    │   ├── student/
    │   ├── parent/
    │   ├── trainer/
    │   └── admin/
    ├── layouts/
    ├── pages/
    ├── routes/
    ├── hooks/
    ├── services/
    ├── api/
    ├── contexts/
    ├── utils/
    ├── constants/
    ├── styles/
    └── assets/
```

## Backend

```text
backend/
└── src/
    ├── app/
    ├── config/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── students/
    │   ├── parents/
    │   ├── trainers/
    │   ├── courses/
    │   ├── enrollments/
    │   ├── learning/
    │   ├── attendance/
    │   ├── assignments/
    │   ├── assessments/
    │   ├── grading/
    │   ├── payments/
    │   ├── certificates/
    │   ├── messaging/
    │   ├── notifications/
    │   ├── grievances/
    │   ├── reporting/
    │   └── audit/
    ├── middleware/
    ├── integrations/
    ├── jobs/
    ├── validators/
    └── shared/
        ├── errors/
        ├── logging/
        └── utils/
```

> Feature/domain-first organization is preferred over a giant global controller/service structure.

---

# 57. Architecture Decision Records

## ADR-001 — React + Vite

**Decision:** React + Vite.

**Reason:** Existing technology direction and SPA suitability.

**Alternative:** Next.js.

**Consequence:** Authenticated LMS pages do not require heavy SSR/SEO.

---

## ADR-002 — Node + Express

**Decision:** Node.js + Express.

**Reason:** Simplicity and existing stack alignment.

**Alternative:** NestJS/Fastify.

---

## ADR-003 — Supabase

**Decision:** Supabase.

**Reason:** Managed PostgreSQL + Auth + Storage + RLS.

**Benefit:** Reduced infrastructure management.

---

## ADR-004 — PostgreSQL

**Decision:** PostgreSQL.

**Reason:** LMS requires strong relational integrity and transactional workflows.

**Alternative:** MongoDB.

---

## ADR-005 — Supabase Auth

**Decision:** Supabase Auth.

**Reason:** Managed identity/session management.

---

## ADR-006 — RLS

**Decision:** PostgreSQL RLS.

**Reason:** Database-level protection against unauthorized data access.

---

## ADR-007 — Modular Monolith

**Decision:** Modular monolith.

**Reason:** Lower complexity and cost.

**Alternative:** Microservices.

---

## ADR-008 — Razorpay

**Decision:** Razorpay.

**Reason:** Required payment provider and suitable integration model.

---

## ADR-009 — Supabase Storage

**Decision:** Supabase Storage.

**Future:** S3-compatible storage if scale/security/operational requirements justify migration.

---

## ADR-010 — LMS Subdomain

**Decision:**

```text
lms.socialmeupacademy.in
```

**Reason:** Independent deployment and operational separation.

---

## ADR-011 — Prisma vs Supabase Client

**Decision:** Start with Supabase client/data-access approach.

**Reason:**

- Native Supabase integration
- RLS compatibility
- Less duplicated abstraction
- Faster implementation

Evaluate Prisma later if complex server-side query abstraction becomes difficult to maintain.

---

# 58. Technology Decision Matrix

| Area | Decision |
|---|---|
| Frontend | React.js + Vite |
| Styling | CSS / CSS Modules |
| Routing | React Router |
| Backend | Node.js + Express |
| API | REST |
| Database | PostgreSQL |
| Database Platform | Supabase |
| Authentication | Supabase Auth |
| Authorization | RBAC + Permissions + RLS |
| Storage | Supabase Storage |
| Payments | Razorpay |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Cache | None initially |
| Queue | Postpone |
| AI | Future |
| Domain | LMS subdomain |
| Architecture | Modular Monolith |

---

# 59. System Sequence Diagrams

## Signup

```text
User
 |
 v
React
 |
 v
Supabase Auth
 |
 v
Identity Created
 |
 v
Email Verification
 |
 v
Profile
 |
 v
Role
 |
 v
Dashboard
```

## Login

```text
User
 |
 v
React Login
 |
 v
Supabase Auth
 |
 v
Session
 |
 v
Profile Lookup
 |
 v
Role Lookup
 |
 v
Permission Resolution
 |
 v
Authorized Dashboard
```

## Paid Enrollment

```text
Student
 |
 v
Enrollment API
 |
 v
Eligibility
 |
 v
Invoice
 |
 v
Razorpay Order
 |
 v
Checkout
 |
 v
Payment
 |
 v
Webhook
 |
 v
Signature Verification
 |
 v
Idempotency Check
 |
 v
DB Transaction
 |
 +--> Payment
 |
 +--> Enrollment
 |
 v
ACTIVE
```

## Assignment Submission

```text
Student
 |
 v
Authorization
 |
 v
Assignment Validation
 |
 v
File Upload
 |
 v
Storage
 |
 v
Submission Record
 |
 v
Notification
```

## Assignment Grading

```text
Trainer
 |
 v
Authorization
 |
 v
Course Assignment Check
 |
 v
Submission
 |
 v
Grade
 |
 v
Feedback
 |
 v
Audit
 |
 v
Student Notification
```

## Parent Access

```text
Parent
 |
 v
Student Request
 |
 v
Parent-Student Relationship
 |
 v
Permission Check
 |
 v
Service Authorization
 |
 v
RLS
 |
 v
Authorized Data
```

## Attendance

```text
Trainer
 |
 v
Attendance Request
 |
 v
Course Assignment
 |
 v
Batch Assignment
 |
 v
Session Validation
 |
 v
Attendance Record
 |
 v
Audit
 |
 v
Notification
```

## Certificate

```text
Completion
 |
 v
Eligibility
 |
 v
Certificate Record
 |
 v
Background Generation
 |
 v
PDF
 |
 v
Private Storage
 |
 v
Notification
```

## Grievance

```text
User
 |
 v
Create Ticket
 |
 v
OPEN
 |
 v
Assignment
 |
 v
IN_PROGRESS
 |
 v
Comments
 |
 v
RESOLVED
 |
 v
CLOSED
```

---

# 60. Production Security Checklist

## Authentication

- [ ] Supabase Auth configured
- [ ] Email verification configured
- [ ] Password reset tested
- [ ] Session behavior reviewed
- [ ] Suspended users blocked

## Authorization

- [ ] Role checks
- [ ] Permission checks
- [ ] Ownership checks
- [ ] Contextual access checks
- [ ] Frontend never trusted

## RLS

- [ ] RLS enabled where required
- [ ] Student isolation tested
- [ ] Parent relationship tested
- [ ] Trainer assignment tested
- [ ] Admin privileges tested
- [ ] Cross-user access tested

## API

- [ ] JWT validation
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS
- [ ] Security headers
- [ ] Request IDs
- [ ] Standard errors
- [ ] No stack traces exposed

## Storage

- [ ] Sensitive buckets private
- [ ] Signed URLs
- [ ] File validation
- [ ] Ownership validation
- [ ] Service credentials protected

## Payments

- [ ] Razorpay signature verification
- [ ] Webhook verification
- [ ] Idempotency
- [ ] Duplicate event handling
- [ ] Refund audit
- [ ] Payment reconciliation

## Secrets

- [ ] No secrets in Git
- [ ] Separate environments
- [ ] Production keys isolated
- [ ] Service-role key server-only
- [ ] Razorpay secret server-only

## Monitoring

- [ ] Error tracking
- [ ] API monitoring
- [ ] Database monitoring
- [ ] Payment alerts
- [ ] Authentication anomaly monitoring

## Backups

- [ ] Database backup
- [ ] Storage strategy
- [ ] Recovery process
- [ ] DR documentation
- [ ] Recovery testing

---

# 61. Development Handoff

This architecture serves as the **parent architecture document** for implementation.

The following engineering documents should be created from it:

1. Database ERD
2. Database schema specification
3. RLS policy specification
4. REST API specification
5. Frontend implementation plan
6. Backend implementation plan
7. UI/UX wireframes
8. QA test strategy
9. Security test plan
10. CI/CD specification
11. Deployment runbook
12. Backup/recovery runbook
13. Payment integration specification
14. Notification specification
15. AI integration specification

## Development Order

```text
1. Infrastructure
   |
2. Supabase
   |
3. Authentication
   |
4. Profiles
   |
5. RBAC
   |
6. RLS
   |
7. Course Management
   |
8. Enrollment
   |
9. Learning
   |
10. Attendance
   |
11. Assignments
   |
12. Assessments
   |
13. Grading
   |
14. Fees/Payments
   |
15. Certificates
   |
16. Notifications
   |
17. Messaging
   |
18. Grievances
   |
19. Reports
   |
20. Audit
   |
21. AI Extension
```

## Engineering Rule

No developer should bypass module ownership merely because direct database access appears easier.

Business workflows must respect:

```text
UI
 ↓
API
 ↓
Service
 ↓
Data Access
 ↓
Database
```

---

# 62. Final Recommended Architecture

## Production Architecture

```text
USERS
+---------------------------------------+
| Student | Parent | Trainer | Admin   |
+-------------------+-------------------+
                    |
                    v
       lms.socialmeupacademy.in
                    |
                    v
             React + Vite LMS
                    |
          +---------+---------+
          |                   |
          v                   v
   Supabase Auth          REST API
                              |
                              v
                       Node.js + Express
                        Modular Monolith
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
 Domain Modules        Integrations        Background Jobs
        |                     |                     |
        +---------------------+---------------------+
                              |
                              v
                       Supabase Platform
                  +-----------+-----------+
                  |           |           |
                  v           v           v
                 Auth     PostgreSQL   Storage + RLS
                              |
                  +-----------+-----------+
                  |                       |
                  v                       v
              Razorpay             Email Provider
                                              |
                                       Future SMS/WhatsApp
```

## Final Technology Stack

### Frontend

- React.js
- Vite
- React Router
- CSS / CSS Modules

### Backend

- Node.js
- Express.js
- REST API

### Authentication

- Supabase Auth

### Authorization

- RBAC
- Permissions
- PostgreSQL RLS

### Database

- PostgreSQL
- Supabase

### Storage

- Supabase Storage

### Payments

- Razorpay

### Frontend Deployment

- Vercel

### Backend Deployment

- Railway initially

### Future Infrastructure

- Redis
- Queue Workers
- AWS
- Analytics
- AI
- Mobile
- Selective Microservices

## Final Domain

**Public Website**

```text
https://socialmeupacademy.in/
```

**LMS**

```text
https://lms.socialmeupacademy.in/
```

**API**

```text
https://api.lms.socialmeupacademy.in/
```

---

# 63. Final Architectural Contract

The following rules are considered **non-negotiable architectural constraints**:

1. The browser is untrusted.
2. Supabase Auth is the identity authority.
3. The application database owns business profiles and relationships.
4. The Node API owns business-critical workflows.
5. PostgreSQL is the system of record.
6. RLS provides database-level defense in depth.
7. The Supabase service-role credential must never reach the browser.
8. Payment success from the frontend is never authoritative.
9. Razorpay webhooks must be verified and idempotent.
10. Financial records must not be casually overwritten.
11. Academic grades must be auditable.
12. Certificate issuance must be authoritative and traceable.
13. Private student files must remain private.
14. Parent access requires an explicit relationship and permission.
15. Trainer access requires actual course/batch assignment.
16. Admin access remains permission-based.
17. No authorization may rely only on a URL ID.
18. Sensitive operations must generate audit records.
19. AI must never receive unrestricted database access.
20. Business modules must not create circular dependencies.
21. Production secrets must never enter source control.
22. Development, staging and production must use separate credentials/resources.
23. The public marketing website must remain operationally independent from the LMS.
24. The LMS should remain a modular monolith until scale or organizational complexity justifies service extraction.
25. Infrastructure complexity must be introduced only when measurable requirements justify it.

---

## Document Status

**Document:** `Architecture.md`  
**Version:** `1.0`  
**Status:** Production Architecture Baseline  
**Product:** SocialMeUp Academy LMS

This document is the parent architecture contract from which database, API, RLS, frontend, backend, QA, security, deployment, payment, notification, and future AI implementation specifications should be derived.

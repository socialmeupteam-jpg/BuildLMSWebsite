# SocialMeUp Academy LMS — Project Memory

> Persistent project memory for the SocialMeUp Academy LMS.
> Contains confirmed product requirements, architecture decisions, implementation constraints,
> conventions, and important project context that must be preserved across development sessions.

---

# 1. Project Identity

**Product Name:** SocialMeUp Academy LMS  
**Organization:** SocialMeUp Academy  
**Public Website:** https://socialmeupacademy.in/  
**LMS Domain:** https://lms.socialmeupacademy.in/  
**API Domain:** https://api.lms.socialmeupacademy.in/  
**Product Type:** Production-ready Learning Management System  
**Architecture Style:** Secure Modular Monolith  

**Primary Objective:** Build an enterprise-level LMS for SocialMeUp Academy supporting students, parents, trainers/teachers, and administrators.

---

# 2. Source of Truth

Project-level sources of truth:

1. Production PRD
2. LMS Use Case & Workflow Specification
3. Database Architecture & ERD Specification
4. `SYSTEM_ARCHITECTURE.md`
5. UI/UX designs and approved product decisions

When implementing functionality:

- Do not contradict the PRD.
- Do not invent major business requirements.
- Do not silently change approved architecture decisions.
- If a requirement is unclear, mark it as an **OPEN QUESTION**.
- Distinguish confirmed requirements from recommendations and assumptions.

---

# 3. Product Vision

SocialMeUp Academy LMS should provide a complete digital learning ecosystem for academy operations.

The platform should support:

- Course discovery
- Course enrollment
- Online learning
- Offline learning
- Course progress
- Attendance
- Assignments
- Assignment submissions
- Assessments
- Quizzes
- Exams
- Grading
- Trainer feedback
- Fees
- Invoices
- Online payments
- Certificates
- Messaging
- Announcements
- Notifications
- Grievances
- Reports
- Audit logs
- Future AI-powered learning assistance

The LMS is not merely a course-content website. It is intended to function as the operational platform for the academy.

---

# 4. Primary Roles

The platform has four primary roles.

## STUDENT

Students can:

- Manage their profile
- View enrolled courses
- Access course content
- Track learning progress
- View attendance
- Submit assignments
- Attempt assessments
- View grades
- View trainer feedback
- View fees
- Make payments
- Access certificates
- Receive notifications
- Communicate with authorized trainers
- Raise grievances

Students must never be able to access another student's private information.

## PARENT

Parents can access information about linked students.

Parent access must be relationship-based. A parent does **not** automatically receive unrestricted access.

Possible permissions include:

- `VIEW_PROGRESS`
- `VIEW_ATTENDANCE`
- `VIEW_GRADES`
- `VIEW_PAYMENTS`

Parent access must require:

```text
Parent
+
Active Parent-Student Relationship
+
Required Permission
```

## TRAINER / TEACHER

Trainers can:

- Manage assigned courses
- Manage assigned batches
- Access authorized students
- Create lessons/resources
- Create assignments
- Review submissions
- Grade assignments
- Provide feedback
- Conduct/record attendance
- Create/manage assessments
- Communicate with students
- Handle authorized grievances

Trainer access must be scoped to actual course/batch assignments.

A trainer must not automatically access all students.

## ADMIN

Admin functionality includes:

- User management
- Role management
- Permission management
- Student management
- Parent management
- Trainer management
- Course management
- Enrollment management
- Attendance oversight
- Assessment oversight
- Payment oversight
- Certificate management
- Communication management
- Grievance management
- Reports
- System configuration
- Audit logs

Admin authorization should remain permission-based.

Do not assume:

```text
ADMIN = unlimited access
```

without explicit permission architecture.

---

# 5. Technology Stack

## Frontend

- React.js
- Vite
- React Router
- JavaScript / JSX
- CSS
- CSS Modules

**Important:** Do **not** use Tailwind CSS unless explicitly requested later.

## Backend

- Node.js
- Express.js
- REST API

## Database

- PostgreSQL
- Supabase

PostgreSQL is the primary system of record.

## Authentication

- Supabase Auth

Supabase Auth owns:

- Identity
- Authentication
- Sessions
- Email verification
- Password recovery

Application database owns:

- Profile
- Roles
- Permissions
- Business relationships
- Account status

## Authorization

Use:

- RBAC
- Permissions
- Ownership checks
- Relationship checks
- PostgreSQL Row Level Security

Authorization is defense-in-depth.

## Storage

- Supabase Storage

Used for:

- Course resources
- Assignment submissions
- Certificates
- Profile images
- Student documents

Sensitive files must remain private.

## Payments

- Razorpay

Payment processing must be server-authoritative.

## Deployment

**Frontend:** Vercel  
**Backend:** Railway initially  
**Database/Auth/Storage:** Supabase

AWS can be considered later if actual scale or infrastructure requirements justify it.

---

# 6. Core Architecture

The LMS uses a modular monolith.

**Do not start with microservices.**

```text
Node.js + Express
        |
        +-- Auth
        +-- Users
        +-- Roles
        +-- Permissions
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

Each domain module should maintain clear ownership of its business logic.

Avoid circular dependencies.

---

# 7. Public Website vs LMS

The public SocialMeUp Academy website and LMS must remain architecturally separate.

## Public Website

```text
socialmeupacademy.in
```

Purpose:

- Marketing
- Academy information
- Course promotion
- Public content
- SEO
- Lead generation
- Contact

## LMS

```text
lms.socialmeupacademy.in
```

Purpose:

- Authentication
- Student portal
- Parent portal
- Trainer portal
- Admin portal
- Learning
- Academic operations
- Payments
- Certificates
- Communication

The public website should link users into the LMS.

The LMS should not be tightly coupled to the public website's deployment.

---

# 8. Architecture Principles

Always prioritize:

1. Security
2. Privacy
3. Data integrity
4. Reliability
5. Maintainability
6. Performance
7. Scalability
8. Cost efficiency

Additional principles:

- Browser is untrusted.
- Server is authoritative for business rules.
- Database is authoritative for persistent state.
- RLS provides database-level defense.
- Sensitive operations must be auditable.
- Financial operations must be transactional.
- Academic records must be protected.
- Private files must remain private.
- Avoid premature infrastructure complexity.

---

# 9. Non-Negotiable Security Rules

## Rule 1

The browser is **NEVER** a trusted security boundary.

## Rule 2

Frontend route guards are for UX, not actual authorization.

## Rule 3

Every sensitive API must perform server-side authorization.

## Rule 4

The Supabase service-role key must **NEVER** be exposed to frontend code.

Never place it in:

```text
VITE_*
```

frontend environment variables.

## Rule 5

Never authorize access based only on a URL ID.

Example:

```text
GET /students/:id
```

must verify whether the current user is allowed to access that student.

## Rule 6

Student data must be isolated.

Student A must never access Student B's:

- Profile
- Attendance
- Grades
- Assignments
- Payments
- Documents
- Certificates

unless an explicit authorized workflow permits it.

## Rule 7

Parent access requires an active relationship and appropriate permission.

## Rule 8

Trainer access requires actual course/batch assignment.

## Rule 9

Admin access must remain permission-based.

## Rule 10

AI must never receive unrestricted database access.

---

# 10. Authentication Memory

Authentication uses Supabase Auth.

Expected lifecycle:

```text
REGISTER
   |
EMAIL VERIFICATION
   |
PROFILE CREATION
   |
ROLE ASSIGNMENT
   |
ACTIVE ACCOUNT
```

Possible account states:

```text
PENDING_VERIFICATION
ACTIVE
SUSPENDED
DEACTIVATED
```

Authentication concerns:

- Login
- Logout
- Session restoration
- Registration
- Email verification
- Password reset
- Password change
- Account suspension
- Account deactivation

---

# 11. RBAC Memory

Primary roles:

```text
STUDENT
PARENT
TRAINER
ADMIN
```

Recommended permission format:

```text
resource.action
```

Examples:

```text
course.create
course.update
course.delete

student.read
student.update

attendance.mark
attendance.read

assignment.create
assignment.grade

payment.read
payment.refund

certificate.issue

report.export
```

Recommended entities:

```text
profiles
roles
permissions
role_permissions
user_roles
```

Authorization should combine:

```text
Role
+
Permission
+
Business Context
+
Ownership/Relationship
+
RLS
```

---

# 12. Parent-Student Relationship

Parent access is relationship-driven.

Conceptually:

```text
Parent
   |
   v
Parent-Student Relationship
   |
   v
Student
```

Do not grant parent access simply because the user has:

```text
role = PARENT
```

The system must verify the specific relationship.

---

# 13. Trainer Access Model

Trainer access is assignment-driven.

Conceptually:

```text
Trainer
   |
   v
Course Assignment
   |
   v
Batch Assignment
   |
   v
Students
```

A trainer should only access students belonging to authorized courses/batches.

---

# 14. Database Memory

PostgreSQL is the system of record.

Use:

- UUID identifiers
- Foreign keys
- Unique constraints
- Check constraints
- NOT NULL where appropriate
- Indexes
- Transactions
- Explicit timestamps

Core domain areas include:

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
Announcements
Notifications

Grievances

Reports

Audit Logs
System Settings
```

---

# 15. Database Integrity

Important business workflows should use transactions.

Examples:

```text
Payment Confirmation
+
Enrollment Activation
```

```text
Certificate Issuance
+
Certificate Record
+
Storage Reference
```

```text
Grade Update
+
Audit Record
```

```text
Parent Linking
+
Relationship Validation
```

Do not allow partially completed critical workflows.

---

# 16. RLS Memory

PostgreSQL RLS is mandatory defense-in-depth for sensitive data.

**Student:** Own records only.  
**Parent:** Linked student records only.  
**Trainer:** Assigned course/batch/student records only.  
**Admin:** Permission-controlled administrative access.

RLS must be tested for:

- Same-role cross-user access
- Cross-role access
- URL manipulation
- API manipulation
- Direct database access paths
- Storage access

---

# 17. Storage Memory

Recommended storage buckets:

```text
course-assets
assignment-submissions
certificates
profile-images
student-documents
```

Private by default for sensitive information.

Private files should use short-lived signed URLs.

Do not expose sensitive files through permanent public URLs.

Validate:

- File type
- MIME type
- File size
- Ownership
- Authorization
- Destination

---

# 18. Learning Model

Learning hierarchy:

```text
Course
   |
   +-- Module
         |
         +-- Lesson
               |
               +-- Resources
```

Track:

- Lesson completion
- Module completion
- Course completion
- Last accessed lesson
- Progress percentage

Initial progress calculation can be based on completed required lessons.

---

# 19. Enrollment Memory

Enrollment states may include:

```text
PENDING
PAYMENT_PENDING
ACTIVE
SUSPENDED
COMPLETED
CANCELLED
```

Paid enrollment must be activated by the backend.

Never allow the frontend to simply set:

```text
enrollment.status = ACTIVE
```

after displaying payment success.

---

# 20. Attendance Memory

Attendance supports online and offline learning.

Suggested states:

```text
PRESENT
ABSENT
LATE
EXCUSED
```

Attendance should be connected to:

- Student
- Course
- Batch
- Trainer
- Session/date

Trainer authorization is mandatory.

---

# 21. Assignment Memory

Assignment lifecycle:

```text
Trainer Creates Assignment
        |
        v
Assignment Published
        |
        v
Student Submits
        |
        v
Trainer Reviews
        |
        v
Grade + Feedback
        |
        v
Student Notification
```

Submission files must remain private.

Students only access their own submissions.

Trainers access only authorized submissions.

---

# 22. Assessment Memory

Assessment types may include:

- Quizzes
- Exams
- MCQ
- Multiple-answer
- True/False
- Short-answer
- Manual evaluation

Assessment integrity:

- Server validates attempts.
- Server controls attempt limits.
- Server controls authoritative scoring.
- Client cannot determine final result.

---

# 23. Grading Memory

Grades are sensitive academic records.

Grade modifications must be:

- Authorized
- Validated
- Persisted transactionally where required
- Audited

Do not silently destroy historical academic information.

---

# 24. Payment Memory

Razorpay is the payment provider.

Payment flow:

```text
Student
   |
   v
Backend
   |
   v
Create Razorpay Order
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
Idempotency
   |
   v
Database Transaction
   |
   +--> Payment
   |
   +--> Enrollment
```

Never trust frontend payment success alone.

Required:

- Signature verification
- Webhook verification
- Idempotency
- Duplicate event handling
- Payment reconciliation
- Refund handling
- Audit logging

Store external identifiers such as:

```text
Razorpay Order ID
Razorpay Payment ID
Webhook Event ID
```

---

# 25. Certificate Memory

Certificate workflow:

```text
Course Completion
       |
       v
Eligibility
       |
       v
Certificate Record
       |
       v
Certificate Generation
       |
       v
Private Storage
       |
       v
Student Access
```

Certificate records should contain:

- Certificate number
- Student
- Course
- Issue date
- Verification reference

Certificate issuance must be authoritative and auditable.

---

# 26. Messaging Memory

Messaging supports authorized communication.

Possible relationships:

```text
Student <-> Trainer
Parent  <-> Trainer
```

Admin can communicate with platform users based on permissions.

Conversation access must be participant-based.

A user must not gain conversation access simply by knowing a conversation ID.

---

# 27. Notification Memory

MVP notification channels:

```text
In-App
Email
```

Future:

```text
SMS
WhatsApp
Push Notifications
```

Potential triggers:

- Enrollment
- Payment
- Assignment
- Submission
- Grade
- Attendance
- Certificate
- Grievance
- Announcement
- Security event

---

# 28. Grievance Memory

Workflow:

```text
OPEN
 |
 v
ASSIGNED
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

Important status changes should be audited.

Attachments must remain private.

---

# 29. Reporting Memory

Reports may cover:

- Students
- Courses
- Enrollment
- Attendance
- Progress
- Assignments
- Grades
- Payments
- Revenue
- Certificates
- Trainers
- Grievances

Use PostgreSQL for MVP reporting.

Do not introduce a dedicated analytics warehouse prematurely.

---

# 30. Audit Memory

Audit logs should capture sensitive actions.

Recommended information:

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
- Grade changes
- Payment actions
- Refunds
- Certificate issuance
- Account suspension
- Parent linking
- Sensitive profile changes
- Admin configuration
- Grievance changes

Audit logs should be append-oriented.

---

# 31. API Memory

API version:

```text
/api/v1
```

Use REST.

Common resource areas:

```text
/auth
/users
/students
/parents
/trainers
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

Use:

```text
GET
POST
PATCH
DELETE
```

where appropriate.

API errors should use predictable structures.

Never expose stack traces in production.

Every request should have a request/correlation ID.

---

# 32. API Authorization Memory

Every sensitive API should follow:

```text
Request
 |
 v
Authentication
 |
 v
Role
 |
 v
Permission
 |
 v
Business Context
 |
 v
Ownership / Relationship
 |
 v
Database / RLS
```

Never rely only on frontend visibility.

Hiding a button is not authorization.

---

# 33. Background Jobs

MVP can initially avoid dedicated queue infrastructure.

Use background processing for operations such as:

- Email
- Certificate generation
- Large reports
- Reminders
- Payment reconciliation
- Bulk operations

When scale increases, introduce:

```text
Queue
+
Workers
```

Do not introduce Kafka or complex event infrastructure without a real requirement.

---

# 34. Caching

MVP does not require Redis by default.

Potential future cache targets:

- Public course catalog
- Non-sensitive configuration
- Dashboard aggregates
- Expensive read-only data

Do not casually cache:

- Permissions
- Payments
- Sensitive student data
- Authorization decisions

---

# 35. Performance Memory

Recommended principles:

- Lazy loading
- Route-level code splitting
- Pagination
- Database indexes
- Optimized queries
- Optimized images
- Debounced search
- Progressive dashboard loading
- Avoid unnecessary React rerenders

Avoid loading entire datasets when pagination is possible.

---

# 36. Scalability Memory

## Initial scale

```text
Vercel
+
Railway
+
Supabase
```

## Growing scale

Add:

- Query optimization
- Better monitoring
- Caching
- Multiple API instances
- Background workers

## Large scale

Evaluate:

- Redis
- Queue workers
- Read replicas
- Analytics separation
- Selective microservices

Do not prematurely distribute the system.

---

# 37. Deployment Memory

Production:

```text
Public Website
socialmeupacademy.in

LMS
lms.socialmeupacademy.in

API
api.lms.socialmeupacademy.in

Frontend
Vercel

Backend
Railway

Database/Auth/Storage
Supabase
```

Development and production resources should remain separate.

---

# 38. Environment Memory

Three environments are preferred:

```text
Development
Staging
Production
```

Never share production credentials with development.

Never commit secrets to Git.

Frontend environment variables must only contain values safe for browser exposure.

Server-only secrets remain on the backend.

---

# 39. CI/CD Memory

Recommended pipeline:

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
Tests
      |
      v
Build
      |
      v
Security Checks
      |
      v
Staging
      |
      v
QA
      |
      v
Production
```

Production deployment should require successful checks.

---

# 40. Backup & Disaster Recovery

Define:

```text
RPO
RTO
```

Protect:

- PostgreSQL data
- Certificates
- Student documents
- Assignment submissions
- Course assets

Recovery procedures must be documented and tested.

---

# 41. AI Memory

AI is a future extension.

Potential AI capabilities:

- Student chatbot
- Course questions
- Learning assistance
- Study recommendations
- FAQ
- Content discovery

Architecture:

```text
Student
   |
   v
Chat UI
   |
   v
Backend
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

AI must never directly query the entire database.

AI cannot decide:

- Permissions
- Payments
- Enrollment authorization
- Certificate eligibility
- Final grades

AI output is assistance, not authority.

---

# 42. Design System Memory

SocialMeUp Academy branding should be preserved.

## Primary

```text
#007991
```

## CTA / Accent

```text
#FF9635
```

Use neutral supporting colors for:

- Backgrounds
- Surfaces
- Borders
- Text
- Disabled states
- Semantic states

Do not introduce unrelated primary branding without approval.

---

# 43. Frontend Rules

Frontend should use:

- React
- Vite
- React Router
- CSS/CSS Modules

**Do NOT use Tailwind.**

Use reusable:

- Buttons
- Inputs
- Cards
- Tables
- Modals
- Badges
- Alerts
- Empty states
- Loading states
- Error states

Role-specific layouts should be separated.

---

# 44. Responsive Design

Must support:

- Mobile
- Tablet
- Desktop
- Large desktop

Important dashboards should be mobile-friendly.

Tables should support:

- Responsive layouts
- Horizontal scrolling
- Appropriate column prioritization

Sidebar should collapse on smaller screens.

---

# 45. Accessibility

Target:

```text
WCAG 2.2 AA
```

Important requirements:

- Keyboard navigation
- Focus states
- Semantic HTML
- Form labels
- Screen reader support
- Contrast
- Accessible modals
- Accessible tables
- Clear errors
- Reduced motion
- Logical focus order

Do not communicate important information through color alone.

---

# 46. MVP Scope

MVP includes:

```text
Authentication
Profiles
RBAC
Permissions
RLS

Courses
Modules
Lessons
Enrollment
Progress

Attendance

Assignments
Submissions
Grading

Assessments

Fees
Invoices
Payments

Certificates

Notifications
Basic Messaging

Grievances
Reports
Audit Logs
```

Avoid initially:

```text
Microservices
Kafka
Redis
Advanced Analytics Warehouse
Dedicated AI Infrastructure
WhatsApp
SMS
Multi-tenancy
Complex Event Streaming
```

---

# 47. Future Scope

Potential future additions:

- AI chatbot
- Redis
- Queue workers
- Mobile applications
- Live classes
- WhatsApp
- SMS
- Advanced analytics
- Multi-branch architecture
- Multi-tenancy
- Selective microservices
- Advanced search
- Analytics warehouse

Future features must not break the existing domain boundaries.

---

# 48. Project Structure Memory

## Frontend

```text
frontend/
└── src/
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
    ├── middleware/
    ├── integrations/
    ├── jobs/
    ├── validators/
    └── shared/
```

Use domain/feature-first organization.

Avoid a giant global:

```text
controllers/
services/
models/
```

structure where every feature becomes mixed together.

---

# 49. Coding Rules

When implementing this LMS:

1. No placeholder code.
2. No fake APIs.
3. No fake database responses.
4. No hardcoded production credentials.
5. No frontend-only authorization.
6. No direct manipulation of sensitive database state from the browser.
7. No unnecessary dependencies.
8. No Tailwind.
9. Keep modules separated.
10. Keep business logic in services.
11. Validate input.
12. Handle errors explicitly.
13. Add loading states.
14. Add empty states.
15. Add error states.
16. Keep accessibility in mind.
17. Preserve existing architecture.
18. Do not introduce microservices without justification.

---

# 50. Error Handling

API errors should be predictable.

Client should receive:

```text
error.code
error.message
requestId
```

Production responses must not expose:

- Stack traces
- SQL queries
- Secrets
- Internal infrastructure details

Server logs may contain diagnostic information, but sensitive data must be excluded.

---

# 51. External Integration Rules

Every third-party integration should have:

```text
Timeout
Error Handling
Safe Retry
Logging
Monitoring
Secret Management
Failure State
```

Never allow an external provider failure to produce false business success.

Examples:

### Razorpay fails

Enrollment remains pending.

### Email fails

Core operation remains successful but notification is retryable.

### Storage fails

Submission should not falsely appear as uploaded.

---

# 52. Important Business Invariants

These rules must always remain true.

## Invariant 1

A student can only access their own protected data.

## Invariant 2

A parent can only access authorized linked students.

## Invariant 3

A trainer can only access authorized students/courses/batches.

## Invariant 4

Payment confirmation must be server-authoritative.

## Invariant 5

Paid enrollment activation must not depend solely on frontend state.

## Invariant 6

Certificate issuance must be authoritative.

## Invariant 7

Sensitive operations must be auditable.

## Invariant 8

Private files must remain private.

## Invariant 9

AI cannot bypass authorization.

## Invariant 10

RLS must remain part of the security architecture.

---

# 53. Important Architectural Decisions

### React + Vite

Chosen for the LMS frontend.

### Node + Express

Chosen for backend simplicity and existing skill alignment.

### PostgreSQL

Chosen because LMS data is highly relational and requires strong integrity.

### Supabase

Chosen to provide managed:

- PostgreSQL
- Auth
- Storage
- RLS

### Modular Monolith

Chosen instead of microservices to minimize unnecessary operational complexity.

### Razorpay

Chosen for payments.

### Supabase Storage

Chosen initially for managed file storage.

### LMS Subdomain

Chosen for operational separation from the public website.

---

# 54. Things That Must NOT Be Changed Casually

Do not casually change:

- Database from PostgreSQL to MongoDB
- Supabase Auth to custom authentication
- RLS strategy
- Modular monolith to microservices
- LMS subdomain architecture
- Razorpay without business approval
- CSS/CSS Modules to Tailwind
- TypeScript for the LMS
- Brand colors
- Four primary roles
- Parent relationship model
- Trainer assignment model
- Server-authoritative payments
- Audit requirements

Any such change requires an architecture decision.

---

# 55. Open Questions

These require product-owner/business confirmation when implementation reaches them.

## Academic

- Exact course completion criteria?
- Minimum attendance percentage?
- Grade calculation rules?
- Certificate eligibility rules?
- Retake rules for exams?
- Assignment late-submission rules?

## Parent

- Which student information can parents access?
- Can parents make payments?
- Can parents download certificates?
- Can parents communicate directly with trainers?

## Payments

- Refund policy?
- Partial refund policy?
- EMI rules?
- Payment failure recovery?
- Invoice numbering rules?
- Tax/GST requirements?

## Attendance

- How are online sessions represented?
- How are offline sessions created?
- Can trainers edit attendance?
- Is attendance editing time-limited?

## Certificates

- Certificate design?
- Verification page?
- Certificate numbering format?
- Reissue rules?

## Communication

- Email provider?
- SMS provider?
- WhatsApp provider?
- Notification retention?

## Infrastructure

- Final RPO?
- Final RTO?
- Required uptime SLA?
- Expected user volume?

---

# 56. Development Priorities

When implementing new functionality, prioritize:

```text
Security
   ↓
Data Integrity
   ↓
Correct Business Logic
   ↓
Authorization
   ↓
Error Handling
   ↓
Performance
   ↓
UX Polish
```

Do not optimize performance by weakening authorization or data integrity.

---

# 57. Testing Priorities

Critical test categories:

## Authentication

- Login
- Logout
- Registration
- Password reset
- Session expiration
- Suspended account

## Authorization

- Student isolation
- Parent isolation
- Trainer isolation
- Admin permissions
- IDOR
- Privilege escalation

## Database

- Foreign keys
- Constraints
- Transactions
- RLS

## Payments

- Success
- Failure
- Duplicate webhook
- Invalid signature
- Delayed webhook
- Refund

## Academic

- Assignment submission
- Grading
- Assessment attempts
- Attendance
- Certificate issuance

## Security

- Unauthorized API requests
- Manipulated IDs
- Invalid roles
- Malicious files
- Rate limiting
- Token misuse

---

# 58. Production Readiness Checklist

Before production:

```text
[ ] Authentication configured
[ ] Email verification tested
[ ] Password reset tested

[ ] RBAC implemented
[ ] Permission system implemented
[ ] Ownership checks implemented
[ ] Parent relationship authorization implemented
[ ] Trainer assignment authorization implemented

[ ] RLS enabled
[ ] RLS tested
[ ] IDOR tested

[ ] API validation implemented
[ ] Rate limiting enabled
[ ] CORS configured
[ ] Security headers configured

[ ] Storage buckets secured
[ ] Signed URLs configured
[ ] File validation configured

[ ] Razorpay verification configured
[ ] Webhook verification configured
[ ] Idempotency implemented

[ ] Audit logging implemented
[ ] Error tracking configured
[ ] Structured logging configured

[ ] Production secrets secured
[ ] No secrets committed to Git

[ ] Database backups configured
[ ] Recovery procedure documented

[ ] Staging environment tested
[ ] Production build tested

[ ] Accessibility checked
[ ] Responsive UI checked

[ ] QA sign-off completed
```

---

# 59. Architectural Change Process

Any major architecture change should follow:

```text
Problem
   |
   v
Requirement
   |
   v
Impact Analysis
   |
   v
Alternatives
   |
   v
Decision
   |
   v
ADR
   |
   v
Implementation
   |
   v
Testing
```

Examples requiring an ADR:

- Microservices
- Redis
- New database
- Authentication replacement
- Payment provider replacement
- Storage provider replacement
- Multi-tenancy
- Major AI infrastructure
- AWS migration
- Event-driven architecture

---

# 60. AI Coding Agent Instructions

Any AI coding agent working on this project must:

1. Read `MEMORY.md`.
2. Read `SYSTEM_ARCHITECTURE.md`.
3. Read the relevant PRD section.
4. Understand the affected domain.
5. Preserve existing architecture.
6. Never invent major business rules.
7. Never expose secrets.
8. Never weaken RLS.
9. Never bypass backend authorization.
10. Never implement payment success based solely on frontend state.
11. Never use fake/placeholder production logic.
12. Follow the existing project structure.
13. Use CSS/CSS Modules, not Tailwind.
14. Keep backend modules separated.
15. Maintain audit requirements.
16. Add appropriate error/loading/empty states.
17. Consider mobile responsiveness.
18. Consider accessibility.
19. Explain architectural impact when making a major change.
20. Ask/flag an **OPEN QUESTION** instead of guessing when business behavior is undefined.

---

# 61. Quick Architecture Reference

```text
                     USERS
                       |
       +---------------+---------------+
       |               |               |
    Student          Parent         Trainer/Admin
       |               |               |
       +---------------+---------------+
                       |
                       v
          lms.socialmeupacademy.in
                       |
                       v
                React + Vite
                       |
                       v
                Supabase Auth
                       |
                       v
                 REST API
                       |
                       v
              Node + Express
             Modular Monolith
                       |
      +----------------+----------------+
      |                |                |
      v                v                v
   Business         Integrations      Jobs
    Modules
      |
      v
   PostgreSQL
      +
     RLS
      |
   +--+----------------+
   |                   |
   v                   v
Storage              Payments
Supabase             Razorpay
```

---

# 62. Final Project Memory

SocialMeUp Academy LMS is a **production-oriented, secure, modular LMS**.

The canonical architecture is:

```text
React + Vite
      |
      v
Supabase Auth
      |
      v
Node.js + Express
      |
      v
PostgreSQL + RLS
      |
      +---- Supabase Storage
      |
      +---- Razorpay
      |
      +---- Email
```

Deployment:

```text
Vercel
   +
Railway
   +
Supabase
```

Domain:

```text
lms.socialmeupacademy.in
```

Primary roles:

```text
STUDENT
PARENT
TRAINER
ADMIN
```

Core architectural philosophy:

> Secure first.
>
> Data integrity first.
>
> Server-authoritative business logic.
>
> Defense-in-depth authorization.
>
> Modular monolith before microservices.
>
> Managed infrastructure before unnecessary complexity.
>
> Preserve business history and auditability.
>
> Build for today's requirements while keeping a clean path to tomorrow's scale.

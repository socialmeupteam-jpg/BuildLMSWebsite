# SocialMeUp Academy LMS — RULES.md

## 1. Purpose

This file defines the mandatory engineering rules for the SocialMeUp Academy LMS.

These rules must be followed by every developer, AI coding agent, reviewer, and automated coding system working on the project.

The goal is to maintain:

- Security
- Data integrity
- Maintainability
- Scalability
- Performance
- Reliability
- Accessibility
- Consistent architecture
- Clean TypeScript code
- Secure Supabase integration

---

# 2. Project Identity

Project:

**SocialMeUp Academy LMS**

The LMS is an enterprise-level Learning Management System intended to support:

- Students
- Parents
- Trainers/Teachers
- Administrators

The system must be designed as a secure, modular, production-ready application.

The architecture is a:

**Secure Modular Monolith**

Do not introduce microservices unless there is a documented architectural reason and an approved ADR.

---

# 3. Source of Truth
Before making architectural or major implementation changes, always consult:

1. `MEMORY.md`
2. `SYSTEM_ARCHITECTURE.md`
3. Relevant PRD/documentation
4. Existing implementation
5. Existing database structure and Supabase configuration

Do not contradict these documents without explicitly identifying the conflict.

If documentation and implementation disagree:

1. Identify the conflict.
2. Do not silently choose one.
3. Determine whether the implementation or documentation is outdated.
4. Update the appropriate documentation/ADR after the decision.

---

# 4. Mandatory Technology Stack

## Frontend

Use:

- React
- TypeScript
- Vite
- React Router
- CSS Modules / normal CSS
- Axios or approved API client
- React Icons
- Framer Motion where appropriate
- React Hot Toast or equivalent approved notification library

### Strict rules

- TypeScript is mandatory.
- JavaScript is NOT allowed for new application code.
- JSX files must use `.tsx`.
- TypeScript files must use `.ts`.
- Do not introduce `.js` or `.jsx` files.
- Do not use Tailwind CSS.
- Do not use Bootstrap.
- Do not introduce another styling framework without approval.

---

# 5. Backend

Use:

- Node.js
- Express
- TypeScript
- REST API
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Razorpay
- Socket.io where required

Backend source files must use:

- `.ts`

Do not create JavaScript backend files.

The backend must contain business logic, authorization, validation, integrations, and security-sensitive operations.

---

# 6. Database

## Supabase is the database platform.

The system uses:

**Supabase PostgreSQL**

Supabase PostgreSQL is the system of record.

Do not introduce:

- MongoDB
- MongoDB Atlas
- Firebase Firestore
- MySQL
- SQLite
- Prisma as an unnecessary database abstraction

unless explicitly approved through an architectural decision.

---

# 7. Supabase Rules

Supabase must be treated as a security-sensitive infrastructure component.

Use Supabase for:

- PostgreSQL database
- Authentication
- Storage
- Row Level Security
- Database policies
- Database relationships
- Database functions where justified

The backend may use privileged Supabase credentials for server-side operations when required.

---

# 8. Supabase Service Role Key

The Supabase Service Role Key is highly sensitive.

### NEVER:

- Put it in frontend code.
- Put it in `VITE_*` variables.
- Commit it to Git.
- Store it in public configuration.
- Send it to the browser.
- Log it.
- Include it in API responses.

The service-role key may only exist in secure backend/server environment variables.

---

# 9. Supabase Anon/Publishable Key

The frontend may use the Supabase public/anon key where appropriate.

However:

**A public Supabase key does NOT mean database access should be unrestricted.**

Security must still rely on:

- Authentication
- Authorization
- RLS
- Database policies
- Backend validation

Never disable RLS merely because the frontend requires Supabase access.

---

# 10. Database Security

Row Level Security is mandatory for sensitive application tables.

Never assume that frontend route protection is database security.

The database must enforce appropriate access boundaries.

Sensitive data must not become readable merely because a user knows a UUID.

---

# 11. RLS Rules

RLS policies must be based on actual business authorization.

Policies may consider:

- Authenticated user ID
- Role
- Permission
- Ownership
- Parent-child relationship
- Trainer assignment
- Enrollment
- Course membership
- Batch membership
- Organization/business context where applicable

Do not create insecure policies such as:

```text
authenticated users can read everything
```

or:

```text
user can access any row if they know the ID
```

---

# 12. Frontend Authorization

Frontend authorization is for UX.

It is NOT the security boundary.

Examples:

- Hiding an Admin button does not secure an Admin API.
- Blocking a route does not secure database access.
- Checking a role in React does not replace backend authorization.
- Disabling a UI button does not prevent API manipulation.

Every sensitive operation must be authorized server-side and/or enforced through appropriate Supabase RLS/database policies.

---

# 13. Backend Authorization

Sensitive backend requests must follow this conceptual sequence:

```text
Authentication
        ↓
Role
        ↓
Permission
        ↓
Business Context
        ↓
Ownership / Relationship
        ↓
Database / RLS
```

Never authorize a request solely because:

```text
req.user exists
```

---

# 14. IDOR Protection

Never trust IDs supplied by the client.

Example:

```text
GET /students/:studentId
```

must NOT automatically mean:

```text
authenticated user → access studentId
```

The server must verify that the authenticated user is authorized to access that specific student.

This applies to:

- Students
- Parents
- Trainers
- Courses
- Assignments
- Submissions
- Grades
- Payments
- Certificates
- Files
- Grievances
- Messages
- Reports

---

# 15. Roles

The system has four primary roles:

- `STUDENT`
- `PARENT`
- `TRAINER`
- `ADMIN`

Roles must not automatically imply unlimited permissions.

Use permissions for fine-grained authorization.

---

# 16. Student Rules

A student may access only data they are authorized to access.

Typical student capabilities include:

- Own profile
- Enrolled courses
- Course content
- Progress
- Attendance
- Assignments
- Submissions
- Assessments
- Grades
- Feedback
- Fees
- Payments
- Certificates
- Notifications
- Authorized messaging
- Grievances

A student must never access another student's protected data.

---

# 17. Parent Rules

Parent access is relationship-based.

A parent must only access students explicitly linked to that parent.

Never assume:

```text
role = PARENT
```

means access to every student.

Parent permissions may include:

- `VIEW_PROGRESS`
- `VIEW_ATTENDANCE`
- `VIEW_GRADES`
- `VIEW_PAYMENTS`

Permissions must be explicitly enforced.

---

# 18. Trainer Rules

Trainer access must be assignment-based.

A trainer should only access:

- Authorized courses
- Authorized batches
- Authorized students
- Authorized assignments
- Authorized assessments

Do not give every trainer access to every student.

---

# 19. Admin Rules

`ADMIN` does not automatically mean unrestricted access.

Administrative actions should use explicit permissions.

Examples:

- Manage users
- Manage roles
- Manage permissions
- Manage courses
- Manage trainers
- Manage payments
- Manage reports
- Manage grievances
- Manage system settings

Sensitive administrative actions must be audited.

---

# 20. TypeScript Rules

TypeScript is mandatory.

Use strict TypeScript configuration.

Prefer:

```ts
type;
```

and:

```ts
interface;
```

appropriately.

Avoid:

```ts
any;
```

unless there is a documented technical reason.

Prefer:

```ts
unknown;
```

when the type is genuinely unknown.

Do not suppress TypeScript errors using:

```ts
// @ts-ignore
```

unless absolutely necessary and documented.

Avoid:

```ts
as any
```

as a shortcut.

---

# 21. Type Safety

Do not rely on implicit `any`.

Types should exist for:

- API requests
- API responses
- Database records
- User roles
- Permissions
- Forms
- Component props
- Service functions
- Error objects
- Authentication state
- Payment states
- Enrollment states

Prefer shared domain types where appropriate.

---

# 22. No Duplicate Types

Do not repeatedly define the same domain type in multiple files.

For example, do not create five unrelated versions of:

```ts
Student;
```

Centralize shared types where appropriate.

However, do not create a giant global types file containing unrelated domains.

Prefer domain-oriented types.

---

# 23. React Rules

Use functional React components.

Do not use class components for new code.

Components must have a clear responsibility.

Avoid giant components containing:

- API logic
- Business logic
- Authentication
- Database operations
- Complex state management
- UI rendering

Separate concerns appropriately.

---

# 24. React State Rules

Use local component state when state is local.

Use Context when state is genuinely application-wide.

Do not put every piece of application state into Context.

Avoid unnecessary global state.

Authentication state, user state, theme state, and other truly global concerns may use Context where appropriate.

---

# 25. API Rules

The frontend must not directly perform privileged database operations.

Sensitive operations should go through the backend.

Examples:

- Payment verification
- Payment confirmation
- Refunds
- Certificate issuance
- Administrative operations
- Sensitive reports
- Privileged database operations
- Third-party secret integrations

---

# 26. REST API

Use:

```text
/api/v1
```

for backend APIs.

Use predictable REST resources.

Examples:

```text
/api/v1/students
/api/v1/courses
/api/v1/enrollments
/api/v1/assignments
/api/v1/assessments
/api/v1/payments
/api/v1/certificates
```

---

# 27. API Error Handling

Production API errors must be structured.

Preferred format:

```text
error.code
error.message
requestId
```

Do not return:

- Stack traces
- Database credentials
- Internal SQL
- Secret keys
- Sensitive implementation details

to clients.

---

# 28. Request IDs

Requests should have correlation/request IDs.

Use them for:

- Debugging
- Logging
- Monitoring
- Incident investigation
- Support

Do not expose sensitive internal information through request IDs.

---

# 29. Validation

Validate all external input.

This includes:

- Request bodies
- Query parameters
- Route parameters
- File uploads
- Payment payloads
- Authentication input
- Form submissions

Never trust client-side validation alone.

---

# 30. Business Logic

Business rules belong in backend/domain services where security or integrity is involved.

Do not place critical business rules exclusively inside React components.

Examples:

- Enrollment eligibility
- Payment confirmation
- Certificate eligibility
- Grade calculation
- Refund rules
- Parent authorization
- Trainer authorization

must not rely exclusively on frontend logic.

---

# 31. Database Integrity

Use PostgreSQL constraints whenever appropriate.

Prefer:

- Foreign keys
- Unique constraints
- Check constraints
- Not-null constraints
- Appropriate indexes

Application validation and database constraints should complement each other.

---

# 32. Transactions

Use database transactions for operations requiring atomicity.

Examples:

```text
Payment confirmation
        +
Enrollment activation
```

and:

```text
Certificate issuance
        +
Certificate record
        +
Storage reference
```

must not leave the database in an inconsistent state.

---

# 33. Payment Rules

Payment provider:

**Razorpay**

The payment workflow must be server-authoritative.

Correct conceptual flow:

```text
Frontend
   ↓
Backend
   ↓
Create Razorpay Order
   ↓
Frontend Checkout
   ↓
Razorpay
   ↓
Webhook / Verification
   ↓
Backend Verification
   ↓
Database
   ↓
Enrollment Activation
```

Never activate paid enrollment solely because the frontend reports payment success.

---

# 34. Payment Security

Always verify payment data server-side.

Handle:

- Signature verification
- Webhook verification
- Duplicate webhooks
- Idempotency
- Delayed webhooks
- Failed payments
- Refunds
- Reconciliation

Store provider identifiers such as:

- Order ID
- Payment ID
- Webhook event ID

where appropriate.

---

# 35. Certificate Rules

Certificate issuance must be authoritative.

Conceptual flow:

```text
Course Completion
        ↓
Eligibility Check
        ↓
Certificate Record
        ↓
Certificate Generation
        ↓
Private Storage
        ↓
Student Access
```

Certificates must have:

- Certificate number
- Student
- Course
- Issue date
- Verification reference

Certificate issuance should be auditable.

---

# 36. Storage Rules

Use:

**Supabase Storage**

for application files where appropriate.

Private files must remain private.

Examples:

- Student documents
- Assignment submissions
- Certificates
- Sensitive attachments

Use signed URLs or authorized server-mediated access where appropriate.

Never expose permanent public URLs for sensitive files.

---

# 37. File Upload Security

Validate:

- File type
- File size
- File extension
- Content expectations
- Ownership
- Authorization

Never trust:

```text
filename
MIME type
extension
```

provided by the client alone.

---

# 38. Course Rules

Courses may contain:

- Modules
- Lessons
- Resources
- Assignments
- Assessments

Course content must respect enrollment and authorization rules.

Do not allow arbitrary users to access private course content.

---

# 39. Enrollment Rules

Enrollment must be authoritative in the backend/database.

Paid enrollment must not be activated by frontend state.

Enrollment status must have clear business semantics.

Avoid ambiguous states.

---

# 40. Attendance Rules

Attendance must be scoped to the appropriate:

- Student
- Course
- Batch
- Session/date

Only authorized trainers/admins should be able to modify attendance.

Attendance changes should be auditable where required.

---

# 41. Assignment Rules

Assignments may contain:

- Instructions
- Due dates
- Attachments
- Submissions
- Feedback
- Grades

Students must only access their own protected submissions.

Trainers must only access submissions within their authorized scope.

---

# 42. Assessment Rules

Assessments may contain:

- Questions
- Options
- Attempts
- Scores
- Results

Protect assessment data according to business requirements.

Do not expose answer keys unnecessarily.

---

# 43. Grading Rules

Grades are sensitive academic data.

Students must only access their own grades.

Parents may access grades only when authorized.

Trainers may modify grades only within their authorized academic scope.

Important grade changes must be auditable.

---

# 44. Messaging Rules

Messaging must be authorization-aware.

A user cannot message arbitrary users simply by knowing their ID.

Conversation membership must determine access.

Messages should be associated with authorized participants.

---

# 45. Notifications

MVP notification channels:

- In-app
- Email

Future channels may include:

- SMS
- WhatsApp
- Push notifications

Do not implement additional providers without architectural justification.

---

# 46. Grievance Rules

Suggested grievance lifecycle:

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

Important grievance actions must be auditable.

Private grievance attachments must remain protected.

---

# 47. Audit Logging

Audit sensitive actions.

Examples:

- Role changes
- Permission changes
- Grade changes
- Payments
- Refunds
- Certificate issuance
- Account suspension
- Parent linking
- Sensitive profile changes
- Administrative configuration
- Grievance changes

Audit records should contain appropriate information such as:

```text
actor
action
resource
resourceId
timestamp
requestId
IP
userAgent
metadata
```

Never store secrets inside audit metadata.

---

# 48. AI Rules

AI is an assistant.

AI is NOT an authority.

AI must never independently decide:

- Authorization
- Permissions
- Payment success
- Enrollment eligibility
- Certificate eligibility
- Final grades
- Account security decisions

Correct architecture:

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

AI must never receive unrestricted database access.

---

# 49. AI Data Access

Before sending application data to an AI system:

1. Authenticate the user.
2. Authorize access.
3. Retrieve only allowed data.
4. Minimize sensitive data.
5. Send only required context.
6. Never expose secrets.

Do not allow an AI model to bypass RLS or backend authorization.

---

# 50. Security Rules

Always assume:

**The browser is untrusted.**

Never trust:

- Hidden fields
- Disabled buttons
- URL parameters
- Client-side roles
- Client-side prices
- Client-side payment state
- Client-side permissions

Security must be enforced on trusted infrastructure.

---

# 51. Secrets

Never commit secrets.

Never hardcode:

- API keys
- Database credentials
- Supabase service-role key
- Razorpay secret
- JWT secrets
- Email credentials
- AI provider keys

Use environment variables and secure deployment secrets.

---

# 52. Environment Variables

Frontend public variables may use:

```text
VITE_
```

only when the value is intentionally public.

Never place secrets inside:

```text
VITE_*
```

because Vite variables are exposed to the browser.

---

# 53. Git Rules

Never commit:

```text
.env
.env.local
.env.production
```

or other secret files.

Never commit:

- API keys
- Passwords
- Tokens
- Private certificates
- Service-role credentials

Use `.gitignore`.

---

# 54. Dependencies

Do not install packages unnecessarily.

Before adding a dependency:

1. Check whether existing code already solves the problem.
2. Check maintenance/activity.
3. Check security.
4. Check bundle impact.
5. Check compatibility with the architecture.
6. Check whether the dependency is actually necessary.

---

# 55. CSS Rules

Use:

- CSS Modules
- Normal CSS
- CSS variables
- Flexbox
- CSS Grid
- `clamp()`
- Responsive design
- Accessible states

Do NOT use:

- Tailwind
- Bootstrap

unless explicitly approved.

---

# 56. Design System

The SocialMeUp Academy brand should primarily use:

- Primary Teal: `#007991`
- CTA Orange: `#FF9635`

Do not randomly introduce major brand colors.

Use CSS variables for reusable design tokens.

---

# 57. Responsive Design

The LMS must work across:

- Mobile
- Tablet
- Laptop
- Desktop
- Large desktop

Do not design exclusively for a single viewport.

Avoid fixed layouts that break at different screen sizes.

---

# 58. Accessibility

Target:

**WCAG 2.2 AA**

Consider:

- Keyboard navigation
- Focus states
- Semantic HTML
- ARIA where required
- Color contrast
- Form labels
- Error messages
- Screen-reader compatibility
- Reduced motion
- Accessible buttons and links

---

# 59. Loading States

Every asynchronous UI flow should consider:

- Loading
- Success
- Empty
- Error

Do not leave users staring at an unresponsive screen.

---

# 60. Error States

Errors should be:

- Clear
- User-friendly
- Actionable where possible

Do not expose technical stack traces to users.

Developers should receive detailed logs separately.

---

# 61. Empty States

Every major data-driven page should have a meaningful empty state.

Examples:

```text
No courses enrolled yet.
```

```text
No assignments available.
```

```text
No notifications.
```

Avoid blank screens.

---

# 62. Performance

Use:

- Lazy loading
- Route-level code splitting
- Pagination
- Debouncing
- Optimized queries
- Database indexes
- Optimized images
- Efficient rendering

Do not prematurely introduce:

- Redis
- Kafka
- Microservices
- Analytics warehouses

without measurable need.

---

# 63. Database Query Rules

Avoid:

- N+1 queries
- Unbounded queries
- Fetching unnecessary columns
- Loading entire tables
- Missing indexes on frequently filtered relationships

Use pagination for large datasets.

---

# 64. Caching

Caching is optional and must be introduced based on real performance requirements.

Do not casually cache:

- Permissions
- Authentication decisions
- Payment state
- Sensitive student data

If caching is introduced, define:

- TTL
- Invalidation
- Consistency requirements
- Security implications

---

# 65. Background Jobs

The MVP may avoid a dedicated job queue.

Future jobs may include:

- Email delivery
- Certificate generation
- Large reports
- Reminders
- Payment reconciliation
- Bulk operations

Do not introduce Kafka or complex event infrastructure prematurely.

---

# 66. Logging

Logs must help developers diagnose problems without exposing sensitive information.

Never log:

- Passwords
- Access tokens
- Service-role keys
- Payment secrets
- Full sensitive documents

Use structured logging where appropriate.

---

# 67. Observability

Production systems should eventually support:

- Application logs
- Error tracking
- Request IDs
- Performance monitoring
- Database monitoring
- Payment monitoring
- Authentication monitoring

Critical failures should be observable.

---

# 68. Testing

Important areas must have tests.

Prioritize:

### Authentication

- Registration
- Login
- Logout
- Password reset
- Session handling
- Suspended accounts

### Authorization

- Role isolation
- Permission enforcement
- Parent access
- Trainer access
- Admin access
- IDOR protection
- Privilege escalation

### Payments

- Successful payment
- Failed payment
- Duplicate webhook
- Invalid signature
- Delayed webhook
- Refund

### Academic

- Enrollment
- Assignment
- Submission
- Attendance
- Assessment
- Grading
- Certificate

### Security

- Unauthorized API access
- Manipulated IDs
- Invalid roles
- Malicious uploads
- Token misuse
- Rate limiting

---

# 69. No Fake Production Logic

Never create fake production behavior such as:

```ts
const fakeUser = ...
```

or:

```ts
const paymentSuccessful = true;
```

or:

```ts
return mockStudents;
```

unless explicitly building a clearly isolated development/test fixture.

Do not disguise mock data as real application functionality.

---

# 70. No Placeholder Implementations

Do not claim a feature is implemented when it is only:

- UI
- Dummy data
- Console logging
- Fake API response
- Hardcoded state

If a feature requires backend/database integration, implement the real integration or clearly identify what remains.

---

# 71. No Hardcoded Business Data

Avoid hardcoding:

- User IDs
- Course IDs
- Payment IDs
- Permissions
- Student records
- Production URLs
- API secrets

Business data belongs in the appropriate data source/configuration.

---

# 72. Routing

Use React Router.

Protected routes should improve UX but must never be considered the primary authorization mechanism.

Routes must support:

- Authentication
- Role-aware navigation
- Unauthorized state
- Not-found state

---

# 73. Component Architecture

Prefer reusable components.

Examples:

```text
Button
Modal
Input
Select
Table
Pagination
Card
Toast
Loader
EmptyState
ErrorState
```

Avoid creating components so generic that they become difficult to understand.

---

# 74. Feature Architecture

Prefer domain/feature-oriented organization.

Examples:

```text
features/
├── auth/
├── students/
├── parents/
├── trainers/
├── courses/
├── enrollments/
├── attendance/
├── assignments/
├── assessments/
├── grades/
├── payments/
├── certificates/
├── messages/
├── notifications/
├── grievances/
└── reports/
```

Do not create a single giant component/controller/service for the entire application.

---

# 75. Frontend Structure

Preferred structure:

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

Use `.ts` and `.tsx`.

---

# 76. Backend Structure

Preferred structure:

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

Use `.ts`.

Organize backend modules around business domains.

---

# 77. Naming

Use clear names.

Prefer:

```text
studentService.ts
courseService.ts
paymentService.ts
certificateService.ts
```

over:

```text
helper.ts
misc.ts
stuff.ts
common2.ts
```

Avoid unclear abbreviations.

---

# 78. Code Quality

Code should be:

- Readable
- Modular
- Testable
- Typed
- Explicit
- Maintainable

Avoid clever code that makes business logic difficult to understand.

---

# 79. Comments

Comments should explain:

- Why something exists
- Why a non-obvious decision was made
- Security implications
- Architectural constraints

Do not write comments that merely repeat obvious code.

---

# 80. Architecture Changes

Any major architectural change must follow:

```text
Problem
   ↓
Requirement
   ↓
Impact Analysis
   ↓
Alternatives
   ↓
Decision
   ↓
ADR
   ↓
Implementation
   ↓
Testing
```

Major changes include:

- Database changes
- Authentication changes
- Authorization changes
- Payment architecture
- Storage architecture
- Redis
- Queues
- Microservices
- Multi-tenancy
- AI infrastructure
- Cloud migration

---

# 81. ADR Requirement

Architecture Decision Records should be created for important architectural decisions.

An ADR should explain:

- Context
- Problem
- Options
- Decision
- Reason
- Consequences

Do not silently make major architectural changes.

---

# 82. Deployment

Recommended architecture:

```text
Public Website
    ↓
socialmeupacademy.in

LMS
    ↓
lms.socialmeupacademy.in

API
    ↓
api.lms.socialmeupacademy.in
```

Infrastructure:

```text
Frontend → Vercel
Backend  → Railway
Database → Supabase
Auth     → Supabase Auth
Storage  → Supabase Storage
Payments → Razorpay
```

---

# 83. Environment Separation

Maintain clear environments where practical:

```text
Development
Staging
Production
```

Never use production secrets in local development.

Never connect development code to production data unintentionally.

---

# 84. CI/CD

Recommended flow:

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

Do not deploy knowingly broken builds.

---

# 85. Backup and Disaster Recovery

Protect:

- PostgreSQL data
- Student data
- Course content
- Assignment submissions
- Certificates
- Important configuration

Define and document:

- RPO
- RTO
- Recovery procedure

Backups must be tested, not merely assumed to exist.

---

# 86. Data Privacy

Treat student, parent, trainer, payment, academic, and grievance information as sensitive.

Collect only necessary data.

Do not expose private information through:

- URLs
- Logs
- Public storage
- Client bundles
- Error messages
- AI prompts

---

# 87. Third-Party Integrations

Current important integrations include:

- Supabase
- Razorpay
- Email provider
- AI provider
- Vercel
- Railway

Third-party credentials must remain server-side unless intentionally public.

Every integration should have clear error handling and failure behavior.

---

# 88. Failure Handling

Assume external services can fail.

Handle:

- Supabase outages
- Razorpay failures
- Email failures
- AI provider failures
- Storage failures
- Network failures

Do not silently mark operations successful when the authoritative system failed.

---

# 89. Payment Failure

If payment confirmation cannot be verified:

Do NOT:

```text
activate enrollment
```

Instead:

```text
mark payment appropriately
log failure
allow reconciliation/retry
```

The system must remain consistent.

---

# 90. AI Failure

If the AI provider is unavailable:

The LMS core must continue functioning.

AI must be an extension, not a single point of failure for:

- Login
- Courses
- Enrollment
- Attendance
- Assignments
- Payments
- Certificates

---

# 91. Supabase Failure

Core application behavior should fail safely.

Do not:

- Assume database writes succeeded
- Show fake success
- Activate business state without confirmation

Return a controlled error and log the incident appropriately.

---

# 92. Security Invariants

The following rules are non-negotiable:

1. Students can only access authorized protected data.
2. Parents can only access authorized linked students.
3. Trainers can only access authorized academic scope.
4. Admins require appropriate permissions for sensitive operations.
5. Frontend authorization is never the security boundary.
6. Backend authorization is mandatory for sensitive operations.
7. RLS must protect sensitive database access.
8. Payment confirmation is server-authoritative.
9. Paid enrollment cannot depend only on frontend payment success.
10. Certificates are authoritative and auditable.
11. Private files remain private.
12. Sensitive operations are audited.
13. AI cannot bypass authorization.
14. Supabase service-role credentials never reach the browser.
15. Secrets are never committed to Git.

---

# 93. Do Not Weaken Security for Convenience

Never solve an authorization problem by:

- Disabling RLS
- Making storage public
- Returning all database rows
- Trusting frontend roles
- Trusting client-provided prices
- Trusting payment success from the browser
- Using service-role credentials in the frontend

If a secure implementation is difficult, solve the architecture rather than weakening security.

---

# 94. Performance vs Security

Never sacrifice critical security for minor performance improvements.

Examples:

Do not remove authorization because it adds a query.

Do not disable RLS because queries become easier.

Do not cache sensitive permissions indefinitely.

Security remains the priority.

---

# 95. Maintainability Rules

Prefer simple architecture over unnecessary complexity.

Do not introduce technology simply because it is popular.

Every new infrastructure component should have a clear reason.

Current default:

```text
Modular Monolith
+
Supabase PostgreSQL
+
Supabase Auth
+
Supabase Storage
+
REST API
```

This remains the preferred architecture until actual scale or business requirements justify change.

---

# 96. Future Infrastructure

Potential future additions:

- Redis
- Background workers
- Queue system
- Advanced analytics
- Mobile application
- WhatsApp
- SMS
- Live classes
- Multi-branch support
- Multi-tenancy
- Selective microservices
- Search infrastructure

These are NOT automatically required for MVP.

---

# 97. No Premature Microservices

Do not split the LMS into microservices merely because it is described as enterprise-level.

Start with:

**Secure Modular Monolith**

Extract services only when justified by:

- Scale
- Independent deployment needs
- Team boundaries
- Reliability requirements
- Performance requirements
- Clear domain boundaries

---

# 98. No Premature Redis

Redis should only be introduced when a measurable requirement exists.

Potential reasons:

- High-frequency caching
- Rate limiting
- Session-related infrastructure
- Distributed coordination
- Queue infrastructure

Do not add Redis simply because the project is large.

---

# 99. No Premature Kafka

Kafka/event streaming is not an MVP requirement.

Do not introduce Kafka without a documented requirement for:

- High-volume event streaming
- Independent consumers
- Durable event pipelines
- Analytics/event architecture

---

# 100. Code Before Architecture

Do not immediately write code when a request changes architecture.

First determine:

- What changes?
- Which modules are affected?
- Which database tables are affected?
- Which RLS policies are affected?
- Which APIs are affected?
- Which security rules are affected?
- Which tests are required?

Then implement.

---

# 101. Before Editing Existing Code

Before modifying existing code:

1. Read the relevant file.
2. Understand existing behavior.
3. Identify dependencies.
4. Identify related types.
5. Identify API contracts.
6. Identify security implications.
7. Make the smallest safe change.

Do not rewrite entire files unnecessarily.

---

# 102. Preserve Existing Functionality

When implementing a new feature:

- Do not break unrelated features.
- Do not remove working functionality.
- Do not change public APIs without reason.
- Do not change database semantics casually.
- Do not change authentication behavior without review.

---

# 103. Refactoring

Refactor when it improves:

- Security
- Maintainability
- Performance
- Correctness

Avoid refactoring unrelated code while implementing a feature.

Keep changes focused.

---

# 104. Migration Safety

Database/schema changes must consider:

- Existing records
- Foreign keys
- RLS
- Indexes
- Application compatibility
- Rollback
- Production deployment order

Never make destructive schema changes casually.

---

# 105. Production Safety

Before production changes, verify:

- Build
- Type check
- Tests
- Environment variables
- Database compatibility
- RLS
- Authorization
- Payment behavior
- Storage permissions

Never assume a successful frontend build means the system is production-ready.

---

# 106. Definition of Done

A feature is not complete merely because its UI exists.

A production feature should consider:

```text
UI
+
TypeScript
+
API
+
Validation
+
Authorization
+
Database
+
RLS
+
Error Handling
+
Loading State
+
Empty State
+
Testing
+
Accessibility
+
Responsive Design
+
Logging
```

Only the applicable layers are required for a particular feature.

---

# 107. AI Coding Agent Rules

Any AI coding agent working on this repository MUST:

1. Read `MEMORY.md`.
2. Read `SYSTEM_ARCHITECTURE.md`.
3. Read relevant PRD sections.
4. Inspect existing implementation before editing.
5. Preserve TypeScript.
6. Preserve Supabase architecture.
7. Never introduce MongoDB.
8. Never introduce JavaScript for new code.
9. Never introduce Tailwind.
10. Never expose secrets.
11. Never weaken RLS.
12. Never bypass backend authorization.
13. Never trust frontend payment success.
14. Never give AI unrestricted database access.
15. Add appropriate validation.
16. Add loading/error/empty states where relevant.
17. Consider accessibility.
18. Consider responsive behavior.
19. Consider tests.
20. Explain major architectural impacts.

---

# 108. AI Coding Agent — Database Rules

Before changing database-related code, the agent must determine:

- Which tables are affected?
- Which relationships are affected?
- Which indexes are required?
- Which RLS policies are affected?
- Which API services depend on the change?
- Whether existing records remain compatible?
- Whether migration/rollback is required?

Never make an insecure RLS policy just to make a query work.

---

# 109. AI Coding Agent — Authentication Rules

Authentication must use the approved Supabase Auth architecture.

Do not create an unrelated authentication system unless explicitly required.

Never store plaintext passwords.

Never expose authentication secrets.

Session handling must be secure.

---

# 110. AI Coding Agent — Authorization Rules

Before implementing protected functionality, answer:

```text
Who can perform this action?
On which resource?
Under what relationship?
With which permission?
```

If these rules are unclear, do not invent business behavior.

Flag the requirement as an open question.

---

# 111. AI Coding Agent — Payment Rules

Before changing payment logic, verify:

- Razorpay order creation
- Server-side verification
- Signature verification
- Webhook handling
- Idempotency
- Enrollment activation
- Refund behavior
- Audit requirements

Never simplify payment logic by trusting the frontend.

---

# 112. AI Coding Agent — File Rules

For private files:

```text
User
 ↓
Authentication
 ↓
Authorization
 ↓
Signed/authorized access
 ↓
Private Storage
```

Do not make private buckets public merely to simplify frontend rendering.

---

# 113. AI Coding Agent — Error Rules

Do not hide errors with:

```ts
catch {
  // ignore
}
```

Errors must be:

- Handled
- Logged appropriately
- Returned safely
- Recoverable where possible

---

# 114. AI Coding Agent — No Hallucinated APIs

Do not invent:

- Database tables
- Columns
- Supabase functions
- API endpoints
- Environment variables
- Third-party SDK methods
- Existing components

Inspect the repository first.

If something does not exist, explicitly state that it needs to be created.

---

# 115. AI Coding Agent — No Hallucinated Business Rules

Do not invent:

- Attendance percentage
- Grading formula
- Certificate eligibility
- Refund policy
- Parent permissions
- Course completion rules
- EMI rules
- GST behavior

unless those rules are already documented or explicitly provided.

---

# 116. Open Questions

The following business rules require explicit decisions when implementation depends on them:

- Exact course completion criteria
- Minimum attendance percentage
- Grade calculation
- Retake rules
- Certificate eligibility
- Certificate reissue rules
- Parent permissions
- Parent payment access
- Parent certificate access
- Parent-trainer communication
- Refund rules
- Partial refund rules
- EMI rules
- Invoice/GST rules
- Online/offline attendance rules
- Notification retention
- Email provider
- SMS/WhatsApp provider
- RPO
- RTO
- Expected user volume
- Uptime SLA

Do not silently invent these rules.

---

# 117. Final Engineering Principle

When choosing between:

```text
Fast but insecure
```

and:

```text
Secure, maintainable and correct
```

always choose:

**Secure, maintainable and correct.**

When choosing between:

```text
Complex architecture
```

and:

```text
Simple architecture that satisfies requirements
```

choose the simpler architecture.

When requirements are unclear:

**Ask or flag the open question instead of guessing.**

---

# 118. Final Stack

The approved baseline stack is:

```text
Frontend
React
TypeScript
Vite
React Router
CSS Modules / Normal CSS

Backend
Node.js
Express
TypeScript
REST API

Database
Supabase PostgreSQL

Authentication
Supabase Auth

Authorization
RBAC
Permissions
RLS
Ownership / Relationship checks

Storage
Supabase Storage

Payments
Razorpay

Realtime
Socket.io where required

Deployment
Vercel
Railway
Supabase

Version Control
Git
GitHub
```

---

# 119. Final Rule

**Do not break the architecture to make one feature easier.**

Every implementation must preserve the core principles:

```text
Security
+
Privacy
+
Data Integrity
+
Authorization
+
Type Safety
+
Maintainability
+
Performance
+
Accessibility
+
Scalability
```

These rules are mandatory unless explicitly superseded by an approved architectural decision.
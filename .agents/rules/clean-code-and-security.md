# Engineering Guidelines: Clean Code, Security & Performance Standards

These rules must be strictly adhered to across all future tasks, code generation, refactoring, and feature additions in this project.

---

## 1. Clean Code Standards
- **Strict TypeScript Typing**:
  - Prohibit `any` types. All entities (products, orders, notifications, users, server action responses) must use explicit interfaces from `@/types`.
  - Maintain type consistency between Prisma generated types and client interfaces.
- **Single Responsibility Principle (SRP)**:
  - Separate business logic into dedicated libraries (`@/lib/security.ts`, `@/lib/userAuth.ts`, `@/lib/adminAuth.ts`, `@/lib/prisma.ts`).
  - Keep Server Components focused on data fetching and Client Components focused on user interactions.
- **Consistent Code Structure & Reusability**:
  - Keep styling consistent with Tailwind CSS utility classes and design tokens.
  - Adhere to the established Next.js App Router conventions and file structure.

---

## 2. Up-To-Date Security Rules
- **Password & Credential Security**:
  - Passwords must NEVER be stored or checked in plain text.
  - Always use `bcryptjs` with a work factor of at least 12 salt rounds (`hashPassword`, `verifyPassword`).
- **Cryptographic Session Management**:
  - Never store raw user IDs or guessable state in client cookies.
  - All authentication cookies (`hardware_user_session`, `hardware_admin_session`) must be cryptographically signed using HMAC SHA-256 with `SESSION_SECRET`.
  - Validate signatures using constant-time comparison (`crypto.timingSafeEqual`) to prevent timing attack vulnerabilities.
  - Ensure cookies have `httpOnly: true`, `sameSite: "lax"`, and `secure: process.env.NODE_ENV === "production"`.
- **Input Validation & Sanitization**:
  - Sanitize all strings using `sanitizeInput` to strip null bytes (`\0`), trim whitespace, and enforce maximum length bounds.
  - Never trust client inputs; always re-validate values on the server before database mutation.
- **File Upload Protection**:
  - Strictly whitelist allowed file extensions (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`).
  - Verify MIME types match image headers.
  - Enforce file size limits (max 10MB).
  - Generate cryptographically random filenames (`crypto.randomBytes`) and store files securely without directory traversal vulnerabilities.
- **HTTP Security Headers**:
  - Maintain defensive security headers in `next.config.mjs`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Strict-Transport-Security`, `Referrer-Policy`, and restrictive `Permissions-Policy`.

---

## 3. Performance & Optimization Standards
- **Database Indexing**:
  - All foreign keys and frequently queried fields (`user_id`, `status`, `condition`, `created_at`) must be indexed in `prisma/schema.prisma` (`@@index(...)`).
- **Prisma Client Singleton**:
  - Always import from `@/lib/prisma` to prevent connection pool exhaustion during Next.js Hot Module Replacement (HMR).
- **Safe Database Transactions**:
  - Multi-table operations (e.g. approving an order and decrementing stock) must be wrapped in `prisma.$transaction(...)` to preserve ACID atomicity.
- **Image & Asset Optimization**:
  - Maintain strict 1:1 aspect ratio (`aspect-square` with `object-cover` or `object-contain`).
  - Keep static assets vectorized or properly compressed for fast rendering.
- **Next.js Cache Optimization**:
  - Use `revalidatePath` strategically after mutations to ensure client views update immediately without full application reloads.

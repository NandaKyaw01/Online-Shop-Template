# Project Rules & Architecture Standards

These rules must be followed across all code generation, refactoring, and feature additions in this repository.

## 1. Clean Code Standards
- **Strict TypeScript Typing**: No `any` types. Use explicit types defined in `@/types`.
- **Separation of Concerns**: Isolate business logic into `@/lib` utilities and use Server Actions for mutations.
- **Maintainability**: Clear naming conventions, DRY components, and modular structure.

## 2. Security Standards
- **Password Hashing**: Always hash passwords using `bcryptjs` (min 12 salt rounds) via `@/lib/security.ts`.
- **Cryptographic Sessions**: Cookies must be signed with HMAC SHA-256 (`SESSION_SECRET`) and verified using constant-time comparison (`crypto.timingSafeEqual`).
- **Input Sanitization**: Use `sanitizeInput` for all string inputs before persisting or querying.
- **Safe File Uploads**: Enforce strict extensions (`.jpg`, `.jpeg`, `.png`, `.webp`), MIME type verification, size limits (10MB), and cryptographically random filenames.
- **Security Headers**: Maintain defensive HTTP headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `HSTS`, `Referrer-Policy`) in `next.config.mjs`.

## 3. Performance Standards
- **Database Indexing**: All indexed queries and relations must have `@@index` in `prisma/schema.prisma`.
- **Prisma Connection Pooling**: Use the singleton `@/lib/prisma`.
- **Atomic Transactions**: Multi-model writes must use `prisma.$transaction`.
- **Cache Invalidation**: Use `revalidatePath` strategically after database mutations.
- **1:1 Hardware Images**: Maintain strict 1:1 square ratio (`aspect-square`) for visual consistency.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

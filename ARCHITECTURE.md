# ARCHITECTURE.md

## Next.js 16 SaaS Architecture

Tech stack: - Next.js 16 (App Router) - React 19 - TypeScript - Tailwind
CSS v4 - shadcn/ui - Better Auth - Drizzle ORM + PostgreSQL - Biome

## Directory Structure

``` text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
│
├── features/
│   ├── auth/
│   ├── billing/
│   ├── workspace/
│   └── blog/
│
├── components/
│   ├── ui/
│   ├── shared/
│   └── layout/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── env.ts
│   └── utils.ts
│
├── actions/
├── hooks/
├── types/
└── styles/
```

## Layer Responsibilities

### app/

Routing, layouts, loading, error, route groups, and Server Components.

### features/

Business domains. Each feature owns its UI, server logic, schemas, and
types.

Example:

``` text
features/workspace/
├── components/
├── server/
│   ├── queries.ts
│   └── mutations.ts
├── schemas.ts
├── types.ts
└── index.ts
```

### components/

-   `ui/` → shadcn components
-   `shared/` → reusable business-agnostic components
-   `layout/` → Navbar, Sidebar, Footer

### lib/

Framework and infrastructure only.

``` text
lib/
├── auth/
├── db/
├── email/
├── storage/
├── env.ts
└── utils.ts
```

Never place business logic here.

## Page Private Components

Use `_components` for components used by a single route.

``` text
app/dashboard/members/
├── page.tsx
├── loading.tsx
├── error.tsx
└── _components/
    ├── member-table.tsx
    └── invite-dialog.tsx
```

## Naming Convention

  Item            Convention
  --------------- --------------------
  Component       `kebab-case.tsx`
  Server Action   `create-member.ts`
  Schema          `member.schema.ts`
  Types           `member.types.ts`
  Query           `queries.ts`
  Mutation        `mutations.ts`

## Import Rule

Allowed:

``` ts
features -> lib
app -> features
app -> components
```

Avoid:

``` text
feature A -> feature B
components -> features
lib -> features
```

## Server Actions

Global actions:

``` text
src/actions/
├── upload-file.ts
└── send-feedback.ts
```

Feature-specific actions belong inside `features/*/server`.

## Multi Tenant

``` text
workspace
 ├── members
 ├── roles
 ├── billing
 └── settings
```

Every database query must include `workspaceId`.

## Environment

``` env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_APP_URL=
```

## Principles

1.  Feature-first architecture.
2.  Keep business logic inside `features`.
3.  Keep `lib` infrastructure-only.
4.  Use Server Components by default.
5.  Use `_components` for page-local UI.
6.  Prefer Server Actions over unnecessary API routes.
7.  Enforce strict TypeScript boundaries.
8.  Write unit tests for all business logic.

## Testing

### Test Infrastructure

- **Framework**: Vitest
- **UI Testing**: @testing-library/react
- **Test Environment**: jsdom

### Test Scripts

```bash
pnpm test              # Run tests in watch mode
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Run tests with coverage report
```

### Testing Guidelines

1. **Unit Tests**
   - Test all server mutations and queries
   - Test all schemas and validators
   - Test utility functions
   - Location: `__tests__/` folder next to the tested file

2. **Test Structure**

```text
features/blog/posts/
├── server/
│   ├── mutations.ts
│   ├── queries.ts
│   └── __tests__/
│       ├── mutations.test.ts
│       └── queries.test.ts
└── schemas.ts
```

3. **What to Test**

   - ✅ Server mutations (create, update, delete)
   - ✅ Server queries (filters, pagination)
   - ✅ Schema validations
   - ✅ Business logic functions
   - ✅ Utility functions
   - ❌ React components (optional)
   - ❌ API routes (covered by mutations/queries)

4. **Mocking Strategy**

   - Mock database calls with `vi.mock("@/lib/db")`
   - Mock external services (S3, email, etc.)
   - Use real schema validators (no mocking)
   - Mock `nanoid` for predictable IDs

5. **Test Coverage Goals**

   - Minimum 80% coverage for `features/*/server`
   - 100% coverage for critical paths (auth, billing)
   - Run coverage before merging PRs

6. **Example Test**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPost } from "../mutations";

vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(undefined),
    })),
  },
}));

describe("createPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a post with required fields", async () => {
    const input = {
      title: "Test Post",
      status: "DRAFT",
    };

    const postId = await createPost(input, "author-id");
    expect(postId).toBeDefined();
  });
});
```

7. **Testing Workflow**

   - Write tests when adding new features
   - Run tests before committing
   - Fix failing tests immediately
   - Update tests when refactoring
   - Use TDD for complex business logic

8. **CI/CD Integration**

   - Tests run automatically on PR
   - Coverage reports generated
   - Build fails if tests fail
   - No merge without passing tests

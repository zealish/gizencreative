# CODING_STANDARD.md

## Philosophy

Write code as if it will be maintained for years.

-   Clean Code first
-   Readability over cleverness
-   Type Safety always
-   Zero warnings
-   Zero type errors
-   Zero unused imports
-   Minimal comments
-   Small, composable functions

------------------------------------------------------------------------

## General Rules

-   Use TypeScript `strict`.
-   Never use `any`.
-   Prefer `unknown` over `any`.
-   One responsibility per function.
-   Keep files focused.
-   Delete dead code immediately.
-   No commented-out code.
-   No console logs in production.

------------------------------------------------------------------------

## Naming

  Item        Style
  ----------- ------------------
  Component   PascalCase
  File        kebab-case
  Variable    camelCase
  Function    camelCase
  Constant    UPPER_SNAKE_CASE
  Type        PascalCase
  Interface   PascalCase

Examples:

``` ts
const userProfile = {}
function createWorkspace() {}
type WorkspaceMember = {}
```

------------------------------------------------------------------------

## Imports

Order imports:

1.  React / Next
2.  Third-party
3.  Internal aliases
4.  Relative

Example:

``` ts
import { redirect } from "next/navigation"

import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"

import { formatName } from "./utils"
```

Rules:

-   No unused imports
-   No wildcard imports
-   Use absolute `@/` imports

------------------------------------------------------------------------

## Components

-   Server Component by default
-   Client Component only when required
-   Max one default export
-   Extract reusable UI

Good:

``` tsx
export function MemberTable() {
  return <div />
}
```

Avoid giant page files.

------------------------------------------------------------------------

## Server Actions

-   Validate input with Zod
-   Return typed result
-   Never trust client input

Structure:

``` text
server/
  queries.ts
  mutations.ts
```

------------------------------------------------------------------------

## Database

-   Use Drizzle ORM
-   Never write raw SQL unless necessary
-   Every query must be typed
-   Multi-tenant queries require workspaceId

------------------------------------------------------------------------

## Zod

Every external input must be validated.

``` ts
export const schema = z.object({
  name: z.string().min(2),
})
```

------------------------------------------------------------------------

## Error Handling

Never swallow errors.

``` ts
try {
  ...
} catch (error) {
  throw new Error("Failed to create workspace")
}
```

User-facing errors must be human readable.

------------------------------------------------------------------------

## Styling

-   Tailwind utility first
-   Use `cn()` helper
-   No inline styles
-   Reuse UI components

------------------------------------------------------------------------

## File Size

  File              Limit
  ----------- -----------
  Component     200 lines
  Page          150 lines
  Hook          100 lines
  Utility        80 lines

Extract when larger.

------------------------------------------------------------------------

## Comments

Allowed:

-   Why something exists
-   Complex business rule

Not allowed:

``` ts
// increment i
i++
```

Code should explain itself.

------------------------------------------------------------------------

## Biome

Required:

``` json
{
  "formatter": {
    "indentStyle": "space"
  },
  "linter": {
    "enabled": true
  }
}
```

Run before commit:

``` bash
pnpm biome check --write .
pnpm tsc --noEmit
```

Both commands must pass.

------------------------------------------------------------------------

## Pull Request Checklist

-   [ ] TypeScript passes
-   [ ] Biome passes
-   [ ] No unused imports
-   [ ] No `any`
-   [ ] No dead code
-   [ ] No commented code
-   [ ] Components extracted
-   [ ] Zod validation applied
-   [ ] Responsive UI verified

------------------------------------------------------------------------

## Definition of Done

Code is complete only if:

-   Zero TypeScript errors
-   Zero Biome warnings
-   Zero ESLint issues (if used)
-   Production build succeeds
-   Readable without comments
-   Consistent with architecture
-   Ready for deployment

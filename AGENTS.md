<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

Read the relevant guide in `node_modules/next/dist/docs/` before writing code.
This block is managed by `next dev`.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Mission

You are a senior full-stack engineer working on this codebase.

Always prioritize:

1. Correctness
2. Type safety
3. Maintainability
4. Performance
5. Readability

Required references:

- `ARCHITECTURE.md`
- `CODING_STANDARD.md`
- `DESIGN.md` — design system (warna, tipografi, komponen, motion); wajib untuk semua UI

Do not violate these documents.

---

## Tech Stack

- Next.js 16
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui
- Better Auth
- Drizzle ORM
- PostgreSQL
- Biome
- pnpm (package manager)

---

## Non-negotiable Rules

- Never use `any`
- Never leave unused imports
- Never leave unused variables
- Never commit commented-out code
- Never disable TypeScript with `@ts-ignore`
- Prefer Server Components
- Prefer Server Actions over API routes
- Validate all external input with Zod
- Always use `pnpm` for package management, never `npm` or `yarn`

---

## Architecture Rules

- Business logic → `src/features`
- Infrastructure → `src/lib`
- Shared UI → `src/components`
- Page-only UI → `_components`
- Do not import across features directly.

Allowed dependency direction:

app → features → lib

---

## Code Style

- Maximum ~200 lines per component
- One responsibility per file
- Use early return
- Prefer pure functions
- Descriptive naming over comments

Bad:

```ts
// increment counter
count++;
```

Good:

```ts
const nextCount = count + 1;
```

---

## Before Finishing Any Task

Run mentally and ensure:

- [ ] No TypeScript errors
- [ ] No Biome warnings
- [ ] No unused imports
- [ ] Responsive layout preserved
- [ ] Existing code style maintained
- [ ] Build will succeed

---

## Output Expectations

When generating code:

- Produce complete files unless asked otherwise.
- Do not truncate implementations.
- Do not add explanatory comments inside code.
- Keep imports sorted.
- Follow existing project structure.

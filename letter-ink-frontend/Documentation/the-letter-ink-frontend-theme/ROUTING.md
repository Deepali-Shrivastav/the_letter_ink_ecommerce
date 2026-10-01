# Routing

Use Next.js App Router conventions.

Suggested route structure:

```text
src/app/
├── page.tsx
├── about/page.tsx
├── services/page.tsx
├── portfolio/page.tsx
├── contact/page.tsx
├── privacy/page.tsx
└── terms/page.tsx
```

For service detail pages:

```text
services/
└── [slug]/
    └── page.tsx
```

## Rules

- Keep URLs stable.
- Prefer server components.
- Use route-level metadata.
- Use `not-found.tsx` for missing dynamic resources.
- Use `error.tsx` only where a recovery UI is meaningful.
- Avoid deeply nested URLs without a content reason.

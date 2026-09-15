# Component Architecture

## Principles

- Components are small and composable.
- Styling is token-driven.
- Content is separated from layout where practical.
- Server components remain the default in Next.js App Router.
- Add `"use client"` only where browser state or event handlers require it.

## Suggested layers

```text
components/
├── primitives/       # smallest reusable UI
├── forms/            # form-specific primitives
├── content/          # content patterns
├── feedback/         # status/interruption patterns
├── navigation/       # site navigation
├── layout/           # shell, header, footer, page layout
└── sections/         # page-level compositions
```

## Dependency direction

```text
sections
   ↓
layout / navigation / content / feedback
   ↓
forms / primitives
   ↓
CSS tokens
```

Avoid circular dependencies.

## Props

Prefer explicit typed props. Avoid broad `any` and boolean-prop explosions.

## Variants

Keep variants intentional:
- `primary | secondary | ghost`
- `sm | md | lg`

Do not create a variant for every visual difference.

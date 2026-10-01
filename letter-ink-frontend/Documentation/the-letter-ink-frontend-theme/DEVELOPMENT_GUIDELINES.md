# Development Guidelines

## General

- TypeScript strict mode
- Reusable components
- No arbitrary magic numbers when a token exists
- No inline color values in components
- Keep client-side JavaScript minimal
- Prefer semantic HTML
- Keep content close to its route when it is page-specific

## Styling

Use `src/app/globals.css` for the global token system and shared utility classes.

Do not create a second token system in component CSS.

## Images

Use Next.js `Image` for content imagery. Use plain `<img>` only when a technical constraint makes it necessary.

## Validation

Before merging:
```bash
npm run lint
npm run typecheck
npm run build
```

## Review checklist

- Responsive
- Keyboard accessible
- No console errors
- Correct metadata
- Correct image alt text
- No unused dependencies
- No arbitrary colors/spacing
- No unnecessary animations

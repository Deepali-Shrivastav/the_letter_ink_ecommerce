# Responsive Guidelines

## Breakpoints

The implementation uses:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Mobile first

Write base styles for small screens first, then enhance for larger screens.

## Header

Desktop:
- Horizontal navigation
- Brand lockup
- One clear primary action if required

Mobile:
- Compact brand treatment
- Menu button
- Full-screen or anchored navigation panel
- No crowded utility links

## Images

- Use intrinsic aspect ratios.
- Never distort the official logo.
- Avoid forcing brand artwork into arbitrary card crops.

## Touch targets

Interactive controls should have at least a 44×44px usable target.

## Content behavior

At smaller widths:
- Stack columns
- Reduce heading scale
- Reduce decorative density
- Keep line lengths readable
- Preserve whitespace rather than shrinking everything proportionally

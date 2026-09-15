# Animation Guidelines

Motion is optional and quiet.

## Allowed

- 150–220ms hover/focus transitions
- Small opacity/transform changes
- Mobile menu reveal
- Accordion open/close

## Avoid

- Parallax
- Constant floating
- Auto-playing decorative motion
- Large page transitions
- Bouncy spring animations
- Scroll-triggered animation on every section

## Reduced motion

Always honor:

```css
@media (prefers-reduced-motion: reduce)
```

In reduced motion mode, remove transforms and non-essential transitions.

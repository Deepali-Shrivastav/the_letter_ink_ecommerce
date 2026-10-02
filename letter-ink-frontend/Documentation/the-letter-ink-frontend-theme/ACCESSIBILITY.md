# Accessibility

Target WCAG 2.2 AA practices.

## Required

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`
- One meaningful page `h1`
- Logical heading order
- Keyboard access for all interactive elements
- Visible `:focus-visible`
- Labels associated with inputs
- Error text associated with the relevant field
- Buttons must have accessible names
- Decorative imagery uses empty alt text
- Informative imagery has meaningful alt text
- Do not communicate state using color alone
- Respect reduced motion

## Color

Use dark ink text on light backgrounds. Do not use pale blush as body text.

## Forms

Use:
- visible labels
- clear required/optional state
- inline error messages
- `aria-describedby` where helper/error text exists
- `aria-invalid="true"` when invalid

## Motion

All non-essential motion must be disabled or minimized under:

```css
@media (prefers-reduced-motion: reduce)
```

## Testing

Before release:
- Keyboard-only pass
- Screen-reader spot check
- Zoom to 200%
- Mobile viewport test
- Lighthouse accessibility audit

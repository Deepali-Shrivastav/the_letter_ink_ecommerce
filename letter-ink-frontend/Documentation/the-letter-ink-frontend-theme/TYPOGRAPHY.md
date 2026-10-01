# Typography

## Roles

### Display serif
Use for:
- Hero headlines
- Editorial section titles
- Important brand statements

Preferred stack:
```css
Georgia, "Times New Roman", serif
```

If the product later adopts a licensed/web font, replace the stack centrally rather than changing component styles.

### Interface sans
Use for:
- Navigation
- Buttons
- Forms
- Body copy
- Metadata

Preferred stack:
```css
Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### Script

The supplied logo/tagline artwork contains the handwritten expression. Do not introduce a script font across the application. If a handwritten accent is needed, prefer the official image asset.

## Scale

| Role | Desktop | Mobile | Weight |
|---|---:|---:|---|
| Display | 64px / 1.02 | 42px / 1.08 | 500 |
| H1 | 48px / 1.08 | 36px / 1.1 | 500 |
| H2 | 36px / 1.12 | 30px / 1.15 | 500 |
| H3 | 26px / 1.2 | 23px / 1.25 | 600 |
| H4 | 20px / 1.3 | 19px / 1.3 | 600 |
| Body large | 19px / 1.7 | 18px / 1.65 | 400 |
| Body | 16px / 1.65 | 16px / 1.65 | 400 |
| Small | 14px / 1.5 | 14px / 1.5 | 400 |
| Label | 13px / 1.4 | 13px / 1.4 | 600 |

## Rules

- Keep paragraphs around 60–80 characters per line.
- Avoid all-caps for long content.
- Use letter spacing sparingly.
- Do not use thin font weights for essential text.
- Never rely on color alone to communicate hierarchy.

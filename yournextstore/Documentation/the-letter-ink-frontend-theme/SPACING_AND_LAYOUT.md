# Spacing & Layout

## Base unit

The system uses a 4px base unit.

```text
4  8  12  16  20  24  32  40  48  64  80  96  120
```

## Layout tokens

- Page horizontal gutter: 20px mobile, 32px tablet, 40px desktop
- Maximum content width: 1200px
- Reading width: 720px
- Section vertical spacing: 72–120px desktop, 56–80px mobile
- Component gaps: usually 8–32px

## Grid

Prefer CSS Grid for page sections.

Common desktop:
- 12-column conceptual grid
- 24px gap
- Content constrained by `--container`

Tablet:
- 8-column conceptual grid

Mobile:
- Single column

## Alignment

- Default text alignment: left
- Hero may be centered when the content is short and brand-led
- Forms should remain left aligned
- Avoid arbitrary center alignment inside dense content

## Containers

Use the shared `.container` utility. Do not set unrelated `max-width` values on every component.

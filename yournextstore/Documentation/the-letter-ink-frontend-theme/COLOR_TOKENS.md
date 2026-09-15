# Color Tokens

The palette is derived from repeated colors visible in the supplied brand artwork. Values are intentionally normalized into a small, maintainable token set rather than reproducing every watercolor shade.

## Core palette

| Token | Value | Use |
|---|---|---|
| `--color-brand-blush-50` | `#FDF0F0` | soft page tint |
| `--color-brand-blush-100` | `#FBE8E8` | primary warm background |
| `--color-brand-blush-200` | `#F5D8DA` | subtle surfaces |
| `--color-brand-rose-300` | `#F3B0B7` | soft accent |
| `--color-brand-rose-400` | `#E996A5` | brand accent |
| `--color-brand-rose-500` | `#C87278` | accessible accent/darker rose |
| `--color-ink-900` | `#231F20` | primary text / logo ink |
| `--color-ink-700` | `#403A3B` | secondary text |
| `--color-ink-500` | `#6F6667` | muted text |
| `--color-paper` | `#FFFDFC` | elevated content |
| `--color-white` | `#FFFFFF` | control surfaces |
| `--color-border` | `#E8D7D7` | borders/dividers |

## Semantic tokens

Use semantic tokens in components:

- `--color-bg`: application background
- `--color-surface`: content surface
- `--color-surface-muted`: subtle surface
- `--color-text`: primary text
- `--color-text-muted`: supporting text
- `--color-border`: standard border
- `--color-primary`: primary action
- `--color-primary-hover`: hover state
- `--color-focus`: keyboard focus
- `--color-success`, `--color-warning`, `--color-danger`, `--color-info`: functional states

## Contrast

Do not use the light blush/rose tokens for body text on light backgrounds. For text, use `--color-ink-900` or `--color-ink-700`.

The darker rose `#C87278` is reserved for text/icon use where contrast is adequate.

## Color ratio guidance

A typical page should visually read approximately as:
- 65–80% warm neutral/white space
- 10–20% ink typography
- 5–15% blush/rose brand accents

This is guidance, not a mathematical requirement.

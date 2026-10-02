# Design System

## 1. Design character

The Letter Ink should feel like a considered creative studio, not a SaaS dashboard.

**Keywords:** editorial, crafted, feminine, restrained, warm, precise, premium, personal.

### Avoid

- Neon or cyber colors
- Heavy gradients
- Glassmorphism
- Huge floating cards
- Excessive pill controls
- Dense dashboard layouts
- Excessive drop shadows
- Decorative animation on every element
- AI-generated-looking geometric decorations

## 2. Visual hierarchy

Use this order:

1. Page title / primary message
2. Supporting context
3. Primary action
4. Supporting content
5. Decorative brand details

The logo is a brand asset, not a substitute for page hierarchy.

## 3. Surfaces

Preferred surfaces:
- Warm ivory/blush page background
- White/near-white content surfaces
- Very light rose-tinted borders
- Ink text

Cards are optional. Prefer sections with whitespace and a border over a grid of identical rounded cards.

## 4. Shape

- Default radius: 8px
- Small controls: 6px
- Larger feature surfaces: 12px
- Avoid excessive 20–32px radii unless the content genuinely benefits from it.

## 5. Depth

Use borders before shadows.

Default shadow is deliberately subtle:
`0 8px 24px rgba(35, 31, 32, 0.06)`

Do not stack multiple shadows.

## 6. Interaction

Hover:
- Slight border-color change
- Small tonal shift
- Optional 1–2px translate for a primary button only

Focus:
- Always visible
- 2px accent outline with adequate offset

Pressed:
- Remove any hover lift
- Use a slightly darker surface

## 7. Content width

Default reading width: 680–760px.
Default page width: 1200px.
Wide layouts may reach 1280px when needed.

## 8. Brand asset rule

The supplied official logo artwork is the source of truth. Do not recreate the calligraphic mark with CSS or substitute it with an icon.

# Image & Asset Guidelines

## Official assets

The supplied brand files under `public/brand/` are source assets.

### Web usage

Use:
- PNG when transparency/quality is required
- JPEG only where the supplied image itself is the intended artwork/reference

Do not re-export official artwork at lower quality unless a specific optimization workflow is introduced.

## Naming

New assets should use:
```text
kebab-case-descriptive-name.ext
```

## Alt text

Informative:
> The Letter Ink calligraphic logo in black over a soft pink watercolor field.

Decorative:
```html
alt=""
```

Do not use file names as alt text.

## Decorative botanical artwork

Use sparingly and only in spaces where it does not interfere with:
- text
- navigation
- forms
- accessibility
- mobile readability

## Optimization

For newly produced photographic content:
- AVIF/WebP where appropriate
- responsive `sizes`
- avoid shipping desktop-resolution images to mobile unnecessarily

For official logo assets, preserve the supplied artwork's visual fidelity.

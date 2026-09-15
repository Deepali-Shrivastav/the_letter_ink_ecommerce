# SEO Guidelines

## Page structure

Every indexable page should have:
- Unique `<title>`
- Unique meta description
- Canonical URL where appropriate
- One clear H1
- Descriptive headings
- Semantic content
- Descriptive image alt text

## Next.js

Prefer Next.js `metadata` exports for static pages and `generateMetadata` for dynamic pages.

## URLs

Use:
- lowercase
- hyphens
- stable paths
- no unnecessary query parameters

Example:
`/services/custom-invitations`

## Internal links

Use descriptive anchor text. Avoid generic "click here".

## Images

Use `next/image` and meaningful filenames for newly added assets.

## Structured data

Add JSON-LD only when the page/entity genuinely qualifies, such as:
- Organization
- LocalBusiness
- Service
- Product
- BreadcrumbList

Do not add schema merely for decoration.

## Social metadata

Important marketing pages should provide Open Graph and Twitter/X metadata through Next.js metadata configuration.

# 44 — Open Questions
## letter-ink-backend · Decisions Required Before PRD

> All of these must be resolved in Phase 1 (Architecture Definition) before implementation begins.

---

## Architecture Questions

| # | Question | Impact | Who decides |
|---|---|---|---|
| Q1 | **Customisation storage:** Should selections be stored in `cart_line_item.metadata` (jsonb) or in a new custom `cart_line_item_customisation` table? | Schema, migration, query strategy | Tech lead |
| Q2 | **Customization pricing:** Fixed per product? Per option surcharge? Additive? Variant-level? | Pricing module extension strategy | Business + Tech |
| Q3 | **Preview system:** Client-side CSS/canvas only, or server-side image generation? | Infrastructure requirements | Business + Tech |
| Q4 | **Payment providers:** Razorpay only (India), or Razorpay + Stripe (international)? | Integration complexity | Business |
| Q5 | **Shipping providers:** Which Indian shipping provider? (Shiprocket, Delhivery, Bluedart, EcomExpress?) | Fulfillment integration | Business |
| Q6 | **Production workflow:** Is printing done in-house or by an external print vendor API? | Workflow design, vendor integration | Business |
| Q7 | **Production status machine:** What are the exact production stages? (Pending → Printing → Drying → QC → Packaging → Ready) | Workflow design | Business |
| Q8 | **Customisation history:** Should historical selections be stored for reorder and analytics? | Additional data model | Business |
| Q9 | **International scope:** Is INR the only currency, or are international orders planned? | Multi-currency, multi-region complexity | Business |
| Q10 | **Admin customisation:** Full custom page in admin sidebar, or extended product widget? | Admin architecture | UX team |

---

## Domain Questions

| # | Question | Impact |
|---|---|---|
| Q11 | What is the **complete product catalog** for The Letter Ink? (Name frames, cards, envelopes — full list with all variants) | Product seed data, catalog architecture |
| Q12 | What are all the **paper colors** available? (Exact hex values, labels, availability) | Seed data |
| Q13 | What are all the **ink colors** available? (Exact hex values, labels, compatibility) | Seed data |
| Q14 | What are all the **font styles** available? (Names, preview images) | Seed data |
| Q15 | What are the **exact compatibility rules**? (Which inks work with which papers — complete matrix) | Compatibility engine |
| Q16 | What is the **maximum text length** for personalization? (Per product, or global?) | Text field configuration |
| Q17 | Can a customer **reuse** a previous personalization for reorder? | Order history feature scope |

---

## Compliance Questions

| # | Question | Impact |
|---|---|---|
| Q18 | What is the **GST rate** for stationery products? (Standard 18%? Paper 12%? Printing services?) | Tax configuration |
| Q19 | Are there any **export regulations** for sending stationery internationally? | Fulfillment restrictions |
| Q20 | What are the **return/refund policies** for personalized items? (Typically non-returnable) | Order management logic |
| Q21 | Is a **privacy policy** required for storing personalization text (customer names)? | GDPR/IT Act compliance |

---

## Infrastructure Questions

| # | Question | Impact |
|---|---|---|
| Q22 | **Deployment target:** AWS, GCP, Azure, Hetzner, or another provider? | Deployment architecture |
| Q23 | **Database hosting:** Managed RDS, self-hosted, Neon, Supabase, or Railway? | Database architecture |
| Q24 | **File storage:** AWS S3, Cloudflare R2, or alternative? | File storage configuration |
| Q25 | **Email provider:** SendGrid, AWS SES, Resend, or Postmark? | Notification integration |
| Q26 | **Monitoring:** Is an observability stack required at launch? (Datadog, Grafana, Sentry?) | Infrastructure budget |
| Q27 | **CI/CD:** GitHub Actions, or another CI platform? | DevOps setup |

---

## Urgency Priority

Questions that block the PRD:

| Priority | Questions |
|---|---|
| **Must answer first** | Q1, Q4, Q5, Q6, Q11, Q12, Q13, Q15 |
| **Answer before implementation** | Q2, Q3, Q7, Q8, Q9, Q14, Q16, Q18, Q22, Q23 |
| **Can answer during implementation** | Q10, Q17, Q19, Q20, Q21, Q24, Q25, Q26, Q27 |

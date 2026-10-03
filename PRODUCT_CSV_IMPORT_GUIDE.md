# Product CSV Import Guide (Medusa v2)

This document provides the complete specification, column definitions, rules, and ready-to-use CSV templates for importing products into the **Letter Ink E-Commerce** store using Medusa v2's built-in CSV import tool.

---

## 1. Quick Overview

Medusa processes product CSV files using an internal `CSVNormalizer`. The normalizer:
1. Matches columns case-insensitively with standardized names.
2. Groups rows belonging to the same product by **`Product Handle`** (for new products) or **`Product Id`** (for updating existing products).
3. Treats each CSV row as **one variant** of that product.
4. Requires at least **one variant price** (e.g., `Variant Price INR`) per row.

---

## 2. Field Specifications

### A. Mandatory Fields (Required to create a new product)

| CSV Header | Format / Type | Description & Example |
| :--- | :--- | :--- |
| **`Product Handle`** | String (kebab-case) | Unique slug identifying the product. Must be identical across all rows for the same product.<br>*(e.g., `royal-name-frame-large`)* |
| **`Product Title`** | String | The public name of the product.<br>*(e.g., `Royal Name Frame Large`)* |
| **`Variant Title`** | String | Name of the variant.<br>*(e.g., `Default`, `Small`, `Brass Frame`)* |
| **`Variant Price <CURRENCY>`** | Numeric | Price in the specified ISO currency code. Do not include currency symbols (`₹` or `$`).<br>*(e.g., `Variant Price INR` with value `3800`)* |

> **Option Rule**: If your product uses options (e.g. Size, Material), both **`Variant Option 1 Name`** and **`Variant Option 1 Value`** must be provided. For simple products without variations, set `Variant Option 1 Name` to `Standard` and `Variant Option 1 Value` to `Default`.

---

### B. Recommended Storefront Fields

| CSV Header | Type | Description |
| :--- | :--- | :--- |
| **`Product Status`** | `published` \| `draft` | Defaults to `draft` if omitted. Use `published` to display directly on storefront. |
| **`Product Subtitle`** | String | Short secondary tag line *(e.g., `Shadowbox Keepsake`)*. |
| **`Product Description`** | String | Detailed description. Enclose in double quotes if it contains commas or newlines. |
| **`Product Thumbnail`** | URL String | Main product card image URL. |
| **`Product Image 1 Url`** | URL String | First gallery image URL. |
| **`Product Image 2 Url`** | URL String | Second gallery image URL (increment number for more images). |
| **`Product Discountable`** | `TRUE` \| `FALSE` | Determines if promotion discounts apply to this product. Defaults to `TRUE`. |
| **`Product Metadata`** | JSON String | Custom store fields (must be valid JSON).<br>*(e.g., `{"badge":"Bestseller","rating":4.9,"category_name":"Name Frames"}`)* |

---

### C. Variant & Inventory Fields

| CSV Header | Type | Description |
| :--- | :--- | :--- |
| **`Variant SKU`** | String | Stock Keeping Unit code *(e.g., `RNF-LRG-001`)*. |
| **`Variant Manage Inventory`** | `TRUE` \| `FALSE` | Whether stock levels are tracked. Defaults to `TRUE`. |
| **`Variant Allow Backorder`** | `TRUE` \| `FALSE` | Whether customers can order when out of stock. Defaults to `FALSE`. |
| **`Variant Barcode`** | String | Barcode / UPC / EAN. |
| **`Variant Weight`** | Number | Weight (grams or kg). |
| **`Variant Length`** | Number | Dimensions. |
| **`Variant Width`** | Number | Dimensions. |
| **`Variant Height`** | Number | Dimensions. |

---

### D. Organization & Relation IDs (Optional)

| CSV Header | Type | Description |
| :--- | :--- | :--- |
| **`Shipping Profile Id`** | ID String | Shipping profile ID (e.g., `sp_...`). |
| **`Product Sales Channel 1`** | ID String | Sales channel ID (e.g., `sc_...`). |
| **`Product Category 1`** | ID String | Product category ID (e.g., `pcat_...`). |
| **`Product Collection Id`** | ID String | Collection ID (e.g., `pcol_...`). |
| **`Product Tag 1`** | ID String | Tag ID (e.g., `ptag_...`). |

---

## 3. Multi-Variant Structure

When a product has multiple variants (e.g. Small / Large, or Different Colors):
- Each variant has its own row in the CSV.
- The `Product Handle`, `Product Title`, and product-level fields must match across all rows for that product.
- The `Variant Title`, `Variant SKU`, `Variant Option <N> Value`, and prices will vary per row.

---

## 4. Ready-to-Use CSV Templates

### Template 1: Minimal CSV

```csv
Product Handle,Product Title,Product Status,Variant Title,Variant Price INR,Variant Option 1 Name,Variant Option 1 Value
royal-name-frame,Royal Name Frame,published,Default,3800,Standard,Default
classic-desk-frame,Classic Desk Heirloom,published,Default,2499,Standard,Default
```

---

### Template 2: Full Catalog CSV (Single & Multi-Variant)

```csv
Product Handle,Product Title,Product Subtitle,Product Description,Product Status,Product Thumbnail,Product Image 1 Url,Variant Title,Variant SKU,Variant Manage Inventory,Variant Allow Backorder,Variant Price INR,Variant Option 1 Name,Variant Option 1 Value
wooden-monogram-wax-seal-kit,Wooden Monogram Wax Seal Kit,Scribe & Epistolary,"Turned beechwood handle with solid brass coin, brass melting spoon, and pearlescent wax beads.",published,https://images.example.com/kit-thumb.jpg,https://images.example.com/kit-thumb.jpg,Standard Kit,WMS-KIT-STD,TRUE,FALSE,1850,Edition,Standard
engraved-french-glass-box,Engraved French Glass Box,Monogram Glass,"Diamond micro-drill hand engraved glass keepsake with botanical wreath and intertwined initials.",published,https://images.example.com/box-thumb.jpg,https://images.example.com/box-detail.jpg,Small,EFB-SML,TRUE,FALSE,2499,Size,Small
engraved-french-glass-box,Engraved French Glass Box,Monogram Glass,"Diamond micro-drill hand engraved glass keepsake with botanical wreath and intertwined initials.",published,https://images.example.com/box-thumb.jpg,https://images.example.com/box-detail.jpg,Large,EFB-LRG,TRUE,FALSE,3400,Size,Large
personalised-handwritten-scroll,Personalised Handwritten Scroll,Epistolary Suite,"Up to 150 words of poetic prose or personal wedding letters, finished with hand-dyed silk ribbon.",published,https://images.example.com/scroll-thumb.jpg,https://images.example.com/scroll-detail.jpg,Single Scroll,PHS-001,TRUE,FALSE,3500,Format,Single Scroll
```

---

## 5. Important Rules to Avoid Errors

1. **Exact Header Names**:
   - Headers are strictly checked against Medusa's known columns list. Unrecognized headers will trigger an error: `Invalid column name(s) "<name>"`.
   - Use spaces between words (e.g., `Product Handle`, NOT `product_handle`).
2. **Numeric Values Only for Prices**:
   - Use `3800`, **not** `₹3800` or `Rs. 3800`.
3. **Double Quotes for Commas**:
   - If `Product Description` contains commas, quotes, or new lines, enclose the entire description in double quotes (`"..."`).
4. **Encoding**:
   - Always save/export the file with **UTF-8** encoding.
5. **Updating Existing Products**:
   - To update an existing product instead of creating a duplicate, include the **`Product Id`** column populated with Medusa's internal product ID (`prod_...`).

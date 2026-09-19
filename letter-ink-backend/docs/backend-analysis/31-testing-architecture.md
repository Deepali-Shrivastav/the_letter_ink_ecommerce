# 31 — Testing Architecture
## letter-ink-backend · Test Coverage Analysis

> **Analysis only. Do not modify the codebase.**

---

## 1. Testing Infrastructure

| Tool | Version | Purpose |
|---|---|---|
| **Jest** | ^29.7.0 | Test runner |
| **@swc/jest** | ^0.2.36 | Fast TypeScript transpilation for tests |
| **@medusajs/test-utils** | 2.21.0 | Medusa-specific test helpers (module bootstrap, etc.) |
| **@medusajs/utils** | 2.21.0 | `loadEnv` utility used in `jest.config.js` |

---

## 2. Test Configuration

**File:** `apps/backend/jest.config.js`

```javascript
module.exports = {
  transform: {
    "^.+\\.[jt]s$": ["@swc/jest", { jsc: { parser: { syntax: "typescript", decorators: true } } }]
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json"],
  modulePathIgnorePatterns: ["dist/", "<rootDir>/.medusa/"],
  setupFiles: ["./integration-tests/setup.js"],
}

// TEST_TYPE=integration:http   → tests in integration-tests/http/*.spec.[jt]s
// TEST_TYPE=integration:modules → tests in src/modules/*/__tests__/**/*.[jt]s
// TEST_TYPE=unit               → tests in src/**/__tests__/**/*.unit.spec.[jt]s
```

**Test commands (from `package.json`):**

| Command | What it runs |
|---|---|
| `npm run test` | All tests (via Turbo) |
| `TEST_TYPE=unit npm test` | Unit tests only |
| `TEST_TYPE=integration:http npm test` | HTTP integration tests |
| `TEST_TYPE=integration:modules npm test` | Module integration tests |

---

## 3. Current Test Coverage

### Integration Tests

**File:** `apps/backend/integration-tests/setup.js`

```javascript
// Content (from filesystem):
// Single file, 102 bytes — likely just environment setup
```

**Status:** No actual test files exist. The `integration-tests/` directory contains only `setup.js` (environment bootstrapper). There are **zero test files** matching any of the test patterns.

### Module Tests

No `__tests__/` directories in `src/modules/customisation/` or anywhere in `src/`.

### Unit Tests

No `.unit.spec.[jt]s` files anywhere in the codebase.

---

## 4. Test Coverage: Critical Gap

| Component | Coverage | Risk |
|---|---|---|
| `CustomisationModuleService` | 0% | High |
| `customisation/groups/route.ts` | 0% | High |
| `customisation/compatibility/route.ts` | 0% | High |
| `customisation/products/route.ts` | 0% | High |
| `store/products/[productId]/customisation/route.ts` | 0% | **Critical** — this is the most complex and business-critical route |
| `seed-customisation.ts` | 0% | Medium |
| `initial-data-seed.ts` | 0% | Medium |
| Module link `product-customisation.ts` | 0% | Medium |
| Admin widget | 0% | Low |

**Total custom code test coverage: 0%**

---

## 5. What Tests Should Be Written

### Unit Tests (fast, no DB)

| Test | Description |
|---|---|
| `validateCompatibility(selections, rules)` | Given selections and rules, returns valid/invalid with reason |
| `validateRequiredGroups(productGroups, selections)` | Checks all required groups have selections |
| `validateTextFields(textFields, textSelections)` | Validates max_chars, required |
| `assembleCustomisationResponse(...)` | Tests the assembly logic of the store endpoint |
| `buildCompatibilityMap(options, rules)` | Tests the compatibility_rules map building |

### Module Integration Tests (with Medusa test DB)

| Test | Description |
|---|---|
| `createCustomisationGroups` | Create group → retrieve → verify |
| `createCustomisationOptions` | Create option with group → list by group |
| `createCompatibilityRule` | Create rule → list → verify |
| `createProductGroup` | Link product to group → list → verify |
| `deleteCustomisationGroups` (soft delete) | Create → delete → verify deleted_at set |
| `listCustomisationGroups (relations: ["options"])` | Verify relations are loaded |

### HTTP Integration Tests (full API call)

| Test | Description |
|---|---|
| `GET /admin/customisation/groups` | Returns empty list when no groups |
| `POST /admin/customisation/groups` | Creates group, returns it |
| `POST /admin/customisation/groups` (missing name) | Returns 400 or 422 |
| `PATCH /admin/customisation/groups/:id` | Updates name |
| `DELETE /admin/customisation/groups/:id` | Soft deletes |
| `GET /store/products/:id/customisation` | Returns assembled config |
| `GET /store/products/:id/customisation` (no groups) | Returns `{ groups: [], text_field: null }` |
| `GET /store/products/nonexistent/customisation` | Returns empty gracefully |

---

## 6. Testing Strategy Recommendation

**Phase 1 (before first real order):**
- Write unit tests for all validation logic
- Write HTTP integration tests for all custom routes

**Phase 2 (before production deployment):**
- Write module integration tests for all service methods
- Add test for the cart customisation workflow (when implemented)

**Phase 3 (ongoing):**
- Maintain test coverage gate: no new feature merged without tests
- Add E2E test for the full customer customisation journey

---

## 7. Running Tests Locally

```bash
# From apps/backend/
cd apps/backend

# Unit tests
TEST_TYPE=unit npx jest

# Module integration tests (requires test DB)
TEST_TYPE=integration:modules npx jest

# HTTP integration tests (requires running server)
TEST_TYPE=integration:http npx jest
```

The `integration-tests/setup.js` loads `.env.test` via `loadEnv("test", process.cwd())`.

**Note:** `.env.test` does not exist in the repository — would need to be created pointing to a test database.

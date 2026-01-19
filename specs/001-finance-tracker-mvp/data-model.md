# Data Model: Personal Finance Tracking SaaS - Core MVP

**Branch**: `001-finance-tracker-mvp` | **Date**: 2026-01-17

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    User     │───┬───│   Account   │───────│   Transaction   │
└─────────────┘   │   └─────────────┘       └─────────────────┘
       │          │          │                      │
       │          │          │                      │
       │          │   ┌──────┴──────┐              │
       │          │   │             │              │
       │          ▼   ▼             │              ▼
       │   ┌─────────────┐         │       ┌─────────────┐
       │   │   Budget    │         │       │  Category   │
       │   └─────────────┘         │       └─────────────┘
       │          │                │              │
       │          │                │              ▼
       │          └────────────────┼───────┌─────────────────────┐
       │                           │       │ AutoCategorizationRule│
       │                           │       └─────────────────────┘
       │                           │
       ▼                           │
┌─────────────────┐               │
│  Notification   │◄──────────────┘
└─────────────────┘

Legend:
  ───── One-to-Many
  ─ ─ ─ Optional relationship
```

## Entities

### User

Represents a registered user with authentication credentials and preferences.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| email_verified_at | TIMESTAMP | NULLABLE | Verification timestamp |
| password | VARCHAR(255) | NULLABLE | Bcrypt hash (null for OAuth-only) |
| display_name | VARCHAR(100) | NOT NULL | User's display name |
| google_id | VARCHAR(255) | UNIQUE, NULLABLE | Google OAuth identifier |
| subscription_tier | ENUM | NOT NULL, DEFAULT 'free' | 'free', 'pro', 'team' |
| notification_preferences | JSONB | NOT NULL, DEFAULT '{}' | {budget_alerts: bool, email_alerts: bool} |
| failed_login_attempts | INTEGER | NOT NULL, DEFAULT 0 | Consecutive failures |
| locked_until | TIMESTAMP | NULLABLE | Lockout expiry time |
| remember_token | VARCHAR(100) | NULLABLE | Session remember token |
| created_at | TIMESTAMP | NOT NULL | Registration time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes**:
- `users_email_unique` on `email`
- `users_google_id_unique` on `google_id`

**Validation Rules**:
- email: valid email format, unique
- password: min 8 chars (validated at input, stored hashed)
- display_name: 1-100 characters
- subscription_tier: one of ['free', 'pro', 'team']

---

### Account

A financial container for tracking money.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| user_id | UUID | FK → users.id, NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Account name |
| type | ENUM | NOT NULL | 'checking', 'savings', 'credit_card', 'cash', 'investment' |
| balance | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Current balance (calculated) |
| currency | CHAR(3) | NOT NULL, DEFAULT 'USD' | ISO 4217 currency code |
| is_asset | BOOLEAN | NOT NULL | True for checking/savings/cash/investment, false for credit_card |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes**:
- `accounts_user_id_index` on `user_id`
- `accounts_user_id_type_index` on `(user_id, type)`

**Validation Rules**:
- name: 1-100 characters, unique per user
- type: one of defined enum values
- balance: max 13 digits, 2 decimal places

**Business Rules**:
- Free tier users limited to 2 accounts (FR-070)
- Deleting account cascades to all transactions (clarification)
- `is_asset` derived from type: credit_card = false, others = true

---

### Transaction

A financial event representing money in or out.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| account_id | UUID | FK → accounts.id, NOT NULL | Parent account |
| category_id | UUID | FK → categories.id, NULLABLE | Assigned category |
| linked_transaction_id | UUID | FK → transactions.id, NULLABLE | For transfers |
| type | ENUM | NOT NULL | 'income', 'expense' |
| amount | DECIMAL(15,2) | NOT NULL | Absolute value |
| date | DATE | NOT NULL | Transaction date |
| payee | VARCHAR(255) | NOT NULL | Payee/merchant name |
| notes | TEXT | NULLABLE | User notes |
| is_duplicate_flagged | BOOLEAN | NOT NULL, DEFAULT false | Import duplicate flag |
| import_batch_id | UUID | NULLABLE | Reference to import batch |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes**:
- `transactions_account_id_index` on `account_id`
- `transactions_account_id_date_index` on `(account_id, date DESC)`
- `transactions_category_id_index` on `category_id`
- `transactions_payee_trgm_index` GIN trigram on `payee` (for search)
- `transactions_date_index` on `date`
- `transactions_duplicate_check_index` on `(account_id, date, amount, payee)` (for import)

**Validation Rules**:
- amount: positive, max 13 digits, 2 decimal places
- date: valid date, can be future (for scheduled)
- payee: 1-255 characters

**Business Rules**:
- Free tier users can only view transactions from last 6 months (FR-071)
- Account balance = SUM(income) - SUM(expense) for that account
- Transfer creates two linked transactions (clarification)
- Deleting one transfer transaction deletes the linked one

---

### Category

Classification for organizing transactions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| user_id | UUID | FK → users.id, NULLABLE | Null for system categories |
| parent_id | UUID | FK → categories.id, NULLABLE | Parent for subcategories |
| name | VARCHAR(100) | NOT NULL | Category name |
| icon | VARCHAR(50) | NULLABLE | Icon identifier |
| is_system | BOOLEAN | NOT NULL, DEFAULT false | True for pre-seeded |
| is_protected | BOOLEAN | NOT NULL, DEFAULT false | True for "Uncategorized" |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | Sort order |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes**:
- `categories_user_id_index` on `user_id`
- `categories_parent_id_index` on `parent_id`
- `categories_user_id_name_unique` on `(user_id, name)` where user_id IS NOT NULL

**Validation Rules**:
- name: 1-100 characters, unique per user (or globally for system)
- Max 2 levels of nesting (category → subcategory)

**Business Rules**:
- System categories visible to all users, cannot be edited/deleted
- "Uncategorized" is protected, cannot be deleted (FR-041a)
- Deleting category reassigns transactions to "Uncategorized" (clarification)

**Pre-seeded Categories** (FR-040):
1. Housing (subcategories: Rent/Mortgage, Utilities, Maintenance)
2. Transportation (subcategories: Gas, Public Transit, Car Payment, Parking)
3. Food & Dining (subcategories: Groceries, Restaurants, Coffee)
4. Utilities (subcategories: Electric, Water, Internet, Phone)
5. Healthcare (subcategories: Insurance, Doctor, Pharmacy)
6. Entertainment (subcategories: Streaming, Events, Hobbies)
7. Shopping (subcategories: Clothing, Electronics, Home)
8. Income (subcategories: Salary, Freelance, Investments, Other)
9. Transfers
10. Uncategorized (protected)

---

### AutoCategorizationRule

Pattern-matching rule for automatic transaction categorization.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| user_id | UUID | FK → users.id, NOT NULL | Owner |
| category_id | UUID | FK → categories.id, NOT NULL | Target category |
| pattern | VARCHAR(255) | NOT NULL | Match pattern |
| match_type | ENUM | NOT NULL | 'contains', 'starts_with', 'equals' |
| priority | INTEGER | NOT NULL, DEFAULT 0 | Evaluation order (higher = first) |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Rule enabled |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes**:
- `auto_cat_rules_user_id_index` on `user_id`
- `auto_cat_rules_user_id_priority_index` on `(user_id, priority DESC)`

**Validation Rules**:
- pattern: 1-255 characters, case-insensitive matching
- match_type: one of defined enum values

**Business Rules**:
- Rules evaluated in priority order, first match wins
- Applied to new transactions and CSV imports
- Category deletion does not delete rules (rule becomes inactive or reassigned)

---

### Budget

Monthly spending limit for a category.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| user_id | UUID | FK → users.id, NOT NULL | Owner |
| category_id | UUID | FK → categories.id, NOT NULL | Tracked category |
| amount | DECIMAL(15,2) | NOT NULL | Monthly limit |
| period_month | INTEGER | NOT NULL | Month (1-12) |
| period_year | INTEGER | NOT NULL | Year |
| rollover_enabled | BOOLEAN | NOT NULL, DEFAULT false | Carry over unspent |
| rollover_amount | DECIMAL(15,2) | NOT NULL, DEFAULT 0 | Carried from previous |
| alert_threshold | INTEGER | NOT NULL, DEFAULT 80 | Warning at % spent |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes**:
- `budgets_user_id_index` on `user_id`
- `budgets_user_category_period_unique` on `(user_id, category_id, period_year, period_month)`

**Validation Rules**:
- amount: positive, max 13 digits, 2 decimal places
- period_month: 1-12
- period_year: reasonable range (2020-2100)
- alert_threshold: 0-100

**Business Rules**:
- One budget per category per month per user
- Spent = SUM(expense transactions in category for period)
- Rollover: next month's effective budget = amount + rollover_amount
- Negative rollover possible if overspent (reduces next month)
- Category deletion deletes associated budgets (clarification)

---

### Notification

In-app and email notification records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| user_id | UUID | FK → users.id, NOT NULL | Recipient |
| type | ENUM | NOT NULL | 'budget_warning', 'budget_exceeded', 'import_complete', 'system' |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification body |
| data | JSONB | NULLABLE | Additional context (budget_id, etc.) |
| channel | ENUM | NOT NULL | 'in_app', 'email', 'both' |
| read_at | TIMESTAMP | NULLABLE | When marked as read |
| email_sent_at | TIMESTAMP | NULLABLE | When email was sent |
| created_at | TIMESTAMP | NOT NULL | Creation time |

**Indexes**:
- `notifications_user_id_index` on `user_id`
- `notifications_user_id_read_at_index` on `(user_id, read_at)` for unread count
- `notifications_created_at_index` on `created_at DESC`

**Validation Rules**:
- type: one of defined enum values
- channel: one of defined enum values

**Business Rules**:
- Budget warning at 80% (FR-053)
- Budget exceeded at 100% (FR-054)
- Respect user notification preferences
- Retain notifications for 90 days, then archive/delete

---

### ImportBatch (Supporting Entity)

Tracks CSV import operations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Primary identifier |
| user_id | UUID | FK → users.id, NOT NULL | Importer |
| account_id | UUID | FK → accounts.id, NOT NULL | Target account |
| filename | VARCHAR(255) | NOT NULL | Original filename |
| file_path | VARCHAR(500) | NOT NULL | S3 path |
| column_mapping | JSONB | NOT NULL | User-defined mapping |
| status | ENUM | NOT NULL | 'pending', 'processing', 'completed', 'failed' |
| total_rows | INTEGER | NULLABLE | Total rows in file |
| imported_count | INTEGER | NOT NULL, DEFAULT 0 | Successfully imported |
| skipped_count | INTEGER | NOT NULL, DEFAULT 0 | Duplicates skipped |
| error_count | INTEGER | NOT NULL, DEFAULT 0 | Failed rows |
| errors | JSONB | NULLABLE | Error details per row |
| started_at | TIMESTAMP | NULLABLE | Processing start |
| completed_at | TIMESTAMP | NULLABLE | Processing end |
| created_at | TIMESTAMP | NOT NULL | Creation time |

**Indexes**:
- `import_batches_user_id_index` on `user_id`
- `import_batches_status_index` on `status`

## State Transitions

### ImportBatch Status

```
pending → processing → completed
                    → failed
```

### User Account Lockout

```
normal (failed_login_attempts < 5)
    → [5th failure] → locked (locked_until set)
    → [15 min elapsed] → normal (counters reset)
    → [successful login] → normal (counters reset)
```

## Migration Order

1. `users` - no dependencies
2. `categories` - self-referential (parent_id), seeder for system categories
3. `accounts` - depends on users
4. `transactions` - depends on accounts, categories, self-referential (linked_transaction_id)
5. `auto_categorization_rules` - depends on users, categories
6. `budgets` - depends on users, categories
7. `notifications` - depends on users
8. `import_batches` - depends on users, accounts

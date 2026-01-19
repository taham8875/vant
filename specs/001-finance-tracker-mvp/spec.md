# Feature Specification: Personal Finance Tracking SaaS - Core MVP

**Feature Branch**: `001-finance-tracker-mvp`
**Created**: 2026-01-17
**Status**: Draft
**Input**: User description: "Personal Finance Tracking SaaS with authentication, account/transaction management, categorization, budgeting, dashboard reporting, and tiered monetization (Free/Pro/Team)"

## Clarifications

### Session 2026-01-17

- Q: What happens to transactions when an account is deleted? → A: Hard delete - transactions are permanently removed along with the account
- Q: What happens to transactions older than 6 months for free tier users? → A: Transactions remain stored but are hidden/inaccessible until user upgrades to Pro
- Q: What happens after multiple failed login attempts? → A: Temporary lockout (15 minutes) after 5 consecutive failed attempts
- Q: How are transfers between user accounts recorded? → A: Two linked transactions - expense from source account, income to destination account
- Q: What happens when a category with transactions/budgets is deleted? → A: Transactions reassigned to "Uncategorized"; associated budgets are deleted

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration & Setup (Priority: P1)

A new user discovers the app and wants to start tracking their finances. They sign up using email/password or Google OAuth, verify their email, and set up their first financial account to begin tracking.

**Why this priority**: This is the foundational flow - without user registration and initial account setup, no other features can be accessed. This is the entry point for all users and directly impacts conversion.

**Independent Test**: Can be fully tested by completing registration and creating one financial account. Delivers immediate value by enabling users to begin their financial tracking journey.

**Acceptance Scenarios**:

1. **Given** a visitor on the registration page, **When** they enter valid email, password (min 8 chars), and submit, **Then** an account is created and verification email is sent within 60 seconds
2. **Given** a visitor on the registration page, **When** they click "Sign in with Google", **Then** they are redirected to Google OAuth, and upon approval, an account is created automatically
3. **Given** a user with an unverified email, **When** they click the verification link within 24 hours, **Then** their account becomes fully active
4. **Given** a registered user, **When** they create their first account (checking/savings/credit card/cash/investment), **Then** the account appears in their dashboard with zero balance

---

### User Story 2 - Manual Transaction Entry (Priority: P1)

A user wants to record their daily spending by manually entering transactions with details like amount, date, payee, category, and notes.

**Why this priority**: Transaction entry is the core data input mechanism. Without transactions, there is nothing to categorize, budget against, or report on. This is essential for MVP functionality.

**Independent Test**: Can be tested by logging in and creating multiple transactions across different accounts. Delivers value by giving users a complete record of their financial activity.

**Acceptance Scenarios**:

1. **Given** a logged-in user with at least one account, **When** they enter a transaction with amount, date, payee, category, and optional notes, **Then** the transaction is saved and reflected in the account balance
2. **Given** a user entering a transaction, **When** they select "expense" or "income" type, **Then** the transaction correctly affects the account balance (expenses decrease, income increases)
3. **Given** a user viewing their transaction list, **When** they search by payee name, filter by date range, or sort by amount, **Then** matching transactions are displayed correctly
4. **Given** a user viewing a transaction, **When** they edit any field and save, **Then** changes are persisted and balances are recalculated

---

### User Story 3 - CSV Bulk Import (Priority: P2)

A user wants to import their transaction history from their bank by uploading a CSV file and mapping columns to the required fields.

**Why this priority**: Bulk import dramatically reduces data entry burden for users with existing financial history. This significantly improves onboarding experience but requires manual entry to work first.

**Independent Test**: Can be tested by uploading a sample bank CSV and mapping columns. Delivers value by allowing users to quickly populate their account history.

**Acceptance Scenarios**:

1. **Given** a user with a CSV file from their bank, **When** they upload the file, **Then** the system displays a preview of detected columns and sample data
2. **Given** a user viewing column preview, **When** they map CSV columns to required fields (date, amount, payee) and optional fields (category, notes), **Then** the mapping is validated and accepted
3. **Given** a valid column mapping, **When** the user confirms import, **Then** transactions are created and the user sees an import summary with success/failure counts
4. **Given** an import in progress, **When** a transaction matches an existing transaction (same date, amount, and payee within the same account), **Then** it is flagged as potential duplicate and user can choose to skip or import

---

### User Story 4 - Category Management & Auto-Categorization (Priority: P2)

A user wants transactions to be automatically categorized based on payee patterns, and they want to customize categories to match their personal organization preferences.

**Why this priority**: Categorization enables meaningful analysis and budgeting. Auto-categorization reduces manual work significantly. However, basic tracking can work without it.

**Independent Test**: Can be tested by creating custom categories, setting up rules, and verifying auto-categorization applies correctly to new transactions.

**Acceptance Scenarios**:

1. **Given** a new user, **When** they access categories, **Then** they see a pre-seeded taxonomy covering essentials (Housing, Transportation, Food & Dining, Utilities, Healthcare, Entertainment, Shopping, Income, Transfers)
2. **Given** a user viewing categories, **When** they create a new category or subcategory with a name and optional icon, **Then** it is available for transaction assignment
3. **Given** a user, **When** they create an auto-categorization rule (e.g., "If payee contains 'UBER' then assign to Transportation"), **Then** new transactions matching the rule are automatically categorized
4. **Given** a user viewing multiple transactions, **When** they select transactions and apply bulk re-categorization, **Then** all selected transactions are updated to the chosen category

---

### User Story 5 - Monthly Budget Creation & Tracking (Priority: P2)

A user wants to set spending limits for each category and track their progress throughout the month with visual indicators.

**Why this priority**: Budgeting is the primary tool for financial improvement. It transforms passive tracking into active financial management. Depends on categorization working first.

**Independent Test**: Can be tested by creating budgets for categories and entering transactions to see progress updates. Delivers value through visibility into spending habits.

**Acceptance Scenarios**:

1. **Given** a user on the budget page, **When** they set a monthly budget amount for a category, **Then** the budget is saved and appears with a progress bar showing $0 spent
2. **Given** an active budget, **When** the user adds a categorized transaction, **Then** the budget progress bar updates to reflect the percentage spent
3. **Given** a budget with rollover enabled, **When** a new month begins with unspent funds, **Then** the unspent amount is added to the new month's budget
4. **Given** a budget approaching 80% spent, **When** a transaction pushes it over 80%, **Then** an in-app notification appears warning the user
5. **Given** a budget that exceeds 100%, **When** the user has enabled email alerts, **Then** an over-budget email notification is sent

---

### User Story 6 - Dashboard & Reporting (Priority: P2)

A user wants to see their overall financial health at a glance including net worth, cash flow, and spending trends.

**Why this priority**: The dashboard provides the value proposition of tracking finances - insight into financial health. This is why users track in the first place.

**Independent Test**: Can be tested by viewing the dashboard with populated accounts and transactions. Delivers value through instant financial visibility.

**Acceptance Scenarios**:

1. **Given** a user with accounts set up, **When** they view the dashboard, **Then** they see net worth calculated as (checking + savings + cash + investments) minus (credit card balances)
2. **Given** a user viewing the dashboard, **When** they look at monthly cash flow, **Then** they see income vs expenses for the current month with the net difference
3. **Given** a user with categorized transactions, **When** they view spending breakdown, **Then** they see a visual chart (pie/bar) showing spending by category for the current month
4. **Given** a user with at least 6 months of history, **When** they view spending trends, **Then** they see a line graph showing total spending per month over time

---

### User Story 7 - Password Reset (Priority: P3)

A user who forgot their password needs to securely reset it to regain access to their account.

**Why this priority**: Critical for user retention but only needed when users forget credentials. Lower priority than core functionality but essential for production readiness.

**Independent Test**: Can be tested by initiating password reset and completing the flow. Delivers value by preventing permanent account lockout.

**Acceptance Scenarios**:

1. **Given** a user on the login page, **When** they click "Forgot Password" and enter their email, **Then** a reset link is sent if the email exists (same message shown regardless to prevent enumeration)
2. **Given** a user with a reset link, **When** they click it within 1 hour and enter a new valid password, **Then** their password is updated and they can log in
3. **Given** an expired reset link (older than 1 hour), **When** the user clicks it, **Then** they see an error message and must request a new link

---

### User Story 8 - Profile Settings (Priority: P3)

A user wants to manage their profile information and notification preferences.

**Why this priority**: Settings provide control and customization but are not essential for core functionality. Users can use the app without changing defaults.

**Independent Test**: Can be tested by updating profile fields and notification preferences. Delivers value through personalization.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they access profile settings, **Then** they can view and edit their display name and email (email change requires re-verification)
2. **Given** a user in settings, **When** they toggle email notification preferences (over-budget alerts, weekly summary), **Then** preferences are saved and respected by the notification system
3. **Given** a user, **When** they change their password in settings, **Then** they must enter current password and new password (meeting requirements) to confirm change

---

### Edge Cases

- What happens when a user tries to delete an account with transactions? System warns user that all transactions will be permanently deleted; upon confirmation, account and all transactions are hard deleted
- What happens when CSV import has invalid date formats? System should show specific row errors and allow user to correct or skip
- What happens when a transaction date is in the future? System should allow it (for scheduled bills) but flag visually
- What happens when budget rollover results in negative amount (overspent)? Negative amount should carry over, reducing next month's budget
- How does system handle duplicate Google OAuth accounts with same email? Merge or link accounts rather than create duplicates
- What happens when a user's session expires mid-import? Import should be queued/resumable or atomically rolled back

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & User Management**

- **FR-001**: System MUST allow users to register with email and password (minimum 8 characters, at least 1 uppercase, 1 number)
- **FR-002**: System MUST send email verification within 60 seconds of registration
- **FR-003**: System MUST support Google OAuth as an alternative registration/login method
- **FR-004**: System MUST provide password reset via email link valid for 1 hour
- **FR-005**: System MUST allow users to update display name, email (with re-verification), and password
- **FR-006**: System MUST maintain secure sessions with appropriate timeout (assumed: 24 hours for web, 30 days for "remember me")
- **FR-007**: System MUST temporarily lock accounts for 15 minutes after 5 consecutive failed login attempts

**Account Management**

- **FR-010**: System MUST support account types: checking, savings, credit card, cash, investment
- **FR-011**: System MUST allow users to create, edit, and delete financial accounts
- **FR-012**: System MUST track account balance as the sum of all transactions
- **FR-013**: System MUST warn users before deleting accounts with transactions; deletion permanently removes the account and all associated transactions

**Transaction Management**

- **FR-020**: System MUST allow manual transaction entry with: amount (required), date (required), payee (required), category (optional), notes (optional)
- **FR-021**: System MUST support transaction types: expense (decreases balance) and income (increases balance)
- **FR-021a**: System MUST support transfers between accounts as two linked transactions (expense from source, income to destination) that reference each other
- **FR-022**: System MUST allow editing and deleting of existing transactions
- **FR-023**: System MUST recalculate account balances when transactions are added, edited, or deleted
- **FR-024**: System MUST support transaction search by payee name
- **FR-025**: System MUST support transaction filtering by date range and category
- **FR-026**: System MUST support transaction sorting by date, amount, and payee

**CSV Import**

- **FR-030**: System MUST accept CSV file uploads up to 10MB
- **FR-031**: System MUST display column preview with sample data before import
- **FR-032**: System MUST allow user-defined column mapping to required fields (date, amount, payee)
- **FR-033**: System MUST detect potential duplicate transactions (same date, amount, payee in same account)
- **FR-034**: System MUST provide import summary showing successful imports, duplicates skipped, and errors
- **FR-035**: System MUST handle common date formats (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)

**Categorization**

- **FR-040**: System MUST provide pre-seeded categories: Housing, Transportation, Food & Dining, Utilities, Healthcare, Entertainment, Shopping, Income, Transfers (and relevant subcategories)
- **FR-041**: System MUST allow creation of custom categories and subcategories
- **FR-041a**: System MUST provide a protected "Uncategorized" system category that cannot be deleted
- **FR-041b**: System MUST reassign transactions to "Uncategorized" and delete associated budgets when a category is deleted
- **FR-042**: System MUST support auto-categorization rules based on payee pattern matching (contains, starts with, equals)
- **FR-043**: System MUST apply auto-categorization rules to new transactions in real-time
- **FR-044**: System MUST support bulk re-categorization of selected transactions

**Budgeting**

- **FR-050**: System MUST allow monthly budget creation per category
- **FR-051**: System MUST track budget progress as percentage of limit spent
- **FR-052**: System MUST support rollover toggle per budget (carry unspent/overspent to next month)
- **FR-053**: System MUST generate in-app notification when budget reaches 80% spent
- **FR-054**: System MUST generate in-app and optional email notification when budget exceeds 100%
- **FR-055**: System MUST allow users to configure notification preferences (in-app only, email, both, none)

**Dashboard & Reporting**

- **FR-060**: System MUST display net worth calculated as (checking + savings + cash + investments) minus (credit card balances)
- **FR-061**: System MUST display monthly cash flow summary (total income vs total expenses)
- **FR-062**: System MUST display spending breakdown by category as visual chart
- **FR-063**: System MUST display spending trend line for the last 6-12 months when sufficient data exists

**Tier Restrictions (Free Tier)**

- **FR-070**: Free tier users MUST be limited to 2 manual accounts
- **FR-071**: Free tier users MUST be limited to viewing 6 months of transaction history; older transactions remain stored but hidden until upgrade
- **FR-072**: System MUST display upgrade prompts when free tier limits are approached or reached

### Key Entities

- **User**: Represents a registered user with authentication credentials, profile information, notification preferences, and subscription tier
- **Account**: A financial container (checking, savings, credit card, cash, investment) with name, type, current balance, and currency
- **Transaction**: A financial event with amount, date, payee, category reference, notes, type (income/expense), and optional linked transaction reference (for transfers) belonging to an account
- **Category**: A classification for transactions with name, optional parent category (for subcategories), icon, and system/custom flag
- **AutoCategorizationRule**: A pattern-matching rule linking payee patterns to categories with match type (contains/starts with/equals)
- **Budget**: A monthly spending limit for a category with limit amount, period (month/year), rollover flag, and notification thresholds
- **Notification**: A message to users (in-app or email) with type, message content, read status, and delivery status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New users can complete registration and create their first account in under 3 minutes
- **SC-002**: Users can enter a transaction in under 30 seconds
- **SC-003**: CSV import of 500 transactions completes within 60 seconds with user-visible progress
- **SC-004**: Dashboard loads and displays all widgets within 2 seconds for users with up to 10,000 transactions
- **SC-005**: 95% of users successfully complete their first transaction entry on first attempt
- **SC-006**: Auto-categorization correctly categorizes at least 70% of transactions for users with 5+ rules defined
- **SC-007**: Budget alerts are delivered within 5 minutes of the triggering transaction
- **SC-008**: System maintains 99.9% uptime during business hours
- **SC-009**: All sensitive user data is encrypted at rest and in transit
- **SC-010**: Free tier limitations are enforced consistently with clear messaging about upgrade paths

## Assumptions

- Users have a valid email address for registration and verification
- Users understand basic financial terminology (accounts, transactions, budgets)
- Session timeout defaults to 24 hours for web sessions, extendable with "remember me" to 30 days
- Email verification links expire after 24 hours
- Password reset links expire after 1 hour
- CSV import supports UTF-8 encoding as the default
- Currency defaults to USD for MVP, with locale-based formatting
- Investment accounts track only cash value (not individual holdings for MVP)
- Pre-seeded categories cover common expense types; users can customize as needed
- Budget periods are calendar months by default
- "Remember me" functionality uses secure, httpOnly cookies with extended session

## Out of Scope (Deferred to Pro/Team Tiers)

- Bank/institution API connections (Plaid, etc.)
- Advanced analytics (year-over-year, merchant insights, income stability scoring)
- Savings goals and cash flow forecasting
- Recurring transaction detection and subscription management
- Multi-currency support with automatic exchange rates
- Household/partner account linking and shared budgets
- PDF/Excel report generation
- Webhook and API access
- Priority support with SLA guarantees

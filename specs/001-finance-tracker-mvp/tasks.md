# Tasks: Personal Finance Tracking SaaS - Core MVP

**Input**: Design documents from `/specs/001-finance-tracker-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks not included. Add via `/speckit.tasks --with-tests` if needed.

**Organization**: Tasks grouped by user story (8 stories: 2 P1, 4 P2, 2 P3) to enable independent implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US8)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` (Laravel API)
- **Frontend**: `frontend/` (Next.js SPA)
- **Shared**: `shared/types/` (Generated TypeScript types)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both backend and frontend

- [ ] T001 [P] Create backend Laravel project structure in backend/ per plan.md
- [ ] T002 [P] Create frontend Next.js project structure in frontend/ per plan.md
- [ ] T003 [P] Initialize backend with composer dependencies (Laravel 11, Sanctum, Socialite, Excel) in backend/composer.json
- [ ] T004 [P] Initialize frontend with npm dependencies (Next.js 14, Tailwind, React Query, Recharts) in frontend/package.json
- [ ] T005 [P] Configure backend linting (Pint) and static analysis (PHPStan) in backend/
- [ ] T006 [P] Configure frontend linting (ESLint) and TypeScript in frontend/
- [ ] T007 Configure backend environment variables template in backend/.env.example
- [ ] T008 Configure frontend environment variables template in frontend/.env.example
- [ ] T009 [P] Setup Docker Compose for local development (PostgreSQL, Redis, MinIO) in docker-compose.yml
- [X] T010 Generate TypeScript types from OpenAPI spec to shared/types/api.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Database Schema & Migrations

- [ ] T011 Create users migration with all fields per data-model.md in backend/database/migrations/
- [ ] T012 Create categories migration with parent_id self-reference in backend/database/migrations/
- [ ] T013 Create accounts migration in backend/database/migrations/
- [ ] T014 Create transactions migration with linked_transaction_id in backend/database/migrations/
- [ ] T015 Create auto_categorization_rules migration in backend/database/migrations/
- [ ] T016 Create budgets migration in backend/database/migrations/
- [ ] T017 Create notifications migration in backend/database/migrations/
- [ ] T018 Create import_batches migration in backend/database/migrations/
- [ ] T019 Create CategorySeeder with pre-seeded categories (10 main + subcategories) in backend/database/seeders/CategorySeeder.php

### Backend Core Infrastructure

- [ ] T020 [P] Create User model with relationships and scopes in backend/app/Models/User.php
- [ ] T021 [P] Create Category model with parent/children relationships in backend/app/Models/Category.php
- [ ] T022 [P] Create Account model with user relationship in backend/app/Models/Account.php
- [ ] T023 [P] Create Transaction model with relationships and scopes in backend/app/Models/Transaction.php
- [ ] T024 [P] Create Budget model with category relationship in backend/app/Models/Budget.php
- [ ] T025 [P] Create Notification model in backend/app/Models/Notification.php
- [ ] T026 Configure Sanctum SPA authentication in backend/config/sanctum.php
- [ ] T027 Configure CORS for frontend domain in backend/config/cors.php
- [ ] T028 Setup API routes structure (v1 prefix, auth middleware) in backend/routes/api.php
- [ ] T029 Create base API controller with response helpers in backend/app/Http/Controllers/Controller.php
- [ ] T030 Create UserResource API transformer in backend/app/Http/Resources/UserResource.php
- [ ] T031 [P] Configure Redis for sessions in backend/config/session.php
- [ ] T032 [P] Configure Redis for cache in backend/config/cache.php
- [ ] T033 [P] Configure queue with Redis driver in backend/config/queue.php
- [ ] T034 Setup error handling and API exception responses in backend/app/Exceptions/Handler.php

### Frontend Core Infrastructure

- [ ] T035 [P] Setup Tailwind CSS configuration in frontend/tailwind.config.ts
- [ ] T036 [P] Create base layout component with navigation in frontend/src/components/layout/MainLayout.tsx
- [ ] T037 [P] Create API client with credentials handling in frontend/src/lib/api/client.ts
- [ ] T038 [P] Create React Query provider and configuration in frontend/src/lib/api/queryClient.ts
- [ ] T039 Create auth context for user state management in frontend/src/lib/auth/AuthContext.tsx
- [ ] T040 Create protected route wrapper component in frontend/src/lib/auth/ProtectedRoute.tsx
- [ ] T041 [P] Create base UI components (Button, Input, Card, Modal) in frontend/src/components/ui/
- [ ] T042 [P] Create form components (FormField, FormError) in frontend/src/components/forms/
- [ ] T043 Setup currency and date formatting utilities in frontend/src/lib/utils/formatters.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - New User Registration & Setup (Priority: P1)

**Goal**: Users can register (email/password or Google OAuth), verify email, and create their first financial account

**Independent Test**: Complete registration flow and create one checking account - should appear in dashboard with $0 balance

### Backend Implementation for US1

- [ ] T044 [P] [US1] Create RegisterRequest validation in backend/app/Http/Requests/Auth/RegisterRequest.php
- [ ] T045 [P] [US1] Create LoginRequest validation in backend/app/Http/Requests/Auth/LoginRequest.php
- [ ] T046 [US1] Implement AuthController with register, login, logout in backend/app/Http/Controllers/Auth/AuthController.php
- [ ] T047 [US1] Implement email verification with signed URLs in backend/app/Http/Controllers/Auth/VerificationController.php
- [ ] T048 [US1] Implement Google OAuth controller in backend/app/Http/Controllers/Auth/GoogleAuthController.php
- [ ] T049 [US1] Create login lockout middleware (5 attempts, 15 min) in backend/app/Http/Middleware/LoginLockout.php
- [ ] T050 [P] [US1] Create AccountResource API transformer in backend/app/Http/Resources/AccountResource.php
- [ ] T051 [P] [US1] Create CreateAccountRequest validation in backend/app/Http/Requests/Accounts/CreateAccountRequest.php
- [ ] T052 [US1] Implement AccountController (list, create, update, delete) in backend/app/Http/Controllers/Accounts/AccountController.php
- [ ] T053 [US1] Create AccountPolicy for authorization in backend/app/Policies/AccountPolicy.php
- [ ] T054 [US1] Implement free tier account limit check (max 2) in backend/app/Services/Account/AccountLimitService.php
- [ ] T055 [US1] Register auth and account routes in backend/routes/api.php

### Frontend Implementation for US1

- [ ] T056 [P] [US1] Create registration page in frontend/src/app/(auth)/register/page.tsx
- [ ] T057 [P] [US1] Create login page in frontend/src/app/(auth)/login/page.tsx
- [ ] T058 [P] [US1] Create email verification pending page in frontend/src/app/(auth)/verify-email/page.tsx
- [ ] T059 [P] [US1] Create email verified callback page in frontend/src/app/(auth)/verify-email/[token]/page.tsx
- [ ] T060 [US1] Create registration form component with validation in frontend/src/components/forms/RegisterForm.tsx
- [ ] T061 [US1] Create login form component with error handling in frontend/src/components/forms/LoginForm.tsx
- [ ] T062 [US1] Implement Google OAuth button component in frontend/src/components/auth/GoogleAuthButton.tsx
- [ ] T063 [US1] Create useAuth hook for auth operations in frontend/src/hooks/useAuth.ts
- [ ] T064 [P] [US1] Create accounts list page in frontend/src/app/accounts/page.tsx
- [ ] T065 [P] [US1] Create account creation modal/form in frontend/src/components/accounts/CreateAccountForm.tsx
- [ ] T066 [US1] Create AccountCard component for display in frontend/src/components/accounts/AccountCard.tsx
- [ ] T067 [US1] Create useAccounts hook for account operations in frontend/src/hooks/useAccounts.ts

**Checkpoint**: Users can register, login, and create accounts. MVP foundation complete.

---

## Phase 4: User Story 2 - Manual Transaction Entry (Priority: P1)

**Goal**: Users can manually enter, edit, delete transactions with search/filter/sort capabilities

**Independent Test**: Create income and expense transactions, verify account balance updates, test search and filtering

### Backend Implementation for US2

- [ ] T068 [P] [US2] Create TransactionResource API transformer in backend/app/Http/Resources/TransactionResource.php
- [ ] T069 [P] [US2] Create CreateTransactionRequest validation in backend/app/Http/Requests/Transactions/CreateTransactionRequest.php
- [ ] T070 [P] [US2] Create UpdateTransactionRequest validation in backend/app/Http/Requests/Transactions/UpdateTransactionRequest.php
- [ ] T071 [P] [US2] Create CreateTransferRequest validation in backend/app/Http/Requests/Transactions/CreateTransferRequest.php
- [ ] T072 [US2] Create TransactionService for business logic in backend/app/Services/Transaction/TransactionService.php
- [ ] T073 [US2] Implement account balance recalculation in TransactionService in backend/app/Services/Transaction/TransactionService.php
- [ ] T074 [US2] Implement transfer creation (two linked transactions) in backend/app/Services/Transaction/TransferService.php
- [ ] T075 [US2] Implement TransactionController (CRUD, transfer, bulk-categorize) in backend/app/Http/Controllers/Transactions/TransactionController.php
- [ ] T076 [US2] Create TransactionPolicy for authorization in backend/app/Policies/TransactionPolicy.php
- [ ] T077 [US2] Implement transaction search/filter/sort query scopes in backend/app/Models/Transaction.php
- [ ] T078 [US2] Implement free tier 6-month history scope in backend/app/Models/Scopes/FreeTierHistoryScope.php
- [ ] T079 [US2] Register transaction routes in backend/routes/api.php

### Frontend Implementation for US2

- [ ] T080 [P] [US2] Create transactions list page with pagination in frontend/src/app/transactions/page.tsx
- [ ] T081 [P] [US2] Create transaction creation modal/form in frontend/src/components/transactions/CreateTransactionForm.tsx
- [ ] T082 [P] [US2] Create transaction edit form in frontend/src/components/transactions/EditTransactionForm.tsx
- [ ] T083 [P] [US2] Create transfer creation form in frontend/src/components/transactions/CreateTransferForm.tsx
- [ ] T084 [US2] Create TransactionRow component for list display in frontend/src/components/transactions/TransactionRow.tsx
- [ ] T085 [US2] Create TransactionFilters component (date, category, search) in frontend/src/components/transactions/TransactionFilters.tsx
- [ ] T086 [US2] Create useTransactions hook with filtering in frontend/src/hooks/useTransactions.ts
- [ ] T087 [US2] Add delete confirmation dialog for transactions in frontend/src/components/transactions/DeleteTransactionDialog.tsx

**Checkpoint**: Core transaction management complete. Users can fully track income/expenses.

---

## Phase 5: User Story 3 - CSV Bulk Import (Priority: P2)

**Goal**: Users can import transactions from bank CSV files with column mapping and duplicate detection

**Independent Test**: Upload a sample bank CSV, map columns, complete import, verify transactions created with duplicates flagged

### Backend Implementation for US3

- [ ] T088 [P] [US3] Create ImportBatch model in backend/app/Models/ImportBatch.php
- [ ] T089 [P] [US3] Create ImportBatchResource API transformer in backend/app/Http/Resources/ImportBatchResource.php
- [ ] T090 [US3] Implement S3 signed URL generation for uploads in backend/app/Services/Import/UploadService.php
- [ ] T091 [US3] Implement CSV preview/column detection service in backend/app/Services/Import/CsvPreviewService.php
- [ ] T092 [US3] Implement CSV import job with chunk processing in backend/app/Jobs/ProcessCsvImport.php
- [ ] T093 [US3] Implement duplicate detection logic in backend/app/Services/Import/DuplicateDetector.php
- [ ] T094 [US3] Implement date format parsing (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD) in backend/app/Services/Import/DateParser.php
- [ ] T095 [US3] Implement ImportController (upload-url, preview, start, status, duplicates) in backend/app/Http/Controllers/Import/ImportController.php
- [ ] T096 [US3] Fire ImportComplete event and notification in backend/app/Services/Import/
- [ ] T097 [US3] Register import routes in backend/routes/api.php

### Frontend Implementation for US3

- [ ] T098 [P] [US3] Create import page with multi-step wizard in frontend/src/app/transactions/import/page.tsx
- [ ] T099 [P] [US3] Create file upload component with drag-drop in frontend/src/components/import/FileUpload.tsx
- [ ] T100 [US3] Create column mapping step component in frontend/src/components/import/ColumnMapping.tsx
- [ ] T101 [US3] Create import preview table component in frontend/src/components/import/ImportPreview.tsx
- [ ] T102 [US3] Create import progress/status component in frontend/src/components/import/ImportProgress.tsx
- [ ] T103 [US3] Create duplicate resolution interface in frontend/src/components/import/DuplicateResolver.tsx
- [ ] T104 [US3] Create useImport hook for import operations in frontend/src/hooks/useImport.ts

**Checkpoint**: Bulk import functional. Users can quickly populate historical data.

---

## Phase 6: User Story 4 - Category Management & Auto-Categorization (Priority: P2)

**Goal**: Users can manage categories, create auto-categorization rules, and bulk re-categorize transactions

**Independent Test**: Create custom category, set up auto-categorization rule, add transaction matching rule, verify auto-categorization applies

### Backend Implementation for US4

- [ ] T105 [P] [US4] Create CategoryResource API transformer in backend/app/Http/Resources/CategoryResource.php
- [ ] T106 [P] [US4] Create AutoCategorizationRule model in backend/app/Models/AutoCategorizationRule.php
- [ ] T107 [P] [US4] Create RuleResource API transformer in backend/app/Http/Resources/RuleResource.php
- [ ] T108 [P] [US4] Create CreateCategoryRequest validation in backend/app/Http/Requests/Categories/CreateCategoryRequest.php
- [ ] T109 [P] [US4] Create CreateRuleRequest validation in backend/app/Http/Requests/Categories/CreateRuleRequest.php
- [ ] T110 [US4] Implement CategoryController (list, create, update, delete) in backend/app/Http/Controllers/Categories/CategoryController.php
- [ ] T111 [US4] Implement category deletion with transaction reassignment in backend/app/Services/Category/CategoryService.php
- [ ] T112 [US4] Implement RuleController (CRUD) in backend/app/Http/Controllers/Categories/RuleController.php
- [ ] T113 [US4] Implement AutoCategorizationService (apply rules to transaction) in backend/app/Services/Categorization/AutoCategorizationService.php
- [ ] T114 [US4] Integrate auto-categorization into TransactionService on create/import in backend/app/Services/Transaction/TransactionService.php
- [ ] T115 [US4] Implement bulk re-categorization endpoint in backend/app/Http/Controllers/Transactions/TransactionController.php
- [ ] T116 [US4] Register category and rule routes in backend/routes/api.php

### Frontend Implementation for US4

- [ ] T117 [P] [US4] Create categories management page in frontend/src/app/categories/page.tsx
- [ ] T118 [P] [US4] Create category list with nested subcategories in frontend/src/components/categories/CategoryList.tsx
- [ ] T119 [P] [US4] Create category creation/edit form in frontend/src/components/categories/CategoryForm.tsx
- [ ] T120 [P] [US4] Create auto-categorization rules page in frontend/src/app/categories/rules/page.tsx
- [ ] T121 [US4] Create rule creation form in frontend/src/components/categories/RuleForm.tsx
- [ ] T122 [US4] Create bulk re-categorization dialog in frontend/src/components/transactions/BulkCategorizeDialog.tsx
- [ ] T123 [US4] Create useCategories hook in frontend/src/hooks/useCategories.ts
- [ ] T124 [US4] Create useRules hook in frontend/src/hooks/useRules.ts
- [ ] T125 [US4] Add category selector dropdown to transaction forms in frontend/src/components/forms/CategorySelect.tsx

**Checkpoint**: Category management and auto-categorization complete. Transaction organization streamlined.

---

## Phase 7: User Story 5 - Monthly Budget Creation & Tracking (Priority: P2)

**Goal**: Users can create monthly budgets per category with progress tracking, rollover, and alerts

**Independent Test**: Create budget, add categorized transaction, verify progress updates and alerts trigger at 80%/100%

### Backend Implementation for US5

- [ ] T126 [P] [US5] Create BudgetResource API transformer in backend/app/Http/Resources/BudgetResource.php
- [ ] T127 [P] [US5] Create CreateBudgetRequest validation in backend/app/Http/Requests/Budgets/CreateBudgetRequest.php
- [ ] T128 [US5] Implement BudgetController (list, create, update, delete) in backend/app/Http/Controllers/Budgets/BudgetController.php
- [ ] T129 [US5] Implement BudgetService for spend calculation in backend/app/Services/Budget/BudgetService.php
- [ ] T130 [US5] Implement budget alert checking on transaction create in backend/app/Services/Budget/BudgetAlertService.php
- [ ] T131 [US5] Create BudgetAlertEvent in backend/app/Events/BudgetAlertEvent.php
- [ ] T132 [US5] Create BudgetAlertListener for notifications in backend/app/Listeners/SendBudgetAlertNotification.php
- [ ] T133 [US5] Implement monthly rollover calculation job in backend/app/Jobs/ProcessBudgetRollover.php
- [ ] T134 [US5] Schedule rollover job for month start in backend/app/Console/Kernel.php
- [ ] T135 [US5] Integrate budget alert check into TransactionService in backend/app/Services/Transaction/TransactionService.php
- [ ] T136 [US5] Register budget routes in backend/routes/api.php

### Frontend Implementation for US5

- [ ] T137 [P] [US5] Create budgets page with month selector in frontend/src/app/budgets/page.tsx
- [ ] T138 [P] [US5] Create budget creation form in frontend/src/components/budgets/CreateBudgetForm.tsx
- [ ] T139 [US5] Create BudgetCard with progress bar in frontend/src/components/budgets/BudgetCard.tsx
- [ ] T140 [US5] Create budget progress visualization in frontend/src/components/budgets/BudgetProgress.tsx
- [ ] T141 [US5] Create useBudgets hook in frontend/src/hooks/useBudgets.ts
- [ ] T142 [US5] Add budget overview widget to dashboard in frontend/src/components/dashboard/BudgetOverview.tsx

**Checkpoint**: Budget tracking complete. Users can actively manage spending limits.

---

## Phase 8: User Story 6 - Dashboard & Reporting (Priority: P2)

**Goal**: Users see net worth, cash flow summary, spending breakdown chart, and spending trends

**Independent Test**: Populate accounts and transactions, view dashboard, verify all widgets display correct calculations

### Backend Implementation for US6

- [ ] T143 [US6] Implement DashboardController in backend/app/Http/Controllers/Dashboard/DashboardController.php
- [ ] T144 [US6] Implement net worth calculation service in backend/app/Services/Dashboard/NetWorthService.php
- [ ] T145 [US6] Implement cash flow calculation service in backend/app/Services/Dashboard/CashFlowService.php
- [ ] T146 [US6] Implement spending breakdown service in backend/app/Services/Dashboard/SpendingBreakdownService.php
- [ ] T147 [US6] Implement spending trends service (6-12 months) in backend/app/Services/Dashboard/SpendingTrendsService.php
- [ ] T148 [US6] Implement Redis caching for dashboard data in backend/app/Services/Dashboard/DashboardCacheService.php
- [ ] T149 [US6] Invalidate dashboard cache on transaction changes in backend/app/Services/Transaction/TransactionService.php
- [ ] T150 [US6] Register dashboard routes in backend/routes/api.php

### Frontend Implementation for US6

- [ ] T151 [US6] Create dashboard page layout in frontend/src/app/dashboard/page.tsx
- [ ] T152 [P] [US6] Create NetWorthWidget component in frontend/src/components/dashboard/NetWorthWidget.tsx
- [ ] T153 [P] [US6] Create CashFlowWidget component in frontend/src/components/dashboard/CashFlowWidget.tsx
- [ ] T154 [P] [US6] Create SpendingBreakdownChart (pie/bar) in frontend/src/components/charts/SpendingBreakdownChart.tsx
- [ ] T155 [P] [US6] Create SpendingTrendsChart (line graph) in frontend/src/components/charts/SpendingTrendsChart.tsx
- [ ] T156 [US6] Create AccountsOverview widget in frontend/src/components/dashboard/AccountsOverview.tsx
- [ ] T157 [US6] Create useDashboard hook in frontend/src/hooks/useDashboard.ts
- [ ] T158 [US6] Implement dashboard data prefetching in frontend/src/app/dashboard/page.tsx

**Checkpoint**: Dashboard complete. Users have full financial visibility.

---

## Phase 9: User Story 7 - Password Reset (Priority: P3)

**Goal**: Users can securely reset forgotten passwords via email link

**Independent Test**: Request password reset, receive email, click link within 1 hour, set new password, login successfully

### Backend Implementation for US7

- [ ] T159 [P] [US7] Create ForgotPasswordRequest validation in backend/app/Http/Requests/Auth/ForgotPasswordRequest.php
- [ ] T160 [P] [US7] Create ResetPasswordRequest validation in backend/app/Http/Requests/Auth/ResetPasswordRequest.php
- [ ] T161 [US7] Implement PasswordResetController in backend/app/Http/Controllers/Auth/PasswordResetController.php
- [ ] T162 [US7] Create password reset email template in backend/resources/views/emails/password-reset.blade.php
- [ ] T163 [US7] Register password reset routes in backend/routes/api.php

### Frontend Implementation for US7

- [ ] T164 [P] [US7] Create forgot password page in frontend/src/app/(auth)/forgot-password/page.tsx
- [ ] T165 [P] [US7] Create reset password page in frontend/src/app/(auth)/reset-password/[token]/page.tsx
- [ ] T166 [US7] Create ForgotPasswordForm component in frontend/src/components/forms/ForgotPasswordForm.tsx
- [ ] T167 [US7] Create ResetPasswordForm component in frontend/src/components/forms/ResetPasswordForm.tsx

**Checkpoint**: Password reset flow complete.

---

## Phase 10: User Story 8 - Profile Settings (Priority: P3)

**Goal**: Users can manage profile information and notification preferences

**Independent Test**: Update display name, change email (verify re-verification required), toggle notification preferences

### Backend Implementation for US8

- [ ] T168 [P] [US8] Create UpdateProfileRequest validation in backend/app/Http/Requests/Auth/UpdateProfileRequest.php
- [ ] T169 [P] [US8] Create ChangePasswordRequest validation in backend/app/Http/Requests/Auth/ChangePasswordRequest.php
- [ ] T170 [US8] Implement ProfileController (update profile, change password) in backend/app/Http/Controllers/Auth/ProfileController.php
- [ ] T171 [US8] Implement email change with re-verification in backend/app/Services/User/ProfileService.php
- [ ] T172 [US8] Register profile routes in backend/routes/api.php

### Frontend Implementation for US8

- [ ] T173 [P] [US8] Create settings page layout in frontend/src/app/settings/page.tsx
- [ ] T174 [P] [US8] Create profile settings tab in frontend/src/app/settings/profile/page.tsx
- [ ] T175 [P] [US8] Create security settings tab (password change) in frontend/src/app/settings/security/page.tsx
- [ ] T176 [P] [US8] Create notifications settings tab in frontend/src/app/settings/notifications/page.tsx
- [ ] T177 [US8] Create ProfileForm component in frontend/src/components/settings/ProfileForm.tsx
- [ ] T178 [US8] Create ChangePasswordForm component in frontend/src/components/settings/ChangePasswordForm.tsx
- [ ] T179 [US8] Create NotificationPreferencesForm component in frontend/src/components/settings/NotificationPreferencesForm.tsx

**Checkpoint**: Profile settings complete. All core user stories implemented.

---

## Phase 11: Notifications System (Cross-Cutting)

**Purpose**: In-app and email notifications supporting budget alerts and other system notifications

- [ ] T180 [P] Create NotificationResource API transformer in backend/app/Http/Resources/NotificationResource.php
- [ ] T181 Implement NotificationController (list, mark-read, mark-all-read) in backend/app/Http/Controllers/Notifications/NotificationController.php
- [ ] T182 Implement NotificationService for creating notifications in backend/app/Services/Notification/NotificationService.php
- [ ] T183 Implement email notification job in backend/app/Jobs/SendEmailNotification.php
- [ ] T184 Create budget alert email template in backend/resources/views/emails/budget-alert.blade.php
- [ ] T185 Register notification routes in backend/routes/api.php
- [ ] T186 [P] Create notifications dropdown component in frontend/src/components/layout/NotificationsDropdown.tsx
- [ ] T187 Create NotificationItem component in frontend/src/components/notifications/NotificationItem.tsx
- [ ] T188 Create useNotifications hook with polling in frontend/src/hooks/useNotifications.ts

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T189 [P] Add loading states to all frontend pages in frontend/src/components/ui/LoadingState.tsx
- [ ] T190 [P] Add error boundaries to frontend in frontend/src/components/ui/ErrorBoundary.tsx
- [ ] T191 [P] Implement toast notifications for actions in frontend/src/components/ui/Toast.tsx
- [ ] T192 Add upgrade prompts for free tier limits in frontend/src/components/tier/UpgradePrompt.tsx
- [ ] T193 Implement account deletion confirmation with warning in frontend/src/components/accounts/DeleteAccountDialog.tsx
- [ ] T194 Add mobile-responsive styles to all components
- [ ] T195 Implement proper SEO meta tags in frontend/src/app/layout.tsx
- [ ] T196 Add logging throughout backend services in backend/app/Services/
- [ ] T197 Security audit: verify CSRF, XSS protection, input validation
- [ ] T198 Performance optimization: add database indexes verification
- [ ] T199 Run quickstart.md validation - verify local dev setup works
- [ ] T200 Create sample data seeder for demo/testing in backend/database/seeders/DemoDataSeeder.php

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-10 (User Stories)**: All depend on Phase 2 completion
  - Can proceed in parallel by different developers
  - Or sequentially in priority order (P1 → P2 → P3)
- **Phase 11 (Notifications)**: Can run after Phase 2, best after Phase 7 (Budget)
- **Phase 12 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Priority | Can Start After | Dependencies |
|-------|----------|-----------------|--------------|
| US1 (Registration & Setup) | P1 | Phase 2 | None - foundational for all |
| US2 (Transactions) | P1 | Phase 2 | None - can parallel with US1 |
| US3 (CSV Import) | P2 | Phase 2 | Better after US2 for transaction context |
| US4 (Categories) | P2 | Phase 2 | None - categories seeded in Phase 2 |
| US5 (Budgets) | P2 | Phase 2 | Better after US4 for category context |
| US6 (Dashboard) | P2 | Phase 2 | Better after US1, US2 for data |
| US7 (Password Reset) | P3 | Phase 2 | None |
| US8 (Profile Settings) | P3 | Phase 2 | None |

### Within Each User Story

1. Backend request validation (parallel)
2. Backend models/resources (parallel where possible)
3. Backend services (depends on models)
4. Backend controllers (depends on services)
5. Backend routes registration
6. Frontend pages (parallel where possible)
7. Frontend components (parallel where possible)
8. Frontend hooks (depends on API client)

### Parallel Opportunities

**Phase 2 - Foundational**: T020-T025 (models) can run in parallel
**Phase 3 - US1**: T044-T045 (requests), T056-T059 (pages), T064-T065 (accounts pages) can run in parallel
**Phase 4 - US2**: T068-T071 (requests), T080-T084 (frontend pages/components) can run in parallel
**Phase 6 - US4**: T105-T109 (backend), T117-T120 (frontend) can run in parallel
**Phase 8 - US6**: T152-T155 (dashboard widgets) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Backend requests in parallel:
Task: "Create RegisterRequest validation in backend/app/Http/Requests/Auth/RegisterRequest.php"
Task: "Create LoginRequest validation in backend/app/Http/Requests/Auth/LoginRequest.php"

# Frontend pages in parallel:
Task: "Create registration page in frontend/src/app/(auth)/register/page.tsx"
Task: "Create login page in frontend/src/app/(auth)/login/page.tsx"
Task: "Create email verification pending page in frontend/src/app/(auth)/verify-email/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Registration & Accounts)
4. **STOP and VALIDATE**: Test registration, login, account creation
5. Complete Phase 4: User Story 2 (Transactions)
6. **STOP and VALIDATE**: Test full transaction CRUD
7. Deploy/demo - This is a functional MVP!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. + US1 + US2 → **MVP**: Users can register and track transactions
3. + US3 → **Enhanced**: Bulk import capability
4. + US4 → **Organized**: Auto-categorization
5. + US5 → **Active**: Budget tracking with alerts
6. + US6 → **Insightful**: Full dashboard
7. + US7 + US8 → **Complete**: All user management features

### Parallel Team Strategy

With multiple developers after Phase 2:

- **Developer A**: US1 (Registration) → US7 (Password Reset) → US8 (Settings)
- **Developer B**: US2 (Transactions) → US3 (CSV Import)
- **Developer C**: US4 (Categories) → US5 (Budgets) → Notifications
- **Developer D**: US6 (Dashboard) → Polish

---

## Task Summary

| Phase | Description | Task Count |
|-------|-------------|------------|
| 1 | Setup | 10 |
| 2 | Foundational | 34 |
| 3 | US1: Registration & Setup | 24 |
| 4 | US2: Transactions | 20 |
| 5 | US3: CSV Import | 17 |
| 6 | US4: Categories | 21 |
| 7 | US5: Budgets | 17 |
| 8 | US6: Dashboard | 16 |
| 9 | US7: Password Reset | 9 |
| 10 | US8: Profile Settings | 12 |
| 11 | Notifications | 9 |
| 12 | Polish | 12 |
| **Total** | | **200** |

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [Story] label (US1-US8) maps task to specific user story
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend tasks precede corresponding frontend tasks within each story
- All file paths are relative to repository root

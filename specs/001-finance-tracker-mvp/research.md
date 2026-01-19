# Research: Personal Finance Tracking SaaS - Core MVP

**Branch**: `001-finance-tracker-mvp` | **Date**: 2026-01-17

## Technology Decisions

### 1. Authentication Strategy

**Decision**: Laravel Sanctum with SPA authentication + Google OAuth via Laravel Socialite

**Rationale**:
- Sanctum provides simple, lightweight SPA authentication using cookies (no token management complexity)
- Native CSRF protection for SPA requests
- Socialite handles OAuth flows with minimal configuration
- Session-based auth aligns with spec requirement (24hr default, 30-day "remember me")

**Alternatives Considered**:
- **JWT (tymon/jwt-auth)**: Rejected - adds complexity for SPA use case, token refresh logic needed
- **Laravel Passport**: Rejected - overkill for first-party SPA, designed for third-party OAuth
- **Firebase Auth**: Rejected - external dependency, less control over user data

**Implementation Notes**:
- Use `sanctum` middleware for API routes
- Configure session lifetime in `config/session.php` (1440 min default, 43200 for remember)
- Store failed login attempts in Redis with TTL for lockout logic (FR-007)

### 2. CSV Import Strategy

**Decision**: Laravel Excel (Maatwebsite/Excel) with queued imports

**Rationale**:
- Battle-tested library with 50M+ downloads
- Built-in chunk reading for large files (memory efficient)
- Queue support for background processing (meets SC-003: 500 rows <60s)
- Handles encoding detection (UTF-8, UTF-16)

**Alternatives Considered**:
- **League\Csv**: Rejected - lower-level, requires more custom code for mapping UI
- **Custom parser**: Rejected - reinventing wheel, edge case handling
- **Spout**: Rejected - better for XLSX, CSV support less mature

**Implementation Notes**:
- Use `WithChunkReading` for files >1000 rows
- Implement `ShouldQueue` for async processing
- Store column mappings in session during preview step
- Use database transactions for atomic import with rollback on error

### 3. Auto-Categorization Engine

**Decision**: Database-stored rules with pattern matching (LIKE/ILIKE queries)

**Rationale**:
- Simple, no external dependencies
- Rules are user-specific and persisted
- PostgreSQL ILIKE provides case-insensitive matching
- Evaluation order: exact match > starts with > contains

**Alternatives Considered**:
- **ML-based classification**: Rejected - overkill for MVP, requires training data
- **In-memory rule engine**: Rejected - rules must persist, database is source of truth
- **Elasticsearch**: Rejected - infrastructure complexity for simple pattern matching

**Implementation Notes**:
- Apply rules in priority order (user-defined or by specificity)
- Cache frequently-used rules in Redis per user
- Batch apply rules during CSV import
- First matching rule wins (no cascading)

### 4. Budget Alert System

**Decision**: Event-driven with Laravel Events + Redis-backed queue

**Rationale**:
- Decoupled architecture - transaction save triggers event
- Queue ensures alerts don't block transaction saves
- Redis provides fast threshold checks
- Supports both in-app (database) and email (queue) notifications

**Alternatives Considered**:
- **Scheduled job scanning**: Rejected - delayed alerts, inefficient
- **Real-time WebSockets**: Rejected - complexity for MVP, polling sufficient
- **External service (Pusher)**: Rejected - cost, dependency for simple notifications

**Implementation Notes**:
- Fire `TransactionCreated` event after save
- Listener calculates budget spend, checks thresholds
- In-app notifications stored in `notifications` table
- Email queued via `Mail::queue()` for async delivery
- Cache budget totals in Redis, invalidate on transaction changes

### 5. Dashboard Performance

**Decision**: Materialized calculations with Redis caching

**Rationale**:
- Pre-calculate aggregates to meet <2s load time (SC-004)
- Redis cache with TTL for dashboard widgets
- Invalidate on transaction/account changes
- Background job for heavy recalculations

**Alternatives Considered**:
- **Real-time aggregation**: Rejected - too slow for 10k transactions
- **PostgreSQL materialized views**: Considered - good for complex queries but cache simpler
- **Denormalized totals table**: Considered - could complement caching

**Implementation Notes**:
- Cache keys: `user:{id}:net_worth`, `user:{id}:cashflow:{month}`, `user:{id}:spending:{month}`
- TTL: 5 minutes for dashboard, invalidate immediately on writes
- Use database aggregates as fallback when cache miss
- Lazy load trend data (only when expanded)

### 6. Free Tier History Enforcement

**Decision**: Query-time filtering with `created_at` scope

**Rationale**:
- Data retained (per clarification) but filtered in queries
- Scope applies to all transaction queries for free users
- Pro upgrade instantly reveals hidden data
- No data deletion jobs needed

**Alternatives Considered**:
- **Separate archive table**: Rejected - complicates queries, migration on upgrade
- **Soft delete older transactions**: Rejected - data loss anxiety, wrong semantics
- **View-layer filtering**: Rejected - must enforce at API level for security

**Implementation Notes**:
- Global scope on Transaction model checks user tier
- Scope: `where('date', '>=', now()->subMonths(6))` for free tier
- Dashboard calculations include only visible transactions
- Show "X hidden transactions" count for upgrade prompt

### 7. File Storage (CSV Uploads)

**Decision**: S3-compatible storage with signed URLs

**Rationale**:
- Scalable, reliable storage
- Signed URLs for secure direct browser uploads
- Compatible with multiple providers (AWS, MinIO, DigitalOcean Spaces)
- Laravel Filesystem abstraction

**Alternatives Considered**:
- **Local storage**: Rejected - not scalable, single point of failure
- **Database BLOB**: Rejected - not suited for file storage, backup complications

**Implementation Notes**:
- Configure `filesystems.php` for S3 driver
- Generate pre-signed upload URLs for frontend
- Store file reference in import job, delete after processing
- Retain for 24 hours for retry capability

### 8. Transfer Transaction Linking

**Decision**: Self-referential foreign key with `linked_transaction_id`

**Rationale**:
- Simple schema addition per clarification decision
- Both transactions reference each other (bidirectional)
- Easy to query related transfer
- Deletion cascades correctly (delete one, delete both)

**Alternatives Considered**:
- **Separate transfers table**: Rejected - adds join complexity, duplicates data
- **JSON metadata field**: Rejected - harder to query, no referential integrity

**Implementation Notes**:
- `transactions.linked_transaction_id` nullable FK to `transactions.id`
- On transfer create: insert both, update both with each other's ID
- On edit: update both amounts symmetrically
- On delete: cascade delete linked transaction

## Security Considerations

### Password Security
- Bcrypt hashing (Laravel default)
- Minimum 8 characters (spec allows flexible complexity)
- Password reset tokens expire in 1 hour
- Rate limit password reset requests (5/hour per email)

### Session Security
- HTTP-only, Secure, SameSite=Lax cookies
- Session regeneration on login
- CSRF protection via Sanctum
- Redis session storage for scalability

### API Security
- All endpoints require authentication except login/register/reset
- Input validation via Form Requests
- SQL injection prevention via Eloquent/prepared statements
- XSS prevention via React (auto-escaping) + CSP headers

### Data Protection
- TLS 1.3 for transit encryption
- PostgreSQL encryption at rest (provider-managed)
- PII limited to email and display name
- No financial institution credentials stored (manual entry only)

## Performance Benchmarks (Targets)

| Operation | Target | Approach |
|-----------|--------|----------|
| Dashboard load | <2s | Redis cache, lazy load trends |
| Transaction list (paginated) | <500ms | Index on user_id, date; limit 50/page |
| CSV import (500 rows) | <60s | Queued job, chunk processing |
| Search transactions | <1s | PostgreSQL full-text on payee |
| Budget calculation | <200ms | Cached totals, invalidate on write |

## Dependencies Summary

### Backend (composer.json)
```
laravel/framework: ^11.0
laravel/sanctum: ^4.0
laravel/socialite: ^5.0
maatwebsite/excel: ^3.1
predis/predis: ^2.0
```

### Frontend (package.json)
```
next: ^14.0
react: ^18.0
tailwindcss: ^3.4
@tanstack/react-query: ^5.0
recharts: ^2.10
react-hook-form: ^7.0
zod: ^3.22
```

### Infrastructure
- PostgreSQL 15+
- Redis 7+
- S3-compatible storage
- SMTP service (SendGrid/Mailgun recommended)

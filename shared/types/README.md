# Shared TypeScript Types

This directory contains TypeScript types generated from the OpenAPI specification.

## Generated Files

- `api.ts` - TypeScript types generated from the OpenAPI spec at `specs/001-finance-tracker-mvp/contracts/openapi.yaml`

## Regenerating Types

To regenerate the TypeScript types after updating the OpenAPI spec:

```bash
npm run generate-types
```

This command uses `openapi-typescript` to parse the OpenAPI YAML file and generate TypeScript definitions.

## Usage

Import types in your frontend code:

```typescript
import type { components, paths, operations } from '@/shared/types/api';

// Use component schemas
type User = components['schemas']['User'];
type Account = components['schemas']['Account'];

// Use operation types
type RegisterRequest = operations['register']['requestBody']['content']['application/json'];
```

## Notes

- The generated `api.ts` file should be committed to version control
- Regenerate types whenever the OpenAPI spec is updated
- Do not manually edit the generated `api.ts` file

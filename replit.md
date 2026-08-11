# FarmShare

FarmShare is an agricultural resource sharing platform foundation for growers and farming communities.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/web run dev` — run the React client
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required secrets: `MONGODB_URI`, `JWT_SECRET`
- Optional env: `JWT_EXPIRES_IN` (defaults to `7d`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React, Vite, Tailwind CSS, React Query, Wouter
- API: Express 5 with MVC-style config, routes, controllers, middleware, and models
- DB: MongoDB Atlas + Mongoose
- Authentication: bcrypt password hashing + JWT bearer tokens
- Validation and API codegen: Zod + Orval from OpenAPI
- Build: esbuild for the API, Vite for the client

## Where things live

- `artifacts/web` — React + Vite client with responsive landing, signup, login, and protected dashboard pages
- `artifacts/api-server` — Express API with MVC-style config, models, controllers, middleware, and routes
- `artifacts/api-server/src/models/User.ts` — Mongoose User model and password hashing
- `artifacts/api-server/src/controllers/authController.ts` — signup, login, and current-user controller logic
- `artifacts/api-server/src/middlewares/auth.ts` — JWT bearer-token protection
- `lib/api-spec/openapi.yaml` — source of truth for the authentication API contract
- `lib/api-client-react` and `lib/api-zod` — generated client hooks, types, and validation schemas

## Architecture decisions

- MongoDB Atlas is used for application data; the API connects on startup and fails clearly if `MONGODB_URI` is missing.
- Passwords are hashed with bcrypt before persistence and are excluded from normal User queries.
- JWTs are returned after signup/login and sent by the client as bearer tokens for protected profile access.
- API request and response shapes are defined in OpenAPI first, then generated for the client and server.
- Equipment, bookings, and notifications are intentionally reserved for a later phase.

## Product

- Public FarmShare introduction page
- Grower signup with farm profile details
- Email/password login
- Protected profile dashboard with sign out
- Health status indicator for the API

## User preferences

- Keep the first build focused on authentication and the platform foundation; do not add equipment listings, bookings, or notifications until requested.

## Gotchas

- Run API codegen after changing `lib/api-spec/openapi.yaml`.
- The API requires both `MONGODB_URI` and `JWT_SECRET` at startup.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
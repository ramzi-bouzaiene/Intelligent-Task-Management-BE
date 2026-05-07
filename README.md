# Intelligent Task Manager

An intelligent task management backend built with Node.js, Express, TypeScript, PostgreSQL, and Minio. It exposes REST APIs for auth, tasks, projects, and users, plus an AI assistant powered by Google Gemini that can query the database through Postgres MCP.

## Highlights

- JWT-based authentication and role-aware access.
- Tasks, projects, and users modules with clean separation.
- AI chatbot endpoint that uses Google Gemini + Postgres MCP for data-aware answers.
- Minio-backed avatar uploads and bucket management.
- Swagger API docs at `/api/docs`.
- SQL migrations and a seed script for local data.

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- Google Gemini (hosted LLM)
- Postgres MCP (tooling bridge)
- Minio (object storage)
- Swagger, Zod, Winston

## Quick Start (Local)

### Prerequisites

- Node.js 18+
- PostgreSQL 16+
- Minio server (or Docker)
- Google Gemini API key (for AI features)

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret

GEMINI_MODEL=gemini-flash-latest
GEMINI_API_KEY=your_gemini_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
MCP_URL=http://localhost:8001

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=avatars
MINIO_PUBLIC_URL=http://localhost:9000

```

### Run Migrations and Start the API

```bash
npm run dev
```

For live reload without re-running migrations, run migrations once and then start the watcher:

```bash
npx ts-node src/scripts/runMigrations.ts
npm run dev:watch
```

### Swagger API Docs

Open http://localhost:5000/api/docs

## Docker Compose

This repository includes `docker-compose.yml` with PostgreSQL, Postgres MCP, Minio, and the API.

```bash
docker compose up --build
```

Set the environment variables used by the compose file (at minimum `JWT_SECRET`, `GEMINI_MODEL`, and `GEMINI_API_KEY`) in a local `.env`. If you run the API outside Docker, keep `MINIO_ENDPOINT=localhost`; inside Docker, set `MINIO_ENDPOINT=minio` and `MCP_URL=http://postgres-mcp:8002`.

## Environment Variable Reference

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| PORT | No | 5000 | API port |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| JWT_SECRET | Yes | - | Used to sign auth tokens |
| GEMINI_MODEL | No | gemini-flash-latest | Gemini model name |
| GEMINI_API_KEY | Yes (for AI) | - | Gemini API key |
| GEMINI_BASE_URL | No | https://generativelanguage.googleapis.com/v1beta | Gemini API base URL |
| MCP_URL | No | http://localhost:8001 | Postgres MCP SSE base URL |
| MINIO_ENDPOINT | Yes | - | Hostname for Minio |
| MINIO_PORT | No | 9000 | Minio port |
| MINIO_USE_SSL | No | false | Set to true for TLS |
| MINIO_ACCESS_KEY | Yes | - | Minio access key |
| MINIO_SECRET_KEY | Yes | - | Minio secret key |
| MINIO_BUCKET | No | avatars | Bucket for user avatars |
| MINIO_PUBLIC_URL | No | - | Public base URL for object links |

## Scripts

- `npm run dev` - Run migrations and start the API
- `npm run dev:watch` - Start the API with live reload
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server from `dist`
- `npm run format` - Format code with Prettier

## Seeding Data

```bash
npx ts-node src/scripts/seed.ts
```

This deletes existing users, projects, and tasks, then inserts demo data.

## API Modules

- Auth: `/api/auth`
- Tasks: `/api/tasks`
- Projects: `/api/projects`
- Users: `/api/users`
- Chatbot: `/api/chatbot/ai`
- Storage: `/api/buckets`

Swagger is the source of truth for payloads and responses.

## Project Structure

```
src/
  app.ts                # Express app setup
  server.ts             # Server entry point
  config/               # Environment, DB, logger, MCP client
  database/             # Models and permissions
  middleware/           # Auth, RBAC, error handling
  migrations/           # SQL migration scripts
  modules/              # Feature modules (auth, tasks, users, projects, chatbot)
  scripts/              # Utility scripts (runMigrations, seed)
  shared/               # Shared constants, types, utils
```

## Docs

- MCP integration details: see MCP.md

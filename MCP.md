# AI Agent with Google Gemini + Postgres MCP (Express + TypeScript)

This project demonstrates how to connect a Google Gemini LLM (hosted API model) with a PostgreSQL MCP server using an Express + TypeScript backend.

It enables the AI to:
- Understand user requests
- Decide when database access is needed
- Call MCP tools (Postgres)
- Return intelligent, data-driven responses

---

## Architecture Overview

```
User
  ↓
Express API (TypeScript)
  ↓
Google Gemini API (LLM)
  ↓ (tool decision)
AI Agent Layer (your backend logic)
  ↓
MCP Client
  ↓
Postgres MCP Server (localhost:8000/mcp or /sse)
  ↓
PostgreSQL Database
```

---

## What is MCP?

Model Context Protocol (MCP) is a standard that allows AI models to use external tools.

In this project:
- MCP provides PostgreSQL tools
- Tools include:
  - SQL execution
  - Database health checks
  - Query analysis
  - Performance insights

**Source MCP server:** [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp)

---

## How it works

### 1. User asks a question

**Example:**
```
Show me all tasks created today
```

### 2. Google Gemini decides tool usage

The model may output:

```json
{
  "tool_calls": [
    {
      "function": {
        "name": "query_postgres",
        "arguments": {
          "sql": "SELECT * FROM tasks WHERE created_at = CURRENT_DATE"
        }
      }
    }
  ]
}
```

### 3. Backend executes MCP tool

Your Express server:
- detects tool call
- sends request to MCP server
- receives database result

### 4. MCP server executes SQL

MCP communicates with PostgreSQL using a safe execution layer.

### 5. Final response from LLM

The result is sent back to Google Gemini to generate a human-readable answer.

---

## MCP Server Setup

### Run with Docker

```bash
docker run -p 8000:8000 \
  -e DATABASE_URI=postgresql://user:password@localhost:5432/db \
  crystaldba/postgres-mcp \
  --access-mode=unrestricted --transport=sse
```

This exposes MCP at: `http://localhost:8000/sse`

---

## Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `/sse`   | MCP streaming connection (recommended) |
| `/mcp`   | MCP HTTP transport (depends on setup) |

> MCP uses a protocol layer, not REST APIs.

---

## Tech Stack

- Node.js + Express
- TypeScript
- Google Gemini (hosted LLM)
- Postgres MCP Server
- PostgreSQL
- MCP Protocol (SSE/stdio)

---

## Important Concepts

| What it's NOT | What it IS |
|-----------------|--------------|
| The model does NOT directly access the database | LLM decides |
| MCP is NOT a REST API | Backend executes |
| | MCP performs DB operations |

---

## Project Structure

```
src/
 ├── services/
 │    ├── ai.service.ts        # Google Gemini integration
 │    ├── mcpClient.ts         # MCP communication layer
 │
 ├── mcp/
 │    ├── postgresMcp.ts       # MCP connection logic
 │
 ├── routes/
 │    ├── api.ts               # Express routes
```

---

## Example AI Service Flow

```
gemini generateContent
  → detect tool_calls
  → call MCP client
  → execute SQL
  → send result back to Google Gemini
  → return final answer
```

---

## Security Notes

- Prefer `--access-mode=restricted` in production
- Avoid exposing `/mcp` publicly without auth
- Validate SQL before execution (optional safety layer)

---

## Why This Architecture is Powerful

- AI can use real database data
- No need to hardcode business logic
- Extensible (add Redis, Git, APIs via MCP)
- Works with Google Gemini + MCP

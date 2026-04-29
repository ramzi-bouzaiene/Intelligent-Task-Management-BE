# Intelligent Task Manager

A modern, intelligent task management backend built with Node.js, Express, TypeScript, and PostgreSQL. This project provides robust APIs for user authentication, task management, and integrates AI-powered features for productivity.

## Features

- **User Authentication**: Register, login, and JWT-based authentication.
- **Task Management**: Create, update, delete, and retrieve tasks with status tracking (pending, in progress, completed).
- **Role-based Access**: User roles for secure access control.
- **AI Integration**: (Planned) Smart suggestions and chatbot support.
- **API Documentation**: Swagger UI available at `/api/docs`.
- **Database Migrations**: Simple migration runner for PostgreSQL schema management.
- **Logging**: Centralized logging using Winston.

## Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL**
- **JWT** for authentication
- **Zod** for validation
- **Swagger** for API docs
- **Winston** for logging

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ramzi-bouzaiene/Intelligent-Task-Management.git
   cd Intelligent-Task-Management
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/yourdb
   JWT_SECRET=your_jwt_secret
   ```
4. **Run database migrations:**
   ```bash
   npm run dev
   ```
   (This will run migrations and start the server in development mode.)

### Scripts
- `npm run dev` — Run migrations and start the server (development)
- `npm run build` — Compile TypeScript
- `npm start` — Start the server from compiled code
- `npm run format` — Format code with Prettier

## API Documentation
- Visit [http://localhost:5000/api/docs](http://localhost:5000/api/docs) after starting the server for interactive Swagger docs.

## Project Structure
```
├── src/
│   ├── app.ts                # Express app setup
│   ├── server.ts             # Server entry point
│   ├── config/               # Configuration files
│   ├── database/             # Database models
│   ├── middleware/           # Express middlewares
│   ├── migrations/           # SQL migration scripts
│   ├── modules/              # Feature modules (auth, tasks, users, chatbot, dashboard)
│   ├── routes/               # Route definitions
│   ├── scripts/              # Utility scripts (e.g., runMigrations)
│   └── shared/               # Shared constants, types, utils
├── package.json
├── tsconfig.json
└── README.md
```

## Seeding the Database with Sample Data

To populate your database with sample users and tasks, run the seed script:

```bash
npx ts-node src/scripts/seed.ts
```

- This will delete all existing users and tasks, then insert demo users and related tasks.
- Make sure your `.env` file is configured and the database is running.

> **Note:** You can also run the script with `npm run seed` if you add a script entry:
> ```json
> "seed": "ts-node src/scripts/seed.ts"
> ```

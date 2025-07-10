# Web-Shop Dashboard

A full-stack web application for managing product inventory, built with React frontend, Node.js backend, and AI-powered tag suggestions.

## Features
- **Full CRUD REST API** for Product management (id, name, description, tags, price, category, brand)
- **React Frontend** with modern UI and responsive design
- **User Authentication** with JWT tokens
- **AI-Powered Tag Suggestions** using Ollama integration
- **Input validation** with Zod
- **API documentation** with Swagger/OpenAPI
- **Error handling** and basic logging
- **Dockerized** for easy deployment
- **Jest tests** for endpoints

## Bonus Features
- **Soft Deletes**: Products are not removed from the database, but marked as deleted (using `deletedAt`).
- **Category/Brand Fields**: Products can be categorized and branded.
- **Cursor-based Pagination**: Efficient pagination for product listings.
- **Audit Logging**: All create, update, and delete actions are logged for traceability.
- **AI Tag Suggestions**: Automatic tag generation using Ollama AI model.

## Tech Stack
### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL (via Docker)
- Jest + Supertest
- Swagger (OpenAPI)
- JWT Authentication

### Frontend
- React 19 + TypeScript
- Vite
- React Router DOM
- TanStack Query
- Tailwind CSS
- React Hot Toast

## Project Structure

```
/project-root
│
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── components/   # React components
│   │   ├── api/          # API client functions
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
│
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma
│
├── src/                   # Backend application
│   ├── routes/            # Route handlers (controllers)
│   │   ├── products.ts
│   │   ├── auth.ts
│   │   └── suggestTags.ts
│   ├── services/          # Business logic, DB access, helpers
│   │   ├── productService.ts
│   │   └── tagSuggestService.ts
│   ├── models/            # Zod schemas and TypeScript types
│   │   └── product.ts
│   ├── middlewares/       # Express middlewares (error handling, etc.)
│   │   ├── errorHandler.ts
│   │   └── auth.ts
│   ├── prisma.ts          # Prisma client instance
│   ├── swagger.ts         # Swagger/OpenAPI setup
│   └── index.ts           # App entry point
│
├── .env
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

Choose your preferred setup method:

### Option 1: Docker Setup (Recommended - Easiest)

**Prerequisites:** Docker and Docker Compose installed

```bash
# 1. Clone the repository
git clone <repo-url>
cd <project-folder>

# 2. Set up environment
cp .env.example .env
# Edit .env if needed (defaults work for Docker)

# 3. Start everything with Docker
docker compose up --build

# 4. Access the application
# Frontend: http://localhost:5173
# API Docs: http://localhost:3000/api-docs/
```

### Option 2: Local Development

**Prerequisites:** Node.js 18+, PostgreSQL, Ollama

```bash
# 1. Clone the repository
git clone <repo-url>
cd <project-folder>

# 2. Set up environment
cp .env.example .env
# Edit .env for local development:
# DATABASE_URL=postgresql://username:password@localhost:5432/web_shop_db
# OLLAMA_URL=http://localhost:11434

# 3. Install dependencies
npm install
cd frontend && npm install

# 4. Set up database
npx prisma migrate dev

# 5. Start the backend
npm run dev

# 6. Start the frontend (new terminal)
cd frontend && npm run dev
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database connection
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres

# JWT authentication secret
JWT_SECRET=your-super-secret-jwt-key-here

# Ollama AI service
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=mistral
```

### Important Notes:
- **JWT_SECRET**: Generate a strong secret with `openssl rand -base64 32`
- **OLLAMA_URL**: Use `host.docker.internal:11434` for Docker, `localhost:11434` for local
- **Ollama**: Install from [ollama.ai](https://ollama.ai) and run `ollama pull mistral`

## 🌐 Access URLs

Once running, access the application at:

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs/
- **Database**: PostgreSQL on localhost:5432

## 🔐 Authentication

Default login credentials:
- **Username**: `admin`
- **Password**: `password123`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔧 Troubleshooting

### Common Issues

**Docker Issues:**
- **Port conflicts**: Change ports in `docker-compose.yml` if 3000, 5173, or 5432 are in use
- **Build fails**: Try `docker compose down && docker compose up --build`
- **Ollama connection**: Ensure Ollama is running on your host machine

**Local Development Issues:**
- **Database connection**: Make sure PostgreSQL is running and accessible
- **Ollama not found**: Install from [ollama.ai](https://ollama.ai) and run `ollama pull mistral`
- **Port conflicts**: Change ports in your `.env` file or stop conflicting services

**General Issues:**
- **Environment variables**: Double-check your `.env` file configuration
- **Dependencies**: Try deleting `node_modules` and running `npm install` again
- **Database migrations**: Run `npx prisma migrate reset` if you encounter migration issues

### Getting Help

1. Check the [API Documentation](http://localhost:3000/api-docs/) for endpoint details
2. Review the console logs for error messages
3. Ensure all prerequisites are installed and running

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Products
- `GET /products` - List products (with pagination and search)
- `POST /products` - Create new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Soft delete product

### AI Features
- `POST /suggest-tags` - Get AI-suggested tags for a product

See [Swagger UI](http://localhost:3000/api-docs/) for full documentation.

## Authentication
- **Username**: `admin`
- **Password**: `password123`

## How to Extend
- Add new resources by creating a model (zod + types), a service for business logic, and a route/controller.
- Add new middlewares in `src/middlewares/` for cross-cutting concerns.
- Update Swagger docs in `src/swagger.ts` and with JSDoc comments in your routes.
- Frontend components can be added in `frontend/src/components/`.

## License
MIT 
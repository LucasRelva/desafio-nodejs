

# NestJS Project Management App

This is a project management application built with NestJS. The app provides endpoints to manage users, projects, tasks, and tags. Authentication is handled using JWT tokens.

## Features

- User management: Create, update, delete, and list users.
- Project management: Create, update, delete, and list projects. Add members to projects.
- Task management: Create, update, delete, and list tasks. Add tags and assignees to tasks.
- Tag management: Create, update, delete, and list tags.
- Authentication: Secure endpoints with JWT tokens.

## Logging

Logs are saved in the `logs` directory. Both successful operations and errors are logged.

## Authentication

Some endpoints require a JWT token for authentication. You can obtain a token by logging in with the `/user/login` endpoint. Use the token in the `Authorization` header as `Bearer <token>` for subsequent requests.

## Running the Application

To run the application, you need Docker and Docker Compose installed on your machine. Follow the steps below:

1. **Start the application using Docker Compose:**
   ```bash
   docker-compose up
   ```

2. **Access the application:**
   The application will be accessible at `http://localhost:3000`.

3. **Prisma Seed Command**
   To seed the database with sample data, you can run the following command when the application starts:
   ```bash
   npx prisma db seed
   ```
   This command will populate the database with sample data. You can choose to run it if you want to have some initial data in your application.



## API Documentation

The documentation for the endpoints can be found at `http://localhost:3000/api-docs`.

## Endpoints

### User Endpoints

- `POST /user/login`: Log in to obtain a JWT token.
- `POST /user`: Create a new user.
- `GET /user`: Get a paginated list of users (requires authentication).
- `GET /user/:id`: Get a user by ID (requires authentication).
- `PATCH /user/:id`: Update a user by ID (requires authentication).
- `DELETE /user/:id`: Delete a user by ID (requires authentication).

### Project Endpoints

- `POST /project`: Create a new project (requires authentication).
- `GET /project`: Get a paginated list of projects (requires authentication).
- `GET /project/:id`: Get a project by ID (requires authentication).
- `PATCH /project/:id`: Update a project by ID (requires authentication).
- `DELETE /project/:id`: Delete a project by ID (requires authentication).
- `POST /project/:id/members`: Add members to a project (requires authentication).

### Task Endpoints

- `POST /task`: Create a new task (requires authentication).
- `GET /task`: Get a paginated list of tasks (requires authentication).
- `GET /task/:id`: Get a task by ID (requires authentication).
- `PATCH /task/:id`: Update a task by ID (requires authentication).
- `DELETE /task/:id`: Delete a task by ID (requires authentication).
- `POST /task/:id/tags`: Add tags to a task (requires authentication).
- `POST /task/:id/assignee`: Add an assignee to a task (requires authentication).

### Tag Endpoints

- `POST /tag`: Create a new tag (requires authentication).
- `GET /tag`: Get a paginated list of tags (requires authentication).
- `GET /tag/:id`: Get a tag by ID (requires authentication).
- `PATCH /tag/:id`: Update a tag by ID (requires authentication).
- `DELETE /tag/:id`: Delete a tag by ID (requires authentication).

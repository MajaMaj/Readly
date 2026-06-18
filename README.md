# Readly 📚

Readly is a modern web application designed for book lovers to organize their reading life. Track your progress, rate your latest discoveries, and build your ultimate digital bookshelf.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Bootstrap 5
- Framer Motion
- Axios

### Backend

- Backend application available in the `Backend` directory

### Containerization

- Docker
- Docker Compose

---

## Project Structure

```text
Readly/
├── Backend/
│   └── ...
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── docker-compose.yml
```

---

## Running with Docker

The easiest way to start the entire application is using Docker Compose.

### 1. Clone the repository

```bash
git clone https://github.com/MajaMaj/Readly.git
cd Readly
```

### 2. Start the containers

```bash
docker compose up --build
```

or:

```bash
docker-compose up --build
```

### 3. Access the application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8000
```

### Running in background

```bash
docker compose up -d --build
```

### Stopping containers

```bash
docker compose down
```

---

## Running Frontend Locally

Navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start
```

The application will be available at:

```text
http://localhost:5173
```

---

## Available Scripts

### Start development server

```bash
npm run start
```

### Build production version

```bash
npm run build
```

### Run ESLint

```bash
npm run lint
```

---

## Docker Configuration

The application uses the following Docker Compose configuration:

```yaml
services:
  backend:
    build: ./Backend
    ports:
      - "8000:8000"
    volumes:
      - ./Backend:/app

  frontend:
    build: ./Frontend
    ports:
      - "5173:5173"
    volumes:
      - ./Frontend:/app
      - /app/node_modules
    depends_on:
      - backend
```

---

## Authors

Developed as part of the Readly project.

GitHub Repository:
https://github.com/MajaMaj/Readly

# Stage 1: Build Next.js static export
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend runtime
FROM python:3.12-slim
WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy backend source and install Python dependencies
COPY backend/ ./backend/
WORKDIR /app/backend
RUN uv pip install --system --no-cache \
    "fastapi>=0.111.0" \
    "uvicorn[standard]>=0.30.0" \
    "pydantic>=2.7.0" \
    "pydantic-settings>=2.3.0" \
    "PyJWT>=2.8.0" \
    "bcrypt>=4.0.0" \
    "aiosqlite>=0.20.0" \
    "python-multipart>=0.0.9" \
    "email-validator>=2.0.0"

# Copy the Next.js static export into the backend working directory
COPY --from=frontend-builder /app/frontend/out ./frontend_dist

EXPOSE 8000

ENV FRONTEND_DIST_DIR=./frontend_dist
ENV DB_PATH=./prelegal.db

# Delete the DB file on each start so it's always fresh, then launch
CMD ["sh", "-c", "rm -f $DB_PATH && uvicorn prelegal.main:app --host 0.0.0.0 --port 8000"]

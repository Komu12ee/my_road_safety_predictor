# Stage 1 — build dependencies (no cache problems)
FROM python:3.10-slim AS builder

WORKDIR /app

# Install build deps (if any C extensions needed)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential gcc libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage layer cache
COPY backend/requirements.txt ./requirements.txt

# Create a venv to isolate packages (optional but smaller layer changes)
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade pip
RUN pip wheel --no-cache-dir --wheel-dir=/wheels -r requirements.txt

# Stage 2 — final runtime image
FROM python:3.10-slim

WORKDIR /app

# Create a runtime venv and copy wheels
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*

# Copy app code
COPY backend/ ./

# Expose port used by the app
ENV PORT=8000
EXPOSE 8000

# Add a simple healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:${PORT}/health || exit 1

# Use gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app", "--workers", "2", "--threads", "2", "--timeout", "120"]

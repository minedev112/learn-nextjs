FROM python:3.12-slim

# Keep Python lean and logs unbuffered inside the container.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# curl is needed for container healthchecks (Docker HEALTHCHECK / Coolify).
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first to leverage Docker layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Container-level healthcheck hitting the app's /health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost:8000/health || exit 1

# Ensure schema is current (non-destructive) and load sample data if empty,
# then start the server. Bind to 0.0.0.0 so it's reachable outside the container.
CMD ["sh", "-c", "python -m app.dbinit && python -m app.seed && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"]

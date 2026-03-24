# Deployment Guide

## Environment Configuration
[cite_start]Ensure your `.env.production` file is configured with the following mandatory keys:
* `DATABASE_URL`: Production database connection string.
* [cite_start]`OPENAI_API_KEY`: Valid OpenAI API key.
* [cite_start]`REDIS_URL`: Connection string for the Redis service (e.g., `redis://chat-redis:6379`).

## Local Production Simulation
[cite_start]To test the production build locally using Docker:
```bash
docker compose -f docker-compose.yml up --build
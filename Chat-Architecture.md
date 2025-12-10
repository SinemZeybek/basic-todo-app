# Chat Architecture

This document describes the architecture of the AI Chat feature implemented in the existing Next.js + Supabase project.

---

## 1. High-Level Overview

The chat feature is built on top of the existing Next.js 16 application using the App Router. It provides:

- A REST-like API endpoint: `/api/chat`
- A UI page: `/chat`
- Integration with:
  - OpenAI (gpt-4o-mini) via the official SDK
  - Redis for chat history storage
  - Docker + docker-compose for local container orchestration (web + Redis)
- Basic error logging via a global API middleware that attaches a `request id` to each request.

The chat system is stateless from the HTTP perspective but uses Redis to store recent messages and rebuild conversational context per request.

---

## 2. Components

### 2.1 API Layer: `/api/chat`

**File:** `app/api/chat/route.js`  
**Method:** `POST`

Responsibilities:

- Accept a JSON payload of the form:

  ```json
  { "message": "Hello" }

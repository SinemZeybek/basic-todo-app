Queue Flow Architecture
This document describes the asynchronous message processing flow implemented using Next.js, BullMQ, and Redis for the AI Chat application.

1. High-Level Overview
The system follows a producer-consumer pattern to handle long-running OpenAI API requests without blocking the main thread.

2. Component Breakdown
A. Client (Frontend)

Action: User sends a chat message via the UI.


Interaction: Sends a POST request to /api/queue.


Feedback: Receives a jobId and starts polling the /api/queue/status endpoint.

B. Producer (API Route)

Endpoint: /api/queue.


Logic: Receives the payload, validates authentication, and adds a new job to the BullMQ instance named chat-queue.


Storage: The job metadata is stored in Redis.

C. Message Broker (Redis)

Role: Acts as the persistence layer for the queue.


Reliability: Ensures messages are not lost if the worker crashes.

D. Consumer (Worker)

Process: A separate Node.js process (or Docker container) running worker.js.

Action:

Picks up "waiting" jobs from the queue.

Calls the OpenAI API (gpt-4o-mini).

Implements Hardcoded RAG by injecting context into the prompt.

Updates the job state to completed and stores the result.

3. Error Handling & Resilience

Retries: Jobs that fail due to API limits or network issues are automatically retried with exponential backoff.


Monitoring: Job statuses (active, waiting, completed, failed) can be monitored via the /api/queue/metrics endpoint.
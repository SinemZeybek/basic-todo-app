# TESTING DOCUMENTATION

## 1. Overview
This project follows a rigorous testing strategy to ensure the reliability of the AI Support Desk. [cite_start]We utilize **Jest** for unit, integration, and end-to-end (E2E) testing.

## 2. Test Types
* [cite_start]**Unit Tests**: Focus on utility functions and validation logic (e.g., `utils/validation.test.js`).
* [cite_start]**Integration Tests**: Verify the interaction between the API routes, BullMQ, and the Redis connection.
* [cite_start]**E2E Tests**: Simulate the complete user journey: Login → Ticket Creation → AI Background Response → Admin View.

## 3. Coverage Requirements
* [cite_start]**Minimum Goal**: 80% total code coverage.
* [cite_start]**Current Status**: All core business logic, including protected routes and error handling, is covered by the test suite.

## 4. How to Run Tests
To execute the test suite and generate a coverage report, use the following commands within the `apps/web` directory:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage
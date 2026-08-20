Here is a comprehensive, structured set of documentation pages for the `spiff-ui-bridge` repository Wiki.

---

# Home

Welcome to the **Spiff UI Bridge** documentation.

`spiff-ui-bridge` serves as the middleware layer bridging BPMN workflow orchestration (via SpiffWorkflow) with frontend questionnaires and domain data models (via Metastruct).

## Core Capabilities

* **Task Hydration:** Extracts workflow task context and resolves data schemas for UI rendering.
* **Service Task Mutations:** Orchestrates CRUD actions against downstream microservices during process execution.
* **Law & Policy Validation:** Enforces compliance and domain validation logic against workflow payloads.

## System Architecture

```
+------------------+         +--------------------+         +-------------------+
|  Frontend / UI   | <-----> |  spiff-ui-bridge   | <-----> | SpiffWorkflow /   |
| (React / MUI)    |         | (Express / Node)   |         | Metastruct Core   |
+------------------+         +--------------------+         +-------------------+

```

---

# Quick Start & Setup

## Prerequisites

* **Node.js**: `v18+` or `v20+`
* **Package Manager**: `npm` or `pnpm`

## Installation

```bash
# Clone repository
git clone https://github.com/your-org/spiff-ui-bridge.git
cd spiff-ui-bridge

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

```

## Running the Application

* **Development Mode**: `npm run dev`
* **Build Project**: `npm run build`
* **Production Run**: `npm start`
* **Test Suite**: `npm test`

---

# API Reference

## 1. Health Check

* **Endpoint**: `GET /health`
* **Description**: Returns system availability and running environment status.
* **Response**: `200 OK`
```json
{
  "status": "UP",
  "environment": "development"
}

```



---

## 2. Task Submit & Hydration

* **Endpoint**: `POST /api/v1/tasks/submit`
* **Description**: Receives user task completions and executes hydration logic.
* **Request Body**:
```json
{
  "taskId": "task-123",
  "qStepId": "qstep-456",
  "entityName": "User",
  "payload": {
    "key": "value"
  }
}

```


* **Response**: `200 OK`
```json
{
  "status": "ACCEPTED",
  "taskId": "task-123",
  "qStepId": "qstep-456",
  "data": {}
}

```



---

## 3. Service Task Mutation

* **Endpoint**: `POST /api/v1/service/mutate`
* **Description**: Handles automated BPMN service task data mutations.
* **Request Body**:
```json
{
  "entityName": "User",
  "action": "CREATE", // or "UPDATE"
  "data": {
    "id": "ent-456"
  }
}

```


* **Response**: `200 OK`
```json
{
  "status": "MUTATION_SUCCESS"
}

```



---

# Testing Strategy

The repository utilizes **Jest** and **Supertest** with full TypeScript integration (`ts-jest`).

## Running Tests

```bash
# Run integration test suite
npm test

# Run tests in watch mode
npx jest --watch

```

## Test Structure

* **Unit Tests**: Located in `tests/unit/` for isolated service testing.
* **Integration Tests**: Located in `tests/integration.test.ts` for end-to-end API testing.


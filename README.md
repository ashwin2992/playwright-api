# Playwright API Framework

JavaScript Playwright API automation framework with enterprise-style request utilities, service classes, Winston logging, Allure reporting, and optional Ollama AI failure analysis.

## Framework Phases

### Phase 1: Base Playwright API Framework

- Playwright Test configured for API testing in `playwright.config.js`.
- Environment-driven `BASE_URL` through `.env`.
- Shared test fixture in `fixtures/baseTest.js`.
- API specs live under `tests/`.

### Phase 2: Enterprise ApiClient

- `utils/apiClient.js` wraps Playwright `APIRequestContext`.
- Supports `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- Centralizes base URL handling, headers, timeout, retry count, response parsing, API context capture, and report attachments.

### Phase 3: Winston Logging

- `utils/logger.js` writes console logs plus file logs under `logs/`.
- Request lifecycle and test lifecycle are logged.
- Sensitive header-style values are redacted in log messages.

### Phase 4: Allure Integration

- `allure-playwright` reporter is configured in `playwright.config.js`.
- API request/response exchanges are attached from `ApiClient` through Playwright attachments.
- Generate and open reports with:

```bash
npm run allure:generate
npm run allure:open
```

### Phase 5: Ollama AI Failure Analysis

- `utils/ollama.js` calls a local Ollama server.
- `utils/aiAnalyzer.js` builds a failure-analysis prompt using the last captured API context and Playwright error.
- On failed tests, analysis is attached as `ollama-failure-analysis` and saved under `reports/ai-analysis/`.
- The attachment is file-backed through Playwright `testInfo.attach`, so it is included in Playwright HTML and Allure report artifacts for failed tests.
- Configure with `.env`:

```ini
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5-coder:7b
OLLAMA_TIMEOUT_MS=180000
OLLAMA_NUM_PREDICT=350
AI_ANALYSIS_ENABLED=true
```

Run a quick Ollama check:

```bash
npm run ollama:smoke
```

### Phase 6: Service Layer

- `services/bookingService.js` provides domain-level Restful Booker actions.
- `tests/booking_service.spec.js` demonstrates service-driven tests using the `bookingService` fixture.

## Setup

```bash
npm install
```

Update `.env` if you want a different API target:

```ini
BASE_URL=https://restful-booker.herokuapp.com
API_TIMEOUT_MS=30000
API_RETRIES=1
```

## Run Tests

```bash
npm test
```

Show the Playwright HTML report:

```bash
npm run report
```

## Example Service Test

```js
const { test, expect } = require('../fixtures/baseTest.js');

test('Create booking', async ({ bookingService }) => {
  const response = await bookingService.createBooking({
    firstname: 'Ashwin',
    lastname: 'Netalkar',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-05-01',
      checkout: '2026-05-10'
    },
    additionalneeds: 'Breakfast'
  });

  expect(response.ok()).toBeTruthy();
});
```

## Project Structure

```text
fixtures/
  baseTest.js
hooks/
  globalHooks.js
scripts/
  ollamaSmoke.js
services/
  bookingService.js
testdata/
tests/
utils/
  apiClient.js
  aiAnalyzer.js
  apiContext.js
  common.js
  logger.js
  ollama.js
```

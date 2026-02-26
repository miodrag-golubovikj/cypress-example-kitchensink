# Cypress Kitchensink — Playwright Test Suite (Dockerised)

This repository contains the [Cypress Kitchen Sink](https://github.com/cypress-io/cypress-example-kitchensink)
demo application with an added Playwright test suite running against it.
The app and tests are packaged together in a single Docker image.

---

## Prerequisites

- [Docker](https://www.docker.com/) installed and running
- (Optional) Node.js 18+ for running locally without Docker

---

## Running Locally (without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Start the application (serves on http://localhost:8080)
npm start

# 3. In a separate terminal, run Playwright tests
npx playwright test

# 4. Generate and open Allure report
allure generate allure-results --clean -o allure-report
allure open allure-report
```

Access the Todo app at: **http://localhost:8080/todo**

---

## Docker: Build the Image

```bash
docker build -t kitchensink-playwright:latest .
```

This single image contains:
- The Kitchen Sink application (served via `npm start` on port **8080**)
- All Playwright test dependencies and browsers
- Java + Allure CLI for report generation
- `serve` for hosting the Allure HTML report on port **3000**

---

## Docker: Run the Container

```bash
docker run --rm \
  -p 8080:8080 \
  -p 3000:3000 \
  -v $(pwd)/allure-report:/app/allure-report \
  kitchensink-playwright:latest
```

### What happens on `docker run`:
1. The Kitchen Sink app starts at `http://localhost:8080`
2. Playwright waits 5 seconds for the app to be ready
3. Playwright tests execute against `http://localhost:8080/todo`
4. Raw Allure results are written to `/app/allure-results`
5. Allure CLI generates an HTML report to `/app/allure-report`
6. `serve` hosts the report at **http://localhost:3000** and keeps the container alive

Stop the container at any time with `Ctrl+C` or `docker stop <container_id>`.

---

## Accessing the Allure Report

Once the container is running and tests have completed, the Allure report
is automatically served at:

**➡ http://localhost:3000**

No additional steps required — `serve` runs inside the container and keeps
it alive until you stop it.

The volume mount (`-v`) also persists the `allure-report/` folder to your
host machine for later inspection without re-running the container.

---

## Ports Reference

| Port | Purpose |
|------|---------|
| 8080 | Kitchen Sink application (`http://localhost:8080/todo`) |
| 3000 | Allure HTML report (`http://localhost:3000`) |

---

## Project Structure

```
.
├── Dockerfile                        # Single image: app + tests + report server
├── README.md                         # This file
├── package.json                      # App + test dependencies
├── playwright.config.ts              # Playwright configuration
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions CI workflow
├── tests/                            # Playwright test files
│   └── ...
├── allure-results/                   # Generated after test run (gitignored)
└── allure-report/                    # Generated HTML report (gitignored)
```

---

## CI/CD

This project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`)
that runs the Playwright tests on every push and pull request, uploading
the Allure results as a build artifact.

---

## Notes

- `allure open` is **not** used inside Docker because it attempts to launch a browser
  from within a headless container. `serve` is the correct approach as it simply
  binds to a port that Docker maps to your host.
- The `sleep 5` before tests gives `npm start` time to bind to port 8080 before
  Playwright begins navigating.
- On **Windows (PowerShell)**, replace `$(pwd)` with `${PWD}` in the run command.

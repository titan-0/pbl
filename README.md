# Tests and Validation Guide

This repository includes an automated test suite for the FastAPI backend along with input validation rules for new orders. This guide explains how to run tests, what they cover, and how validation works.

## Prerequisites

- Windows PowerShell (default shell)
- Python and a virtual environment with backend dependencies installed
- Node.js (optional) if you want to run the frontend, not required for backend tests

## Quick start: run the backend tests

```powershell
# From the repo root
Set-Location -LiteralPath 'c:\Users\Lenovo\Desktop\assignment'

# (Optional) Activate your virtualenv if not already active
# & .\.venv\Scripts\Activate.ps1

# Run all backend tests
Set-Location -LiteralPath '.\backend'
pytest tests -v
```

Notes:
- Test discovery is configured via `backend/pytest.ini`.
- Tests use a shared in-memory SQLite database that persists across connections during a test run.

## Test layout and fixtures

- `backend/tests/testApi.py`: Comprehensive API test suite (CRUD, listings, and history).
- `backend/tests/conftest.py`: Shared fixtures and environment setup.
  - Adds the `backend` directory to `sys.path` so imports like `from app.main import app` work.
  - Provides a shared, in-memory SQLite engine (via `StaticPool`) for consistent state across app sessions.
  - Creates/tears down tables between tests via SQLAlchemy metadata calls.

## What the tests cover

### Orders

- GET `/orders/open`
  - Returns a list of OPEN and PENDING orders
  - Sorted by `last_updated` descending
  - Returns 200 with an empty list when no orders are present

- POST `/orders`
  - Creates a new order when payload is valid
  - Rejects invalid payloads with 422 (see “Input validation” below)

- GET `/orders/{order_id}`
  - Returns the order when it exists, 404 when it doesn’t
  - Handles invalid ID formats with 400/422 from FastAPI

- PATCH `/orders/{order_id}`
  - Updates `entry_status` and/or `exit_status`
  - Returns 404 when the order doesn’t exist

### Trades

- GET `/trades/recent?limit=N`
  - Returns up to `N` most recent trades (N clamped to [1, 100])
  - Sorted by `fill_timestamp` descending
  - Returns 200 with an empty list when no trades exist

- GET `/trades/by-order/{order_id}`
  - Returns trades for a specific order
  - Returns an empty list if no trades exist for the order

### Tickers

- GET `/tickers`
  - Returns active tickers only
  - Sorted by symbol

### Price History

- GET `/prices/{symbol}?limit=N`
  - Returns up to `N` recent price ticks for the symbol
  - Returns 200 with an empty list for an unknown or empty symbol

## Input validation for new orders

New order payload schema (`POST /orders`) is defined by `backend/app/schemas.py:OrderCreate` and is enforced by FastAPI/Pydantic. Additional server-side checks ensure the ticker exists.

Schema constraints:
- `ticker` (str)
  - Normalized to uppercase and trimmed
  - Allowed characters: A–Z, 0–9, underscore
  - Length: 1–32
- `action` (enum)
  - One of: `BUY`, `SELL`
- `quantity` (int)
  - Must be greater than 0
  - Must be less than or equal to 1,000,000
- `price` (float)
  - Must be greater than 0
  - Must be less than or equal to 1,000,000,000

Server-side validations (`backend/app/main.py`):
- Ticker must exist in the database; otherwise returns `422 Unprocessable Entity` with `{"detail": "Unknown ticker symbol"}`.

Examples:

Valid request:
```json
{
  "ticker": "NIFTY",
  "action": "BUY",
  "quantity": 50,
  "price": 18600.0
}
```

Invalid requests (return 422):
- Negative quantity:
```json
{"ticker":"NIFTY","action":"BUY","quantity":-50,"price":18600.0}
```
- Zero quantity:
```json
{"ticker":"NIFTY","action":"BUY","quantity":0,"price":18600.0}
```
- Negative price:
```json
{"ticker":"NIFTY","action":"BUY","quantity":50,"price":-18600.0}
```
- Invalid action:
```json
{"ticker":"NIFTY","action":"INVALID","quantity":50,"price":18600.0}
```
- Unknown ticker:
```json
{"ticker":"UNKNOWN","action":"BUY","quantity":50,"price":18600.0}
```

## How tests simulate the app

- Tests create a `TestClient(app)` from FastAPI for HTTP requests.
- `dependency_overrides` replaces the database dependency with the shared in-memory session.
- Data seeding for specific tests is handled by fixtures that insert rows into the test database.

## Tips and troubleshooting

- If test discovery collects 0 items, ensure you are in the `backend` directory and that `pytest.ini` exists with `testpaths = tests`.
- If you see `ModuleNotFoundError: No module named 'app'`, make sure `conftest.py` includes the `sys.path` bootstrap (already in this repo).
- For local curl checks, start the backend server:
  - `& .\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload`

## Extending the tests

- Add new test modules in `backend/tests/` using the `test_*.py` pattern.
- Reuse existing fixtures (`client`, `test_db`, `seed_data`) or add your own.
- Keep tests isolated; seed data per-test where needed.

## Frontend note (optional)

- Frontend tests are not included. Backend tests validate the API contracts the frontend relies upon. If you add frontend tests later, consider Vite + Vitest or Cypress for E2E.

## Test cases: expected vs actual

Below is a concise summary of each backend test with the expected behavior, the actual observation from our latest run, and the final verdict.

| Suite | Test case | Endpoint/Area | Expected | Actual | Verdict |
|---|---|---|---|---|---|
| TestGetOrdersOpen | test_get_orders_open_success | GET /orders/open | 200; JSON contains orders; length ≥ 2 with OPEN/PENDING when seeded | 200; orders present; length ≥ 2 with OPEN/PENDING | PASS |
| TestGetOrdersOpen | test_get_orders_open_returns_correct_statuses | GET /orders/open | All entry_status ∈ {OPEN, PENDING} | All statuses were OPEN or PENDING | PASS |
| TestGetOrdersOpen | test_get_orders_open_empty_database | GET /orders/open | 200 with orders = [] | 200; orders = [] | PASS |
| TestGetOrdersOpen | test_get_orders_open_ordering | GET /orders/open | last_updated values sorted DESC | Timestamps sorted DESC | PASS |
| TestGetTradesRecent | test_get_trades_recent_success | GET /trades/recent | 200; JSON contains trades list | 200; trades list returned | PASS |
| TestGetTradesRecent | test_get_trades_recent_limit | GET /trades/recent?limit=1 | ≤ 1 trade returned | 1 trade returned (≤ 1) | PASS |
| TestGetTradesRecent | test_get_trades_recent_ordering | GET /trades/recent | fill_timestamp sorted DESC | Sorted DESC | PASS |
| TestGetTradesRecent | test_get_trades_recent_empty_database | GET /trades/recent | 200 with trades = [] | 200; trades = [] | PASS |
| TestGetTickers | test_get_tickers_success | GET /tickers | 200; 3 active tickers from seed | 200; 3 tickers | PASS |
| TestGetTickers | test_get_tickers_only_active | GET /tickers | Inactive excluded; active included | Inactive excluded; active included | PASS |
| TestGetTickers | test_get_tickers_ordering | GET /tickers | Symbols sorted ascending | Symbols sorted ascending | PASS |
| TestCreateOrder | test_create_order_success | POST /orders | 200; returned order matches payload; entry_status=OPEN | 200; fields match; entry_status=OPEN | PASS |
| TestCreateOrder | test_create_order_invalid_quantity | POST /orders | 400/422 on negative quantity | 422 | PASS |
| TestCreateOrder | test_create_order_invalid_price | POST /orders | 400/422 on negative price | 422 | PASS |
| TestCreateOrder | test_create_order_invalid_action | POST /orders | 400/422 on invalid action | 422 | PASS |
| TestCreateOrder | test_create_order_missing_fields | POST /orders | 422 on missing required fields | 422 | PASS |
| TestGetOrderById | test_get_order_by_id_success | GET /orders/10001 | 200; correct order payload | 200; expected fields and values | PASS |
| TestGetOrderById | test_get_order_by_id_not_found | GET /orders/99999 | 404 | 404 | PASS |
| TestGetOrderById | test_get_order_by_id_invalid_id | GET /orders/invalid | 400/404/422 | 422 | PASS |
| TestUpdateOrder | test_update_order_entry_status | PATCH /orders/10001 | 200; entry_status updated | 200; entry_status=FILLED | PASS |
| TestUpdateOrder | test_update_order_exit_status | PATCH /orders/10001 | 200; exit_status updated | 200; exit_status=COMPLETED | PASS |
| TestUpdateOrder | test_update_order_both_statuses | PATCH /orders/10001 | 200; both statuses updated | 200; both updated | PASS |
| TestUpdateOrder | test_update_order_not_found | PATCH /orders/99999 | 404 | 404 | PASS |
| TestGetTradesByOrder | test_get_trades_by_order_success | GET /trades/by-order/10001 | 200; trades for order_id=10001 | 200; trades all order_id=10001 | PASS |
| TestGetTradesByOrder | test_get_trades_by_order_empty | GET /trades/by-order/10003 | 200; empty list | 200; empty | PASS |
| TestGetTradesByOrder | test_get_trades_by_order_not_found | GET /trades/by-order/99999 | 200/404 acceptable handling | 200 with empty list | PASS |
| TestGetPriceHistory | test_get_price_history_success | GET /prices/NIFTY | 200; returns seeded 3 ticks | 200; 3 ticks | PASS |
| TestGetPriceHistory | test_get_price_history_limit | GET /prices/NIFTY?limit=5 | ≤ 5 ticks | ≤ 5 ticks | PASS |
| TestGetPriceHistory | test_get_price_history_empty | GET /prices/UNKNOWN | 200; empty list | 200; empty | PASS |
| TestDataValidation | test_order_quantity_constraints | POST /orders | 400/422 for quantity=0 | 422 | PASS |
| TestDataValidation | test_order_price_precision | POST /orders | 200; price preserved (e.g., 18600.99) | 200; price=18600.99 | PASS |
| TestErrorHandling | test_malformed_json | POST /orders | 400/422 for malformed JSON | 422 | PASS |
| TestErrorHandling | test_http_methods_not_allowed | DELETE /tickers | 405 | 405 | PASS |
| TestResponseSchemas | test_order_response_schema | GET /orders/10001 | Response includes required order fields | All required fields present | PASS |
| TestResponseSchemas | test_trade_response_schema | GET /trades/recent | Trade objects include required fields | Required fields present | PASS |
| TestResponseSchemas | test_ticker_response_schema | GET /tickers | Ticker objects include required fields | Required fields present | PASS |

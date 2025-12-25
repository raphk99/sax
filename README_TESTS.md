# Running Tests

This project has both backend Python tests and frontend Playwright E2E tests.

## Backend Tests

The backend tests verify MusicXML parsing functionality using pytest.

### Running Backend Tests

**Windows:**
```bash
cd backend
python -m pytest tests/ -v
```

Or use the batch file:
```bash
backend\run_tests.bat
```

**Unix/Linux/Mac:**
```bash
cd backend
python -m pytest tests/ -v
```

Or use the shell script:
```bash
./backend/run_tests.sh
```

### Test Files

The backend tests use three MusicXML test files:
- `backend/tests/test_scale.musicxml` - Simple scale (C4 to C5)
- `backend/tests/test_rests.musicxml` - Music with rests
- `backend/tests/test_ties.musicxml` - Music with tied notes

## Frontend Tests

The frontend tests use Playwright to test the UI with the same MusicXML files.

### Prerequisites

First, install Playwright browsers:
```bash
cd frontend
npx playwright install
```

### Running Frontend Tests

**Windows:**
```bash
cd frontend
npm run test:e2e
```

Or use the batch file:
```bash
frontend\run_tests.bat
```

**Unix/Linux/Mac:**
```bash
cd frontend
npm run test:e2e
```

Or use the shell script:
```bash
./frontend/run_tests.sh
```

### Frontend Test Options

- `npm run test:e2e` - Run tests headlessly
- `npm run test:e2e:ui` - Run tests with Playwright UI mode
- `npm run test:e2e:headed` - Run tests in headed browser
- `npm run test:e2e:debug` - Run tests in debug mode

### What the Frontend Tests Do

The Playwright tests:
1. Start both the backend (port 8000) and frontend (port 5173) servers
2. Navigate to the app
3. Upload each of the three test MusicXML files
4. Click "Parse on server"
5. Verify:
   - No errors are shown
   - Events table displays correct number of events
   - Correct tempo is shown
   - First and last notes match expectations
   - Score is rendered
   - Sax fingering component is visible
   - Transport controls are enabled after parsing

## Running All Tests

To run both backend and frontend tests:

**Windows:**
```bash
backend\run_tests.bat
frontend\run_tests.bat
```

**Unix/Linux/Mac:**
```bash
./backend/run_tests.sh
./frontend/run_tests.sh
```


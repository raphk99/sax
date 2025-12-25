@echo off
REM Run Playwright E2E tests on Windows
cd frontend
call npm run test:e2e
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%


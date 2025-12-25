@echo off
REM Run the MusicXML parsing tests on Windows
python -m pytest tests/ -v
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%


#!/usr/bin/env python3
"""Run the MusicXML parsing tests."""

import subprocess
import sys
from pathlib import Path

if __name__ == "__main__":
    # Get the backend directory (parent of this script)
    backend_dir = Path(__file__).parent
    
    # Run pytest on the tests directory
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "tests/", "-v"],
        cwd=backend_dir,
    )
    sys.exit(result.returncode)


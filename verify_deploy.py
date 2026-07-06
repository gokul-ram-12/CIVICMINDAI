import os
import sys
from pathlib import Path
import importlib

def verify_deployment():
    print("Starting CivicMind AI Deployment Readiness Check...")
    errors = 0
    warnings = 0

    # 1. Check required files
    required_files = [
        "frontend/app.py",
        "requirements.txt",
        "data/complaints.csv",
        "Dockerfile",
        ".dockerignore"
    ]
    
    base_dir = Path(__file__).resolve().parent
    
    for file_path in required_files:
        full_path = base_dir / file_path
        if not full_path.exists():
            print(f"[FAIL] Required file missing: {file_path}")
            errors += 1
        else:
            print(f"[OK] Found: {file_path}")

    # 2. Check key imports
    required_imports = [
        "streamlit",
        "pandas",
        "plotly",
        "google.generativeai",
        "dotenv",
        "jinja2",
        "openpyxl",
        "google.cloud.bigquery"
    ]
    
    print("\nChecking runtime dependencies...")
    for mod in required_imports:
        try:
            importlib.import_module(mod)
            print(f"[OK] Import successful: {mod}")
        except ImportError:
            print(f"[FAIL] Missing dependency: {mod}")
            errors += 1

    # 3. Check environment variables handling in code
    print("\nChecking environment variables...")
    app_py_path = base_dir / "frontend" / "app.py"
    if app_py_path.exists():
        with open(app_py_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "GEMINI_API_KEY" not in content:
                print("[FAIL] GEMINI_API_KEY handling not found in frontend/app.py")
                errors += 1
            else:
                print("[OK] GEMINI_API_KEY handling found in frontend/app.py")

    # 4. Check for absolute paths
    print("\nChecking for hardcoded absolute paths...")
    bq_service_path = base_dir / "services" / "bigquery_service.py"
    if bq_service_path.exists():
        with open(bq_service_path, "r", encoding="utf-8") as f:
            content = f.read()
            if "c:\\" in content.lower() or "c:/" in content.lower() or "/users/" in content.lower():
                print("[FAIL] Absolute paths detected in bigquery_service.py")
                errors += 1
            else:
                print("[OK] No obvious absolute paths in bigquery_service.py")

    print("\n" + "="*50)
    if errors == 0:
        print("[SUCCESS] CivicMind AI is READY for Google Cloud Run deployment.")
    else:
        print(f"[FAILED] Found {errors} deployment blockers.")
        sys.exit(1)

if __name__ == "__main__":
    verify_deployment()

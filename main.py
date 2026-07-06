import os
import sys
import subprocess

def main():
    """
    Local Development Entrypoint.
    Note: For Google Cloud Run (Docker) deployment, the entrypoint is explicitly:
    `streamlit run frontend/app.py --server.port=$PORT --server.address=0.0.0.0`
    """
    # Construct the path to frontend/app.py
    current_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(current_dir, "frontend", "app.py")
    
    if not os.path.exists(app_path):
        print(f"Error: Could not find application entry point at {app_path}")
        sys.exit(1)
        
    print(f"Launching CivicMind AI Streamlit Dashboard...")
    print(f"Executing: streamlit run {app_path}")
    
    try:
        # Run streamlit as a sub-process
        subprocess.run([sys.executable, "-m", "streamlit", "run", app_path])
    except KeyboardInterrupt:
        print("\nShutdown signal received. Exiting CivicMind AI.")
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

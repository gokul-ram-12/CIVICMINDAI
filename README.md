# CivicMind AI - Deployment Guide

This project is fully optimized and containerized for deployment on **Google Cloud Run** using Docker and Streamlit.

## 1. Local Testing

Before deploying, ensure everything runs properly on your local machine:

```bash
# Run the deployment readiness checks
python verify_deploy.py

# Launch the app locally to verify UI
streamlit run frontend/app.py
```

## 2. Google Cloud Authentication & Setup

You will need to have the Google Cloud CLI (`gcloud`) installed. Run the following commands to authenticate and set up your project:

```bash
# 1. Login to your Google Cloud account
gcloud auth login

# 2. Set your active project ID (replace YOUR_PROJECT_ID with your actual project ID)
gcloud config set project YOUR_PROJECT_ID

# 3. Enable the required Google Cloud APIs for Cloud Run and Build
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

## 3. Deploy to Google Cloud Run

Once authenticated and configured, deploy the app directly from the source using this exact command. 
*Note: Make sure you replace `YOUR_GEMINI_API_KEY` with your actual Gemini API Key.*

```bash
gcloud run deploy civicmind-ai \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Important Notes:
- **Working Prototype Deployed Link**: Once the command completes, it will return a public URL (e.g., `https://civicmind-ai-xxxxx-xx.a.run.app`). This is your final working prototype link for the hackathon.
- **Environment Variables**: The `GEMINI_API_KEY` must be supplied at deploy time so the container can authenticate with Google's Generative AI services.
- **Target**: The deployment target is the final Streamlit app located at `frontend/app.py`, which is automatically launched by the provided `Dockerfile`.

#!/bin/bash
set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "Error: Could not find a default Google Cloud project. Run 'gcloud config set project [PROJECT_ID]' first."
    exit 1
fi

SERVICE_NAME="chunav-mitra-frontend"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "--- Starting deployment for $SERVICE_NAME to Google Cloud Run ---"

# 1. Enable necessary Google Cloud APIs
echo "[1/3] Enabling required APIs..."
gcloud services enable \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    run.googleapis.com

# 2. Build the image using Cloud Build
echo "[2/3] Building and pushing image via Cloud Build..."
gcloud builds submit --tag $IMAGE_NAME .

# 3. Deploy to Cloud Run
echo "[3/3] Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 512Mi \
    --cpu 1

echo "--- Deployment complete! ---"
URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format='value(status.url)')
echo "Your service is live at: $URL"

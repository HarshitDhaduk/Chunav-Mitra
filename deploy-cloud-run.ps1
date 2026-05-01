$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = gcloud config get-value project
if (-not $PROJECT_ID) {
    Write-Error "Could not find a default Google Cloud project. Run 'gcloud config set project [PROJECT_ID]' first."
    exit
}

$SERVICE_NAME = "chunav-mitra-frontend"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "--- Starting deployment for $SERVICE_NAME to Google Cloud Run ---" -ForegroundColor Cyan

# 1. Enable necessary Google Cloud APIs
Write-Host "[1/3] Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com run.googleapis.com

# 2. Build the image using Cloud Build
Write-Host "[2/3] Building and pushing image via Cloud Build..." -ForegroundColor Yellow
gcloud builds submit --tag $IMAGE_NAME .

# 3. Deploy to Cloud Run
Write-Host "[3/3] Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $SERVICE_NAME `
    --image=$IMAGE_NAME `
    --platform=managed `
    --region=$REGION `
    --allow-unauthenticated `
    --port=3000 `
    --memory=512Mi `
    --cpu=1

Write-Host "--- Deployment complete! ---" -ForegroundColor Green
$URL = gcloud run services describe $SERVICE_NAME --platform=managed --region=$REGION --format='value(status.url)'
Write-Host "Your service is live at: $URL" -ForegroundColor Green

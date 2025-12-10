# Deployment Guide for Railway 🚂

This guide will help you deploy the **MeetingMind** application (Backend + Frontend) to [Railway.app](https://railway.app/).

## Prerequisites

1.  Push this code to a **GitHub Repository**.
2.  Create a [Railway account](https://railway.app/).
3.  Install the **Railway CLI** (optional, but UI is sufficient).

## Step 1: Deploying the Backend

1.  **New Project**: In Railway, click **New Project** > **Deploy from GitHub repo**.
2.  **Select Repo**: Choose your `meet-ai` repository.
3.  **Configure Service**:
    *   Click on the newly created service card.
    *   Go to **Settings**.
    *   **Root Directory**: Set this to `/backend`.
    *   **Source Code**:
        *   **Dockerfile Path**: `/backend/Dockerfile` (Railway should auto-detect, but specify if needed)
    *   **Watch Paths** (optional): `/backend/**`.
    *   **Build Command**: (Leave empty if using Dockerfile)
    *   **Start Command**: (Leave empty if using Dockerfile)
4.  **Variables (Environment)**:
    *   Go to the **Variables** tab.
    *   Add the following variables (copy values from your local `.env`):
        *   `NODE_ENV`: `production`
        *   `MONGODB_URI`: *See Step 3 below*
        *   `FIREBASE_PROJECT_ID`: `meetingmuse-541a0`
        *   `FIREBASE_CLIENT_EMAIL`: (Your service account email)
        *   `FIREBASE_PRIVATE_KEY`: (Your full private key, including `\n` or newlines)
        *   `OPENAI_API_KEY`: (Your key)
        *   `GROQ_API_KEY`: (Your key)
        *   `API_SECRET_KEY`: (Generate a secure random string)
        *   `CORS_ORIGIN`: *Leave blank for now, will update after Frontend deploy*

## Step 2: Adding a Database (MongoDB)

1.  In your Railway project view, click **New** > **Database** > **MongoDB**.
2.  Wait for it to initialize.
3.  Click on the MongoDB service > **Variables**.
4.  Copy the `MONGO_URL`.
5.  Go back to your **Backend Service** > **Variables**.
6.  Add/Update `MONGODB_URI` with the value of `MONGO_URL`.

## Step 3: Deploying the Frontend

1.  In the same Railway project, click **New** > **GitHub Repo** (Select the SAME repo again).
2.  **Configure Service**:
    *   Click the new service card.
    *   Go to **Settings**.
    *   **Root Directory**: Set this to `/frontend`.
    *   **Source Code**:
        *   **Dockerfile Path**: `/frontend/Dockerfile`
    *   **Build Command**: (Leave empty)
    *   **Start Command**: (Leave empty)
3.  **Variables**:
    *   `VITE_API_URL`: (The *Public Domain* of your Backend Service).
        *   *To get Backend URL*: Go to Backend Service > Settings > Networking > Generate Domain. Copy that URL (e.g., `https://backend-production.up.railway.app/api`).

## Step 4: Final Connection

1.  Copy the **Frontend Domain** (Frontend Service > Settings > Networking > Generate Domain).
2.  Go to **Backend Service** > **Variables**.
3.  Update `CORS_ORIGIN` to your Frontend Domain (e.g., `https://frontend-production.up.railway.app`).
    *   *Note*: Do not include trailing slashes.
4.  **Redeploy** the Backend (it usually auto-deploys on variable change).

## Troubleshooting

-   **Backend Logs**: "Missing Firebase credentials" -> Double check `FIREBASE_PRIVATE_KEY`. It must likely be wrapped in quotes or pasted exactly as provided in the JSON.
-   **Frontend 404s**: Ensure `VITE_API_URL` ends with `/api` if your backend routes expect it (check `backend/.env` vs `frontend/.env`).
-   **CORS Errors**: Ensure `CORS_ORIGIN` in backend matches the frontend URL exactly.

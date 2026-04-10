# Notes Wallah - Full Stack Deployment Guide

This guide covers deploying the full-stack Notes Wallah application using Render (Backend) and Vercel (Frontend). The backend relies on MongoDB and Cloudinary, while the frontend is a React + Vite app.

## 1. Backend Deployment (Render)

1. Sign up on [Render.com](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository and select the Notes Wallah project.
3. Configure your Web Service:
   - **Name**: `notes-wallah-backend` (or similar)
   - **Root Directory**: `backend` (very important!)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables** (Under the "Environment" setting section):
   - `MONGO_URI` : `mongodb+srv://notes_wallah_admin:shree123yt@cluster0.i7uyjgs.mongodb.net/notes_wallah?appName=Cluster0`
   - `CLOUDINARY_CLOUD_NAME` : `douotsdab`
   - `CLOUDINARY_API_KEY` : `493174817535957`
   - `CLOUDINARY_API_SECRET` : `Hw3jQI54xD1MOysqo4KXHyzopBA`
5. Click **Create Web Service**.
6. Once deployed, Render will give you a live URL (e.g., `https://notes-wallah-backend.onrender.com`). **Copy this URL** for the frontend setup.

## 2. Frontend Deployment (Vercel)

1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import the exact same GitHub repository.
3. In the project configuration, under **Root Directory**, click "Edit" and select `frontend`.
4. The remaining configuration should automatically default to:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** section and add:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: `[PASTE THE RENDER URL YOU COPIED IN STEP 1.6]` (e.g., `https://notes-wallah-backend.onrender.com`)
6. Click **Deploy**.

## 3. Post-Deployment Checks
- Go to your Vercel URL and confirm the 3D items load.
- Try sending a contribution request to verify MongoDB and Cloudinary are working together on production.
- *Note on CORS:* Right now `app.use(cors())` in your backend allows all origins. If you want to tighten security later, you can restrict it to just your Vercel URL!

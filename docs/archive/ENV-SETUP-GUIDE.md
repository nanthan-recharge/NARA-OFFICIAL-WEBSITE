# Environment Variables Setup Guide

Create a `.env` file in `nara_digital_ocean/` with these variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Image Generation APIs (Optional)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## How to Get Gemini API Key:

1. Visit: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste in `.env` file as `VITE_GEMINI_API_KEY`


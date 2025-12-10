# MeetingMuse - AI-Powered Meeting Summarization

Transform your meeting recordings into actionable insights with AI-powered transcription and intelligent summarization.

![MeetingMuse](frontend/public/og-image.png)

## Features

- **AI-Powered Transcription** - Automatic speech-to-text using OpenAI Whisper
- **Intelligent Summarization** - Generate comprehensive summaries with Groq LLaMA 3.3
- **Dual Upload Methods**
  - **Web Interface**: Monitor and manage meetings.
  - **Chrome Extension (LexEye)**: Automatically record and upload directly from Google Meet, Zoom, and Teams.
- **Smart Insights**
  - Action Items Extraction
  - Key Points & Statistics
  - Sentiment Analysis
  - Participant Tracking
- **Robust Architecture**
  - **Dual Authentication**: Secure Firebase Login for Web + Custom JWT implementation for Extension communication.
  - **Resilient Storage**: Automatic fallback to local storage if Cloud Storage fails.
  - **Real-time Status**: Track uploading, transcribing, and processing states.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Firebase Auth (Frontend), Custom JWT (Backend-Extension)
- **Storage**: Firebase Storage (Primary), Local Filesystem (Fallback)
- **AI Services**:
  - OpenAI Whisper API (Transcription)
  - Groq API with LLaMA 3.3 70B (Summarization)
- **Deployment**: MongoDB Atlas, Firebase, Vercel/Netlify, any Node.js host

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (Running locally or MongoDB Atlas URI)
- FFmpeg (Installed and added to PATH)
- Firebase Project (Account, Project ID, Service Account)
- OpenAI API Key
- Groq API Key (free tier available)

### 1. Backend Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd meeting_muse

# Install backend dependencies
cd backend
npm install
```

1. **Configure MongoDB:**
   - Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string

2. **Configure Firebase:**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password provider)
   - Enable Cloud Storage
   - Generate a service account key (Settings → Service Accounts → Generate new private key)

3. **Create `backend/.env` file:**
```bash
PORT=5000
NODE_ENV=development

MONGODB_URI=your-mongodb-connection-string

API_SECRET_KEY=your-random-secret-key
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
CORS_ORIGIN=http://localhost:8080

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

4. **Start the backend server:**
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. **Configure Firebase in frontend:**
   - Copy your Firebase config from Firebase Console → Project Settings → General

2. **Create `frontend/.env` file:**
```bash
VITE_API_URL=http://localhost:5000/api
```

3. **Update Firebase config:**
   - Edit `frontend/src/config/firebase.ts` with your Firebase credentials

4. **Start the frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:8080` (or 8081 if 8080 is in use).

### 3. Extension Setup (LexEye)

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select the `LexEye` directory.
4. Pin the extension.
5. Log in using your MeetingMuse credentials.

## Architecture Highlights

### Dual Authentication System
The system uses a hybrid authentication approach:
- **Web Frontend**: Uses Standard Firebase ID Tokens.
- **Browser Extension**: Uses a custom backend-signed JWT mechanism to allow secure background uploads without persistent Firebase SDK instances in content scripts.

### Storage Fallback
To ensure no recording is ever lost:
1. The system attempts to upload to Firebase Storage.
2. If network/config fails, it automatically saves the file to the local server (`backend/uploads`).
3. The video remains accessible via a local static URL.

### User Upload
1. Sign up / Login
2. Navigate to "Summarize Meeting"
3. Upload a meeting video (MP4, MOV, AVI - max 100MB)
4. Wait for processing (2-5 minutes typically)
5. View transcript, summary, action items, and insights

## Processing Pipeline

1. **Upload** - Video uploaded to Firebase Storage and saved locally
2. **Transcription** - OpenAI Whisper extracts speech-to-text
3. **Cleaning** - Remove filler words, fix formatting
4. **Summarization** - Groq LLaMA generates:
   - Meeting summary
   - Key points discussed
   - Action items with owners
   - Main topics
   - Sentiment analysis
   - Participant mentions
5. **Storage** - Save to MongoDB
6. **Display** - Present in user dashboard

## Project Structure

```
meeting_muse/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API client & utilities
│   │   ├── config/        # Firebase configuration
│   │   └── hooks/         # Custom React hooks
│   └── public/
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (AI, storage)
│   │   ├── middleware/    # Auth & error handling
│   │   └── config/        # Database & Firebase config
│   └── uploads/           # Temporary video storage
├── SETUP.md              # Detailed setup guide
├── API_INTEGRATION.md    # API documentation
└── README.md             # This file
```

## API Keys Setup

### OpenAI (Whisper)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create API key

### Groq (LLaMA)
1. Visit [console.groq.com](https://console.groq.com)
2. Create API key (Free tier available)

### API Secret
Generate a secure random string:
```bash
openssl rand -base64 32
```

Add all to your backend `.env` file.

## Troubleshooting

### Videos not processing
- Check backend server logs
- Verify OpenAI and Groq API keys are set correctly
- Ensure video format is supported
- Check MongoDB connection
- **FFmpeg**: Ensure FFmpeg is installed and added to your system PATH.

### Database connection errors
- Verify MongoDB URI in backend `.env`
- Check if MongoDB Atlas allows connections from your IP
- Ensure MongoDB cluster is running

### API authentication fails
- Verify `x-api-key` header matches backend `.env`
- Check Firebase Auth token is valid
- Ensure user exists in MongoDB

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Frontend built with [React](https://react.dev) + [Vite](https://vitejs.dev)
- Backend powered by [Node.js](https://nodejs.org) + [Express](https://expressjs.com)
- Database by [MongoDB](https://www.mongodb.com)
- Auth & Storage by [Firebase](https://firebase.google.com)
- AI by [OpenAI](https://openai.com) and [Groq](https://groq.com)
- UI components by [Shadcn](https://ui.shadcn.com)

---

**Made with ❤️ for better meetings**
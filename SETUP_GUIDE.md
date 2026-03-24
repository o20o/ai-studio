# Quick Setup Guide

Follow these steps to get your AI Content Generator running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Vertex AI API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Vertex AI API"
   - Click "Enable"
4. Get your API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Create API Key
   - Copy the Project ID from the dashboard

## 3. Configure Environment Variables

### Backend Configuration (.env in root folder)

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_LOCATION=us-central1
GOOGLE_API_KEY=your-google-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=3001
NODE_ENV=development
```

### Frontend Configuration (.env.local)

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 4. Run the Application

You need **TWO terminal windows**:

### Terminal 1 - Backend Server

```bash
npm run server
```

Expected output:
```
Server running on port 3001
Environment: development
```

### Terminal 2 - Frontend Application

```bash
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000
```

## 5. Access the Application

Open your browser and navigate to:

**http://localhost:3000**

## Quick Test

1. Select "Text" generation type
2. Choose "Gemini 1.5 Flash" model
3. Enter a prompt like: "Write a short poem about technology"
4. Click "Generate Text"
5. Wait for the result to appear

## Troubleshooting

### "Environment validation failed"
- Check all environment variables are set correctly in `.env`
- Make sure there are no extra spaces or quotes

### "Server won't start"
- Verify port 3001 is not in use: `lsof -ti:3001`
- Check Node.js version: `node --version` (needs 18+)

### "Failed to generate content"
- Verify Vertex AI API is enabled in Google Cloud
- Check your API key has proper permissions
- Ensure you're within Google Cloud quota limits

### "Database error"
- The Supabase database schema has been automatically created
- Verify your Supabase credentials in both `.env` and `.env.local`

## Production Build

```bash
npm run build
npm start
```

## Need Help?

Check the full README.md for comprehensive documentation.

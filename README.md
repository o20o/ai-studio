# AI Content Generator - Google Gemini & Vertex AI

A production-ready web application for generating AI-powered text, images, and videos using Google Gemini and Vertex AI (including Veo models).

## Features

- **Multi-Model Support**: Generate content using Gemini (text), Imagen (images), and Veo (video) models
- **Flexible Options**: Customize aspect ratios, durations, quality, and more
- **Generation History**: Track and revisit all your generated content
- **Modern UI**: Clean, responsive dark mode design built with TailwindCSS
- **Real-time Updates**: Loading states and error handling for optimal UX
- **Data Persistence**: All generations stored in Supabase with full history
- **Rate Limiting**: Built-in API rate limiting for security
- **Logging**: Comprehensive logging with Winston

## Tech Stack

### Frontend
- **Framework**: Next.js 13 with App Router
- **UI**: React 18 + TailwindCSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Database Client**: Supabase JS

### Backend
- **Runtime**: Node.js with Express
- **AI Integration**: Google Cloud Vertex AI SDK
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Rate Limiting**: Express Rate Limit
- **Logging**: Winston

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── GenerationForm.tsx  # Form for creating generations
│   ├── ResultDisplay.tsx   # Display generated content
│   └── HistoryList.tsx     # List of past generations
├── lib/
│   ├── api.ts              # Frontend API client
│   └── supabase.ts         # Supabase client setup
├── server/
│   ├── index.js            # Express server entry point
│   ├── config/
│   │   ├── env.js          # Environment validation
│   │   └── logger.js       # Winston logger setup
│   ├── middleware/
│   │   ├── validation.js   # Request validation
│   │   ├── rateLimiter.js  # Rate limiting
│   │   └── errorHandler.js # Error handling
│   ├── routes/
│   │   └── generation.routes.js  # API routes
│   └── services/
│       └── vertexAI.service.js   # Vertex AI integration
└── package.json
```

## Setup Instructions

### Prerequisites

1. **Node.js**: Version 18 or higher
2. **Google Cloud Account**: With Vertex AI API enabled
3. **Supabase Account**: For database and authentication

### Step 1: Clone and Install

```bash
# Install dependencies
npm install
```

### Step 2: Configure Environment Variables

#### Backend (.env in root)

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Google Vertex AI Configuration
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_LOCATION=us-central1
GOOGLE_API_KEY=your-google-api-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Frontend (.env.local)

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 3: Set Up Google Cloud

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note your Project ID

2. **Enable Vertex AI API**
   - Navigate to APIs & Services > Library
   - Search for "Vertex AI API"
   - Click Enable

3. **Get API Key**
   - Go to APIs & Services > Credentials
   - Create API Key
   - Copy the key to your `.env` file

### Step 4: Set Up Supabase

The database schema has been automatically created with the following table:

**`generations` Table**
- Stores all generated content (text, images, videos)
- Includes user tracking, timestamps, and metadata
- Row Level Security (RLS) enabled for data protection

The schema includes:
- User-specific data isolation
- Full generation history
- Error tracking
- Automatic timestamps

### Step 5: Run the Application

You need to run both the backend server and the frontend:

#### Terminal 1: Start Backend Server

```bash
npm run server
```

The server will start on `http://localhost:3001`

#### Terminal 2: Start Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 6: Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/generate-text
Generate text using Gemini models.

**Request Body:**
```json
{
  "prompt": "Your text prompt",
  "model": "gemini-1.5-flash"
}
```

### POST /api/generate-image
Generate images using Imagen models.

**Request Body:**
```json
{
  "prompt": "Your image prompt",
  "aspectRatio": "1:1",
  "numberOfImages": 1,
  "negativePrompt": "Optional: things to avoid",
  "model": "imagegeneration@006"
}
```

### POST /api/generate-video
Generate videos using Veo models.

**Request Body:**
```json
{
  "prompt": "Your video prompt",
  "duration": 5,
  "aspectRatio": "16:9",
  "model": "veo-001"
}
```

## Available Models

### Text Generation (Gemini)
- `gemini-1.5-flash` - Fast, efficient text generation
- `gemini-1.5-pro` - Advanced reasoning and longer context
- `gemini-1.0-pro` - Stable production model

### Image Generation (Imagen)
- `imagegeneration@006` - Imagen 3 (latest)
- `imagegeneration@005` - Imagen 2

### Video Generation (Veo)
- `veo-001` - High-quality video generation

## Features in Detail

### Generation Form
- Type selection (text, image, video)
- Model selection based on type
- Dynamic options based on content type
- Real-time validation

### Result Display
- Formatted text display
- Image gallery with download options
- Video player with download
- Model information display

### History Management
- View all past generations
- Click to reload previous results
- Delete unwanted generations
- Filter by type and status
- Chronological ordering

### Security Features
- API rate limiting (10 requests/minute for generation)
- Request validation with Zod
- Environment variable validation
- Row Level Security in database
- Error sanitization

### Error Handling
- Comprehensive error messages
- Failed generation tracking
- Network error recovery
- User-friendly error display

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Generation Endpoints**: 10 requests per minute

## Database Schema

```sql
CREATE TABLE generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  type text NOT NULL,
  prompt text NOT NULL,
  model text NOT NULL,
  result_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  options jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'success',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Troubleshooting

### "Environment validation failed"
- Ensure all required environment variables are set in `.env`
- Check for typos in variable names
- Verify API keys are valid

### "Failed to generate content"
- Verify your Google Cloud project has Vertex AI API enabled
- Check that your API key has the necessary permissions
- Ensure you're within your Google Cloud quota limits

### "Database error"
- Verify Supabase connection details
- Check that the database migration was applied
- Ensure RLS policies are correctly configured

### Backend server won't start
- Check if port 3001 is already in use
- Verify Node.js version (18+)
- Check for missing dependencies

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production` in your `.env`
2. Update `NEXT_PUBLIC_API_URL` to your production API URL
3. Ensure all API keys are production-ready

### Security Checklist
- [ ] All environment variables are set securely
- [ ] Rate limiting is properly configured
- [ ] Database RLS policies are active
- [ ] API keys have minimal required permissions
- [ ] CORS is configured for your domain
- [ ] HTTPS is enabled

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: Railway, Render, or Google Cloud Run
- **Database**: Supabase (managed)

## License

MIT

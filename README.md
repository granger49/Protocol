# Athletic Longevity Training Agent

A full-stack web application for tracking athletic longevity training with personalized workout programs, exercise library management, and cross-device sync.

## Features

- 📅 **Daily Workout View**: Track exercises with checkboxes, weight/reps inputs, and form cues
- 📊 **Week Overview**: See your full weekly training schedule at a glance
- 📋 **Program Reference**: Complete training program with all exercises and protocols
- 📚 **Exercise Library**: 60+ exercises with form cues, add custom exercises
- 🩹 **Achilles Recovery**: Built-in rehab tracking with pain monitoring
- ➡️ **Push to Tomorrow**: Defer exercises to the next day
- 🔄 **Cross-Device Sync**: Access from any device with Google sign-in

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Auth**: Google OAuth via Supabase
- **Deployment**: Vercel

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **SQL Editor** and run the contents of `supabase-migrations.sql`
4. Note your project URL and anon key from **Settings > API**

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret
8. In Supabase: **Authentication > Providers > Google**
9. Enable Google and paste your credentials

### 3. Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
/app
  /app                    # Protected app routes
    /daily                # Daily workout view
    /week                 # Week overview
    /program              # Full program reference
    /progress             # Progress tracking
    /library              # Exercise library management
    /chat                 # Coach chat (coming soon)
  /api                    # API routes
    /workouts             # Workout CRUD
    /exercises            # Exercise library & push
    /templates            # Workout templates
    /prs                  # Personal records
  /auth/callback          # OAuth callback handler
  page.tsx                # Landing page
/components               # Reusable components
/lib
  /supabase              # Supabase clients
  /constants             # Section configs, default template
/types                   # TypeScript types
```

## Database Schema

- `users` - User profiles
- `workout_logs` - Daily workout records
- `exercise_logs` - Individual exercise completions
- `exercise_library` - Global + custom exercises
- `workout_templates` - Training programs
- `pushed_exercises` - Deferred exercises
- `personal_records` - PRs

## License

Private project for personal use.

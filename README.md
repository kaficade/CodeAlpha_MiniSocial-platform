# Mini Social - Social Media Platform

A modern, full-featured mini social media platform built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication** - Email/password sign up, login, logout
- **User Profiles** - Avatar upload, bio, username editing
- **Posts** - Create, edit, delete posts with image uploads
- **Comments** - Comment on posts, delete your comments
- **Likes** - Like/unlike posts with real-time count
- **Follow System** - Follow/unfollow users, follower/following counts
- **Feed** - Personalized feed from followed users + explore tab
- **Notifications** - Like, comment, and follow notifications
- **Search** - Search users by username
- **Responsive** - Mobile-first responsive design

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (Auth + PostgreSQL + Storage)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Formatting:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account

### 1. Clone & Install

```bash
git clone <repo-url>
cd mini-social
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Providers** and ensure Email provider is enabled
4. Copy your project URL and anon key from **Settings > API**

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login & Signup forms
│   ├── comment/       # Comment section
│   ├── layout/        # Navbar & Layout wrapper
│   ├── notification/  # Notification list
│   ├── post/          # Post card, form, feed
│   ├── profile/       # Profile header & edit form
│   └── ui/            # Reusable UI components
├── context/           # Auth context provider
├── hooks/             # Custom React hooks
├── lib/               # Supabase client config
├── pages/             # Route pages
└── types/             # TypeScript interfaces
```

## Deployment

### Vercel

```bash
npm run build
# Deploy the `dist` folder
```

Set environment variables in your Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

MIT

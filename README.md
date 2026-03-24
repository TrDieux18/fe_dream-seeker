# Real-time Message Client

Frontend for a real-time chat and social feed application.

## Deployment Link

- Production: https://fe-dream-seeker-gehw.vercel.app

## Overview

The client is built to support:

- Register/login and session management.
- 1-1 chat and group chat in real time.
- Send text/image messages, reply, edit, and delete.
- Manage posts, comments, follows, and notifications.
- Display online/offline status via socket.

## Tech Stack

- React + TypeScript
- Vite
- React Router
- Zustand
- Axios
- Socket.IO Client
- Tailwind CSS + Radix UI
- React Hook Form + Zod
- Sonner, date-fns, lucide-react

## Folder Structure

```text
src/
  components/   # shared and feature components (chat/post/profile)
  hooks/        # custom hooks (auth, chat, follow, notification...)
  pages/        # route pages
  routes/       # route definitions
  layouts/      # app layouts
  providers/    # context/providers
  lib/          # axios client and helpers
  types/        # TypeScript types
  assets/       # static files
```

## Setup and Run Locally

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the client folder

```env
VITE_API_URL=http://localhost:3001
```

3. Run in development mode

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

5. Preview production build

```bash
npm run preview
```

## Scripts

- npm run dev: run Vite dev server
- npm run build: type-check and build production
- npm run preview: preview local production build
- npm run lint: lint source code

## Key Features

- Real-time messaging with socket
- Group chat settings (rename, change image, clear/delete chat)
- Message actions (reply, edit, delete)
- Toast notifications with loading/error states
- Responsive UI for mobile and desktop
- Theme support

## Backend Connection Notes

- Client calls API with base URL: `${VITE_API_URL}/api`
- Axios uses `withCredentials`, so backend CORS must allow the frontend domain.
- In deployment, set `VITE_API_URL` to your production backend URL.

## Note

You can access the production frontend directly at:

https://fe-dream-seeker-gehw.vercel.app/feed

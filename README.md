# Real-time Message Client

Ứng dụng web chat thời gian thực với giao diện hiện đại.

## Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool & dev server
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **Sonner** - Toast notifications

## Core Features

### Chat

- 1-on-1 conversations
- Group chats with customizable name & image
- Real-time message delivery
- Message editing & deletion
- Reply to messages
- Image sharing
- Online status indicators

### UI/UX

- Responsive design (mobile & desktop)
- Dark/Light theme support
- Smooth animations
- Loading states
- Error handling
- Toast notifications

### Chat Settings

- **Group Settings**: Edit name, change image, view members, clear/delete chat
- **Direct Chat Settings**: Clear messages, delete conversation
- Confirmation dialogs for destructive actions

### Message Actions

- Reply to any message
- Edit your text messages
- Delete your messages
- Double-tap for reactions

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── chat/      # Chat-specific components
│   ├── post/      # Social feed components
│   └── ui/        # UI primitives (shadcn)
├── hooks/         # Custom React hooks
├── pages/         # Route pages
├── routes/        # Route configuration
├── layouts/       # Page layouts
├── lib/           # Utilities & helpers
├── types/         # TypeScript types
└── assets/        # Static assets
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`

3. Start development server:

```bash
npm run dev
```

## Key Components

### Chat Components

- `ChatList` - Chat list with search
- `ChatBody` - Message display area
- `ChatHeader` - Chat info & actions
- `ChatFooter` - Message input
- `GroupSettingsDialog` - Group management
- `DirectChatSettingsDialog` - 1-on-1 chat settings
- `MessageActionsMenu` - Message options

### State Management (Zustand)

- `useAuth` - Authentication state
- `useChat` - Chat & message state
- `useSocket` - Socket connection state
- `usePost` - Social feed state

## Real-time Features

Chat updates automatically when:

- New messages arrive
- Messages are edited/deleted
- Group settings change
- Chats are deleted
- Users go online/offline

## Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.
# fe_dream-seeker

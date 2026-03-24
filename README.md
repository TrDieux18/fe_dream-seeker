# Real-time Message Client

Frontend cho ung dung chat + social feed thoi gian thuc.

## Link deploy

- Production : https://fe-dream-seeker-gehw.vercel.app

## Tong quan

Client duoc xay dung de:

- Dang ky/dang nhap, quan ly phien dang nhap.
- Chat 1-1 va group chat theo thoi gian thuc.
- Gui tin nhan text/anh, reply, edit, delete.
- Quan ly bai viet, comment, follow va notification.
- Hien thi trang thai online/offline theo socket.

## Cong nghe su dung

- React + TypeScript
- Vite
- React Router
- Zustand
- Axios
- Socket.IO Client
- Tailwind CSS + Radix UI
- React Hook Form + Zod
- Sonner, date-fns, lucide-react

## Cau truc thu muc

```text
src/
	components/   # component dung chung va component theo module chat/post/profile
	hooks/        # custom hooks (auth, chat, follow, notification...)
	pages/        # route pages
	routes/       # dinh nghia route
	layouts/      # layout cho app
	providers/    # context/provider
	lib/          # axios client, helper
	types/        # dinh nghia type
	assets/       # static files
```

## Cai dat va chay local

1. Cai dependency

```bash
npm install
```

2. Tao file .env trong thu muc client

```env
VITE_API_URL=http://localhost:3001
```

3. Chay development

```bash
npm run dev
```

4. Build production

```bash
npm run build
```

5. Preview ban build

```bash
npm run preview
```

## Scripts

- npm run dev: chay vite dev server
- npm run build: type-check + build production
- npm run preview: chay thu ban build local
- npm run lint: lint code

## Cac tinh nang chinh

- Realtime messaging voi socket
- Group chat settings (doi ten, doi anh, clear/delete chat)
- Message actions (reply, edit, delete)
- Toast thong bao va loading/error state
- UI responsive cho mobile/desktop
- Theme support

## Luu y ket noi backend

- Client goi API theo baseURL: ${VITE_API_URL}/api
- Axios dang bat withCredentials, backend can cau hinh CORS cho domain frontend.
- Khi deploy, dat VITE_API_URL ve URL backend production.

## Ghi chu

Neu ban truy cap production frontend, co the dung truc tiep link:

https://fe-dream-seeker-gehw.vercel.app/feed

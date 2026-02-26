# Vercel Deployment Setup

## Bước 1: Thêm Biến Môi Trường

Vào **Vercel Dashboard** → Project Settings → **Environment Variables**, thêm:

```bash
VITE_API_URL=https://bedream-seaker-production.up.railway.app
```

**Quan trọng:** URL Railway backend (không có dấu `/` cuối)

## Bước 2: Redeploy

Sau khi thêm biến môi trường, chọn **Redeploy** để build lại với cấu hình mới.

## Bước 3: Cập nhật CORS trên Backend

Đảm bảo Railway backend đã cấu hình FRONTEND_ORIGIN:

```bash
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

## Kiểm tra

- Frontend gọi đến: `https://bedream-seaker-production.up.railway.app/api/auth/register`
- Backend cho phép CORS từ frontend URL Vercel

# FinTrack Deployment Guide

Hướng dẫn deploy ứng dụng FinTrack lên production.

## Phương án Deploy (Miễn phí 100%)

- **Backend API:** Render.com (Free tier)
- **Database:** Render PostgreSQL (Free tier)
- **Frontend:** Vercel (Free tier)

---

## Bước 1: Chuẩn bị Repository

### 1.1. Khởi tạo Git Repository (nếu chưa có)

```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 1.2. Push lên GitHub

1. Tạo repository mới trên GitHub: https://github.com/new
2. Push code lên:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fintrack.git
git branch -M main
git push -u origin main
```

---

## Bước 2: Deploy Backend lên Render

### 2.1. Đăng ký tài khoản Render

1. Truy cập: https://render.com
2. Sign up (có thể dùng GitHub account)

### 2.2. Tạo PostgreSQL Database

1. Từ Dashboard, click **"New +"** → **"PostgreSQL"**
2. Điền thông tin:
   - **Name:** `fintrack-db`
   - **Database:** `fintrack`
   - **User:** `fintrack_user`
   - **Region:** Singapore (gần Việt Nam nhất)
   - **Plan:** Free
3. Click **"Create Database"**
4. **Lưu lại các thông tin:**
   - Internal Database URL
   - External Database URL (dùng cho local testing)

### 2.3. Deploy Backend API

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub repository của bạn
3. Điền thông tin:
   - **Name:** `fintrack-api`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:**
     ```
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command:**
     ```
     npm start
     ```
4. **Environment Variables** (Click "Advanced"):
   ```
   NODE_ENV=production
   DATABASE_URL=[Internal Database URL từ bước 2.2]
   JWT_SECRET=[Tạo random string, ví dụ: abc123xyz456...]
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=nguyenkhang242333@gmail.com
   EMAIL_PASSWORD=znjc toxm gwqe yaom
   EMAIL_FROM=FinTrack <nguyenkhang242333@gmail.com>
   CLIENT_URL=https://fintrack.vercel.app
   PORT=3000
   ```
5. Click **"Create Web Service"**
6. Đợi deploy hoàn tất (5-10 phút)
7. **Lưu lại URL backend:** `https://fintrack-api.onrender.com`

---

## Bước 3: Deploy Frontend lên Vercel

### 3.1. Đăng ký Vercel

1. Truy cập: https://vercel.com
2. Sign up với GitHub account

### 3.2. Deploy Frontend

1. Click **"Add New..."** → **"Project"**
2. Import repository GitHub của bạn
3. Configure Project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   ```
   VITE_API_URL=https://fintrack-api.onrender.com/api
   ```
5. Click **"Deploy"**
6. Đợi deploy hoàn tất (2-3 phút)
7. **Lưu lại URL frontend:** `https://fintrack.vercel.app`

### 3.3. Update Backend với Frontend URL

1. Quay lại Render Dashboard
2. Vào service `fintrack-api`
3. Tab **"Environment"**
4. Update biến `CLIENT_URL` với URL Vercel thật:
   ```
   CLIENT_URL=https://fintrack.vercel.app
   ```
5. Save changes (backend sẽ tự động redeploy)

---

## Bước 4: Test Production

1. Truy cập URL frontend
2. Test các chức năng:
   - ✅ Register account
   - ✅ Email verification
   - ✅ Login
   - ✅ Create transactions
   - ✅ Create budgets
   - ✅ Create goals
   - ✅ View dashboard charts

---

## Auto Deploy

Sau khi setup xong, mỗi khi push code lên GitHub, Vercel và Render sẽ tự động deploy!

---

## Chi phí: MIỄN PHÍ 100%

- ✅ Backend (Render): FREE
- ✅ Database (Render PostgreSQL): FREE
- ✅ Frontend (Vercel): FREE

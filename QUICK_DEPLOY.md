# 🚀 Quick Deploy Guide - FinTrack

Deploy FinTrack lên web thật trong 15 phút! (Hoàn toàn MIỄN PHÍ)

## 📋 Chuẩn bị

- [ ] Tài khoản GitHub
- [ ] Tài khoản Render.com (đăng ký bằng GitHub)
- [ ] Tài khoản Vercel (đăng ký bằng GitHub)

---

## Bước 1: Push Code lên GitHub (5 phút)

### 1.1. Tạo repository trên GitHub
1. Vào https://github.com/new
2. Tạo repository mới tên `fintrack`
3. Để public hoặc private tùy thích
4. **KHÔNG** tick "Add README"

### 1.2. Push code lên
```bash
# Mở terminal tại thư mục ITPM_PROJ
cd c:\Users\Admin\Desktop\ITPM_PROJ

# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Ready for deployment"

# Connect với GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fintrack.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

✅ Xong! Code đã lên GitHub.

---

## Bước 2: Deploy Database & Backend lên Render (5 phút)

### 2.1. Đăng ký Render
1. Vào https://render.com
2. Click "Get Started" → Sign in with GitHub

### 2.2. Tạo PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Điền:
   - Name: `fintrack-db`
   - Database: `fintrack`
   - User: `fintrack`
   - Region: **Singapore** (gần VN nhất)
   - Plan: **Free**
3. Click "Create Database"
4. **Đợi 2-3 phút** database được tạo
5. Click vào database vừa tạo
6. Copy **Internal Database URL** (dạng `postgresql://...`)

### 2.3. Deploy Backend
1. Click "New +" → "Web Service"
2. Click "Build and deploy from a Git repository" → Next
3. Connect GitHub account (nếu chưa)
4. Chọn repository `fintrack`
5. Điền thông tin:

**Basic:**
- Name: `fintrack-api`
- Region: Singapore
- Branch: `main`
- Root Directory: `server`
- Runtime: **Node**

**Build & Deploy:**
- Build Command:
  ```
  npm install && npx prisma generate && npx prisma migrate deploy
  ```
- Start Command:
  ```
  npm start
  ```

**Environment Variables:**
Click "Advanced" → Add Environment Variables:

```
NODE_ENV = production
PORT = 3000
DATABASE_URL = [Paste Internal Database URL từ bước 2.2]
JWT_SECRET = fintrack_super_secret_key_2024_abc123xyz
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = nguyenkhang242333@gmail.com
EMAIL_PASSWORD = znjc toxm gwqe yaom
EMAIL_FROM = FinTrack <nguyenkhang242333@gmail.com>
CLIENT_URL = http://localhost:5173
```

**Note:** CLIENT_URL sẽ update sau khi deploy frontend

6. Click "Create Web Service"
7. **Đợi 5-7 phút** để build xong
8. Khi thấy "Live" màu xanh → Copy URL (dạng: `https://fintrack-api.onrender.com`)

✅ Backend đã live!

---

## Bước 3: Deploy Frontend lên Vercel (3 phút)

### 3.1. Đăng ký Vercel
1. Vào https://vercel.com
2. Click "Sign Up" → Continue with GitHub

### 3.2. Deploy Frontend
1. Click "Add New..." → "Project"
2. Import repository `fintrack`
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Environment Variables:
   Click "Environment Variables" → Add:
   ```
   VITE_API_URL = https://fintrack-api.onrender.com/api
   ```
   **Note:** Thay `fintrack-api` bằng tên backend bạn đặt

5. Click "Deploy"
6. **Đợi 2-3 phút** để build
7. Khi xong, copy URL (dạng: `https://fintrack-abc123.vercel.app`)

✅ Frontend đã live!

---

## Bước 4: Update Backend URL (2 phút)

1. Quay lại Render Dashboard
2. Vào service `fintrack-api`
3. Sidebar → "Environment"
4. Tìm biến `CLIENT_URL`
5. Sửa thành URL Vercel của bạn:
   ```
   CLIENT_URL = https://fintrack-abc123.vercel.app
   ```
6. Click "Save Changes"
7. Backend sẽ tự động redeploy (~1 phút)

✅ Hoàn tất!

---

## 🎉 Test Website

1. Mở URL Vercel của bạn
2. Click "Sign Up" → Tạo tài khoản
3. Check email để lấy verification code
4. Đăng nhập và test:
   - ✅ Add transactions
   - ✅ Create budgets
   - ✅ Create savings goals
   - ✅ View dashboard charts
   - ✅ Toggle dark mode

---

## ⚠️ Lưu ý quan trọng

### Render Free Tier
- Backend sẽ **sleep sau 15 phút không dùng**
- Khi sleep, request đầu tiên sẽ mất ~30 giây để wake up
- Database free expires sau 90 ngày (cần renew miễn phí)

### Giải pháp: Keep Backend Awake
Dùng dịch vụ cron job ping API mỗi 10 phút:

1. Vào https://cron-job.org/en/
2. Sign up free
3. Tạo cronjob mới:
   - URL: `https://fintrack-api.onrender.com/api/health`
   - Schedule: Every 10 minutes
   - Method: GET

### Custom Domain (Optional)
**Vercel (Frontend):**
1. Mua domain (Namecheap ~$1/năm)
2. Vercel Settings → Domains → Add domain
3. Config DNS theo hướng dẫn

**Render (Backend):**
1. Settings → Custom Domain
2. Add domain và config DNS

---

## 🐛 Troubleshooting

### Backend deploy failed
- Check logs: Render Dashboard → Logs tab
- Kiểm tra DATABASE_URL đúng chưa
- Verify Build Command đúng

### Frontend không connect được backend
- Check VITE_API_URL có đúng không
- Kiểm tra CLIENT_URL trong Render có đúng không
- Mở F12 → Console xem lỗi

### Email verification không hoạt động
- Check EMAIL credentials trong Render
- Verify Gmail App Password còn hoạt động
- Check spam folder

---

## 📞 Cần giúp đỡ?

1. Check logs trên Render/Vercel
2. Xem documentation:
   - https://render.com/docs
   - https://vercel.com/docs
3. Hỏi tôi hoặc team!

---

## 🎊 Chúc mừng!

Website của bạn đã LIVE trên internet! 🚀

Share URL với bạn bè và gia đình để test nhé!

**Tổng chi phí:** $0/tháng 🎉

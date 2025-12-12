# Hướng Dẫn Cấu Hình Email Verification

## Tính Năng Email Verification

FinTrack hiện đã tích hợp tính năng xác thực email. Khi người dùng đăng ký tài khoản mới:

1. Hệ thống tạo mã xác thực 6 số
2. Gửi mã qua email của người dùng
3. Người dùng nhập mã để xác thực tài khoản
4. Chỉ tài khoản đã xác thực mới có thể đăng nhập

## API Endpoints Mới

### 1. Đăng Ký (Register)
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyen Van A"
}
```
**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nguyen Van A",
    "isEmailVerified": false
  },
  "requiresVerification": true
}
```

### 2. Xác Thực Email (Verify Email)
```
POST /api/auth/verify-email
```
**Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nguyen Van A",
    "isEmailVerified": true
  },
  "token": "jwt-token"
}
```

### 3. Gửi Lại Mã Xác Thực (Resend Code)
```
POST /api/auth/resend-verification
```
**Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "message": "Verification code sent successfully. Please check your email."
}
```

### 4. Đăng Nhập (Login)
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response (Chưa xác thực):**
```json
{
  "error": "Email not verified",
  "message": "Please verify your email before logging in",
  "requiresVerification": true
}
```

**Response (Đã xác thực):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Nguyen Van A",
    "isEmailVerified": true
  },
  "token": "jwt-token"
}
```

## Cấu Hình Gmail App Password

### Bước 1: Bật 2-Factor Authentication (2FA)

1. Truy cập [Google Account Security](https://myaccount.google.com/security)
2. Tìm mục **"2-Step Verification"**
3. Click **"Get Started"** và làm theo hướng dẫn
4. Xác thực qua số điện thoại của bạn

### Bước 2: Tạo App Password

1. Sau khi bật 2FA, quay lại [Google Account Security](https://myaccount.google.com/security)
2. Tìm mục **"2-Step Verification"** → Click vào
3. Kéo xuống dưới, tìm mục **"App passwords"**
4. Click **"App passwords"**
5. Đăng nhập lại nếu được yêu cầu
6. Chọn:
   - **App:** Mail
   - **Device:** Windows Computer (hoặc device bạn đang dùng)
7. Click **"Generate"**
8. Google sẽ hiển thị **16-character password** (ví dụ: `abcd efgh ijkl mnop`)
9. **Copy password này** (không có khoảng trắng)

### Bước 3: Cập Nhật File .env

1. Mở file `server/.env`
2. Thêm hoặc cập nhật:

```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="abcdefghijklmnop"
```

**Lưu ý:**
- `EMAIL_USER`: Email Gmail của bạn
- `EMAIL_PASSWORD`: App Password vừa tạo (16 ký tự, không có khoảng trắng)
- **KHÔNG** dùng mật khẩu Gmail thông thường

### Bước 4: Khởi Động Lại Server

```bash
cd server
npm run dev
```

## Test Email Verification

### 1. Đăng Ký Tài Khoản Mới

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "Test123456",
    "name": "Test User"
  }'
```

### 2. Kiểm Tra Email

Kiểm tra inbox của `test@gmail.com`, bạn sẽ nhận được email có:
- Subject: **"Xác thực Email - FinTrack"**
- Mã 6 số (ví dụ: **123456**)
- Mã có hiệu lực trong **10 phút**

### 3. Xác Thực Email

```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "code": "123456"
  }'
```

### 4. Đăng Nhập

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "Test123456"
  }'
```

## Xử Lý Lỗi Thường Gặp

### Lỗi 1: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Nguyên nhân:**
- Chưa bật 2FA
- App Password sai
- Đang dùng mật khẩu Gmail thông thường

**Giải pháp:**
- Bật 2-Step Verification
- Tạo App Password mới
- Kiểm tra lại EMAIL_PASSWORD trong .env

### Lỗi 2: Email không được gửi

**Nguyên nhân:**
- EMAIL_USER hoặc EMAIL_PASSWORD sai
- Kết nối internet không ổn định
- Gmail đã chặn ứng dụng

**Giải pháp:**
- Kiểm tra lại thông tin trong .env
- Kiểm tra kết nối internet
- Truy cập [Less secure app access](https://myaccount.google.com/lesssecureapps) và bật (nếu cần)

### Lỗi 3: "Verification code expired"

**Nguyên nhân:**
- Mã đã quá 10 phút

**Giải pháp:**
- Gọi API `/api/auth/resend-verification` để nhận mã mới

### Lỗi 4: "Email already verified"

**Nguyên nhân:**
- Tài khoản đã được xác thực rồi

**Giải pháp:**
- Đăng nhập trực tiếp bằng `/api/auth/login`

## Database Schema

Database đã được cập nhật với các trường mới:

```prisma
model User {
  id                    String        @id @default(uuid())
  email                 String        @unique
  password              String
  name                  String
  isEmailVerified       Boolean       @default(false)      // Trạng thái verify
  emailVerificationCode String?                            // Mã 6 số
  verificationCodeExpiry DateTime?                          // Thời gian hết hạn
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
  // ... other fields
}
```

## Bảo Mật

1. **Mã xác thực:**
   - 6 chữ số ngẫu nhiên (100000-999999)
   - Hết hạn sau 10 phút
   - Bị xóa sau khi verify thành công

2. **Email:**
   - Sử dụng Gmail App Password (không phải mật khẩu thật)
   - Email được gửi qua SSL/TLS
   - Không log sensitive information

3. **User flow:**
   - Không thể đăng nhập nếu chưa verify email
   - Có thể gửi lại mã nếu hết hạn
   - Tự động login sau khi verify thành công

## Testing với Postman

Import collection này vào Postman:

```json
{
  "info": {
    "name": "FinTrack Email Verification",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/auth/register",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@gmail.com\",\n  \"password\": \"Test123456\",\n  \"name\": \"Test User\"\n}"
        }
      }
    },
    {
      "name": "Verify Email",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/auth/verify-email",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@gmail.com\",\n  \"code\": \"123456\"\n}"
        }
      }
    },
    {
      "name": "Resend Verification",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/auth/resend-verification",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@gmail.com\"\n}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/auth/login",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@gmail.com\",\n  \"password\": \"Test123456\"\n}"
        }
      }
    }
  ]
}
```

## Tổng Kết

Tính năng Email Verification đã hoàn thiện với:

✅ Gửi mã 6 số qua Gmail
✅ Xác thực email trước khi login
✅ Resend mã nếu hết hạn
✅ Email template đẹp, chuyên nghiệp
✅ Bảo mật với App Password
✅ Error handling đầy đủ

Để bắt đầu sử dụng, hãy làm theo các bước trong **Cấu Hình Gmail App Password** ở trên!

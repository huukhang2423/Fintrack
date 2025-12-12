# SCRIPT THUYẾT TRÌNH - KIẾN TRÚC 3 TẦNG FINTRACK

## 📋 MỤC LỤC SCRIPT
1. [Giới Thiệu Tổng Quan](#phần-1-giới-thiệu-tổng-quan-30-giây)
2. [Kiến Trúc 3 Tầng](#phần-2-kiến-trúc-3-tầng-2-phút)
3. [Demo Quy Trình Dữ Liệu](#phần-3-demo-quy-trình-dữ-liệu-3-phút)
4. [Bảo Mật & Kết Luận](#phần-4-bảo-mật--kết-luận-1-phút)

---

## PHẦN 1: GIỚI THIỆU TỔNG QUAN (30 giây)

### 🎤 Script:

> "Xin chào mọi người, hôm nay em xin trình bày về kiến trúc hệ thống của ứng dụng **FinTrack** - một ứng dụng quản lý tài chính cá nhân.
>
> FinTrack được xây dựng theo mô hình **3-tier architecture** chuẩn, bao gồm 3 tầng: **Frontend, Backend, và Database**.
>
> Để các bạn dễ hình dung, em sẽ giải thích từng tầng một, sau đó demo một quy trình cụ thể: **Khi user nhập một giao dịch chi tiêu, dữ liệu sẽ đi qua hệ thống như thế nào.**"

### 💡 Động tác:
- Chiếu slide với sơ đồ 3 tầng tổng quan
- Trỏ tay lần lượt vào 3 khối: Frontend → Backend → Database

---

## PHẦN 2: KIẾN TRÚC 3 TẦNG (2 phút)

### 🎤 Script:

#### **A. FRONTEND - Tầng Giao Diện (40 giây)**

> "Đầu tiên là **tầng Frontend** - nơi người dùng tương tác.
>
> Chúng em sử dụng **React** kết hợp với **TypeScript** để xây dựng giao diện. Đây là công nghệ hiện đại, giúp code dễ bảo trì và phát hiện lỗi sớm.
>
> Ở tầng này có 2 component chính:
> - **Transactions.tsx**: Hiển thị danh sách giao dịch dưới dạng bảng
> - **TransactionModal**: Cái form popup để user nhập giao dịch mới
>
> Khi user nhập dữ liệu, React Hook Form sẽ kiểm tra validation ngay trên trình duyệt - ví dụ như số tiền phải lớn hơn 0, phải chọn danh mục chi tiêu.
>
> Sau khi validate OK, Frontend sẽ gọi API thông qua **Axios** - một HTTP client tự động gắn JWT token để xác thực người dùng."

### 💡 Động tác:
- Chiếu slide với code snippet của TransactionModal.tsx
- Highlight phần form fields: amount, type, category, date
- Có thể demo live trên trình duyệt: mở form tạo transaction

---

#### **B. BACKEND - Tầng Xử Lý Logic (50 giây)**

> "Tiếp theo là **tầng Backend** - bộ não của ứng dụng.
>
> Chúng em dùng **Express.js** - một framework Node.js rất phổ biến để xây dựng RESTful API.
>
> Khi Frontend gửi request lên, nó phải đi qua **3 lớp bảo vệ** trước khi vào database:
>
> **Lớp 1 - Authentication Middleware**: Kiểm tra JWT token. Nếu token không hợp lệ hoặc hết hạn → reject ngay, trả về lỗi 401.
>
> **Lớp 2 - Validation Middleware**: Kiểm tra chi tiết dữ liệu. Ví dụ: số tiền có đúng định dạng không, type phải là INCOME hoặc EXPENSE, date phải đúng chuẩn ISO8601.
>
> **Lớp 3 - Controller**: Nếu pass 2 lớp trên, Controller sẽ xử lý logic nghiệp vụ. Ở đây có file `transactionController.ts` với 5 functions: GET danh sách, GET chi tiết, CREATE mới, UPDATE, và DELETE.
>
> Điểm quan trọng: Mọi thao tác đều được **filter theo userId** từ JWT token - đảm bảo user chỉ thấy và sửa được giao dịch của chính mình."

### 💡 Động tác:
- Chiếu slide với flow diagram: Request → Auth → Validation → Controller
- Highlight đoạn code authenticate middleware
- Nhấn mạnh security: "Không có cách nào user A xem được dữ liệu của user B"

---

#### **C. DATABASE - Tầng Lưu Trữ (30 giây)**

> "Cuối cùng là **tầng Database** - nơi lưu trữ toàn bộ dữ liệu.
>
> Chúng em dùng **PostgreSQL** - một hệ quản trị CSDL mạnh mẽ, open-source. Để tương tác với database, em dùng **Prisma ORM** - giúp viết query an toàn hơn, tránh SQL injection.
>
> Database có 4 bảng chính:
> - **Users**: Lưu thông tin tài khoản (email, password đã hash)
> - **Transactions**: Lưu các giao dịch thu/chi
> - **Categories**: Danh mục như Ăn uống, Di chuyển, Lương...
> - **Budgets**: Ngân sách hàng tháng cho từng danh mục
>
> Các bảng có quan hệ với nhau qua **Foreign Key**. Ví dụ: Mỗi Transaction phải thuộc về 1 User và 1 Category. Khi xóa User, tất cả Transaction của user đó cũng tự động xóa theo - gọi là **Cascade Delete**."

### 💡 Động tác:
- Chiếu slide với Entity Relationship Diagram (ERD)
- Trỏ vào các mối quan hệ giữa User → Transaction → Category
- Có thể show file schema.prisma

---

## PHẦN 3: DEMO QUY TRÌNH DỮ LIỆU (3 phút)

### 🎤 Script:

> "Bây giờ để các bạn thấy rõ hơn cách 3 tầng này làm việc với nhau, em sẽ demo một quy trình cụ thể:
>
> **Tình huống**: User vừa đi chợ mua thực phẩm tốn 500,000đ, và muốn ghi lại khoản chi này vào ứng dụng.
>
> Hãy xem dữ liệu sẽ đi qua hệ thống như thế nào."

---

### **BƯỚC 1-4: FRONTEND (45 giây)**

> "**Bước 1**: User click vào nút 'Add Transaction' màu xanh trên giao diện.
>
> **Bước 2**: Một popup hiện ra với form có các trường:
> - Type: Chọn 'Chi tiêu'
> - Amount: Nhập 500000
> - Category: Chọn 'Groceries - Mua sắm'
> - Date: Mặc định là hôm nay
> - Description: 'Đi chợ tuần này'
>
> **Bước 3**: User click Submit. React Hook Form kiểm tra:
> - Số tiền > 0? ✓ OK
> - Đã chọn Category? ✓ OK
> - Date hợp lệ? ✓ OK
>
> **Bước 4**: Form hợp lệ → Frontend gọi API:
> ```
> POST http://localhost:3000/api/transactions
> Header: Authorization: Bearer eyJhbGc...
> Body: {
>   amount: 500000,
>   type: "EXPENSE",
>   categoryId: "cat-123",
>   date: "2025-12-10T00:00:00.000Z",
>   description: "Đi chợ tuần này"
> }
> ```
>
> Lưu ý: JWT token được Axios tự động gắn vào header - đây là cách ứng dụng biết ai đang gửi request."

### 💡 Động tác:
- Demo live trên trình duyệt: mở form, điền thông tin
- Mở DevTools → Network tab để show request
- Highlight JWT token trong Request Headers

---

### **BƯỚC 5-11: BACKEND (1 phút)**

> "Request bay đến Backend. Giờ nó phải vượt qua 3 cửa ải:
>
> **Cửa ải 1 - Authentication** (5 giây):
> ```javascript
> // auth.ts
> 1. Lấy token từ header: "Bearer eyJhbGc..."
> 2. Verify bằng JWT_SECRET
> 3. Giải mã → Lấy userId: "user-456"
> 4. Gắn vào request: req.userId = "user-456"
> 5. ✓ Pass → next()
> ```
> Nếu token giả mạo hoặc hết hạn → trả về 401 Unauthorized ngay.
>
> **Cửa ải 2 - Validation** (5 giây):
> ```javascript
> // validation.ts
> 1. Check amount: 500000 > 0? ✓
> 2. Check type: "EXPENSE" in [INCOME, EXPENSE]? ✓
> 3. Check date: ISO8601 valid? ✓
> 4. Check categoryId: not empty? ✓
> 5. ✓ Pass → next()
> ```
> Nếu thiếu trường hoặc sai format → trả về 400 Bad Request.
>
> **Cửa ải 3 - Controller** (10 giây):
> ```javascript
> // transactionController.ts
> async createTransaction(req, res) {
>   const { amount, type, description, date, categoryId } = req.body;
>   const userId = req.userId; // "user-456" từ JWT
>
>   // Gọi Prisma để lưu vào database...
> }
> ```
>
> Controller nhận được:
> - Dữ liệu từ form (body)
> - userId từ JWT token
>
> Giờ gọi Prisma để lưu vào database."

### 💡 Động tác:
- Chiếu slide với flow diagram có 3 middleware boxes
- Highlight code snippet của từng middleware
- Nhấn mạnh: "Nếu fail ở bất kỳ bước nào → dừng ngay, không chạm đến database"

---

### **BƯỚC 12-15: DATABASE (45 giây)**

> "**Bước 12**: Controller gọi Prisma:
> ```javascript
> const transaction = await prisma.transaction.create({
>   data: {
>     amount: 500000,
>     type: 'EXPENSE',
>     description: 'Đi chợ tuần này',
>     date: new Date('2025-12-10'),
>     userId: 'user-456',      // từ JWT
>     categoryId: 'cat-123'
>   },
>   include: {
>     category: true  // Lấy thêm thông tin category
>   }
> });
> ```
>
> **Bước 13**: Prisma chuyển thành câu SQL:
> ```sql
> INSERT INTO transactions (
>   id, amount, type, description, date,
>   "createdAt", "updatedAt", "userId", "categoryId"
> ) VALUES (
>   'txn-789',  -- UUID tự sinh
>   500000,
>   'EXPENSE',
>   'Đi chợ tuần này',
>   '2025-12-10 00:00:00',
>   NOW(),
>   NOW(),
>   'user-456',
>   'cat-123'
> );
> ```
>
> **Bước 14**: PostgreSQL thực thi:
> - Kiểm tra Foreign Key: userId 'user-456' có tồn tại trong bảng users? ✓
> - Kiểm tra Foreign Key: categoryId 'cat-123' có tồn tại? ✓
> - Lưu vào bảng transactions
> - Return ID mới: 'txn-789'
>
> **Bước 15**: Prisma tự động query thêm thông tin category:
> ```sql
> SELECT * FROM categories WHERE id = 'cat-123';
> ```
> Lấy được: {name: 'Groceries', icon: '🛒', color: '#FF6B6B'}
>
> Giờ có đầy đủ dữ liệu để trả về Frontend."

### 💡 Động tác:
- Chiếu slide với SQL query
- Có thể show live Prisma Studio hoặc pgAdmin để thấy record mới
- Highlight quan hệ giữa transactions và categories trong database

---

### **BƯỚC 16-19: RESPONSE & UI UPDATE (30 giây)**

> "**Bước 16**: Backend trả response về Frontend:
> ```json
> HTTP 201 Created
> {
>   "message": "Transaction created successfully",
>   "transaction": {
>     "id": "txn-789",
>     "amount": 500000,
>     "type": "EXPENSE",
>     "description": "Đi chợ tuần này",
>     "date": "2025-12-10T00:00:00.000Z",
>     "userId": "user-456",
>     "categoryId": "cat-123",
>     "category": {
>       "name": "Groceries",
>       "icon": "🛒",
>       "color": "#FF6B6B"
>     }
>   }
> }
> ```
>
> **Bước 17**: Frontend nhận được response → Hiển thị thông báo xanh: '✓ Transaction created successfully'
>
> **Bước 18**: Frontend tự động gọi API GET /transactions để refresh danh sách mới nhất
>
> **Bước 19**: Giao diện cập nhật:
> - Đóng popup form
> - Bảng transactions hiện thêm 1 dòng mới:
>   - 🛒 Groceries | 500,000đ | Chi tiêu | 10/12/2025 | Đi chợ tuần này
> - Màu đỏ (vì là chi tiêu)
> - Có nút Edit/Delete
>
> **Hoàn thành!** Toàn bộ quy trình từ lúc user nhập đến lúc hiển thị diễn ra trong vòng **dưới 1 giây**."

### 💡 Động tác:
- Demo live: Submit form → Thấy toast notification → Table update
- Highlight dòng mới trong bảng
- Có thể F5 refresh trang để chứng minh data đã lưu vào database

---

## PHẦN 4: BẢO MẬT & KẾT LUẬN (1 phút)

### 🎤 Script:

#### **A. Điểm Mạnh Về Bảo Mật (30 giây)**

> "Trước khi kết thúc, em muốn nhấn mạnh các tính năng bảo mật của hệ thống:
>
> **1. Authentication 2 chiều**:
> - Frontend: Lưu JWT token trong localStorage, tự động gắn vào mọi request
> - Backend: Verify token trên mọi endpoint, reject nếu không hợp lệ
>
> **2. Validation 2 lớp**:
> - Lớp 1: Client-side với React Hook Form - UX tốt, feedback nhanh
> - Lớp 2: Server-side với express-validator - bảo mật thực sự, không trust client
>
> **3. Data Isolation**:
> - Mọi query đều filter theo userId từ JWT
> - User A **không thể** xem/sửa/xóa dữ liệu của User B
> - Ví dụ: Khi GET /transactions, backend tự động thêm WHERE userId = 'user-456'
>
> **4. Database Constraints**:
> - Foreign Keys ngăn dữ liệu invalid
> - Cascade Delete tránh orphaned records
> - Enum validation cho type (chỉ INCOME hoặc EXPENSE)
>
> **5. Password Security**:
> - Hash bằng bcrypt với salt rounds = 10
> - Không bao giờ lưu plaintext password"

### 💡 Động tác:
- Chiếu slide với security checklist (tích xanh cho mỗi điểm)
- Nhấn mạnh: "Đây là best practices trong industry"

---

#### **B. Kết Luận (30 giây)**

> "Tóm lại, FinTrack là một ứng dụng full-stack hoàn chỉnh với:
>
> ✅ **Frontend**: React + TypeScript - Modern, type-safe, responsive
> ✅ **Backend**: Express + Prisma - RESTful API, layered architecture, secure
> ✅ **Database**: PostgreSQL - Relational, ACID compliance, scalable
>
> Kiến trúc 3 tầng giúp:
> - **Separation of Concerns**: Mỗi tầng có trách nhiệm riêng
> - **Maintainability**: Dễ debug, dễ mở rộng tính năng
> - **Scalability**: Có thể scale từng tầng độc lập
> - **Security**: Multiple layers of defense
>
> Đây là foundation vững chắc để phát triển thêm các tính năng như:
> - Real-time notifications
> - Data analytics & charts
> - Budget alerts
> - Export to Excel/PDF
>
> Em xin cảm ơn mọi người đã lắng nghe!"

### 💡 Động tác:
- Chiếu slide tóm tắt với sơ đồ 3 tầng + checklist tính năng
- Mỉm cười, giao tiếp bằng mắt với audience
- Sẵn sàng trả lời câu hỏi

---

## 📊 PHỤ LỤC: SLIDES ĐỀ XUẤT

### Slide 1: Title
```
KIẾN TRÚC 3 TẦNG
ỨNG DỤNG FINTRACK

Personal Finance Tracking System
[Logo hoặc screenshot app]
```

### Slide 2: Tổng Quan Hệ Thống
```
┌─────────────────────────────────────────┐
│         FRONTEND (React)                │
│  - User Interface                       │
│  - Form Validation                      │
│  - API Calls                            │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS + JWT
┌──────────────▼──────────────────────────┐
│         BACKEND (Express)               │
│  - Authentication                       │
│  - Validation                           │
│  - Business Logic                       │
└──────────────┬──────────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────────┐
│       DATABASE (PostgreSQL)             │
│  - Users, Transactions, Categories      │
│  - Data Persistence                     │
└─────────────────────────────────────────┘
```

### Slide 3: Frontend Stack
```
🎨 FRONTEND TIER

Framework: React 18 + TypeScript
Build Tool: Vite
Routing: React Router v6
Form: React Hook Form
HTTP: Axios
Styling: Tailwind CSS

Key Files:
- Transactions.tsx
- TransactionModal.tsx
- transactionService.ts
```

### Slide 4: Backend Stack
```
⚙️ BACKEND TIER

Framework: Express.js + TypeScript
ORM: Prisma
Auth: JWT (jsonwebtoken)
Validation: express-validator
Security: bcrypt, cors

Architecture:
Routes → Middleware → Controller → Database

Middleware Layers:
1️⃣ authenticate (JWT verification)
2️⃣ validation (Input validation)
3️⃣ controller (Business logic)
```

### Slide 5: Database Schema
```
💾 DATABASE TIER

PostgreSQL + Prisma ORM

┌─────────┐       ┌──────────────┐       ┌──────────┐
│  User   │───────│ Transaction  │───────│ Category │
└─────────┘  1:∞  └──────────────┘  ∞:1  └──────────┘
   │                                           │
   │ 1:∞                                   1:∞ │
   │                                           │
   └──────────────┐   ┌──────────────────────┘
                  │   │
               ┌──▼───▼──┐
               │  Budget │
               └─────────┘

Constraints:
- Foreign Keys
- Cascade Delete
- Unique Indexes
```

### Slide 6: Data Flow Diagram
```
🔄 QUY TRÌNH TẠO TRANSACTION

┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ Browser │                    │  Server │                    │ Database │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │ 1. User Submit Form          │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │                              │ 2. Verify JWT                │
     │                              │                              │
     │                              │ 3. Validate Input            │
     │                              │                              │
     │                              │ 4. INSERT Transaction        │
     │                              ├─────────────────────────────>│
     │                              │                              │
     │                              │ 5. Return New Record         │
     │                              │<─────────────────────────────┤
     │                              │                              │
     │ 6. Return JSON (201)         │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
     │ 7. Update UI                 │                              │
     │                              │                              │
```

### Slide 7: Security Features
```
🔐 BẢO MẬT & AN TOÀN

✅ Authentication
   - JWT tokens (expire after 7 days)
   - Auto-attach to requests
   - Verify on every endpoint

✅ Authorization
   - User data isolation
   - Filter by userId from JWT
   - Cannot access other users' data

✅ Validation
   - Client-side: React Hook Form
   - Server-side: express-validator
   - Database: Constraints & Types

✅ Password Security
   - bcrypt hashing (10 salt rounds)
   - Never store plaintext

✅ Data Integrity
   - Foreign key constraints
   - Cascade deletes
   - Transaction isolation
```

### Slide 8: Tech Stack Summary
```
🛠️ CÔNG NGHỆ SỬ DỤNG

Frontend:
├─ React 18.2.0
├─ TypeScript 5.3.3
├─ Vite 5.0
├─ React Router 6.21.1
├─ React Hook Form 7.49.3
├─ Axios 1.6.5
└─ Tailwind CSS 3.4.1

Backend:
├─ Node.js
├─ Express 4.18.2
├─ TypeScript 5.3.3
├─ Prisma 5.8.0
├─ jsonwebtoken 9.0.2
└─ express-validator 7.0.1

Database:
└─ PostgreSQL 16
```

### Slide 9: API Endpoints
```
📡 REST API ENDPOINTS

🔓 Public:
POST   /api/auth/register
POST   /api/auth/login

🔒 Protected (require JWT):
GET    /api/auth/me
GET    /api/transactions
GET    /api/transactions/:id
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/categories
POST   /api/categories
GET    /api/dashboard
GET    /api/budgets
POST   /api/budgets
```

### Slide 10: Kết Luận
```
✨ KẾT LUẬN

Ưu điểm của kiến trúc:
✅ Separation of Concerns
✅ Scalability
✅ Maintainability
✅ Security-first approach
✅ Type-safe (TypeScript)
✅ Modern tech stack

Khả năng mở rộng:
🚀 Real-time notifications
🚀 Data analytics & charts
🚀 Mobile app (React Native)
🚀 Export features
🚀 Multi-currency support

THANK YOU!
Questions?
```

---

## 🎯 TIPS THUYẾT TRÌNH

### ✅ Nên làm:
1. **Practice trước 3-5 lần** để thuộc flow
2. **Giữ eye contact** với audience
3. **Nói chậm, rõ ràng** - đừng vội
4. **Dùng tay chỉ vào slide** khi giải thích
5. **Smile & confident** - bạn là người hiểu code nhất!
6. **Chuẩn bị demo live** - mở sẵn tab browser, Postman, database
7. **Có backup plan** - nếu demo fail, có screenshot/video

### ❌ Không nên:
1. Đọc thuộc lòng từng chữ trên slide
2. Quay lưng nói vào màn hình
3. Nói quá nhiều thuật ngữ kỹ thuật mà không giải thích
4. Vượt quá thời gian quy định
5. Panic khi bị hỏi - cứ trả lời "Em sẽ tìm hiểu thêm về vấn đề này"

### 💡 Câu hỏi có thể bị hỏi:

**Q1: "Tại sao chọn PostgreSQL mà không phải MongoDB?"**
> "Em chọn PostgreSQL vì:
> - FinTrack cần quan hệ chặt chẽ giữa User-Transaction-Category
> - SQL database có ACID compliance - đảm bảo tính toàn vẹn dữ liệu tài chính
> - Prisma ORM support tốt cho PostgreSQL với type-safety
> - PostgreSQL có performance tốt cho complex queries và aggregations"

**Q2: "JWT token lưu ở đâu? Có bị đánh cắp không?"**
> "JWT token lưu trong localStorage của browser.
> Rủi ro: Nếu bị XSS attack có thể bị đánh cắp.
> Biện pháp phòng tránh:
> - Set expiry time (7 days)
> - Sanitize user input để tránh XSS
> - Sử dụng HTTPS trong production
> - Có thể nâng cấp: Dùng httpOnly cookies an toàn hơn localStorage"

**Q3: "Nếu 1 triệu users cùng truy cập thì sao?"**
> "Với kiến trúc hiện tại, có thể scale theo hướng:
> - Frontend: Deploy lên CDN (Vercel, Netlify)
> - Backend: Deploy multiple instances với Load Balancer
> - Database: PostgreSQL có read replicas, connection pooling
> - Cache: Thêm Redis để cache queries thường dùng
> - Monitoring: Setup logging và alerting"

**Q4: "Có test code không?"**
> "Hiện tại chưa có test automation, nhưng plan implement:
> - Unit tests cho controllers/services (Jest)
> - Integration tests cho API endpoints (Supertest)
> - E2E tests cho user flows (Playwright)
> Đây là limitation của project, sẽ cải thiện trong future iterations."

**Q5: "Security có đủ tốt không? Có thể SQL injection được không?"**
> "Security measures hiện tại:
> - ✅ SQL injection: Dùng Prisma ORM - parameterized queries tự động
> - ✅ XSS: React tự động escape output
> - ✅ Authentication: JWT với expiry
> - ✅ Authorization: Filter by userId
> - ✅ Password: bcrypt hashing
> - ✅ CORS: Chỉ accept requests từ allowed origins
> - ⚠️ Rate limiting: Chưa implement - có thể bị brute force
> - ⚠️ Input sanitization: Có basic validation nhưng có thể cải thiện"

---

## 📝 CHECKLIST TRƯỚC KHI THUYẾT TRÌNH

- [ ] Đã practice script ít nhất 3 lần
- [ ] Slides đã chuẩn bị đầy đủ (10 slides)
- [ ] Demo environment đã test (app chạy OK)
- [ ] Có backup screenshots/video nếu demo fail
- [ ] Database có sẵn sample data
- [ ] Browser DevTools biết cách mở (F12)
- [ ] Đã đọc kỹ source code (tránh bị hỏi chi tiết)
- [ ] Biết cách trả lời 5 câu hỏi phổ biến ở trên
- [ ] Đồng hồ/timer để track thời gian
- [ ] Tự tin & smile 😊

---

## ⏱️ TIMING BREAKDOWN (Tổng: ~7 phút)

| Phần | Nội dung | Thời gian |
|------|----------|-----------|
| 1 | Giới thiệu tổng quan | 30s |
| 2A | Frontend tier | 40s |
| 2B | Backend tier | 50s |
| 2C | Database tier | 30s |
| 3 | Demo quy trình (19 bước) | 3 phút |
| 4A | Bảo mật | 30s |
| 4B | Kết luận | 30s |
| 5 | Q&A buffer | 1-2 phút |

**Tip**: Nếu bị giới hạn thời gian 5 phút → Rút gọn phần 3 (demo chỉ nói overview, không đi chi tiết từng bước)

---

## 🎬 CHUẨN BỊ DEMO LIVE

### Setup trước khi thuyết trình:

1. **Terminal 1**: Chạy backend
```bash
cd server
npm run dev
```

2. **Terminal 2**: Chạy frontend
```bash
cd client
npm run dev
```

3. **Browser**: Mở sẵn các tab:
- Tab 1: http://localhost:5173 (App UI)
- Tab 2: DevTools Network tab (để show requests)
- Tab 3: Prisma Studio (để show database)

4. **Đã login sẵn** với test account

5. **Database có sample data** - ít nhất 3-5 transactions

6. **Postman**: Có sẵn collection để test API nếu cần

---

**Chúc bạn thuyết trình thành công! 🎉**

Nếu cần giải thích thêm phần nào hoặc muốn customize script theo style riêng, cứ hỏi em nhé!
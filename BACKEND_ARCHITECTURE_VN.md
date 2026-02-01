# BACKEND NODE.JS MASTERCLASS: TƯ DUY HỆ THỐNG & TRIỂN KHAI THỰC TẾ

Chào các em. Tôi là một Senior Backend Engineer với hơn 10 năm kinh nghiệm. Hôm nay tôi sẽ không dạy các em cách "code cho chạy", mà tôi sẽ dạy các em cách **tư duy** và **thiết kế** một hệ thống Backend chuẩn mực, sẵn sàng cho môi trường doanh nghiệp (Production-grade).

Tài liệu này dành cho những ai đã biết JavaScript nhưng chưa hiểu rõ "Backend thực sự hoạt động như thế nào".

---

## MỤC LỤC

1. [BACKEND FUNDAMENTALS](#1-backend-fundamentals)
2. [HTTP & REQUEST FLOW](#2-http--request-flow)
3. [BACKEND STRUCTURE (CẤU TRÚC CHUẨN)](#3-backend-structure-cấu-trúc-chuẩn)
4. [TỪNG TẦNG BACKEND (SERVER, APP, ROUTES)](#4-từng-tầng-backend-có-code)
5. [CONTROLLER & SERVICE (TRÁI TIM CỦA BACKEND)](#6-controller)
6. [MODEL & DATABASE](#8-model-mongoose)
7. [MIDDLEWARE](#9-middleware)
8. [FEATURE WALKTHROUGH: ĐĂNG KÝ/ĐĂNG NHẬP](#10-feature-đăng-ký--đăng-nhập)
9. [AUTHENTICATION (JWT)](#11-jwt-hoạt-động-như-thế-nào)
10. [ERROR HANDLING & VALIDATION](#12-validation)
11. [TƯ DUY ĐI LÀM](#15-backend-chuẩn-doanh-nghiệp-suy-nghĩ-như-thế-nào)

---

# BACKEND FUNDAMENTALS

## 1. Backend là gì? (Giải thích bằng luồng thực tế)

Hãy tưởng tượng Frontend (React/Vue/Mobile App) là **Nhà hàng (Khu vực khách ngồi)**, còn Backend là **Nhà bếp**.

- **Backend làm gì?**: Ẩn đi sự phức tạp. Khách (User) không cần biết con gà được mổ thế nào, họ chỉ cần món "Gà rán". Backend nhận yêu cầu, xử lý dữ liệu (nấu ăn), bảo mật (kiểm tra vé ăn), và trả về kết quả.
- **Frontend gửi request như thế nào?**: Thông qua giao thức **HTTP**. Giống như waiter ghi order vào giấy rồi đưa vào bếp.
- **Backend nhận request → xử lý → trả response**:
    1.  **Nhận (Receive)**: Bếp trưởng tiếp nhận order.
    2.  **Validate (Kiểm tra)**: Món này còn không? Khách có dị ứng không?
    3.  **Process (Xử lý)**: Nấu nướng, lấy nguyên liệu từ kho (Database).
    4.  **Response (Trả về)**: Đưa món ăn ra (JSON Data) hoặc báo hết món (Error).

**Ví dụ thực tế: User bấm nút LOGIN**
1.  **Frontend**: Gửi cục dữ liệu `{ username: "vuititi", password: "123" }` tới địa chỉ `POST /api/login`.
2.  **Backend**:
    -   Nhận gói tin.
    -   Mở kho (Database) tìm xem user "vuititi" có tồn tại không?
    -   So sánh password "123" (đã mã hóa) với password trong kho.
    -   Nếu đúng: Tạo một cái "vé" (Token) đưa lại cho Frontend.
    -   Nếu sai: Trả về lỗi "Sai mật khẩu".

## 2. HTTP & Request Flow

Backend và Frontend nói chuyện với nhau bằng **HTTP**.

-   **Request (Yêu cầu gửi đi)**:
    -   **Method**: `GET` (Lấy đồ), `POST` (Tạo mới/Gửi dữ liệu nhạy cảm), `PUT` (Sửa hết), `PATCH` (Sửa một phần), `DELETE` (Xóa).
    -   **Headers**: Thông tin phụ (Ví dụ: `Content-Type: application/json`, `Authorization: Bearer token...`).
    -   **Body**: Dữ liệu gửi kèm (chỉ có ở POST, PUT, PATCH). Ví dụ: thông tin user mới.

-   **Response (Phản hồi trả về)**:
    -   **Status Code**: Số hiệu tình trạng.
        -   `2xx` (200, 201): Thành công.
        -   `4xx` (400, 401, 403, 404): Lỗi do người dùng (gửi sai, không quyền, không tìm thấy).
        -   `5xx` (500): Lỗi do Server (Code lởm, sập DB).
    -   **Body**: Dữ liệu JSON (ví dụ: danh sách todo, thông tin user).

-   **Tại sao phải validate request?**: Vì **KHÔNG BAO GIỜ ĐƯỢC TIN FRONTEND**. Hacker có thể gửi request thẳng tới API mà không qua giao diện của bạn với dữ liệu rác. Backend là chốt chặn cuối cùng.

---

# BACKEND STRUCTURE (CỰC KỲ QUAN TRỌNG)

## 3. Cấu trúc thư mục Backend CHUẨN ĐI LÀM

Một dự án Backend tốt giống như một căn nhà ngăn nắp. Mọi thứ phải ở đúng chỗ của nó.

```text
src/
├── configs/        # Cấu hình (Database connect, env variables)
├── controllers/    # Người điều phối (Nhận request -> gọi service -> trả response)
├── middlewares/    # Cảnh sát/Bảo vệ (Check login, log request, validate data)
├── models/         # Bản vẽ dữ liệu (Schema Database)
├── routes/         # Bảng chỉ đường (URL nào vào controller nào)
├── services/       # LOGIC CHÍNH (Xử lý nghiệp vụ phức tạp)
├── utils/          # Công cụ hỗ trợ (Hàm helper, error class)
├── app.js          # Cấu hình Express app (Gắn middleware, routes)
└── server.js       # Khởi động server (Connect DB, listen port)
```

**LUỒNG CHẢY DỮ LIỆU (DATA FLOW):**
`Request` -> `server.js` -> `app.js` -> `Routes` -> `Middlewares` -> `Controllers` -> `Services` -> `Models` -> `Database`

---

# TỪNG TẦNG BACKEND (CÓ CODE)

## 4. server.js & app.js

**Tại sao phải tách?**
-   `app.js`: Định nghĩa logic của ứng dụng (Express app). Dùng để test (nếu cần) mà không cần start server thực sự.
-   `server.js`: Là điểm khởi chạy (Entry point), chịu trách nhiệm kết nối mạng, kết nối DB.

**`src/app.js`**
```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Logger
const routes = require('./routes'); // File index.js trong folder routes
const { errorHandlingMiddleware } = require('./middlewares/error.middleware');

const app = express();

// 1. Third-party Middlewares
app.use(cors());
app.use(express.json()); // Để đọc được body JSON
app.use(morgan('dev'));

// 2. Routes
app.use('/api/v1', routes);

// 3. Error Handling (Luôn nằm cuối cùng)
app.use(errorHandlingMiddleware);

module.exports = app;
```

**`src/server.js`**
```javascript
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối Database trước, thành công mới Start Server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });
```

## 5. Routes

**Nhiệm vụ:**
-   Chỉ làm **Bảng chỉ đường**.
-   Ánh xạ `URL` + `Method` tới một `Controller` cụ thể.
-   **KHÔNG** viết logic xử lý tại đây.

**`src/routes/auth.route.js`**
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister } = require('../middlewares/validation.middleware');

// Định nghĩa đường dẫn
router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);

module.exports = router;
```

## 6. Controller

**Nhiệm vụ:**
-   Là **Người điều phối**.
-   Nhận `req` (request) và `res` (response).
-   Lấy dữ liệu từ `req.body`, `req.params`.
-   Gọi `Service` để xử lý logic.
-   Trả kết quả về cho client (`res.status(...).json(...)`).
-   **KHÔNG** chứa logic nghiệp vụ (Ví dụ: không tính toán tiền, không trực tiếp gọi DB tìm user).

**`src/controllers/auth.controller.js`**
```javascript
const authService = require('../services/auth.service');

// Controller chỉ điều phối, data in -> service -> data out
const register = async (req, res, next) => {
  try {
    const userData = req.body;
    // Gọi Service
    const newUser = await authService.registerUser(userData);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
  } catch (error) {
    next(error); // Chuyền lỗi xuống error middleware
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Gọi Service
    const { user, accessToken } = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: { user, accessToken }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
```

## 7. Service

**Nhiệm vụ:**
-   **Logic nghiệp vụ (Business Logic)** nằm ở đây.
-   Service độc lập với Express (không biết `req`, `res` là gì).
-   Tương tác với `Model` để lấy/lưu dữ liệu.
-   Xử lý các tính toán phức tạp (Hash password, generate token, tính thuế...).
-   Nếu muốn đổi framework từ Express sang cái khác, Service vẫn giữ nguyên.

**`src/services/auth.service.js`**
```javascript
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/ApiError'); // Class lỗi tự tạo

const registerUser = async (userData) => {
  // 1. Check duplicate
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(400, 'Email already exists');
  }

  // 2. Hash password (Logic nghiệp vụ)
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // 3. Save to DB
  const newUser = await User.create({
    ...userData,
    password: hashedPassword
  });

  // Xóa field password trước khi trả về (security best practice)
  const userResponse = newUser.toObject();
  delete userResponse.password;

  return userResponse;
};

const loginUser = async (email, password) => {
  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  // 2. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  // 3. Generate Token
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user, accessToken };
};

module.exports = { registerUser, loginUser };
```

## 8. Model (Mongoose)

**Nhiệm vụ:**
-   Định nghĩa cấu trúc dữ liệu (`Schema`).
-   Là lớp giao tiếp trực tiếp với MongoDB.

**`src/models/user.model.js`**
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true }); // Tự động tạo createdAt, updatedAt

module.exports = mongoose.model('User', userSchema);
```

## 9. Middleware

**Nhiệm vụ:**
-   Đứng giữa Request và Controller.
-   Can thiệp, kiểm tra, sửa đổi request.
-   Ví dụ: Kiểm tra xem user đã đăng nhập chưa (Auth Middleware).

**`src/middlewares/auth.middleware.js`**
```javascript
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/ApiError');

const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Gắn info user vào req để controller dùng
    req.user = decoded; 
    
    // 4. Cho phép đi tiếp
    next(); 
  } catch (error) {
    next(new ApiError(403, 'Invalid token'));
  }
};

module.exports = { verifyToken };
```

---

# FEATURE HOÀN CHỈNH (LUỒNG THỰC)

## 10. Feature: ĐĂNG KÝ & ĐĂNG NHẬP

Để các em hình dung rõ ràng **Dòng chảy dữ liệu**, đây là những gì xảy ra khi User bấm **Đăng ký**:

1.  **Frontend**: Gửi `POST /api/v1/auth/register` với body `{email, password}`.
2.  **App (server)**: Nhận request, thấy url `/api/v1`, chuyển cho `Router`.
3.  **Router**: Thấy `/auth/register`, khớp với định nghĩa.
    -   Chạy `middleware validate` trước: Check email đúng dạng chưa? Password đủ dài chưa? -> OK -> `next()`.
    -   Gọi `authController.register`.
4.  **Controller**:
    -   Nhận `req.body`.
    -   Gọi `authService.registerUser(req.body)`.
5.  **Service**:
    -   Kiểm tra logic: "Email này có ai dùng chưa?".
    -   Gọi `bcrypt` để băm mật khẩu ra chuỗi loằng ngoằng.
    -   Gọi `User Model` để lưu: `User.create(...)`.
6.  **Model -> Database**: MongoDB lưu dữ liệu xuống ổ cứng. Trả kết quả về Service.
7.  **Service**: Trả dữ liệu user (đã xóa password) về Controller.
8.  **Controller**: Đóng gói JSON `{ success: true, data: user }` trả về cho Frontend (Response 201).
9.  **Frontend**: Nhận phản hồi, hiển thị thông báo "Đăng ký thành công".

---

# AUTHENTICATION

## 11. JWT hoạt động như thế nào?

Cơ chế "Không trạng thái" (Stateless). Server không cần nhớ user đã login. Server chỉ cần tin vào **chữ ký** của Token.

-   **Access Token**: Là một chuỗi mã hóa chứa thông tin user (id, role).
-   **Quy trình**:
    1.  Login đúng -> Server ký tên vào một tờ vé (Token) -> Gửi cho User.
    2.  User muốn lấy danh sách công việc (`GET /todos`) -> Gửi kèm Token.
    3.  Middleware Server kiểm tra chữ ký -> Đúng chữ ký của mình -> Cho qua.

---

# ERROR & VALIDATION

## 12. Validation

Đừng bao giờ viết `if (!email) ... if (password.length < 6) ...` trong Controller. Code sẽ rất rối. Hãy dùng thư viện như `express-validator` hoặc `Joi`.

**`src/middlewares/validation.middleware.js`**
```javascript
const { body, validationResult } = require('express-validator');
const { ApiError } = require('../utils/ApiError');

const validateRegister = [
  body('email').isEmail().withMessage('Email invalid'),
  body('password').isLength({ min: 6 }).withMessage('Min length 6'),
  (req, res, next) => {
    const errors = validationResult(req); // Gom lỗi lại
    if (!errors.isEmpty()) {
      // Ném lỗi ra error handler
      const message = errors.array().map(err => err.msg).join(', ');
      throw new ApiError(400, message);
    }
    next();
  }
];

module.exports = { validateRegister };
```

## 13. Error handling

Tại sao không `try-catch` xong `console.log` lỗi? Vì Client sẽ bị treo nếu bạn không trả response!
Hãy dùng một middleware xử lý lỗi tập trung.

**`src/middlewares/error.middleware.js`**
```javascript
// Middleware này phải có đủ 4 tham số (err, req, res, next)
const errorHandlingMiddleware = (err, req, res, next) => {
  console.error(err.stack); // Log lỗi ra console server để dev sửa

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = { errorHandlingMiddleware };
```

---

# TƯ DUY ĐI LÀM

## 14. Những lỗi người mới hay mắc

1.  **Nhét logic vào Controller (Fat Controller)**: Controller dài cả ngàn dòng. Khó bảo trì, khó test. -> **Cách sửa**: Đẩy hết logic sang Service.
2.  **Không tách Service**: Viết query DB thẳng trong Controller. Sau này muốn đổi từ MongoDB sang SQL là phải sửa lại toàn bộ Controller.
3.  **Hard-code Config**: Viết thẳng password DB, Secret Key vào code. -> **Cách sửa**: Luôn dùng biến môi trường `.env`.
4.  **Swallow Error (Nuốt lỗi)**: `try { ... } catch (e) { console.log(e) }`. Code chạy tiếp nhưng sai logic, hoặc Client quay đều không nhận được phản hồi. -> **Cách sửa**: Luôn `next(error)` hoặc trả response lỗi.

## 15. Backend chuẩn doanh nghiệp suy nghĩ như thế nào?

-   **Clean Code**: Viết code để người khác đọc, không phải để máy đọc. Tên biến, tên hàm phải có nghĩa (`getUserById`, không phải `getU`).
-   **Scalability (Mở rộng)**: Code chia tầng rõ ràng giúp dễ dàng thêm tính năng mới mà không đập đi xây lại cái cũ.
-   **Security**: Luôn nghi ngờ dữ liệu đầu vào. Validate mọi thứ. Không bao giờ lưu plain text password.

---

# KẾT LUẬN

Backend không chỉ là viết API để trả về dữ liệu. Backend là nghệ thuật của việc **tổ chức luồng dữ liệu** một cách an toàn, hiệu quả và dễ bảo trì.

Code chỉ là công cụ. Tư duy hệ thống (System Thinking) mới là thứ giúp bạn trở thành Senior. Hãy bắt đầu viết code theo cấu trúc 3 tầng (Controller - Service - Model) ngay từ dự án nhỏ nhất.

Chúc các em thành công!

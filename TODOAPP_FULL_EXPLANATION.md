# 📄 TODOAPP: GIẢI THÍCH TOÀN BỘ DỰ ÁN (BEGINNER FRIENDLY)

Chào mừng bạn đến với bản giáo trình chi tiết về dự án **Workspace TodoApp**. Đây là một ứng dụng Full-stack thực thụ, tích hợp đầy đủ tính năng hiện thực: Xác thực người dùng, Quản lý công việc và Cập nhật thời gian thực (Real-time).

---

# 📂 1. Cấu trúc thư mục & Đường dẫn file (File Paths)

Để học tốt, bạn cần biết code nằm ở đâu. Dưới đây là sơ đồ các file quan trọng:

### 🏠 Thư mục Gốc (Root)
- `/package.json`: File "tổng quản", điều phối Render build cả 2 phần Frontend/Backend.
- `/.gitignore`: Quy định những file bí mật (như `.env`) không được đưa lên GitHub.
- `/README.md`: Hướng dẫn tổng quát.
- `/PRODUCTION_DEPLOYMENT.md`: Các bước đưa app lên Render/MongoDB Atlas.

### ⚙️ Backend (Máy chủ - `/backend`)
- `/backend/server.js`: File chạy chính, khởi tạo Express và Socket.IO.
- `/backend/routes/`: Định nghĩa các đường dẫn (URLs) như `/login`, `/tasks`.
- `/backend/controllers/`: Xử lý logic khi khách gọi vào URL (ví dụ: kiểm tra pass).
- `/backend/services/`: (Đã Refactor) Chứa logic nghiệp vụ nặng (ví dụ: tạo Token, lưu DB).
- `/backend/models/`: Định nghĩa cấu trúc dữ liệu (Schema) trong MongoDB.
- `/backend/middleware/authMiddleware.js`: Cảnh sát kiểm tra Token của người dùng.

### 🎨 Frontend (Giao diện - `/frontend`)
- `/frontend/src/main.jsx`: Cửa ngõ khởi đầu của React.
- `/frontend/src/App.jsx`: Quản lý các trang và định tuyến (Routing).
- `/frontend/src/api.js`: Nơi chứa toàn bộ các lệnh gọi "Alo" về Backend.
- `/frontend/src/components/`: Các mảnh ghép giao diện (Board, Column, Sidebar).
- `/frontend/src/context/`: Quản lý trạng thái chung (Login, Sockets).
- `/frontend/src/styles.css`: Nơi giấu các thanh cuộn và làm đẹp giao diện.

---

# 2. Tổng quan dự án
- **Tính năng:** Đăng nhập, Tạo/Đổi trạng thái Task, Cập nhật Real-time giữa nhiều người dùng.
- **Luồng dữ liệu:** 
  `Người dùng` ➡️ `React (Frontend)` ➡️ `API (axios)` ➡️ `Express (Backend)` ➡️ `Mongoose` ➡️ `MongoDB (Database)`

---

# 3. Backend – Giải thích chi tiết

## 3.1 Entry point (`server.js`)
Lệnh `app = express()` tạo ra một "tòa nhà" máy chủ. Chúng ta cần `httpServer` để gộp cả **Web bình thường** và **Bộ đàm Real-time (Socket.IO)** chạy chung một cổng (PORT).

## 3.2 Middleware
Giống như bảo vệ ở sảnh tòa nhà:
- `express.json()`: Kiểm tra gói hàng khách gửi, nếu là JSON thì mở ra đọc.
- `cors()`: Kiểm tra xem khách đến từ trang web nào, nếu lạ thì đuổi về.
- `authMiddleware`: Yêu cầu khách trình thẻ JWT. Nếu thẻ hết hạn -> 401.

## 3.3 Authentication (JWT)
- **JWT (JSON Web Token)**: Là một chuỗi mã hóa gồm 3 phần, chứa ID người dùng.
- **Login Flow:**
  1. Bạn gửi Email/Pass.
  2. Server kiểm tra DB -> Đúng -> Tạo 1 chuỗi JWT bằng Secret Key.
  3. Bạn nhận chuỗi đó, lưu vào `localStorage` của trình duyệt. Từ đó về sau, mỗi lần gọi API bạn đều gửi kèm chuỗi này.

## 3.4 Database (MongoDB)
- **Mongoose Schema**: Quy định Task phải có chữ (String), ngày tháng (Date).
- **Relationship**: Mỗi Task đều có `createdBy` trỏ đến ID của một User. Đây là cách chúng ta biết "Ai là chủ của công việc này".

---

# 4. Realtime – WebSocket (Socket.IO)

## 4.1 Vì sao cần?
Nếu không có Real-time, bạn tạo 1 Task thì bạn bè của bạn phải **F5 mới thấy**. Với Socket.IO, máy chủ có thể "đập vai" máy khách và bảo: "Có task mới nè, hiện lên đi!".

## 4.2 Cơ chế "Phát loa":
- **Backend**: `io.emit("task:created", data)` -> Hét lên cho tất cả ai đang online.
- **Frontend**: `socket.on("task:created", ...)` -> Nghe thấy và tự thêm task vào màn hình.

---

# 5. Frontend – React

## 5.1 State & Hooks
- `useState`: Lưu danh sách Task. Khi có task mới, React tự vẽ lại màn hình.
- `useEffect`: Dùng để kết nối Socket ngay khi app vừa mở, và ngắt kết nối khi app đóng (để tránh tốn tài nguyên).

## 5.2 Context API
Mọi thông tin như `user` đang đăng nhập được để trong `AuthContext`. Nhờ đó, dù bạn ở trang Board hay trang Profile, app đều biết bạn là ai mà không cần truyền dữ liệu lòng vòng.

---

# 6. Biến môi trường (.env)
- **Tại sao phải dùng?** Để bảo mật. Chúng ta không đưa mật khẩu Database lên GitHub.
- **VITE_API_URL**: Giúp giao diện biết phải gọi "Alo" về địa chỉ Server nào trên internet.

---

# 7. Deploy – Đưa lên Internet

## 7.1 Render (Backend + Frontend gộp)
Dự án của bạn đặc biệt vì mình đã **gộp chung**. 
- Render sẽ chạy lệnh `npm run build` ở thư mục gốc. 
- Nó sẽ build React trước, sau đó dùng Express để "phục vụ" các file đó (Static Hosting).

## 7.2 Lỗi CORS
Nếu bạn deploy xong mà không đăng nhập được (báo lỗi đỏ ở console), thường là do bạn chưa điền đúng link web vào biến `CLIENT_ORIGIN` ở Render.

---

# 8. Tổng kết
Để giỏi Full-stack, bạn không cần học thuộc. Hãy tập trung hiểu:
1. **Request/Response**: Cách dữ liệu đi từ máy bạn về server.
2. **State Management**: Cách React quản lý những gì đang hiện lên màn hình.
3. **Database Security**: Cách bảo vệ dữ liệu người dùng qua JWT.

---
*Dự án này là nền tảng vững chắc để bạn xây dựng các app lớn hơn như Chat, E-commerce sau này. Chúc bạn học tốt!* 🚀🔥

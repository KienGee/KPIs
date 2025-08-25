# KPI Management System 📊

Hệ thống quản lý KPI cua PHO Hieu Truong cho Trường Đại học Xây dựng Hà Nội - Hanoi University of Civil Engineering

## 🎯 Tổng quan

Ứng dụng web quản lý chỉ số hiệu suất (KPI) được xây dựng với:
- **Backend**: .NET 8 Web API
- **Frontend**: Angular 16
- **Database**: SQL Server 
- **Authentication**: JWT Bearer Token + BCrypt
- **UI Framework**: Angular Material

## 🏗️ Kiến trúc hệ thống

```
KPIs/
├── src/
│   └── app/
│       ├── BE/              # Backend .NET 8 API
│       │   ├── Controllers/ # API Controllers (Auth, KPI)
│       │   ├── Services/    # Business Logic
│       │   ├── Models/      # Data Models & DTOs
│       │   ├── Data/        # Entity Framework DbContext
│       │   └── Program.cs   # App Entry Point
│       └── FE/              # Frontend Angular 16
│           ├── auth/        # Authentication Module
│           ├── dashboard/   # Dashboard Components
│           └── shared/      # Shared Components
└── README.md
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- ✅ .NET 8 SDK
- ✅ Node.js 16.20.2+
- ✅ SQL Server 
- ✅ Angular CLI 16

### 1. Backend (.NET API)

```bash
cd src/app/BE
dotnet restore
dotnet run
```

**Backend endpoints:**
- HTTP: `http://localhost:5197` ✅
- HTTPS: `https://localhost:7297` ✅
- Test: `http://localhost:5197/api/auth/test`

### 2. Frontend (Angular)

```bash
cd src/app/FE
npm install
npm start
```

**Frontend URL:** `http://localhost:4200` ✅

### 3. Database Configuration


**Cấu trúc database:**
- ✅ `Users` - Quản lý người dùng
- ✅ `Roles` - Hệ thống vai trò (5 roles)
- ✅ `UserRoles` - Liên kết user-role
- ✅ `Departments` - Phòng ban/đơn vị
- 🚧 `Kpis` - Định nghĩa KPI
- 🚧 `AssignedKpis` - Phân công KPI
- 🚧 `KpiEvaluations` - Đánh giá KPI

## 🔐 Hệ thống xác thực

### ✅ Đăng ký tài khoản mới
1. Truy cập `http://localhost:4200/login`
2. Nhấp "Đăng ký tài khoản mới"
3. Điền thông tin **BẮT BUỘC**:
   - **Tên đăng nhập**: Duy nhất, không được trùng
   - **Mật khẩu**: Bắt buộc
   - **Họ và tên**: Bắt buộc
   - **Email**: Bắt buộc, đúng định dạng `name@domain.com`
4. ✅ Hệ thống tự động gán role **"Phó Hiệu trưởng"** 

### ✅ Đăng nhập
- Sử dụng username/password đã đăng ký
- Nhận JWT token để xác thực API calls
- Session được duy trì trong localStorage

## 📋 Hệ thống vai trò (Roles)

| Role ID | Tên vai trò | Mô tả | Status |
|---------|-------------|-------|--------|
| 1 | Trưởng đơn vị | Quản lý cấp đơn vị | ✅ |
| 2 | **Phó Hiệu trưởng** | **Mặc định cho user mới** | ✅ |
| 3 | Giảng viên | Giảng viên | ✅ |
| 4 | Chuyên viên Nhận viên | Nhân viên chuyên môn | ✅ |
| 5 | Admin | Quản trị viên hệ thống | ✅ |

## 🔧 API Endpoints

### Authentication APIs
- ✅ `POST /api/auth/register` - Đăng ký user mới
- ✅ `POST /api/auth/login` - Đăng nhập
- ✅ `GET /api/auth/test` - Test API connectivity
- ✅ `GET /` - API status

### KPI Management APIs (🚧 Đang phát triển)
- 🚧 `GET /api/kpi` - Danh sách KPI
- 🚧 `POST /api/kpi` - Tạo KPI mới
- 🚧 `PUT /api/kpi/{id}` - Cập nhật KPI
- 🚧 `DELETE /api/kpi/{id}` - Xóa KPI

## 🎨 Giao diện người dùng

### ✅ Trang đăng nhập
- Form đăng nhập với real-time validation
- Chuyển đổi liền mạch sang form đăng ký
- Responsive design với Angular Material
- Error handling và success messages

### 🚧 Dashboard (Đang phát triển)
- Tổng quan KPI cá nhân
- Biểu đồ thống kê
- Quản lý KPI được giao

## 🔒 Bảo mật

- ✅ **Password hashing**: BCrypt với salt
- ✅ **JWT Authentication**: Secure Bearer token
- ✅ **CORS**: Configured cho Angular frontend
- ✅ **Input validation**: Frontend + Backend validation
- ✅ **SQL injection protection**: Entity Framework parameterized queries
- ✅ **Email validation**: Regex pattern matching
- ✅ **Unique constraints**: Username và Email unique

Backend API sẽ chạy tại:
- HTTPS: `https://localhost:7297`
- HTTP: `http://localhost:5197`
- Swagger UI: `https://localhost:7297/swagger`

### 3. Cài đặt Database

## 🌟 Tính năng hiện tại

### ✅ **Đã hoàn thành và hoạt động:**
- 🔐 Hệ thống đăng ký/đăng nhập hoàn chỉnh
- 👥 Quản lý user và role system
- 🔑 JWT authentication với BCrypt hashing
- 📧 Email validation đầy đủ
- 📱 Responsive UI với Angular Material
- 🛡️ CORS configuration cho security
- 💾 Database integration với SQL Server VM
- ⚡ Real-time form validation
- 🎯 Auto role assignment (Phó Hiệu trưởng)

### 🚧 **Đang phát triển:**
- 📊 Dashboard KPI overview
- 🏢 Quản lý phòng ban chi tiết
- 📈 Báo cáo và thống kê
- 🔐 Phân quyền nâng cao
- 📋 CRUD operations cho KPI

## 📱 Responsive Design

Giao diện được tối ưu cho:
- 💻 **Desktop**: Full features
- 📱 **Mobile**: Touch-friendly
- 📲 **Tablet**: Adaptive layout

## 🐛 Troubleshooting

### Backend không khởi động
```bash
# Kill existing processes
taskkill /F /IM "dotnet.exe"

# Restart fresh
cd src/app/BE
dotnet run
```

### Frontend compilation errors  
```bash
cd src/app/FE
npm install
npm start
```

### Database connection issues
- ✅ Test connection string trong `appsettings.json`

### Email validation không hoạt động
- ✅ Đảm bảo email format: `name@domain.com`
- ✅ Không để trống field email
- ✅ Check unique constraint

## 👥 Team & Credits

**Developed for:** Trường Đại học Xây dựng Hà Nội  
**Architecture:** Full-stack web application  
**Development:** 2025

## 📄 Technical Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | Angular | 16.0+ |
| Backend | .NET | 8.0+ |
| Database | SQL Server | 2019+ |
| Auth | JWT + BCrypt | Latest |
| UI | Angular Material | 16.0+ |
| HTTP Client | Angular HTTP | 16.0+ |

## 📞 Support & Contact

- **Repository**: [KienGee/KPIs](https://github.com/KienGee/KPIs)
- **Issues**: GitHub Issues tab
- **Email**: support@nuce.edu.vn

---

## 🎉 Project Status

**✅ PRODUCTION READY cho Authentication Module**

| Module | Status | Description |
|---------|--------|-------------|
| 🔐 Auth System | ✅ **LIVE** | Login/Register hoàn chỉnh |
| 👥 User Management | ✅ **LIVE** | CRUD users + roles |
| 📊 KPI Dashboard | 🚧 **DEVELOPMENT** | Đang xây dựng |
| 📈 Reports | 🚧 **PLANNING** | Sắp triển khai |

**Phiên bản hiện tại**: `v1.0.0-auth`  
**Cập nhật cuối**: 25/08/2025  
**Trạng thái hệ thống**: 🟢 **ONLINE & STABLE**

---


*🚀 Angular 16 + .NET 8 + SQL Server*
├── src/
│   ├── app/
│   │   ├── BE/                    # Backend .NET API
│   │   │   ├── Controllers/       # API Controllers
│   │   │   ├── Data/             # Entity Framework DbContext
│   │   │   ├── Models/           # Data Models & DTOs
│   │   │   ├── Services/         # Business Logic Services
│   │   │   ├── Properties/       # Launch Settings
│   │   │   ├── appsettings.json  # Configuration
│   │   │   ├── Program.cs        # API Startup
│   │   │   └── KpiApi.csproj     # Project File
│   │   ├── FE/                   # Frontend Angular
│   │   │   ├── auth/             # Authentication Module
│   │   │   ├── dashboard/        # Dashboard Module
│   │   │   └── nginx.conf        # Nginx Configuration
│   │   ├── shared/               # Shared Services
│   │   │   └── services/         # Angular Services
│   │   └── DB/                   # Legacy DB files (không dùng)
│   ├── environments/             # Angular Environments
│   └── assets/                   # Static Assets
├── package.json                  # Angular Dependencies
└── README.md                     # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký người dùng
- `GET /api/auth/user/{id}` - Lấy thông tin người dùng

### KPI Management
- `GET /api/kpi` - Lấy danh sách KPI
- `POST /api/kpi` - Tạo KPI mới
- `PUT /api/kpi/{id}` - Cập nhật KPI
- `DELETE /api/kpi/{id}` - Xóa KPI
- `GET /api/kpi/assigned` - Lấy KPI được phân công
- `GET /api/kpi/assigned/user/{userId}` - Lấy KPI của người dùng

### Department Management
- `GET /api/department` - Lấy danh sách phòng ban
- `POST /api/department` - Tạo phòng ban mới
- `PUT /api/department/{id}` - Cập nhật phòng ban
- `DELETE /api/department/{id}` - Xóa phòng ban

## Xử lý sự cố

### 1. Lỗi kết nối Database
- Kiểm tra SQL Server service đang chạy
- Xác nhận connection string đúng
- Đảm bảo database đã được tạo

### 2. Lỗi CORS khi gọi API
- Kiểm tra CORS policy trong `Program.cs`
- Đảm bảo Angular dev server chạy trên port 4200

### 3. Lỗi SSL Certificate
- Thêm `TrustServerCertificate=True` vào connection string
- Hoặc cài đặt dev certificate: `dotnet dev-certs https --trust`

### 4. Lỗi JWT Token
- Kiểm tra JWT settings trong `appsettings.json`
- Đảm bảo secret key đủ dài (ít nhất 256 bits)


### Debugging
- Frontend: Sử dụng Chrome DevTools
- Backend: Sử dụng Visual Studio hoặc VS Code với C# extension

## Triển khai Production

1. Build Angular app: `ng build --prod`
2. Publish .NET API: `dotnet publish -c Release`
3. Cấu hình Nginx reverse proxy
4. Cài đặt SSL certificate
5. Cấu hình connection string cho production database

## Liên hệ

Nếu có vấn đề về kỹ thuật, vui lòng tạo issue hoặc liên hệ team phát triển.

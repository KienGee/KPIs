-- Tạo database nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'KPI_Management')
BEGIN
    CREATE DATABASE [KPI_Management]
END
GO

USE [KPI_Management]
GO

-- Tạo bảng Departments
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Departments' AND xtype='U')
CREATE TABLE Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName NVARCHAR(150) NOT NULL,
    ParentDepartmentId INT NULL,
    FOREIGN KEY (ParentDepartmentId) REFERENCES Departments(DepartmentId)
);

-- Tạo bảng Roles
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL UNIQUE
);

-- Tạo bảng Users
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NULL UNIQUE,
    DepartmentId INT NULL,
    JobTitle NVARCHAR(100) NULL,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId)
);

-- Tạo bảng UserRoles
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserRoles' AND xtype='U')
CREATE TABLE UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE
);

-- Tạo bảng Kpis
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Kpis' AND xtype='U')
CREATE TABLE Kpis (
    KpiId INT IDENTITY(1,1) PRIMARY KEY,
    KpiName NVARCHAR(255) NOT NULL,
    Description NTEXT NULL,
    KpiType NVARCHAR(20) NULL,
    MeasurementUnit NVARCHAR(50) NULL
);

-- Tạo bảng EvaluationPeriods
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EvaluationPeriods' AND xtype='U')
CREATE TABLE EvaluationPeriods (
    PeriodId INT IDENTITY(1,1) PRIMARY KEY,
    PeriodName NVARCHAR(100) NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL
);

-- Tạo bảng AssignedKpis
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AssignedKpis' AND xtype='U')
CREATE TABLE AssignedKpis (
    AssignedKpiId INT IDENTITY(1,1) PRIMARY KEY,
    KpiId INT NOT NULL,
    PeriodId INT NOT NULL,
    AssigneeUserId INT NULL,
    AssigneeDepartmentId INT NULL,
    TargetValue FLOAT NULL,
    WeightPercent INT NULL,
    FOREIGN KEY (KpiId) REFERENCES Kpis(KpiId) ON DELETE CASCADE,
    FOREIGN KEY (PeriodId) REFERENCES EvaluationPeriods(PeriodId) ON DELETE CASCADE,
    FOREIGN KEY (AssigneeUserId) REFERENCES Users(UserId) ON DELETE SET NULL,
    FOREIGN KEY (AssigneeDepartmentId) REFERENCES Departments(DepartmentId) ON DELETE SET NULL
);

-- Tạo bảng KpiEvaluations
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='KpiEvaluations' AND xtype='U')
CREATE TABLE KpiEvaluations (
    EvaluationId INT IDENTITY(1,1) PRIMARY KEY,
    AssignedKpiId INT NOT NULL,
    SelfAssessedScore FLOAT NULL,
    SelfComment NTEXT NULL,
    ManagerAssessedScore FLOAT NULL,
    ManagerComment NTEXT NULL,
    FinalScore FLOAT NULL,
    Status NVARCHAR(30) NULL,
    FOREIGN KEY (AssignedKpiId) REFERENCES AssignedKpis(AssignedKpiId) ON DELETE CASCADE
);

-- Tạo bảng EvaluationAttachments
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EvaluationAttachments' AND xtype='U')
CREATE TABLE EvaluationAttachments (
    AttachmentId INT IDENTITY(1,1) PRIMARY KEY,
    EvaluationId INT NOT NULL,
    FileName NVARCHAR(255) NULL,
    FilePath NVARCHAR(255) NULL,
    FOREIGN KEY (EvaluationId) REFERENCES KpiEvaluations(EvaluationId) ON DELETE CASCADE
);

-- Tạo bảng FinalResults
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FinalResults' AND xtype='U')
CREATE TABLE FinalResults (
    ResultId INT IDENTITY(1,1) PRIMARY KEY,
    PeriodId INT NOT NULL,
    UserId INT NULL,
    DepartmentId INT NULL,
    TotalKpiScore FLOAT NULL,
    CompletionLevel NVARCHAR(50) NULL,
    FinalRank NVARCHAR(5) NULL,
    FOREIGN KEY (PeriodId) REFERENCES EvaluationPeriods(PeriodId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE SET NULL,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(DepartmentId) ON DELETE SET NULL
);

-- Thêm dữ liệu mẫu
-- Departments
INSERT INTO Departments (DepartmentName, ParentDepartmentId) VALUES 
('Ban Giám hiệu', NULL),
('Phòng Đào tạo', 1),
('Phòng Khoa học Công nghệ', 1),
('Khoa Công nghệ Thông tin', 2),
('Khoa Kinh tế', 2);

-- Roles
INSERT INTO Roles (RoleName) VALUES 
('Admin'),
('Manager'),
('Employee'),
('HR');

-- Users (password: "123456" được hash)
INSERT INTO Users (Username, PasswordHash, FullName, Email, DepartmentId, JobTitle) VALUES 
('admin', '$2a$11$9XyY8s1Oq4V3mU7L2N8pEu5Q3w7R9T1K6M8X4C2V9B3N7L5D8F6G0', 'Quản trị viên', 'admin@university.edu.vn', 1, 'Quản trị hệ thống'),
('manager1', '$2a$11$9XyY8s1Oq4V3mU7L2N8pEu5Q3w7R9T1K6M8X4C2V9B3N7L5D8F6G0', 'Trưởng phòng Đào tạo', 'manager1@university.edu.vn', 2, 'Trưởng phòng'),
('employee1', '$2a$11$9XyY8s1Oq4V3mU7L2N8pEu5Q3w7R9T1K6M8X4C2V9B3N7L5D8F6G0', 'Nguyễn Văn A', 'nguyenvana@university.edu.vn', 4, 'Giảng viên'),
('employee2', '$2a$11$9XyY8s1Oq4V3mU7L2N8pEu5Q3w7R9T1K6M8X4C2V9B3N7L5D8F6G0', 'Trần Thị B', 'tranthib@university.edu.vn', 5, 'Giảng viên');

-- UserRoles
INSERT INTO UserRoles (UserId, RoleId) VALUES 
(1, 1), -- admin có role Admin
(2, 2), -- manager1 có role Manager
(3, 3), -- employee1 có role Employee
(4, 3); -- employee2 có role Employee

-- KPIs
INSERT INTO Kpis (KpiName, Description, KpiType, MeasurementUnit) VALUES 
('Số lượng bài báo khoa học', 'Số bài báo khoa học được công bố trong năm', 'Quantitative', 'Bài'),
('Điểm đánh giá sinh viên', 'Điểm đánh giá của sinh viên về giảng viên', 'Qualitative', 'Điểm'),
('Số giờ giảng dạy', 'Tổng số giờ giảng dạy trong học kỳ', 'Quantitative', 'Giờ'),
('Tỷ lệ hoàn thành công việc', 'Tỷ lệ hoàn thành các nhiệm vụ được giao', 'Percentage', '%');

-- EvaluationPeriods
INSERT INTO EvaluationPeriods (PeriodName, StartDate, EndDate) VALUES 
('Học kỳ 1 năm 2024-2025', '2024-09-01', '2025-01-31'),
('Học kỳ 2 năm 2024-2025', '2025-02-01', '2025-06-30');

-- AssignedKpis
INSERT INTO AssignedKpis (KpiId, PeriodId, AssigneeUserId, AssigneeDepartmentId, TargetValue, WeightPercent) VALUES 
(1, 1, 3, NULL, 2, 30),
(2, 1, 3, NULL, 8.5, 25),
(3, 1, 3, NULL, 120, 25),
(4, 1, 3, NULL, 90, 20),
(1, 1, 4, NULL, 1, 30),
(2, 1, 4, NULL, 8.0, 25),
(3, 1, 4, NULL, 100, 25),
(4, 1, 4, NULL, 85, 20);

PRINT 'Database và dữ liệu mẫu đã được tạo thành công!';

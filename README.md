# 🏛️ KPI Management System - Hanoi University of Civil Engineering

A comprehensive web-based KPI (Key Performance Indicator) management system built with Angular and Angular Material for tracking and analyzing university performance metrics.

## 🚀 Features

### 📊 Dashboard
- **User Authentication** - Secure login system with mock authentication
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Collapsible Sidebar** - Easy navigation between different sections
- **University Branding** - Complete with HUCE logo and styling

### 📈 KPI Management
- **Unit Selection** - Choose from different university departments
- **Multi-category KPIs**:
  - **Functional KPIs** (Chức năng) - Core operational metrics
  - **Target KPIs** (Mục tiêu) - Strategic goal tracking
  - **Compliance KPIs** (Tuân thủ) - Regulatory compliance monitoring
- **Data Tables** - Sortable and responsive tables with detailed metrics
- **Real-time Calculations** - Automatic score calculations and totals

### 🤖 Analytics & Reporting
- **Visual Charts** - Mock pie charts for data visualization
- **AI Insights** - Automated analysis and recommendations
- **Export Functions** - Excel export capabilities (in development)
- **Report Generation** - Comprehensive reporting tools (in development)

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 15+
- **UI Library**: Angular Material
- **Styling**: SCSS/CSS with responsive design
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.x or higher)
- **npm** (version 8.x or higher)
- **Angular CLI** (version 15.x or higher)

```bash
# Check versions
node --version
npm --version
ng version
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KPIs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular Material** (if not already installed)
   ```bash
   ng add @angular/material
   ```

## 🚀 Running the Application

### Development Server
```bash
npm start
# or
ng serve
```
Navigate to `http://localhost:4200/` in your browser.

### Production Build
```bash
npm run build
# or
ng build --prod
```
The build artifacts will be stored in the `dist/` directory.

## 📱 Usage

### 1. Login
- Navigate to `http://localhost:4200/login`
- Use any credentials to login (mock authentication)
- System will redirect to dashboard upon successful login

### 2. Dashboard Navigation
- **Tổng quan** - Overview and welcome screen
- **KPI Đơn vị** - Unit KPI management and viewing
- **Báo cáo** - Reports and analytics (placeholder)
- **Cài đặt** - System settings (placeholder)

### 3. KPI Management
- Select a unit from the dropdown
- Browse through different KPI categories using tabs
- View detailed metrics in sortable tables
- Generate AI insights for performance analysis
- Export data or generate reports

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/                 # Login component
│   │   └── services/              # Authentication service
│   ├── dashboard/                 # Main dashboard component
│   ├── unit-kpi-view/            # KPI viewing component
│   ├── shared/                   # Shared components and services
│   ├── app-routing.module.ts     # Application routing
│   ├── app.module.ts             # Main application module
│   └── app.component.*           # Root component
├── assets/
│   └── images/                   # University logos and images
└── styles.css                   # Global styles
```

## 🎨 Components Overview

### LoginComponent
- Full-screen login interface
- University branding
- Reactive form validation
- Mock authentication integration

### DashboardComponent
- Responsive sidebar navigation
- Header with user info and logout
- Content area with routing
- Collapsible menu functionality

### UnitKpiViewComponent
- Angular Material data tables
- Tab-based navigation
- Form controls for unit selection
- Chart visualization
- Action buttons for export/analysis

## 🔐 Authentication

Currently uses **mock authentication** for demonstration purposes:
- Any username/password combination will work
- JWT token simulation
- Automatic redirect handling
- Session management

> **Note**: Replace with real authentication service for production use.

## 🎯 Mock Data

The application includes comprehensive mock data for:
- **University Units**: Different departments and faculties
- **KPI Metrics**: Sample performance indicators with targets and actual values
- **Scoring System**: Automated calculations based on performance
- **AI Insights**: Simulated intelligent analysis

## 🚧 Development Status

### ✅ Completed Features
- ✅ User authentication and routing
- ✅ Responsive dashboard layout
- ✅ KPI data tables with Angular Material
- ✅ Tab-based navigation
- ✅ Mock data integration
- ✅ AI insights simulation
- ✅ University branding

### 🔄 In Development
- 🔄 Excel export functionality
- 🔄 PDF report generation
- 🔄 Real chart integration (Chart.js/D3.js)
- 🔄 Database integration
- 🔄 Real-time data updates

### 📋 Planned Features
- 📋 User role management
- 📋 Advanced filtering and search
- 📋 Email notifications
- 📋 Data import capabilities
- 📋 Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Angular Material styling not working**
   ```bash
   # Ensure Material theme is imported
   npm install @angular/material @angular/cdk @angular/animations
   ```

2. **Build errors related to paths**
   ```bash
   # Clean and rebuild
   rm -rf dist/
   ng build
   ```

3. **Development server not starting**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules/
   npm install
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏫 About Hanoi University of Civil Engineering

This KPI management system is designed specifically for Hanoi University of Civil Engineering (HUCE) to track and manage institutional performance indicators according to Decision 1125/QD-DHXDHN.

## 📞 Support

For support and questions, please contact:
- **Email**: [your-email@huce.edu.vn]
- **Phone**: [your-phone-number]
- **Address**: Hanoi University of Civil Engineering, Vietnam

---
**Built with ❤️ for Hanoi University of Civil Engineering**

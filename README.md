# Full-Stack Task Management System

A comprehensive sample project demonstrating modern full-stack development with:
- **Frontend**: Angular 17+ with Kendo UI
- **Backend**: .NET 8 Web API with Entity Framework Core
- **Database**: SQL Server with LINQ queries
- **Authentication**: JWT-based authentication
- **Real-time**: SignalR for live updates

## Project Structure

```
/
├── backend/                 # .NET Core Web API
│   ├── TaskManagement.API/
│   ├── TaskManagement.Core/
│   ├── TaskManagement.Data/
│   └── TaskManagement.Tests/
├── frontend/               # Angular + Kendo UI
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
│   ├── package.json
│   └── angular.json
└── README.md

```

## Features

### 🚀 Backend (.NET Core API)
- RESTful API with Entity Framework Core
- JWT Authentication & Authorization
- LINQ queries for data operations
- Repository pattern implementation
- Swagger API documentation
- SignalR for real-time updates

### 🎨 Frontend (Angular + Kendo UI)
- Modern Angular application
- Kendo UI components (Grid, DatePicker, DropDownList, etc.)
- Reactive forms with validation
- HTTP interceptors for authentication
- Real-time notifications with SignalR
- Responsive design

### 📊 Database Features
- Entity Framework Code-First approach
- Complex LINQ queries
- Database migrations
- Seed data for testing

## Getting Started

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio Code or Visual Studio

### Backend Setup
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run --project TaskManagement.API
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Learning Path

This project is designed to teach you:

1. **Backend Development**
   - .NET Core Web API architecture
   - Entity Framework Core ORM
   - LINQ query techniques
   - Authentication & Authorization
   - API design patterns

2. **Frontend Development**
   - Angular framework fundamentals
   - Kendo UI component integration
   - State management
   - HTTP client usage
   - Real-time communication

3. **Full-Stack Integration**
   - API consumption
   - Authentication flow
   - Data binding
   - Error handling
   - Performance optimization

## Technologies Used

- **Backend**: .NET 8, Entity Framework Core, SQL Server, SignalR, JWT
- **Frontend**: Angular 17, Kendo UI, TypeScript, RxJS
- **Tools**: Angular CLI, .NET CLI, Entity Framework tools

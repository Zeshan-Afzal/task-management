# Task Management App

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Ant Design for the frontend UI.

## Features

- **User Authentication**: JWT-based authentication with signup, login, and logout functionality
- **Task Management**: Full CRUD operations for tasks
- **Task Filtering**: Filter tasks by status (Pending, In Progress, Completed)
- **Modern UI**: Beautiful and responsive interface using Ant Design
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Form Validation**: Comprehensive form validation for all inputs
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Ant Design** - UI component library
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **dayjs** - Date manipulation

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Task-management-app
```

### 2. Backend Setup

```bash
cd server
npm install
```

### 3. Frontend Setup

```bash
cd client/task-manager-frontend
npm install
```

### 4. Start the Application

#### Start the Backend Server

```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:3005`

#### Start the Frontend Development Server

```bash
cd client/task-manager-frontend
npm run dev
```

The frontend application will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/sign_up` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires authentication)

### Tasks
- `GET /api/task/get-tasks` - Get all tasks (requires authentication)
- `GET /api/task/get-task/:id` - Get task by ID (requires authentication)
- `POST /api/task/create` - Create new task (requires authentication)
- `PUT /api/task/update-task/:taskId` - Update task (requires authentication)
- `DELETE /api/task/delete-task/:id` - Delete task (requires authentication)

## Usage

1. **Sign Up**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View all your tasks with statistics
4. **Create Task**: Click "Add New Task" to create a new task
5. **Edit Task**: Click the "Edit" button to modify task details
6. **Update Status**: Use the "Status" dropdown to change task status
7. **Delete Task**: Click "Delete" to remove a task
8. **Filter Tasks**: Use the status filter to view specific task types
9. **Logout**: Click the logout button to sign out

## Features in Detail

### Task Management
- **Create**: Add new tasks with title, description, due date, and status
- **Read**: View all tasks in a sortable and filterable table
- **Update**: Edit task details and update status
- **Delete**: Remove tasks with confirmation

### Authentication
- **Secure**: JWT-based authentication with password hashing
- **Persistent**: Automatic login state management
- **Protected Routes**: Unauthorized users are redirected to login

### UI/UX
- **Responsive**: Works on all device sizes
- **Modern**: Clean and professional design using Ant Design
- **Interactive**: Loading states, success/error messages, and confirmations
- **Accessible**: Proper form labels and keyboard navigation

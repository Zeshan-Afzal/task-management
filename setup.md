# Setup Instructions

## Environment Configuration

### Backend (.env file)
Create a `.env` file in the `server` directory with the following content:

```env
PORT=3005
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_super_secret_jwt_key_2024
CORS_ORIGIN=http://localhost:5173
```

### Frontend Configuration
The frontend is already configured to connect to `http://192.168.1.60:3005`. If you need to change this, update the `API_BASE_URL` in `client/task-manager-frontend/src/services/api.js`.

## Starting the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Start Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Start Frontend
```bash
cd client/task-manager-frontend
npm install
npm run dev
```

## Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3005

## Features Implemented

✅ **Backend (Node.js + Express + MongoDB)**
- Express.js RESTful APIs
- MongoDB with Mongoose
- JWT-based authentication
- CRUD operations on tasks
- Task filtering by status
- Proper error handling

✅ **Frontend (React + Ant Design)**
- React with Vite
- Ant Design UI components
- User authentication (login/signup/logout)
- Task list with filters
- Create, edit, delete tasks
- Mark tasks as completed
- Ant Design Table with sorting & filtering
- Ant Design Modal for add/edit tasks
- Ant Design Form with validation

✅ **Bonus Features**
- React Query for data fetching
- Modern, responsive UI
- Loading states and error handling
- Protected routes
- Persistent authentication

## API Endpoints

### Authentication
- `POST /api/auth/sign_up` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/task/get-tasks` - Get all tasks
- `GET /api/task/get-task/:id` - Get specific task
- `POST /api/task/create` - Create new task
- `PUT /api/task/update-task/:taskId` - Update task
- `DELETE /api/task/delete-task/:id` - Delete task

## Task Status Options
- `pending` - Task is pending
- `in_progress` - Task is in progress
- `completed` - Task is completed 
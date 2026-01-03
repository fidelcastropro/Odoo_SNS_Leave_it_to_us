# GlobeTrotter Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- Git

## Database Setup

1. Install MySQL and create database:
```sql
CREATE DATABASE globetrotter;
```

2. Import the schema:
```bash
mysql -u root -p globetrotter < database/schema.sql
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=globetrotter
```

4. Start backend server:
```bash
npm run dev
```

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Default Test Data

The database includes sample cities and activities:
- Paris, Tokyo, New York, London
- Various activities for each city

## Features Implemented

✅ User Registration/Login
✅ Dashboard with trip overview
✅ Create new trips
✅ Trip details with itinerary builder
✅ City search and selection
✅ Budget estimation
✅ Responsive design
✅ Professional UI with Tailwind CSS

## Next Steps

- Add activity search and booking
- Implement trip sharing
- Add calendar/timeline view
- Budget breakdown charts
- User profile management
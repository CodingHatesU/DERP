# DERP - College ERP System

A full-stack College Enterprise Resource Planning (ERP) system built with a Spring Boot backend and a Next.js frontend.

## Tech Stack

**Backend:**
*   Java 17
*   Spring Boot 3
*   Spring Security
*   Spring Data MongoDB
*   Maven

**Frontend:**
*   Next.js 15
*   React 19
*   TypeScript
*   Tailwind CSS 4
*   shadcn/ui
*   React Hook Form & Zod

## Features

*   **Authentication**: Role-based authentication (Admin, Student) with Basic Auth.
*   **Student Management**: Admins can perform CRUD operations on student records.
*   **Course Management**: Admins can manage the course catalog (CRUD), while students can view available courses.
*   **Attendance Tracking**: Admins can manage student attendance records.

## Prerequisites

Before you begin, ensure you have the following installed:
*   JDK 17 or later
*   Maven
*   Node.js v20 or later
*   A running MongoDB instance

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Backend Setup

First, navigate to the backend directory:
```bash
cd backend
```

The backend needs to connect to a MongoDB database. You will need to create an `application.properties` file inside `src/main/resources` and add your database connection details.

Create `src/main/resources/application.properties` and add the following:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/derp
```
*(Adjust the URI if your MongoDB instance is running elsewhere)*

Now, you can run the backend server:
```bash
./mvnw spring-boot:run
```
The backend API will be available at `http://localhost:8080`.

### 2. Frontend Setup

In a new terminal, navigate to the frontend directory:
```bash
cd frontend
```

Install the required npm packages:
```bash
npm install
```

Run the frontend development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## API Endpoints

The backend provides a RESTful API for managing the ERP's resources. For detailed information on each endpoint, including request/response examples, please see the `backend/routes.md` file.

*   `/api/auth` - User registration and login.
*   `/api/students` - Student management (Admin only).
*   `/api/courses` - Course management (Admin for CRUD, Student for Read).
*   `/api/attendance` - Attendance tracking (Admin only).

## Project Structure

The project is organized into two main directories:

*   `backend/`: Contains the Spring Boot application, including controllers, services, models, and repositories.
*   `frontend/`: Contains the Next.js application, with pages, components, and services for interacting with the backend API. 
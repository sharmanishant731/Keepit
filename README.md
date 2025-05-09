# Keepit - A Notes App with User Authentication

## Project Screenshots

![Landing Page](frontend/public/LandingPage.png)
![Register](frontend/public/Register.png)
![Login](frontend/public/Login.png)
![User Page 1](frontend/public/UserPage1.png)
![User Page 2](frontend/public/UserPage2.png)
![Forgot Password](frontend/public/ForgotPassword.png)
![Reset Password](frontend/public/ResetPassword.png)

Keepit is a full-stack web application designed to help users manage their notes securely and efficiently. It features user authentication, an admin panel, OTP verification, and full CRUD operations for notes. This README provides a detailed overview of the project, its features, and how to set it up and use it.

## What is Keepit?

Keepit is a note-taking application where users can register, log in, and manage their personal notes. It includes an admin panel for managing users and uses modern security practices to protect user data.

## Key Features

### 1. User Authentication

- Users can register and log in securely.
- Passwords are hashed using **bcrypt**, a strong hashing algorithm, to ensure password security.
- Authentication is managed using **JWT (JSON Web Tokens)** to maintain user sessions securely.
- Password reset and forgot password functionality are included.

### 2. Admin Panel

- Admin users have special privileges to manage other users.
- Admins can view and delete users.
- Admin routes are protected and require admin authentication.

### 3. OTP (One-Time Password) Mechanism

- OTP is used for verifying user actions such as registration or password reset.
- OTPs are generated and sent via email using a server-based SMTP service with **Nodemailer**.
- The backend handles OTP generation, validation, and expiration securely.

### 4. Notes Management (CRUD Operations)

- Users can create, read, update, and delete their notes.
- Notes are stored securely in the backend database.
- The frontend provides an intuitive interface for managing notes.

## Technologies Used

### Backend

- **Node.js** and **Express.js** for building the RESTful API server.
- **MongoDB** for data storage.
- **bcrypt** for password hashing.
- **jsonwebtoken** for authentication tokens.
- **Nodemailer** for sending emails (OTP).
- Custom middleware for authentication and authorization.
- Organized folder structure with models, routes, middleware, and utilities.

### Frontend

- **React.js** for building the user interface.
- React Context API for managing authentication state.
- CSS Modules and **Tailwind CSS** for styling.
- Components and pages structured for scalability and maintainability.

## Project Structure

- `backend/`: Contains the server code, including:
  - `models/`: Data models for users, notes, OTPs.
  - `routes/`: API endpoints for authentication, notes, admin, OTP, and user management.
  - `middleware/`: Authentication and authorization middleware.
  - `utils/`: Helper functions like email sending.
  - `server.js`: Entry point of the backend server.

- `frontend/`: Contains the React application, including:
  - `src/components/`: Reusable UI components.
  - `src/context/`: React context for authentication.
  - `src/pages/`: Different pages like Login, Register, Notes, AdminUsers, ForgotPassword, PasswordReset, Landing.
  - `public/`: Static assets like `index.html`, favicon and project screenshots.
  - Configuration files for Tailwind CSS and PostCSS.

## How It Works

1. **User Registration and Login**
   - Users register with an email and password.
   - Passwords are hashed with bcrypt before storing.
   - Upon login, a JWT token is issued for session management.

2. **OTP Verification**
   - When required (e.g., registration, password reset), an OTP is generated and emailed to the user.
   - The user submits the OTP to verify their action.

3. **Notes Management**
   - Authenticated users can create new notes, view their existing notes, update them, or delete them.
   - All note operations are protected and require valid authentication.

4. **Admin Panel**
   - Admin users can manage other users through protected admin routes.
   - Admin authentication is required to access these routes.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables for:
   - Database connection string.
   - JWT secret keys.
   - Email service credentials for sending OTPs.
4. Start the backend server:
   ```
   npm run dev
   ```

## Environment Variables (.env)

The project uses a `.env` file to manage environment-specific configuration variables securely and conveniently. This file should be placed in the `backend` directory and should never be committed to version control to protect sensitive information.

### What is a `.env` file?

A `.env` file is a plain text file that contains key-value pairs of environment variables. These variables are loaded into the application at runtime to configure settings such as database connections, authentication secrets, and email service credentials.

### Typical Variables in `.env`

Here are some environment variables you need to define in your `.env` file for this project:

- `MONGODB_URI` - The connection string for your MongoDB database.
- `JWT_SECRET` - Secret key used to sign JSON Web Tokens for authentication.
- `EMAIL_USER` - Email address used to send OTP emails.
- `EMAIL_PASS` - Password or app-specific password for the email account.
- `EMAIL_HOST` - SMTP host for the email service.
- `EMAIL_PORT` - SMTP port number for the email service.

### How to create the `.env` file

1. In the `backend` directory, create a file named `.env`.
2. Add the required variables in the format `KEY=VALUE`, for example:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/mydatabase
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   ```

3. Save the file.

### Security Best Practices

- Do **not** commit your `.env` file to any public repository.
- Use `.gitignore` to exclude the `.env` file from version control.
- Keep your secret keys and passwords secure and rotate them periodically.

### How the backend uses `.env`

The backend server loads these environment variables at startup using packages like `dotenv`. This allows the application to access sensitive configuration without hardcoding them in the source code.

Make sure to create and configure your `.env` file correctly before starting the backend server to avoid runtime errors.

### Frontend

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```

## Usage

- Open your browser and go to the URL provided by the React development server (usually `http://localhost:3000`).
- Register a new user or log in with existing credentials.
- Use the interface to create, view, update, and delete notes.
- Admin users can access the admin panel to manage users.

## Additional Notes

- Make sure to set up all required environment variables before running the backend.
- The project uses modern JavaScript features, React hooks, and Express middleware for a clean and modular architecture.
- The codebase is organized for scalability and ease of maintenance.

## Contact

Credits: Nishant Sharma  
For any questions or support, please contact at sharmanishant731@gmail.com

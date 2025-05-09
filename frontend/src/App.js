import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import AdminUsers from './pages/AdminUsers';
import PasswordReset from './pages/PasswordReset';
import ForgotPassword from './pages/ForgotPassword';
import Landing from './pages/Landing';
import { AuthProvider, AuthContext } from './context/AuthContext';

/**
 * Defines the application routes and handles route-based navigation and access control.
 * Uses authentication context to conditionally render routes based on user authentication status and role.
 */
function AppRoutes() {
  // Get authentication status and user role from context
  const { isAuthenticated, role } = React.useContext(AuthContext);

  return (
    <Routes>
      {/* Route for login page, redirects authenticated users to appropriate page based on role */}
      <Route path="/login" element={isAuthenticated ? <Navigate to={role === 'admin' ? '/admin/users' : '/'} /> : <Login />} />
      {/* Route for registration page, redirects authenticated users to appropriate page based on role */}
      <Route path="/register" element={isAuthenticated ? <Navigate to={role === 'admin' ? '/admin/users' : '/'} /> : <Register />} />
      {/* Root route: shows Notes page for authenticated users, Landing page otherwise */}
      <Route path="/" element={
        isAuthenticated
          ? (role === 'admin' ? <Navigate to="/admin/users" /> : <Notes />)
          : <Landing />
      } />
      {/* Admin users management route, accessible only to authenticated admin users */}
      <Route path="/admin/users" element={isAuthenticated && role === 'admin' ? <AdminUsers /> : <Navigate to="/login" />} />
      {/* Password reset route, accessible only to authenticated users */}
      <Route path="/password-reset" element={isAuthenticated ? <PasswordReset /> : <Navigate to="/login" />} />
      {/* Forgot password route, accessible to all users */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

/**
 * Main application component that wraps the app routes with authentication provider.
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

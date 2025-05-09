import React, { createContext, useState, useEffect } from 'react';
// Import jwtDecode to decode JWT tokens
import { jwtDecode } from 'jwt-decode';

// Create a context for authentication state and actions
export const AuthContext = createContext();

// AuthProvider component to provide authentication context to its children
export const AuthProvider = ({ children }) => {
  // State to track if user is authenticated based on presence of token in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  // State to track user role, default to 'user' if not found in localStorage
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  // State to track user's name extracted from decoded token
  const [name, setName] = useState('');

  // Effect to initialize authentication state and listen for storage changes
  useEffect(() => {
    // Function to update auth state based on token in localStorage
    const updateAuthState = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decode token to get user info
          const decoded = jwtDecode(token);
          setName(decoded.name || '');
          setRole(localStorage.getItem('role') || 'user');
          setIsAuthenticated(true);
        } catch (e) {
          // If token invalid, reset auth state
          setName('');
          setIsAuthenticated(false);
          setRole('user');
        }
      } else {
        // If no token, reset auth state
        setName('');
        setIsAuthenticated(false);
        setRole('user');
      }
    };

    // Initial auth state update on component mount
    updateAuthState();

    // Listen for changes to localStorage (e.g., login/logout in other tabs)
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to handle login: store token and role, update state
  const login = (token, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    try {
      const decoded = jwtDecode(token);
      setName(decoded.name || '');
    } catch (e) {
      setName('');
    }
    setIsAuthenticated(true);
    setRole(userRole);
  };

  // Function to handle logout: remove token and role, reset state
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole('user');
    setName('');
  };

  // Provide authentication state and actions to children components
  return (
    <AuthContext.Provider value={{ isAuthenticated, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

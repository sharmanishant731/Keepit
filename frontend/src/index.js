import React from 'react';
import ReactDOM from 'react-dom/client';
// Import BrowserRouter for routing capabilities in the app
import { BrowserRouter } from 'react-router-dom';
// Import the main App component
import App from './App';
// Import global styles including Tailwind CSS
import './index.css';  

// Create a root element to render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the App component wrapped inside BrowserRouter to enable routing
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

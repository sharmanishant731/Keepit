require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import express framework
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection
const cors = require('cors'); // Import cors middleware for Cross-Origin Resource Sharing

// Import route handlers
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');
const userRoutes = require('./routes/user');
const otpRoutes = require('./routes/otp');
const { authenticateToken } = require('./middleware/auth'); // Import authentication middleware

const app = express(); // Create an express application instance
const PORT = process.env.PORT || 5000; // Define the port to run the server on

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Define API routes and attach route handlers
app.use('/api/auth', authRoutes);
app.use('/api/notes', authenticateToken, notesRoutes); // Protect notes routes with authentication
app.use('/api/admin', adminRoutes);
app.use('/api/adminAuth', adminAuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/otp', otpRoutes);

// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  // Log any errors during connection
  console.error('Failed to connect to MongoDB', err);
});

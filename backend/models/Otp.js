const mongoose = require('mongoose'); // Import mongoose library for MongoDB object modeling

// Define the schema for OTP (One-Time Password) documents in MongoDB
const otpSchema = new mongoose.Schema({
  // Email address associated with the OTP (required string)
  email: { type: String, required: true },
  // OTP code (required string)
  code: { type: String, required: true },
  // Expiration date/time of the OTP (required date)
  expiresAt: { type: Date, required: true },
  // Purpose of the OTP, e.g., 'register' or 'forgotPassword' (required string)
  purpose: { type: String, required: true }, // 'register' or 'forgotPassword'
});

// Export the Otp model based on the otpSchema
module.exports = mongoose.model('Otp', otpSchema);

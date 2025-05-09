const mongoose = require('mongoose'); // Import mongoose library for MongoDB object modeling
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// Define the schema for User documents in MongoDB
const userSchema = new mongoose.Schema({
  // Full name of the user (required string)
  name: { type: String, required: true },
  // Unique username for the user (required string)
  username: { type: String, required: true, unique: true },
  // Hashed password for the user (required string)
  password: { type: String, required: true },
});

// Pre-save middleware to hash the password before saving the user document
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare a candidate password with the stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model based on the userSchema
module.exports = mongoose.model('User', userSchema);

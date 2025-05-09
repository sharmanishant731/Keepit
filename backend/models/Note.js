const mongoose = require('mongoose'); // Import mongoose library for MongoDB object modeling

// Define the schema for Note documents in MongoDB
const noteSchema = new mongoose.Schema({
  // Reference to the User who owns the note (ObjectId referencing User collection)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Title of the note (required string)
  title: { type: String, required: true },
  // Content/body of the note (required string)
  content: { type: String, required: true },
  // Timestamp when the note was created, defaults to current date/time
  createdAt: { type: Date, default: Date.now },
  // Timestamp when the note was last updated, defaults to current date/time
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save middleware to update the updatedAt field to current date/time before saving
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Note model based on the noteSchema
module.exports = mongoose.model('Note', noteSchema);

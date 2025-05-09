const express = require('express'); // Import express framework
const Note = require('../models/Note'); // Import Note model

const router = express.Router(); // Create a new router instance

/**
 * Route to get all notes for the logged-in user.
 * Retrieves notes sorted by updatedAt in descending order.
 */
router.get('/', async (req, res) => {
  try {
    // Find notes belonging to the authenticated user and sort by updatedAt descending
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    // Send the notes as JSON response
    res.json(notes);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to create a new note for the logged-in user.
 * Accepts title and content in the request body.
 */
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  try {
    // Create a new note instance with user ID, title, and content
    const note = new Note({
      user: req.user.id,
      title,
      content,
    });
    // Save the note to the database
    await note.save();
    // Respond with the created note and 201 status
    res.status(201).json(note);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to update a note by ID for the logged-in user.
 * Accepts title and content in the request body.
 */
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    // Find the note by ID and user ID
    let note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    // If note not found, respond with 404
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Update note title and content
    note.title = title;
    note.content = content;
    // Save the updated note
    await note.save();

    // Respond with the updated note
    res.json(note);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to delete a note by ID for the logged-in user.
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find and delete the note by ID and user ID
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    // If note not found, respond with 404
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Respond with success message
    res.json({ message: 'Note deleted' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router to be used in the main app
module.exports = router;

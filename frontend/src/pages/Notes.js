import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Import AuthContext to access user info and logout function
import { AuthContext } from '../context/AuthContext';
// Import CSS module styles for Notes component
import styles from './Notes.module.css';

function Notes() {
  // State variables for notes list, form inputs, edit mode, and error message
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  // Get user name and logout function from AuthContext
  const { name, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get token from localStorage for authorization
  const token = localStorage.getItem('token');

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from backend API
  const fetchNotes = async () => {
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  // Handle form submission for adding or updating a note
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        // Update existing note
        await axios.put(`http://localhost:5000/api/notes/${editId}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new note
        await axios.post('http://localhost:5000/api/notes', { title, content }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      // Reset form inputs and edit mode
      setTitle('');
      setContent('');
      setEditId(null);
      // Refresh notes list
      fetchNotes();
    } catch (err) {
      setError('Failed to save note');
    }
  };

  // Set form inputs for editing a note
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
  };

  // Delete a note by id
  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh notes list
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  // Navigate to password reset page
  const handleResetPasswordClick = () => {
    navigate('/password-reset');
  };

  return (
    <div className={styles.container}>
      {/* Page title */}
      <h1 className={styles.title}><span className={styles.titleLink}>Keepit</span></h1>
      <div className={styles.box}>
        <div className={styles.welcomeButtonsContainer}>
          <div className={styles.buttonsContainerCenter}>
            {/* Logout button */}
            <button className={styles.logoutButton} onClick={logout}>Logout</button>
            {/* Reset password button */}
            <button className={styles.smallButtonEqual} onClick={handleResetPasswordClick}>Reset Password</button>
          </div>
          {/* Welcome message with user name */}
          <h2 className={styles.heading}>Welcome, {name}</h2>
        </div>
        <p className={styles.heading}>My Notes</p>
        {/* Form for adding/updating notes */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <textarea
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className={styles.textarea}
            />
          </div>
          <div className={styles.buttonGroup}>
            {/* Submit button text changes based on edit mode */}
            <button type="submit" className={styles.button}>{editId ? 'Update Note' : 'Add Note'}</button>
            {/* Cancel button shown only in edit mode */}
            {editId && <button type="button" className={styles.actionButton} onClick={() => { setEditId(null); setTitle(''); setContent(''); }}>Cancel</button>}
          </div>
        </form>
        {/* Display error message if any */}
        {error && <p className={styles.error}>{error}</p>}
        {/* List of notes */}
        <ul className={styles.list}>
          {notes.map(note => (
            <li key={note._id} className={styles.listItem}>
              <div className={styles.noteHeader}>
                <h3 className={styles.noteTitle}>{note.title}</h3>
              </div>
              <p className={styles.noteContent}>{note.content}</p>
              <div className={styles.noteFooter}>
                <div className={styles.actions}>
                  {/* Edit button with icon */}
                  <button className={styles.smallButtonEqual} onClick={() => handleEdit(note)} title="Edit" aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-7l7 7" />
                    </svg>
                  </button>
                  {/* Delete button with icon */}
                  <button className={styles.smallActionButton} onClick={() => handleDelete(note._id)} title="Delete" aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                    </svg>
                  </button>
                </div>
                {/* Display last edited date */}
                <p className={styles.noteEdited}>Last edited: {new Date(note.updatedAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notes;

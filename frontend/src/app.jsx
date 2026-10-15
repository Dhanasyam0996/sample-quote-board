import { useState, useEffect } from 'react';
import './App.css';

// Automatically uses VITE_API_URL in production (Vercel) or falls back to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/quotes/';

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. GET: Fetch all quotes from Django REST API
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }
      const data = await res.json();
      setQuotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // 2. POST: Submit a new quote
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, text }),
      });

      if (!res.ok) {
        throw new Error('Failed to create quote');
      }

      setAuthor('');
      setText('');
      fetchQuotes(); // Refresh list to show newly added quote
    } catch (err) {
      alert(err.message);
    }
  };

  // 3. DELETE: Remove a quote by its ID
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete quote');
      }

      // Optimistically filter it out from state immediately
      setQuotes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Quote & Thought Board</h2>

      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="text"
          placeholder="Your name..."
          maxLength={50}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Write a thought or quote..."
          maxLength={250}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Post to Board</button>
      </form>

      {loading && <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading quotes...</p>}
      {error && <p style={{ textAlign: 'center', color: '#ef4444' }}>Error: {error}</p>}

      {!loading && quotes.length === 0 && !error && (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No quotes yet. Be the first to share one!</p>
      )}

      <div className="quote-list">
        {quotes.map((q) => (
          <div key={q.id} className="
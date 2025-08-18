import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const CategoryBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data);
      } catch {
        alert('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

const categoryStats = books.reduce((acc, book) => {
  if (!acc[book.category]) {
    acc[book.category] = 0;
  }
  acc[book.category]++; 
  return acc;
}, {});
  if (loading) return <div className="loading">Loading books by category...</div>;

  return (
    <div className="category-books-container">
      <h1 className='Books-heading'>Books by Category</h1>

     <div className="category-stats">
  <h3>Category Counts</h3>
  <div className="stats-grid">
    {Object.entries(categoryStats).map(([cat, count]) => (
      <div key={cat} className="category-stat-card">
        <h4>{cat}</h4>
        <p><strong>Total Books:</strong> {count}</p>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};
export default CategoryBooks;

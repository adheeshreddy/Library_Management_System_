import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const CategoryBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/books');
        setBooks(res.data);
        setCategories([...new Set(res.data.map(book => book.category))]);
      } catch {
        alert('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = selectedCategory === 'all'
    ? books
    : books.filter(book => book.category === selectedCategory);

  const categoryStats = books.reduce((acc, book) => {
    if (!acc[book.category]) acc[book.category] = { total: 0, available: 0, issued: 0, active: 0, inactive: 0 };
    acc[book.category].total++;
    book.availability === 'A' ? acc[book.category].available++ : acc[book.category].issued++;
    book.status === 'A' ? acc[book.category].active++ : acc[book.category].inactive++;
    return acc;
  }, {});

  if (loading) return <div className="loading">Loading books by category...</div>;

  return (
    <div className="category-books-container">
      <h1 className='Books-heading'>Books by Category</h1>

      <div className="category-filter">
        <label htmlFor="category-select">Filter by Category:</label>
        <select id="category-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="category-stats">
        <h3>Category Statistics</h3>
        <div className="stats-grid">
          {Object.entries(categoryStats).map(([cat, stats]) => (
            <div key={cat} className="category-stat-card">
              <h4>{cat}</h4>
              {Object.entries(stats).map(([k, v]) => (
                <p key={k}><strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="table-container">
        <h3>{selectedCategory === 'all' ? 'All Books' : `Books in ${selectedCategory}`} ({filteredBooks.length} books)</h3>
        <table className="category-books-table">
          <thead>
            <tr>
              {['ID','Title','Author','Category','Status','Availability'].map(th => <th key={th}>{th}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No books found in this category</td></tr>
            ) : filteredBooks.map(book => (
              <tr key={book.bookId} className={book.status === 'I' ? 'inactive-book' : ''}>
                <td>{book.bookId}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td><span className={`status-badge ${book.status === 'A' ? 'active' : 'inactive'}`}>{book.status === 'A' ? 'Active' : 'Inactive'}</span></td>
                <td><span className={`availability-badge ${book.availability === 'A' ? 'available' : 'issued'}`}>{book.availability === 'A' ? 'Available' : 'Issued'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="category-summary">
        <h3>Summary</h3>
        <div className="summary-stats">
          {[
            { label: 'Total Categories', value: categories.length },
            { label: 'Total Books', value: books.length },
            { label: 'Available Books', value: books.filter(b => b.availability === 'A').length },
            { label: 'Issued Books', value: books.filter(b => b.availability === 'I').length }
          ].map(stat => (
            <div key={stat.label} className="summary-item">
              <span>{stat.label}:</span> <span>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBooks;

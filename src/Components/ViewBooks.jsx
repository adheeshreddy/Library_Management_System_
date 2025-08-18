import React, { useEffect, useState } from "react";
import api from "../api/axios";
import '../Styles/Books.css';

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', author: '', category: '', status: 'A', availability: 'A'
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch {
      alert("Failed to fetch books");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      alert("Book deleted successfully");
      fetchBooks();
    } catch {
      alert("Error deleting book");
    }
  };

  const handleEdit = (book) => {
    setEditingBookId(book.bookId);
    setEditForm({ ...book });
  };

  const handleCancel = () => setEditingBookId(null);

  const handleUpdate = async (id) => {
    try {
      await api.put(`/books/${id}`, editForm);
      alert("Book updated successfully");
      setEditingBookId(null);
      fetchBooks();
    } catch {
      alert("Error updating book");
    }
  };

  const handleChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const renderField = (book, field, options = null) => {
    if (editingBookId === book.bookId) {
      return options ? (
        <select name={field} value={editForm[field]} onChange={handleChange}>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input type="text" name={field} value={editForm[field]} onChange={handleChange} />
      );
    }
    if (field === "status") return <span className={`status-badge ${book.status === 'A' ? 'active' : 'inactive'}`}>{book.status === 'A' ? 'Active' : 'Inactive'}</span>;
    if (field === "availability") return <span className={`availability-badge ${book.availability === 'A' ? 'available' : 'issued'}`}>{book.availability === 'A' ? 'Available' : 'Issued'}</span>;
    return book[field];
  };

  return (
    <div className="books-container">
      <h1 className='Books-heading'>Books Management</h1>
      <div className="table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Status</th><th>Availability</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No books found</td></tr>
            ) : books.map(book => (
              <tr key={book.bookId} className={book.status === 'I' ? 'inactive-book' : ''}>
                <td>{book.bookId}</td>
                <td>{renderField(book, "title")}</td>
                <td>{renderField(book, "author")}</td>
                <td>{renderField(book, "category")}</td>
                <td>{renderField(book, "status", [{value:"A", label:"Active"}, {value:"I", label:"Inactive"}])}</td>
                <td>{renderField(book, "availability", [{value:"A", label:"Available"}, {value:"I", label:"Issued"}])}</td>
                <td>
                  {editingBookId === book.bookId ? (
                    <>
                      <button className="save-btn" onClick={() => handleUpdate(book.bookId)}>Save</button>
                      <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(book.bookId)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
    </div>
  );
};

export default ViewBooks;

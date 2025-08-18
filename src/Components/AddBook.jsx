import React, { useState } from "react";
import api from "../api/axios";
import '../Styles/Books.css';

export default function AddBook() {
  const [book, setBook] = useState({ title: "", author: "", category: "", status: "A", availability: "A" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 


  
  const handleChange = e => {
    setBook({ ...book, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const validate = () => {
    const newErrors = {};
    if (!book.title.trim()) newErrors.title = "Title is required";
    if (!book.author.trim()) newErrors.author = "Author is required";
    if (!book.category.trim()) newErrors.category = "Category is required";
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/books", book);
      alert(res.data);
      setBook({ title: "", author: "", category: "", status: "A", availability: "A" });
    } catch (err) {
      console.error(err);
      alert("Error adding book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, placeholder) => (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <input
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        value={book[name]}
        onChange={handleChange}
      />
      {errors[name] && <span className="error" style={{color:"red"}}>{errors[name]}</span>}
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <select id={name} name={name} value={book[name]} onChange={handleChange}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="form-container">
      <h1 className="Books-heading">Add New Book</h1>
      <form onSubmit={handleSubmit} className="book-form">
        {renderInput("Book Title", "title", "Enter book title")}
        {renderInput("Author", "author", "Enter author name")}
        {renderInput("Category", "category", "Enter book category")}
        {renderSelect("Status", "status", [
          { value: "A", label: "Active" },
          { value: "I", label: "Inactive" }
        ])}
        {renderSelect("Availability", "availability", [
          { value: "A", label: "Available" },
          { value: "I", label: "Issued" }
        ])}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

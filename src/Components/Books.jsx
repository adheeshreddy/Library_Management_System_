// import React from 'react'
// import '../Styles/Books.css'

// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// const Books = () => {
//   return (
//     <div>
//      <h1 className='Books-heading'> Manage and View Books</h1>
    
//       <button><Link to="/books/add">Add Book</Link></button>
//       <button><Link to="/books/view">View Books</Link></button>
//     </div>
//   )
// }

// export default Books
import React, { useState } from 'react';
import '../Styles/Books.css';
import { Link } from 'react-router-dom'; 

const Books = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <h1 className='Books-heading'>Manage and View Books</h1>
      <div className="dropdown">
        <button onClick={toggleDropdown} className="dropdown-toggle">
          Book Actions
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/books/add" onClick={() => setIsDropdownOpen(false)}>Add Book</Link>
            <Link to="/books/view" onClick={() => setIsDropdownOpen(false)}>View Books</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
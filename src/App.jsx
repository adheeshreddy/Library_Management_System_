import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Components/Home';
import Members from './Components/Members';
import Books from './Components/Books';
import Issue from './Components/Issue';
import Reports from './Components/Reports';
import './App.css'; 
import AddBook from './Components/AddBook';
import ViewBooks from './Components/ViewBooks';
import AddMember from './Components/AddMember';
import ViewMembers from './Components/ViewMembers';
import IssueBook from './Components/IssueBook';
import ReturnBook from './Components/ReturnBook';
import OverdueBooks from './Components/OverdueBooks';
import IssuedBooks from './Components/IssuedBooks';
import CategoryBooks from './Components/CategoryBooks';


function App() {
  console.log("rendered");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <Router>
      <div className="app-container"> 
        <nav className="main-header"> 
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li 
              className="dropdown" 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <Link >Books</Link>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/books/add">Add Book</Link>
                  <Link to="/books/view">View Books</Link>
                </div>
              )}
            </li>
            <li 
              className="dropdown" 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <Link >Members</Link>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/member/add">Add Member</Link>
                  <Link to="/member/view">View Members</Link>
                </div>
              )}
            </li>
             <li 
              className="dropdown" 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <Link >Issue/Return</Link>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/issueBook">Issue Book</Link>
                  <Link to="/returnBook">Return Book</Link>
                </div>
              )}
            </li>

             <li 
              className="dropdown" 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <Link to="/reports">Reports</Link>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/overdueBooks">Overdue Books</Link>
                  <Link to="/issuedBooks">Issued Books</Link>
                  <Link to="/categoryBooks">Books Categories</Link>
                </div>
              )}
            </li>
           
            {/* <li>
              <Link to="/reports">Reports</Link>
            </li> */}
          </ul>
        </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/books" element={<Books />} /> */}
            <Route path="/books/add" element={<AddBook />} /> {/* Add this route */}
            <Route path="/books/view" element={<ViewBooks />} /> {/* Add this route */}
            {/* <Route path="/member" element={<Members />} /> */}
            <Route path="/member/add" element={<AddMember />} />
            <Route path="/member/view" element={<ViewMembers />} />
            {/* <Route path="/issues" element={<Issue />} /> */}
            <Route path="/issueBook" element={<IssueBook/>} />
            <Route path="/returnBook" element={<ReturnBook/>} />
            {/* <Route path="/reports" element={<Reports />} /> */}
            <Route path="/overdueBooks" element={<OverdueBooks />} />
            <Route path="/issuedBooks" element={<IssuedBooks/>} />
            <Route path="/categoryBooks" element={<CategoryBooks />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const ReturnBook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.get('/issues');
      const currentlyIssued = response.data.filter(issue => issue.status === 'I');

      const enrichedIssues = await Promise.all(
        currentlyIssued.map(async issue => {
          try {
            const [bookRes, memberRes] = await Promise.all([
              api.get(`/books/${issue.bookId}`),
              api.get(`/members/${issue.memberId}`)
            ]);
            return { ...issue, book: bookRes.data, member: memberRes.data };
          } catch {
            return { ...issue, book: null, member: null };
          }
        })
      );

      setIssuedBooks(enrichedIssues);
    } catch {
      alert('Failed to fetch issued books');
    }
  };

  useEffect(() => { fetchIssuedBooks(); }, []);

  const handleReturnBook = async (issueId) => {
    if (!window.confirm('Return this book?')) return;
    setLoading(true);
    try {
      const res = await api.post('/issues/return', null, { params: { issueId } });
      alert(res.data);
      fetchIssuedBooks();
    } catch {
      alert('Error returning book');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = date => date ? new Date(date).toLocaleDateString() : 'N/A';
  const daysSinceIssue = date => date ? Math.ceil((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="return-container">
      <h1 className='Books-heading'>Return Issued Books</h1>

      <div className="table-container">
        <table className="issued-books-table">
          <thead>
            <tr>
              {['Issue ID','Book Title','Author','Category','Member Name','Member Email','Member Mobile','Issue Date','Days Since Issue','Action'].map(th => <th key={th}>{th}</th>)}
            </tr>
          </thead>
          <tbody>
            {issuedBooks.length === 0 ? (
              <tr><td colSpan="10" className="no-data">No books are currently issued</td></tr>
            ) : issuedBooks.map(issue => {
              const overdueDays = daysSinceIssue(issue.issueDate);
              const { book = {}, member = {} } = issue;
              return (
                <tr key={issue.issueId} className={overdueDays > 14 ? 'overdue' : ''}>
                  <td>{issue.issueId}</td>
                  <td>{book.title || 'Loading...'}</td>
                  <td>{book.author || 'Loading...'}</td>
                  <td>{book.category || 'Loading...'}</td>
                  <td>{member.name || 'Loading...'}</td>
                  <td>{member.email || 'Loading...'}</td>
                  <td>{member.mobile || 'Loading...'}</td>
                  <td>{formatDate(issue.issueDate)}</td>
                  <td className={overdueDays > 14 ? 'overdue-days' : ''}>{overdueDays} days</td>
                  <td>
                    <button onClick={() => handleReturnBook(issue.issueId)} className="return-btn" disabled={loading}>
                      {loading ? 'Returning...' : 'Return Book'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="info-section">
        <h3>Summary</h3>
        <p>Total Issued Books: {issuedBooks.length}</p>
        <p>Overdue Books: {issuedBooks.filter(issue => daysSinceIssue(issue.issueDate) > 14).length}</p>
      </div>
    </div>
  );
};

export default ReturnBook;

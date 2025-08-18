import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.get('/issues');
      const issued = response.data.filter(issue => issue.status === 'I');

      const enriched = await Promise.all(
        issued.map(async issue => {
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

      setIssuedBooks(enriched);
    } catch {
      alert('Failed to fetch issued books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssuedBooks(); }, []);

  const daysSinceIssue = date => date ? Math.ceil((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) : 0;
  const formatDate = date => date ? new Date(date).toLocaleDateString() : 'N/A';

  if (loading) return <div className="loading">Loading issued books...</div>;

  return (
    <div className="issued-books-container">
      <h1 className='Books-heading'>Currently Issued Books</h1>

      <div className="table-container">
        <table className="issued-books-table">
          <thead>
            <tr>
              {['Issue ID','Book Title','Author','Category','Member Name','Member Email','Member Mobile','Issue Date','Days Since Issue','Status']
                .map(th => <th key={th}>{th}</th>)}
            </tr>
          </thead>
          <tbody>
            {issuedBooks.length === 0 ? (
              <tr><td colSpan="10" className="no-data">No books are currently issued</td></tr>
            ) : issuedBooks.map(issue => {
              const days = daysSinceIssue(issue.issueDate);
              const { book = {}, member = {} } = issue;
              return (
                <tr key={issue.issueId} className={days > 14 ? 'overdue' : ''}>
                  <td>{issue.issueId}</td>
                  <td>{book.title || 'Loading...'}</td>
                  <td>{book.author || 'Loading...'}</td>
                  <td>{book.category || 'Loading...'}</td>
                  <td>{member.name || 'Loading...'}</td>
                  <td>{member.email || 'Loading...'}</td>
                  <td>{member.mobile || 'Loading...'}</td>
                  <td>{formatDate(issue.issueDate)}</td>
                  <td className={days > 14 ? 'overdue-days' : ''}>{days} days</td>
                  <td><span className={`status ${days > 14 ? 'overdue-status' : 'active-status'}`}>{days > 14 ? 'Overdue' : 'Active'}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuedBooks;

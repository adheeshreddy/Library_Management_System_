import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const OverdueBooks = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOverdueBooks = async () => {
    try {
      const response = await api.get('/issues');
      const overdue = response.data
        .filter(issue => issue.status === 'I' && issue.issueDate)
        .filter(issue => {
          const days = Math.ceil((new Date() - new Date(issue.issueDate)) / (1000 * 60 * 60 * 24));
          return days > 14;
        });

      const enriched = await Promise.all(
        overdue.map(async issue => {
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

      setOverdueBooks(enriched);
    } catch {
      alert('Failed to fetch overdue books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOverdueBooks(); }, []);

  const daysSinceIssue = date => date ? Math.ceil((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) : 0;
  const getSeverity = days => (days > 30 ? 'critical' : days > 21 ? 'high' : 'medium');
  const formatDate = date => date ? new Date(date).toLocaleDateString() : 'N/A';

  if (loading) return <div className="loading">Loading overdue books...</div>;

  const severityCounts = { critical: 0, high: 0, medium: 0 };
  overdueBooks.forEach(book => { severityCounts[getSeverity(daysSinceIssue(book.issueDate))]++; });

  return (
    <div className="overdue-books-container">
      <h1 className='Books-heading'>Overdue Books Report</h1>

      <div className="overdue-summary">
        {['critical', 'high', 'medium'].map(level => (
          <div key={level} className={`summary-card ${level}`}>
            <h3>{level.charAt(0).toUpperCase() + level.slice(1)} Overdue</h3>
            <p>{severityCounts[level]}</p>
          </div>
        ))}
      </div>

      <div className="table-container">
        <table className="overdue-books-table">
          <thead>
            <tr>
              {['Issue ID','Book Title','Author','Category','Member Name','Member Email','Member Mobile','Issue Date','Days Overdue','Severity'].map(th => <th key={th}>{th}</th>)}
            </tr>
          </thead>
          <tbody>
            {overdueBooks.length === 0 ? (
              <tr><td colSpan="10" className="no-data">No overdue books found</td></tr>
            ) : overdueBooks.map(issue => {
              const days = daysSinceIssue(issue.issueDate);
              const severity = getSeverity(days);
              const { book = {}, member = {} } = issue;
              return (
                <tr key={issue.issueId} className={`overdue-row ${severity}`}>
                  <td>{issue.issueId}</td>
                  <td>{book.title || 'Loading...'}</td>
                  <td>{book.author || 'Loading...'}</td>
                  <td>{book.category || 'Loading...'}</td>
                  <td>{member.name || 'Loading...'}</td>
                  <td>{member.email || 'Loading...'}</td>
                  <td>{member.mobile || 'Loading...'}</td>
                  <td>{formatDate(issue.issueDate)}</td>
                  <td className={`overdue-days ${severity}`}>{days} days</td>
                  <td><span className={`severity-badge ${severity}`}>{severity.toUpperCase()}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overdue-actions">
        <h3>Actions Required:</h3>
        <ul>
          <li>Send reminder emails to members with overdue books</li>
          <li>Contact members with critical overdue books (&gt;30 days)</li>
          <li>Consider suspension of borrowing privileges for repeat offenders</li>
        </ul>
      </div>
    </div>
  );
};

export default OverdueBooks;

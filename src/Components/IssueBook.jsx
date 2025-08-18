import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const IssueBook = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, membersRes] = await Promise.all([api.get('/books'), api.get('/members')]);
        setBooks(booksRes.data.filter(book => book.availability === 'A' && book.status === 'A'));
        setMembers(membersRes.data);
      } catch {
        alert('Failed to fetch books or members');
      }
    };
    fetchData();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) return alert('Select both a book and a member');

    setLoading(true);
    try {
      const res = await api.post('/issues/issue', null, { params: { bookId: selectedBook, memberId: selectedMember } });
      alert(res.data);
      setSelectedBook('');
      setSelectedMember('');
      setBooks(prev => prev.filter(b => b.bookId !== selectedBook)); 
    } catch {
      alert('Error issuing book. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = (items, valueField, labelFn, placeholder) => (
    <>
      <option value="">{placeholder}</option>
      {items.map(item => <option key={item[valueField]} value={item[valueField]}>{labelFn(item)}</option>)}
    </>
  );

  return (
    <div className="issue-container">
      <h1 className='Books-heading'>Issue Available Book</h1>
      <form onSubmit={handleIssue} className="issue-form">
        <div className="form-group">
          <label>Select Book:</label>
          <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)} required>
            {renderOptions(books, 'bookId', b => `${b.title} by ${b.author} (${b.category})`, 'Choose a book...')}
          </select>
        </div>

        <div className="form-group">
          <label>Select Member:</label>
          <select value={selectedMember} onChange={e => setSelectedMember(e.target.value)} required>
            {renderOptions(members, 'memberId', m => `${m.name} - ${m.email}`, 'Choose a member...')}
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !selectedBook || !selectedMember}>
          {loading ? 'Issuing...' : 'Issue Book'}
        </button>
      </form>

      <div className="info-section">
        <h3>Available Books: {books.length}</h3>
        <h3>Total Members: {members.length}</h3>
      </div>
    </div>
  );
};

export default IssueBook;

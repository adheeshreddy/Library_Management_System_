import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const ViewMembers = () => {
  const [members, setMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', mobile: '', gender: 'M', address: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data);
    } catch {
      alert('Failed to fetch members');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await api.delete(`/members/${id}`);
      alert('Member deleted successfully');
      fetchMembers();
    } catch {
      alert('Error deleting member');
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.memberId);
    setEditForm({ ...member });
    setErrors({});
  };

  const handleCancel = () => setEditingId(null);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!editForm.name.trim()) newErrors.name = 'Name is required';
    if (!editForm.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(editForm.email)) newErrors.email = 'Email is invalid';
    if (!editForm.mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\d{10}$/.test(editForm.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!editForm.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleUpdate = async (id) => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await api.put(`/members/${id}`, editForm);
      alert('Member updated successfully');
      setEditingId(null);
      fetchMembers();
    } catch {
      alert('Error updating member');
    }
  };

  const renderField = (member, field, type = 'text') => {
    if (editingId === member.memberId) {
      if (type === 'textarea') {
        return <textarea name={field} value={editForm[field]} onChange={handleChange} rows="2" />;
      }
      if (type === 'select') {
        return (
          <select name={field} value={editForm[field]} onChange={handleChange}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        );
      }
      return <input type={type} name={field} value={editForm[field]} onChange={handleChange} />;
    }
    if (field === 'gender') return member.gender === 'M' ? 'Male' : 'Female';
    return member[field];
  };

  return (
    <div className="members-container">
      <h1 className='Books-heading'>View and Manage Members</h1>
      <div className="table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Gender</th><th>Address</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.memberId}>
                <td>{member.memberId}</td>
                <td>{renderField(member, 'name')}{errors.name && <span className="error">{errors.name}</span>}</td>
                <td>{renderField(member, 'email', 'email')}{errors.email && <span className="error">{errors.email}</span>}</td>
                <td>{renderField(member, 'mobile', 'tel')}{errors.mobile && <span className="error">{errors.mobile}</span>}</td>
                <td>{renderField(member, 'gender', 'select')}</td>
                <td>{renderField(member, 'address', 'textarea')}{errors.address && <span className="error">{errors.address}</span>}</td>
                <td>
                  {editingId === member.memberId ? (
                    <>
                      <button className="save-btn" onClick={() => handleUpdate(member.memberId)}>Save</button>
                      <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(member)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(member.memberId)}>Delete</button>
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

export default ViewMembers;

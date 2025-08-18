import React, { useState } from 'react';
import api from '../api/axios';
import '../Styles/Books.css';

const AddMember = () => {
  const [member, setMember] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: 'M',
    address: ''
  });
  const [errors, setErrors] = useState({}); 
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setMember({ ...member, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!member.name.trim()) newErrors.name = 'Name is required';
    if (!member.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(member.email)) newErrors.email = 'Email is invalid';
    if (!member.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(member.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!member.address.trim()) newErrors.address = 'Address is required';
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
      const response = await api.post('/members', member);
      alert(response.data);
      setMember({ name: '', email: '', mobile: '', gender: 'M', address: '' });
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Error adding member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, name, type = 'text', placeholder = '', extraProps = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={member[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows="3"
          {...extraProps}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={member[name]}
          onChange={handleChange}
          placeholder={placeholder}
          {...extraProps}
        />
      )}
      {errors[name] && <span className="error" style={{color:"red"}}>{errors[name]}</span>}
    </div>
  );

  return (
    <div className="form-container">
      <h1 className='Books-heading'>Add New Member</h1>
      <form onSubmit={handleSubmit} className="member-form">
        {renderInput('Name', 'name', 'text', 'Enter member name')}
        {renderInput('Email', 'email', 'email', 'Enter email address')}
        {renderInput('Mobile', 'mobile', 'tel', 'Enter mobile number')}
        
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" name="gender" value={member.gender} onChange={handleChange}>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {renderInput('Address', 'address', 'textarea', 'Enter address')}
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding Member...' : 'Add Member'}
        </button>
      </form>
    </div>
  );
};

export default AddMember;

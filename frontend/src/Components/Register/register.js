import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #FFFFFF;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    color: #222060;
    margin-bottom: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      color: rgba(34, 34, 96, 0.7);
      font-size: 0.9rem;
    }

    input {
      padding: 0.7rem 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: #555;
      }
    }
  }

  .submit-btn {
    margin-top: 1rem;
    button {
      width: 100%;
    }
  }

  .extra-links {
    text-align: center;
    margin-top: 1rem;

    a {
      color: #555;
      text-decoration: none;
      font-size: 0.9rem;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = 'Name must contain only letters and spaces.';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (username.length < 5) {
      newErrors.username = 'Username must be at least 5 characters long.';
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters and numbers.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      newErrors.password = 'Password must include at least one number and one special character.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/signup', {
        username,
        password,
        name,
      });

      console.log('Registration successful:', response.data);
      setErrorMessage('');
      onRegisterSuccess();
      navigate('/login');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
      console.error('Registration failed:', error);
    }
  };

  return (
    <RegisterStyled>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">First Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        <div className="submit-btn">
          <button
            type="submit"
            style={{
              padding: '0.7rem 1rem',
              border: 'none',
              borderRadius: '8px',
              background: '#222060',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </div>
      </form>
      <div className="extra-links">
        <Link to="/login">Login</Link>
      </div>
    </RegisterStyled>
  );
};

export default Register;

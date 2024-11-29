import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginRoute } from '../../utils/APIRoutes';
const LoginStyled = styled.div`
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

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username not found.';
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Wrong Password, please try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) return;

    try {
      await axios.post(loginRoute, {
        username,
        password,
      });

      localStorage.setItem('jwtToken', response.data.token);

      console.log('Login successful:', response.data);
      setErrorMessage('');
      onLoginSuccess();
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
      console.error('Login failed:', error);
    }
  };

  return (
    <LoginStyled>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or Email:</label>
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
            Login
          </button>
        </div>
      </form>
      <div className="extra-links">
        <a href="/register">Register</a>
      </div>
    </LoginStyled>
  );
};

export default Login;

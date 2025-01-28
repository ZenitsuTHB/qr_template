import React, { useState } from 'react';
import useApi from '../../Hooks/useApi';
import './css/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const api = useApi();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error message on new attempt

    try {
      const data = {
        username: username,
        password: password,
      };
      const response = await api.post(window.baseDomain + 'api/auth/jwt-sign-in/', data);
      const { accessToken, refreshToken } = response;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('loginSuccessful', true);
        localStorage.setItem('username', username);

        const cookieDomain = window.isProduction ? '.reservaties.net' : 'localhost';
        const cookieSettings = `authToken=${accessToken}; path=/; ${
          window.isProduction ? `domain=${cookieDomain}; Secure; SameSite=None` : ''
        }`;
        document.cookie = cookieSettings;

        window.location.reload();
      } else {
        throw new Error('Token not received');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Onjuiste gebruikersnaam of wachtwoord.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          placeholder="Gebruikersnaam"
          value={username}
          onChange={handleUsernameChange}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={handlePasswordChange}
          className="login-input"
          required
        />

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

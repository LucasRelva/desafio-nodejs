import { useState } from 'react';
import { login } from '../services/authService.ts';
import { jwtDecode } from 'jwt-decode';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      const { access_token } = response;

      const decodedToken = jwtDecode<{ sub: string }>(access_token);
      const userId = decodedToken.sub;

      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('accessToken', access_token);

      navigate('/home');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }} className="login-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                 className="form-input" />
          <input type="password" placeholder="Password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required className="form-input" />
          <button type="submit" className="form-submit">Login</button>
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={handleCloseError} className="close-button">X</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

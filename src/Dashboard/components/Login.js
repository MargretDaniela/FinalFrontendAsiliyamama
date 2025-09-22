import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, InputGroup} from 'react-bootstrap'; // Added Modal
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = ({ onLogin }) => {
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_BASE_URL = 'http://127.0.0.1:5000';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Full backend login response data:', data);

      if (response.ok) {
        const token = data.access_token;
        const refreshToken = data.refresh_token;
        const userType = data.user ? data.user.user_type : undefined;

        if (userType && token && refreshToken) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userType', userType);
          console.log('Login successful! Access Token:', token, 'Refresh Token:', refreshToken, 'User Type:', userType);
          onLogin(userType);
        } else {
          setError('Login successful, but user type, access token, or refresh token not found in response.');
          console.error('Backend response missing expected keys:', data);
        }
      } else {
        setError(data.message || data.error || 'Login failed. Please check your credentials.');
      }
    } catch (networkError) {
      console.error('Network error during login:', networkError);
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Card style={{ width: '25rem' }} className="shadow-lg p-4 rounded-lg">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: '#800000' }}>Admin Login</h2>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  variant='light'
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  style={{ color: '#800000', backgroundColor: "#d9eff7ff" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button
              type="submit"
              className="w-100 py-2 rounded-md shadow-md"
              style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
              ) : null}
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;

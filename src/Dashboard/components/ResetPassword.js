import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// This component is designed to be a standalone page for password reset.
// It will typically be accessed via a link from a "Forgot Password" email.
const ResetPasswordPage = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // When the component mounts, try to get the token from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setMessage('Please enter and confirm your new password.');
    } else {
      setError('No reset token found in the URL. Please use the link from your email.');
    }
  }, []);

  // Handler for submitting the new password
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError('Missing password reset token. Please use the link from your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm new password do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Your password has been reset successfully! You can now log in with your new password.');
        setNewPassword(''); // Clear fields on success
        setConfirmNewPassword('');
        // Optionally, redirect to login page after a delay
        setTimeout(() => {
          // window.location.href = '/admin-login'; // Or wherever your login page is
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. The link might be expired or invalid.');
      }
    } catch (networkError) {
      console.error('Network error during password reset:', networkError);
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Card style={{ width: '28rem' }} className="shadow-lg p-4 rounded-lg">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: '#800000' }}>Reset Your Password</h2>
          {message && <Alert variant="success" className="text-center">{message}</Alert>}
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          {/* Only show form if a token is present and no critical error */}
          {token && !error.includes('No reset token') ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    variant='light'
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={loading}
                    style={{ color: '#800000', backgroundColor: "#d9eff7ff" }}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmNewPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    variant='light'
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    disabled={loading}
                    style={{ color: '#800000', backgroundColor: "#d9eff7ff" }}
                  >
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
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
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Form>
          ) : (
            // Display an alternative message if no token or an error occurred initially
            !error && <p className="text-center text-muted">Awaiting password reset link from your email.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;

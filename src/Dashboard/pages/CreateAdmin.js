import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { authenticatedFetch } from './authService'; // Adjust path as needed

const CreateAdmin = () => {
  const API_BASE_URL = 'http://127.0.0.1:5000';
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Use authenticatedFetch instead of direct fetch
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_type: 'admin',
        }),
      });

      // --- ADDED FOR DEBUGGING: Log the raw response object ---
      console.log('Raw response object before JSON parsing:', response);
      // This log will show you the status, headers, and if a body exists, even before .json() is called.
      // If it's a network error like "getaddrinfo failed", you might see a response with status 0 or a type 'opaque'.
      // --- END ADDED FOR DEBUGGING ---

      const data = await response.json();
      console.log('Admin creation response:', data);

      if (response.ok) {
        setSuccessMessage(data.message || 'Admin created successfully!');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          contact: '',
          password: '',
        });
      } else {
        let specificErrorMessage = 'Failed to create admin.';
        if (data.error) {
          const lowerCaseError = data.error.toLowerCase();
          if (lowerCaseError.includes('email already exists')) {
            specificErrorMessage = 'Error: An admin with this email already exists. Please use a different email.';
          } else if (lowerCaseError.includes('contact already exists') || lowerCaseError.includes('contact number already in use')) {
            specificErrorMessage = 'Error: An admin with this contact number already exists. Please use a different contact.';
          } else {
            specificErrorMessage = data.error;
          }
        } else if (data.msg) { // Check for 'msg' field from backend for token expired
          specificErrorMessage = data.msg;
        }
        setErrorMessage(specificErrorMessage);
      }
    } catch (networkError) {
      console.error('Network error during admin creation:', networkError);
      // This catch block handles the `getaddrinfo failed` error.
      // The `networkError` object often provides a more specific message in its `message` property.
      setErrorMessage(`Could not connect to the server. Please ensure the backend is running and reachable. Details: ${networkError.message || 'Unknown network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4" style={{width:'700px'}}>
      <h1 className="text-3xl font-bold mb-4" style={{ color: '#3c0008' }}>Create New Admin</h1>

      <Card className="shadow-lg p-4 rounded-lg">
        <Card.Body>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formContact">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  placeholder="Enter contact number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Form.Group>
            </div>

            <Button
              type="submit"
              className="w-full py-2 mt-4 rounded-md shadow-md"
              style={{ backgroundColor: '#a03737ff', borderColor: '#800000', color: 'white' }}
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
              {loading ? 'Creating Admin...' : 'Create Admin'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAdmin;

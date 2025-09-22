import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';

const VolunteerForm = () => {
  const API_BASE_URL = 'http://127.0.0.1:5000'; 
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    skills: '',
    availability: '',
    bio: '',
    contact: '',
  });

  // State to track if form submission succeeded
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const backendUrl = `${API_BASE_URL}/api/v1/volunteers/create`;

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Instead of alert, set submitted to true to show thank you message
        setSubmitted(true);
      } else {
        alert(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      alert('Network error: Could not submit application.');
      console.error(error);
    }
  };

  if (submitted) {
    // Thank you message replaces form but navbar remains (outside this component)
    return (
      <Container style={{ marginTop: '150px' }}>
        <Card className="shadow-lg p-4 text-center" style={{ borderRadius: '20px' }}>
          <h2 style={{ color: '#992525' }}>Thank You for Applying!</h2>
          <p>
            We appreciate your interest in volunteering with us.
            <br />
            Our team will review your application and get back to you soon.
          </p>
          <p>
            Stay hopeful and thank you for wanting to make a difference!
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '150px' }}>
      <Card className="shadow-lg p-4" style={{ borderRadius: '20px' }}>
        <h2 className="text-center mb-4" style={{ color: '#992525' }}>
          Volunteer / Mentor Application
        </h2>
        <Form onSubmit={handleSubmit}>
          {['first_name', 'last_name', 'email', 'skills', 'availability', 'contact'].map(field => (
            <Form.Group key={field} className="mb-3">
              <Form.Label style={{ textTransform: 'capitalize' }}>
                {field.replace('_', ' ')}{field !== 'contact' && '*'}
              </Form.Label>
              <Form.Control
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === 'skills' ? 'e.g. Counseling, Teaching, Leadership' :
                  field === 'availability' ? 'e.g. Weekends, Weekdays after 5pm' :
                  field === 'contact' ? '+1234567890' : ''
                }
                required={field !== 'contact'}
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Short Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              required
            />
          </Form.Group>

          <div className="text-center">
            <Button
              type="submit"
              style={{ backgroundColor: '#992525', borderColor: '#992525' }}
              className="px-4 py-2"
            >
              Submit Application
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default VolunteerForm;

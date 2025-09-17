import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
// import PagesTopBar from '../../Content/PagesTopbar'; // <-- CORRECTED IMPORT PATH

const AdminAboutUsPage = () => {
    const [formData, setFormData] = useState({
        our_story: '',
        vision_title: '',
        vision_content: '',
        mission_title: '',
        mission_content: '',
        goals_title: '',
        goals_list: '' // Will be a newline-separated string in the form
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // const API_BASE_URL = 'http://127.0.0.1:5000'; // Your backend API base URL
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    // Function to fetch current About Us content
    const fetchAboutUsContent = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/aboutus/`);
            const data = response.data;
            // Convert goals_list array from backend response to a newline-separated string for the textarea
            setFormData({
                ...data,
                // Ensure data.goals_list is an array before joining, or provide an empty string
                goals_list: Array.isArray(data.goals_list) ? data.goals_list.join('\n') : ''
            });
        } catch (err) {
            setError('Failed to fetch About Us content. Please ensure your backend is running and configured correctly.');
            console.error('Error fetching About Us content:', err);
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // Fetch content on component mount
    useEffect(() => {
        fetchAboutUsContent();
    }, [fetchAboutUsContent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentication token missing. Please log in again.');
            setLoading(false);
            return;
        }

        // Prepare data for backend: convert goals_list string from textarea to an array
        const dataToSend = {
            ...formData,
            // Split the string by newline, trim each item, and filter out empty strings
            goals_list: formData.goals_list.split('\n').map(item => item.trim()).filter(item => item.length > 0)
        };

        try {
            await axios.put(`${API_BASE_URL}/api/aboutus/`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('About Us content updated successfully!');

            // Trigger localStorage event to notify public AboutUs page
            localStorage.setItem('lastAboutUsUpdateTimestamp', Date.now().toString());
            console.log('Admin AboutUs: Set lastAboutUsUpdateTimestamp in localStorage.');

        } catch (err) {
            setError('Failed to update About Us content. Please check server and permissions.');
            console.error('Error updating About Us content:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header as="h5" style={{ backgroundColor: '#800000', color: 'white' }}>
                Edit About Us Page Content
            </Card.Header>
            <Card.Body>
                {loading && <p>Loading...</p>}
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && (
                    <Form onSubmit={handleSubmit}>
                        {/* Our Story */}
                        <Form.Group className="mb-3" controlId="our_story">
                            <Form.Label>Our Story Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="our_story"
                                value={formData.our_story}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Vision */}
                        <Form.Group className="mb-3" controlId="vision_title">
                            <Form.Label>Vision Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="vision_title"
                                value={formData.vision_title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="vision_content">
                            <Form.Label>Vision Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="vision_content"
                                value={formData.vision_content}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Mission */}
                        <Form.Group className="mb-3" controlId="mission_title">
                            <Form.Label>Mission Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="mission_title"
                                value={formData.mission_title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="mission_content">
                            <Form.Label>Mission Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="mission_content"
                                value={formData.mission_content}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Goals */}
                        <Form.Group className="mb-3" controlId="goals_title">
                            <Form.Label>Goals Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="goals_title"
                                value={formData.goals_title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="goals_list">
                            <Form.Label>Goals List (one goal per line)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="goals_list"
                                value={formData.goals_list}
                                onChange={handleChange}
                                placeholder="Enter each goal on a new line."
                                required
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            style={{ backgroundColor: '#800000', borderColor: '#800000' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            ) : null}
                            {loading ? ' Saving Changes...' : 'Save Changes'}
                        </Button>
                    </Form>
                )}
            </Card.Body>
        </Card>
    );
};

export default AdminAboutUsPage;

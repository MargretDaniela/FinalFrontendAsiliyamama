import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AdminImpactPage = () => {
    const [formData, setFormData] = useState({
        main_headline: '',
        card1_value: '',
        card1_description: '',
        card2_value: '',
        card2_description: '',
        card3_value: '',
        card3_description: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

   const API_BASE_URL = 'http://127.0.0.1:5000'; // Your backend API base URL
    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    // Function to fetch current Impact content
    const fetchImpactContent = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/impact/`);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to fetch Impact content. Please ensure your backend is running and configured correctly.');
            console.error('Error fetching Impact content:', err);
            // Set fallback data in case of error
            setFormData({
                main_headline: "Empowered Lives",
                card1_value: 45,
                card1_description: "Children & Youth Empowered",
                card2_value: 8,
                card2_description: "Dedicated Staff Members",
                card3_value: 4,
                card3_description: "Years of Impact",
            });
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // Fetch content on component mount
    useEffect(() => {
        fetchImpactContent();
    }, [fetchImpactContent]);

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

        // Prepare data for backend: ensure values are integers
        const dataToSend = {
            ...formData,
            card1_value: parseInt(formData.card1_value, 10) || 0,
            card2_value: parseInt(formData.card2_value, 10) || 0,
            card3_value: parseInt(formData.card3_value, 10) || 0,
        };

        try {
            await axios.put(`${API_BASE_URL}/api/impact/`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('Impact content updated successfully!');

            // Trigger localStorage event to notify public Impact page (similar to AboutUs)
            localStorage.setItem('lastImpactUpdateTimestamp', Date.now().toString());
            console.log('Admin Impact: Set lastImpactUpdateTimestamp in localStorage.');

        } catch (err) {
            setError('Failed to update Impact content. Please check server and permissions.');
            console.error('Error updating Impact content:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header as="h5" style={{ backgroundColor: '#800000', color: 'white' }}>
                Edit Impact Page Content
            </Card.Header>
            <Card.Body>
                {loading && <p>Loading...</p>}
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && (
                    <Form onSubmit={handleSubmit}>
                        {/* Main Headline */}
                        <Form.Group className="mb-3" controlId="main_headline">
                            <Form.Label>Main Headline</Form.Label>
                            <Form.Control
                                type="text"
                                name="main_headline"
                                value={formData.main_headline}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Card 1 */}
                        <h6 className="mt-4 mb-2">Impact Card 1</h6>
                        <Form.Group className="mb-3" controlId="card1_value">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="number"
                                name="card1_value"
                                value={formData.card1_value}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="card1_description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="card1_description"
                                value={formData.card1_description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Card 2 */}
                        <h6 className="mt-4 mb-2">Impact Card 2</h6>
                        <Form.Group className="mb-3" controlId="card2_value">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="number"
                                name="card2_value"
                                value={formData.card2_value}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="card2_description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="card2_description"
                                value={formData.card2_description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Card 3 */}
                        <h6 className="mt-4 mb-2">Impact Card 3</h6>
                        <Form.Group className="mb-3" controlId="card3_value">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="number"
                                name="card3_value"
                                value={formData.card3_value}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="card3_description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="card3_description"
                                value={formData.card3_description}
                                onChange={handleChange}
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

export default AdminImpactPage;

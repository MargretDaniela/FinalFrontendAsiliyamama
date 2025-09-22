import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSave, FaTrash } from 'react-icons/fa';
import { authenticatedFetch } from '../Latest/authService'; // Adjust path

const MissionDashboard = ({ userType }) => {
    const [formData, setFormData] = useState({
        page_title: '',
        page_intro: '',
        section1_heading: '',
        section1_content: '',
        section1_image: null,
        section2_heading: '',
        section2_content: '',
        section2_image: null,
        cta_heading: '',
        cta_content: '',
        cta_button_text: '',
        cta_button_url: '',
    });
    const [currentImageUrls, setCurrentImageUrls] = useState({ section1: '', section2: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [missionExists, setMissionExists] = useState(false);

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = 'http://localhost:5000';

    const fetchMissionData = useCallback(async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/mission/all`, { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
                setCurrentImageUrls({ section1: data.section1_image_url, section2: data.section2_image_url });
                setMissionExists(true);
            } else if (res.status === 404) {
                setFormData({
                    page_title:'', page_intro:'',
                    section1_heading:'', section1_content:'', section1_image:null,
                    section2_heading:'', section2_content:'', section2_image:null,
                    cta_heading:'', cta_content:'', cta_button_text:'', cta_button_url:''
                });
                setCurrentImageUrls({ section1: '', section2: '' });
                setMissionExists(false);
                setMessage('No mission content found. Fill out the form to create it!');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to fetch mission content.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Failed to fetch mission content.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => { if (isAdmin) fetchMissionData(); }, [fetchMissionData, isAdmin]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'section1_image' || name === 'section2_image') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const form = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== undefined) form.append(key, formData[key]);
        }

        try {
            const endpoint = missionExists ? 'edit' : 'create';
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/mission/${endpoint}`, {
                method: missionExists ? 'PUT' : 'POST',
                body: form
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                fetchMissionData();
            } else {
                setError(data.error || 'Failed to save mission content.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Failed to save mission content.');
        }
    };

    const handleDeleteMission = async () => {
        if (!window.confirm('Are you sure you want to delete all Mission content?')) return;
        setLoading(true); setMessage(''); setError('');
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/mission/delete`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                fetchMissionData();
            } else setError(data.error || 'Failed to delete mission content.');
        } catch (err) {
            console.error(err);
            setError('Network error. Failed to delete mission content.');
        } finally { setLoading(false); }
    };

    if (!isAdmin) return (
        <Container className="my-4"><Alert variant="danger">You do not have permission to view this page.</Alert></Container>
    );

    if (loading) return (
        <Container className="text-center my-5"><Spinner animation="border" /></Container>
    );

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Mission Page</h1>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {isSuperAdmin && missionExists && (
                <div className="mb-4">
                    <Button variant="danger" onClick={handleDeleteMission}><FaTrash /> Delete All Mission Content</Button>
                </div>
            )}

            <Form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-light">
                {/* Mission Header */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Mission Header</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Page Title</Form.Label>
                    <Form.Control type="text" name="page_title" value={formData.page_title || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Intro Paragraph</Form.Label>
                    <Form.Control as="textarea" rows={3} name="page_intro" value={formData.page_intro || ''} onChange={handleChange} required />
                </Form.Group>

                {/* Section 1 */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Section 1</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type="text" name="section1_heading" value={formData.section1_heading || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={4} name="section1_content" value={formData.section1_content || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="section1_image" onChange={handleChange} />
                    {currentImageUrls.section1 && <div className="mt-2"><small>Current Image:</small><img src={currentImageUrls.section1} alt="Section 1" className="img-thumbnail ms-2" style={{height:'70px', objectFit:'cover'}} /></div>}
                </Form.Group>

                {/* Section 2 */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Section 2</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type="text" name="section2_heading" value={formData.section2_heading || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={4} name="section2_content" value={formData.section2_content || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="section2_image" onChange={handleChange} />
                    {currentImageUrls.section2 && <div className="mt-2"><small>Current Image:</small><img src={currentImageUrls.section2} alt="Section 2" className="img-thumbnail ms-2" style={{height:'70px', objectFit:'cover'}} /></div>}
                </Form.Group>

                {/* Call-to-Action */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Call to Action</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type="text" name="cta_heading" value={formData.cta_heading || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" rows={2} name="cta_content" value={formData.cta_content || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Button Text</Form.Label>
                    <Form.Control type="text" name="cta_button_text" value={formData.cta_button_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Button URL</Form.Label>
                    <Form.Control type="text" name="cta_button_url" value={formData.cta_button_url || ''} onChange={handleChange} required />
                </Form.Group>

                <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                    <FaSave /> {missionExists ? 'Update Mission' : 'Create Mission'}
                </Button>
            </Form>
        </Container>
    );
};

export default MissionDashboard;

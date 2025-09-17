import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaSave, FaTrash } from 'react-icons/fa';
import { authenticatedFetch } from '../Latest/authService'; // Adjust this path as needed

const FooterDashboard = ({ userType }) => {
    const [formData, setFormData] = useState({
        logo: null,
        logo_alt_text: '',
        description: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        outreach_heading: '',
        address: '',
        phone: '',
        email: '',
        get_involved_heading: '',
        donor_text: '',
        donor_url: '',
        volunteer_text: '',
        volunteer_url: '',
        membership_text: '',
        membership_url: '',
        committee_heading: '',
        directors_text: '',
        directors_url: '',
        volunteers_text: '',
        volunteers_url: '',
        partners_text: '',
        partners_url: '',
        copyright_text: '',
    });
    const [currentLogoUrl, setCurrentLogoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [footerExists, setFooterExists] = useState(false);

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;
    
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    // const API_BASE_URL = 'http://localhost:5000';

    const fetchFooterData = useCallback(async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/footer/all`, { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    ...data,
                    logo: null, // Don't pre-populate file input
                    ...data.social_media,
                    ...data.outreach,
                    ...data.get_involved,
                    ...data.committee,
                });
                setCurrentLogoUrl(data.logo_url);
                setFooterExists(true);
            } else if (res.status === 404) {
                setFormData({
                    logo: null, logo_alt_text: '', description: '',
                    facebook_url: '', instagram_url: '', twitter_url: '', youtube_url: '',
                    outreach_heading: '', address: '', phone: '', email: '',
                    get_involved_heading: '', donor_text: '', donor_url: '',
                    volunteer_text: '', volunteer_url: '', membership_text: '', membership_url: '',
                    committee_heading: '', directors_text: '', directors_url: '',
                    volunteers_text: '', volunteers_url: '', partners_text: '', partners_url: '',
                    copyright_text: '',
                });
                setCurrentLogoUrl('');
                setFooterExists(false);
                setMessage('No footer content found. Fill out the form to create it!');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to fetch footer content.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Failed to fetch footer content.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => { if (isAdmin) fetchFooterData(); }, [fetchFooterData, isAdmin]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'logo') {
            setFormData(prev => ({ ...prev, logo: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const form = new FormData();
        // Append all text fields
        for (const key in formData) {
            if (key !== 'logo' && formData[key] !== null) {
                form.append(key, formData[key]);
            }
        }
        // Append image file if it exists
        if (formData.logo) {
            form.append('logo', formData.logo);
        }

        try {
            const endpoint = footerExists ? 'edit' : 'create';
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/footer/${endpoint}`, {
                method: footerExists ? 'PUT' : 'POST',
                body: form
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                fetchFooterData();
            } else {
                setError(data.error || 'Failed to save footer content.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Failed to save footer content.');
        }
    };

    const handleDeleteFooter = async () => {
        if (!window.confirm('Are you sure you want to delete all footer content?')) return;
        setLoading(true); setMessage(''); setError('');
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/footer/delete`, { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                fetchFooterData();
            } else {
                setError(data.error || 'Failed to delete footer content.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Failed to delete footer content.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <Container className="my-4">
                <Alert variant="danger">You do not have permission to view this page.</Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Footer</h1>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {isSuperAdmin && footerExists && (
                <div className="mb-4">
                    <Button variant="danger" onClick={handleDeleteFooter}>
                        <FaTrash /> Delete All Footer Content
                    </Button>
                </div>
            )}

            <Form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-light">
                {/* Logo and Description */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Top Section</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Logo Image</Form.Label>
                    <Form.Control type="file" name="logo" onChange={handleChange} />
                    {currentLogoUrl && (
                        <div className="mt-2">
                            <small>Current Logo:</small>
                            <img src={currentLogoUrl} alt="Current Logo" className="img-thumbnail ms-2" style={{ height: '70px', objectFit: 'cover' }} />
                        </div>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Logo Alt Text</Form.Label>
                    <Form.Control type="text" name="logo_alt_text" value={formData.logo_alt_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} name="description" value={formData.description || ''} onChange={handleChange} required />
                </Form.Group>

                {/* Social Media */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Social Media Links</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Facebook URL</Form.Label>
                    <Form.Control type="url" name="facebook_url" value={formData.facebook_url || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Instagram URL</Form.Label>
                    <Form.Control type="url" name="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Twitter URL</Form.Label>
                    <Form.Control type="url" name="twitter_url" value={formData.twitter_url || ''} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Youtube URL</Form.Label>
                    <Form.Control type="url" name="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} />
                </Form.Group>

                {/* Outreach Section */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Outreach</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type="text" name="outreach_heading" value={formData.outreach_heading || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                </Form.Group>

                {/* Get Involved Section */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Get Involved</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type="text" name="get_involved_heading" value={formData.get_involved_heading || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Donor Link Text</Form.Label>
                    <Form.Control type="text" name="donor_text" value={formData.donor_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Donor URL</Form.Label>
                    <Form.Control type="text" name="donor_url" value={formData.donor_url || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Volunteer Link Text</Form.Label>
                    <Form.Control type="text" name="volunteer_text" value={formData.volunteer_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Volunteer URL</Form.Label>
                    <Form.Control type="text" name="volunteer_url" value={formData.volunteer_url || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Membership Link Text</Form.Label>
                    <Form.Control type="text" name="membership_text" value={formData.membership_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Membership URL</Form.Label>
                    <Form.Control type="text" name="membership_url" value={formData.membership_url || ''} onChange={handleChange} required />
                </Form.Group>

                {/* Committee Section */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Committee</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control type="text" name="committee_heading" value={formData.committee_heading || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Directors Link Text</Form.Label>
                    <Form.Control type="text" name="directors_text" value={formData.directors_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Directors URL</Form.Label>
                    <Form.Control type="text" name="directors_url" value={formData.directors_url || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Volunteers Link Text</Form.Label>
                    <Form.Control type="text" name="volunteers_text" value={formData.volunteers_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Volunteers URL</Form.Label>
                    <Form.Control type="text" name="volunteers_url" value={formData.volunteers_url || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Partners Link Text</Form.Label>
                    <Form.Control type="text" name="partners_text" value={formData.partners_text || ''} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Partners URL</Form.Label>
                    <Form.Control type="text" name="partners_url" value={formData.partners_url || ''} onChange={handleChange} required />
                </Form.Group>

                {/* Copyright */}
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Copyright</h2>
                <Form.Group className="mb-5">
                    <Form.Label>Copyright Text</Form.Label>
                    <Form.Control type="text" name="copyright_text" value={formData.copyright_text || ''} onChange={handleChange} required />
                    <Form.Text className="text-muted">Use '&#123;YEAR&#125;' as a placeholder for the current year, e.g., '© &#123;YEAR&#125; Asili Yamama Generation. All rights reserved.'</Form.Text>
                </Form.Group>

                <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                    <FaSave /> {footerExists ? 'Update Footer' : 'Create Footer'}
                </Button>
            </Form>
        </Container>
    );
};

export default FooterDashboard;
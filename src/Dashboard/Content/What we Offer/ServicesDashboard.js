import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, ButtonGroup, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from 'react-icons/fa';
import { authenticatedFetch } from '../Latest/authService';

const ServicesDashboard = ({ userType }) => {
    const [services, setServices] = useState([]);
    // Updated headerData state to include button_text and button_url
    const [headerData, setHeaderData] = useState({ 
        page_title: '', 
        page_description: '',
        button_text: '',
        button_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showServiceModal, setShowServiceModal] = useState(false); // Modal for adding/editing services
    const [showHeaderModal, setShowHeaderModal] = useState(false);   // Modal for editing header
    const [showViewModal, setShowViewModal] = useState(false);       // Modal for viewing service details
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [viewService, setViewService] = useState(null); // Service currently being viewed
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null, // This will hold the File object
    });

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;

    const API_BASE_URL = process.env.REACT_APP_API_URL;
    
    // --- Fetching Data ---
    const fetchServicesData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/services/`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.ok) {
                setHeaderData(data.header);
                setServices(data.services);
            } else {
                setError(data.error || 'Failed to fetch services data.');
            }
        } catch (err) {
            console.error('Error fetching services data:', err);
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchServicesData();
    }, [fetchServicesData]);

    // --- Service CRUD Operations ---
    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentService(null);
        setFormData({ name: '', description: '', image: null });
        setShowServiceModal(true);
    };

    const handleEditClick = (service) => {
        setIsEditing(true);
        setCurrentService(service);
        setFormData({
            name: service.name,
            description: service.description,
            image: null, // User will re-upload if needed
        });
        setShowServiceModal(true);
    };

    const handleViewClick = (service) => {
        setViewService(service);
        setShowViewModal(true);
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/services/delete/${serviceId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchServicesData();
                alert('Service deleted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete service.');
            }
        } catch (err) {
            alert('Network error. Failed to delete service.');
        }
    };

    const handleServiceFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        
        if (formData.image) {
            form.append('image', formData.image);
        }
        
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${API_BASE_URL}/api/v1/services/edit/${currentService.id}`
            : `${API_BASE_URL}/api/v1/services/create`;

        try {
            const res = await authenticatedFetch(url, {
                method,
                body: form,
            });
            if (res.ok) {
                fetchServicesData();
                setShowServiceModal(false);
                alert(`Service ${isEditing ? 'updated' : 'created'} successfully!`);
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${isEditing ? 'update' : 'create'} service.`);
            }
        } catch (err) {
            // This alert is specifically for network-level issues
            alert('Network error. Failed to save service. Please check your connection and the backend server status.');
        }
    };

    // --- Header and Button Management ---
    const handleHeaderEdit = () => {
        setShowHeaderModal(true);
    };

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeaderData(prev => ({ ...prev, [name]: value }));
    };

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/services/header`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(headerData), // Send updated headerData including button fields
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchServicesData(); // Re-fetch to update the displayed header and button
                setShowHeaderModal(false);
            } else {
                alert(data.error || 'Failed to update header.');
            }
        } catch (err) {
            alert('Network error. Failed to update header. Please check your connection and the backend server status.');
        }
    };

    // --- Download Data ---
    const handleDownload = () => {
        if (isSuperAdmin) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(services, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "services_data.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('You do not have permission to download this data.');
        }
    };

    // --- Render Table ---
    const renderServicesTable = (servicesList) => (
        <Table striped bordered hover responsive className="shadow-sm">
            <thead>
                <tr style={{ backgroundColor: '#521c23ff', color: 'white' }}>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {servicesList.map(service => (
                    <tr key={service.id}>
                        <td>{service.id}</td>
                        <td>
                            {service.image_url && (
                                <Image
                                    src={service.image_url}
                                    roundedCircle
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            )}
                        </td>
                        <td>{service.name}</td>
                        <td>{service.description.substring(0, 70)}...</td> {/* Show truncated description */}
                        <td>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => handleViewClick(service)}
                                    variant="info"
                                >
                                    <FaEye />
                                </Button>
                                <Button
                                    onClick={() => handleEditClick(service)}
                                    variant="success"
                                    disabled={!isAdmin}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(service.id)}
                                    variant="danger"
                                    disabled={!isSuperAdmin}
                                >
                                    <FaTrash />
                                </Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Services</h1>
            
            <div className="d-flex justify-content-between mb-3 align-items-center">
                {/* Left side: Header Edit & Add Service buttons */}
                {isAdmin && (
                    <div>
                        <Button onClick={handleHeaderEdit} variant="outline-secondary" className="me-2">
                            <FaEdit /> Edit Header & Button
                        </Button>
                        <Button onClick={handleCreateClick} style={{ backgroundColor: '#521c23ff', color: '#ffffff', outline: '#521c23ff' }}>
                            <FaPlus /> Add Service
                        </Button>
                    </div>
                )}
                {/* Right side: Download Data button */}
                {isSuperAdmin && (
                    <Button onClick={handleDownload} variant="primary">
                        <FaDownload /> Download Data
                    </Button>
                )}
            </div>
            
            <h2 style={{ color: '#3c0008' }}>All Services</h2>
            
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    {renderServicesTable(services)}
                </>
            )}

            {/* Modal for Add/Edit Service */}
            <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Service' : 'Add New Service'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleServiceSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleServiceFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleServiceFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleServiceFormChange} required={!isEditing} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowServiceModal(false)}>Cancel</Button>
                        <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                            <FaSave /> Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for View Service Details */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Service Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {viewService && (
                        <div>
                            {viewService.image_url && (
                                <Image
                                    src={viewService.image_url}
                                    style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem', borderRadius: '8px' }}
                                    alt={viewService.name}
                                />
                            )}
                            <h4>{viewService.name}</h4>
                            <p>{viewService.description}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Edit Header and Button */}
            <Modal show={showHeaderModal} onHide={() => setShowHeaderModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Services Page Header & Button</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleHeaderSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Page Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="page_title" 
                                value={headerData.page_title} 
                                onChange={handleHeaderChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Page Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="page_description" 
                                value={headerData.page_description} 
                                onChange={handleHeaderChange} 
                                required 
                            />
                        </Form.Group>
                        <hr />
                        <h6>"View All Programs" Button</h6>
                        <Form.Group className="mb-3">
                            <Form.Label>Button Text</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="button_text" 
                                value={headerData.button_text} 
                                onChange={handleHeaderChange} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Button URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="button_url" 
                                value={headerData.button_url} 
                                onChange={handleHeaderChange} 
                                required 
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowHeaderModal(false)}>Cancel</Button>
                        <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                            <FaSave /> Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ServicesDashboard;

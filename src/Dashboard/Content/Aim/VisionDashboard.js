import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, ButtonGroup, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload} from 'react-icons/fa';
import { authenticatedFetch } from '../Latest/authService'; // Corrected path assuming VisionDashboard is two levels deep from src/

const VisionDashboard = ({ userType }) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    const [visionContent, setVisionContent] = useState(null);
    const [visionPoints, setVisionPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showContentModal, setShowContentModal] = useState(false); // Modal for editing main vision content
    const [showPointModal, setShowPointModal] = useState(false);     // Modal for adding/editing vision points
    const [showViewModal, setShowViewModal] = useState(false);       // Modal for viewing vision point details

    const [isEditingPoint, setIsEditingPoint] = useState(false);
    const [currentPoint, setCurrentPoint] = useState(null);
    const [viewPoint, setViewPoint] = useState(null);

    // Form data for main vision content
    const [contentFormData, setContentFormData] = useState({
        banner_image: null, // File object
        page_title: '',
        page_subtitle: '',
        statement_title: '',
        statement_text: '',
        call_to_action_text: '',
        button_text: '',
        button_url: ''
    });

    // Form data for individual vision points
    const [pointFormData, setPointFormData] = useState({
        icon_class: '',
        title: '',
        description: '',
        order: 0
    });

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;

    // const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your Flask backend URL

    // --- Fetching Data ---
    const fetchVisionData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/vision/`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.ok) {
                setVisionContent(data.content);
                setVisionPoints(data.points);
                // Initialize content form data with fetched data
                setContentFormData({
                    banner_image: null, // Don't pre-fill image file, user re-uploads
                    page_title: data.content.page_title,
                    page_subtitle: data.content.page_subtitle,
                    statement_title: data.content.statement_title,
                    statement_text: data.content.statement_text,
                    call_to_action_text: data.content.call_to_action_text,
                    button_text: data.content.button_text,
                    button_url: data.content.button_url
                });
            } else {
                setError(data.error || 'Failed to fetch vision data.');
            }
        } catch (err) {
            console.error('Error fetching vision data:', err);
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchVisionData();
    }, [fetchVisionData]);

    // --- Main Vision Content Operations ---
    const handleEditContentClick = () => {
        setShowContentModal(true);
    };

    const handleContentFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'banner_image') {
            setContentFormData(prev => ({ ...prev, banner_image: files[0] }));
        } else {
            setContentFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        
        // Append all text fields
        for (const key in contentFormData) {
            if (key !== 'banner_image' && contentFormData[key] !== null) {
                form.append(key, contentFormData[key]);
            }
        }
        
        // Append image file if present
        if (contentFormData.banner_image) {
            form.append('banner_image', contentFormData.banner_image);
        }

        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/vision/content`, {
                method: 'PUT',
                body: form, // FormData handles 'multipart/form-data'
            });
            if (res.ok) {
                fetchVisionData(); // Re-fetch to update the displayed content
                setShowContentModal(false);
                alert('Vision content updated successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update vision content.');
            }
        } catch (err) {
            alert('Network error. Failed to save vision content. Please check your connection and the backend server status.');
        }
    };

    // --- Vision Point CRUD Operations ---
    const handleCreatePointClick = () => {
        setIsEditingPoint(false);
        setCurrentPoint(null);
        setPointFormData({ icon_class: '', title: '', description: '', order: visionPoints.length + 1 });
        setShowPointModal(true);
    };

    const handleEditPointClick = (point) => {
        setIsEditingPoint(true);
        setCurrentPoint(point);
        setPointFormData({
            icon_class: point.icon_class,
            title: point.title,
            description: point.description,
            order: point.order
        });
        setShowPointModal(true);
    };

    const handleViewPointClick = (point) => {
        setViewPoint(point);
        setShowViewModal(true);
    };

    const handleDeletePoint = async (pointId) => {
        if (!window.confirm('Are you sure you want to delete this vision point?')) return;
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/vision/points/delete/${pointId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchVisionData();
                alert('Vision point deleted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete vision point.');
            }
        } catch (err) {
            alert('Network error. Failed to delete vision point.');
        }
    };

    const handlePointFormChange = (e) => {
        const { name, value } = e.target;
        setPointFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePointSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('icon_class', pointFormData.icon_class);
        form.append('title', pointFormData.title);
        form.append('description', pointFormData.description);
        form.append('order', pointFormData.order);
        
        const method = isEditingPoint ? 'PUT' : 'POST';
        const url = isEditingPoint
            ? `${API_BASE_URL}/api/v1/vision/points/edit/${currentPoint.id}`
            : `${API_BASE_URL}/api/v1/vision/points/create`;

        try {
            const res = await authenticatedFetch(url, {
                method,
                body: form,
            });
            if (res.ok) {
                fetchVisionData();
                setShowPointModal(false);
                alert(`Vision point ${isEditingPoint ? 'updated' : 'created'} successfully!`);
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${isEditingPoint ? 'update' : 'create'} vision point.`);
            }
        } catch (err) {
            alert('Network error. Failed to save vision point. Please check your connection and the backend server status.');
        }
    };

    // --- Download Data ---
    const handleDownload = () => {
        if (isSuperAdmin) {
            const dataToDownload = {
                visionContent: visionContent,
                visionPoints: visionPoints
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToDownload, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "vision_data.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('You do not have permission to download this data.');
        }
    };

    // --- Render Table ---
    const renderVisionPointsTable = (pointsList) => (
        <Table striped bordered hover responsive className="shadow-sm">
            <thead>
                <tr style={{ backgroundColor: '#521c23ff', color: 'white' }}>
                    <th>ID</th>
                    <th>Order</th>
                    <th>Icon Class</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {pointsList.map(point => (
                    <tr key={point.id}>
                        <td>{point.id}</td>
                        <td>{point.order}</td>
                        <td><i className={point.icon_class} style={{ fontSize: '1.2rem', color: '#992525' }}></i> {point.icon_class}</td>
                        <td>{point.title}</td>
                        <td>{point.description.substring(0, 70)}...</td> {/* Show truncated description */}
                        <td>
                            <ButtonGroup size="sm">
                                <Button onClick={() => handleViewPointClick(point)} variant="info">
                                    <FaEye />
                                </Button>
                                <Button onClick={() => handleEditPointClick(point)} variant="success" disabled={!isAdmin}>
                                    <FaEdit />
                                </Button>
                                <Button onClick={() => handleDeletePoint(point.id)} variant="danger" disabled={!isSuperAdmin}>
                                    <FaTrash />
                                </Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    if (loading) {
        return <Container className="my-4 text-center"><Spinner animation="border" /> <p>Loading dashboard...</p></Container>;
    }

    if (error) {
        return <Container className="my-4"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Vision Page</h1>
            
            <div className="d-flex justify-content-between mb-3 align-items-center">
                {/* Left side: Edit Content & Add Point buttons */}
                {isAdmin && (
                    <div>
                        <Button onClick={handleEditContentClick} variant="outline-secondary" className="me-2">
                            <FaEdit /> Edit Main Content
                        </Button>
                        <Button onClick={handleCreatePointClick} style={{ backgroundColor: '#521c23ff', color: '#ffffff', outline: '#521c23ff' }}>
                            <FaPlus /> Add Vision Point
                        </Button>
                    </div>
                )}
                {/* Right side: Download Data button */}
                {isSuperAdmin && (
                    <Button onClick={handleDownload} variant="primary">
                        <FaDownload /> Download All Vision Data
                    </Button>
                )}
            </div>
            
            {/* Display Current Main Vision Content */}
            {visionContent && (
                <div className="mb-5 p-4 border rounded shadow-sm">
                    <h3 style={{ color: '#3c0008' }}>Current Main Vision Content</h3>
                    <p><strong>Page Title:</strong> {visionContent.page_title}</p>
                    <p><strong>Page Subtitle:</strong> {visionContent.page_subtitle}</p>
                    <p><strong>Statement Title:</strong> {visionContent.statement_title}</p>
                    <p><strong>Statement Text:</strong> {visionContent.statement_text}</p>
                    <p><strong>Call to Action:</strong> {visionContent.call_to_action_text}</p>
                    <p><strong>Button Text:</strong> {visionContent.button_text}</p>
                    <p><strong>Button URL:</strong> {visionContent.button_url}</p>
                    <p><strong>Banner Image:</strong></p>
                    {visionContent.banner_image_url ? (
                        <Image src={visionContent.banner_image_url} thumbnail style={{ maxHeight: '150px' }} />
                    ) : (
                        <span>No banner image set.</span>
                    )}
                </div>
            )}

            <h2 style={{ color: '#3c0008' }}>All Vision Points</h2>
            
            {visionPoints.length === 0 ? (
                <Alert variant="info">No vision points available. Click "Add Vision Point" to create one.</Alert>
            ) : (
                renderVisionPointsTable(visionPoints)
            )}

            {/* Modal for Edit Main Vision Content */}
            <Modal show={showContentModal} onHide={() => setShowContentModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Main Vision Page Content</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleContentSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Page Title</Form.Label>
                            <Form.Control type="text" name="page_title" value={contentFormData.page_title} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Page Subtitle</Form.Label>
                            <Form.Control as="textarea" name="page_subtitle" value={contentFormData.page_subtitle} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vision Statement Title</Form.Label>
                            <Form.Control type="text" name="statement_title" value={contentFormData.statement_title} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Vision Statement Text</Form.Label>
                            <Form.Control as="textarea" rows={5} name="statement_text" value={contentFormData.statement_text} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Call to Action Text</Form.Label>
                            <Form.Control as="textarea" name="call_to_action_text" value={contentFormData.call_to_action_text} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Button Text</Form.Label>
                            <Form.Control type="text" name="button_text" value={contentFormData.button_text} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Button URL</Form.Label>
                            <Form.Control type="text" name="button_url" value={contentFormData.button_url} onChange={handleContentFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Banner Image (Current: {visionContent?.banner_image_url ? 'Yes' : 'No'})</Form.Label>
                            <Form.Control type="file" name="banner_image" onChange={handleContentFormChange} />
                            {visionContent?.banner_image_url && <small className="text-muted">Upload a new image to replace the current one.</small>}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowContentModal(false)}>Cancel</Button>
                        <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                            <FaSave /> Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for Add/Edit Vision Point */}
            <Modal show={showPointModal} onHide={() => setShowPointModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingPoint ? 'Edit Vision Point' : 'Add New Vision Point'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handlePointSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Icon Class (e.g., `bi bi-megaphone`)</Form.Label>
                            <Form.Control type="text" name="icon_class" value={pointFormData.icon_class} onChange={handlePointFormChange} required />
                            <Form.Text className="text-muted">
                                Use Bootstrap Icons classes. Example: `bi bi-megaphone`, `bi bi-heart-pulse`.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={pointFormData.title} onChange={handlePointFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={pointFormData.description} onChange={handlePointFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Order</Form.Label>
                            <Form.Control type="number" name="order" value={pointFormData.order} onChange={handlePointFormChange} />
                            <Form.Text className="text-muted">
                                Determines the display order of the vision points. Lower numbers appear first.
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPointModal(false)}>Cancel</Button>
                        <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                            <FaSave /> Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for View Vision Point Details */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Vision Point Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {viewPoint && (
                        <div>
                            <i className={viewPoint.icon_class} style={{ fontSize: '3rem', color: '#992525', marginBottom: '1rem' }}></i>
                            <h4>{viewPoint.title}</h4>
                            <p>{viewPoint.description}</p>
                            <p><strong>Order:</strong> {viewPoint.order}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default VisionDashboard;

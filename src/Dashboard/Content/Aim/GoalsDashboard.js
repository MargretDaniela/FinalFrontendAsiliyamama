import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, ButtonGroup, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from 'react-icons/fa';
import { authenticatedFetch } from '../Latest/authService'; // Assuming the path is correct

const GoalsDashboard = ({ userType }) => {
    const [goals, setGoals] = useState([]);
    const [headerData, setHeaderData] = useState({ 
        page_title: '', 
        page_description: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showGoalModal, setShowGoalModal] = useState(false); // Modal for adding/editing goals
    const [showHeaderModal, setShowHeaderModal] = useState(false); // Modal for editing header
    const [showViewModal, setShowViewModal] = useState(false); // Modal for viewing goal details
    const [isEditing, setIsEditing] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [viewGoal, setViewGoal] = useState(null); // Goal currently being viewed
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null, // This will hold the File object
    });

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;
    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your Flask backend URL

    // --- Fetching Data ---
    const fetchGoalsData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/goals/`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.ok) {
                setHeaderData(data.header);
                // Sort the goals array directly before setting the state
                const sortedGoals = data.goals.sort((a, b) => b.id - a.id);
                setGoals(sortedGoals);
            } else {
                setError(data.error || 'Failed to fetch goals data.');
            }
        } catch (err) {
            console.error('Error fetching goals data:', err);
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchGoalsData();
    }, [fetchGoalsData]);

    // This line was causing the error and has been removed:
    // const sortedGoals = fetchGoalsData.sort((a, b) => b.id - a.id);
    // setGoals(sortedGoals);

    // --- Goal CRUD Operations ---
    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentGoal(null);
        setFormData({ title: '', description: '', image: null });
        setShowGoalModal(true);
    };

    const handleEditClick = (goal) => {
        setIsEditing(true);
        setCurrentGoal(goal);
        setFormData({
            title: goal.title,
            description: goal.description,
            image: null, // User will re-upload if needed
        });
        setShowGoalModal(true);
    };

    const handleViewClick = (goal) => {
        setViewGoal(goal);
        setShowViewModal(true);
    };

    const handleDelete = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/goals/delete/${goalId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchGoalsData();
                alert('Goal deleted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete goal.');
            }
        } catch (err) {
            alert('Network error. Failed to delete goal.');
        }
    };

    const handleGoalFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGoalSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        
        if (formData.image) {
            form.append('image', formData.image);
        }
        
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${API_BASE_URL}/api/v1/goals/edit/${currentGoal.id}`
            : `${API_BASE_URL}/api/v1/goals/create`;

        try {
            const res = await authenticatedFetch(url, {
                method,
                body: form,
            });
            if (res.ok) {
                fetchGoalsData();
                setShowGoalModal(false);
                alert(`Goal ${isEditing ? 'updated' : 'created'} successfully!`);
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${isEditing ? 'update' : 'create'} goal.`);
            }
        } catch (err) {
            alert('Network error. Failed to save goal. Please check your connection and the backend server status.');
        }
    };

    // --- Header Management ---
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
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/goals/header`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(headerData),
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchGoalsData(); // Re-fetch to update the displayed header
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
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(goals, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "goals_data.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('You do not have permission to download this data.');
        }
    };

    // --- Render Table ---
    const renderGoalsTable = (goalsList) => (
        <Table striped bordered hover responsive className="shadow-sm">
            <thead>
                <tr style={{ backgroundColor: '#521c23ff', color: 'white' }}>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {goalsList.map(goal => (
                    <tr key={goal.id}>
                        <td>{goal.id}</td>
                        <td>
                            {goal.image_url && (
                                <Image
                                    src={goal.image_url}
                                    roundedCircle
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            )}
                        </td>
                        <td>{goal.title}</td>
                        <td>{goal.description.substring(0, 70)}...</td> {/* Show truncated description */}
                        <td>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => handleViewClick(goal)}
                                    variant="info"
                                >
                                    <FaEye />
                                </Button>
                                <Button
                                    onClick={() => handleEditClick(goal)}
                                    variant="success"
                                    disabled={!isAdmin}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(goal.id)}
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
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Goals</h1>
            
            <div className="d-flex justify-content-between mb-3 align-items-center">
                {/* Left side: Header Edit & Add Goal buttons */}
                {isAdmin && (
                    <div>
                        <Button onClick={handleHeaderEdit} variant="outline-secondary" className="me-2">
                            <FaEdit /> Edit Header
                        </Button>
                        <Button onClick={handleCreateClick} style={{ backgroundColor: '#521c23ff', color: '#ffffff', outline: '#521c23ff' }}>
                            <FaPlus /> Add Goal
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
            
            <h2 style={{ color: '#3c0008' }}>All Goals</h2>
            
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    {renderGoalsTable(goals)}
                </>
            )}

            {/* Modal for Add/Edit Goal */}
            <Modal show={showGoalModal} onHide={() => setShowGoalModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Goal' : 'Add New Goal'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGoalSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Goal Title</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={handleGoalFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleGoalFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleGoalFormChange} required={!isEditing} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowGoalModal(false)}>Cancel</Button>
                        <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                            <FaSave /> Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for View Goal Details */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Goal Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {viewGoal && (
                        <div>
                            {viewGoal.image_url && (
                                <Image
                                    src={viewGoal.image_url}
                                    style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem', borderRadius: '8px' }}
                                    alt={viewGoal.title}
                                />
                            )}
                            <h4>{viewGoal.title}</h4>
                            <p>{viewGoal.description}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Edit Header */}
            <Modal show={showHeaderModal} onHide={() => setShowHeaderModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Goals Page Header</Modal.Title>
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

export default GoalsDashboard;
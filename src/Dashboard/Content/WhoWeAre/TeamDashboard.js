// DashboardTeam.js
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, ButtonGroup, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaFacebookF, FaTwitter, FaLinkedinIn, FaEye, FaDownload } from 'react-icons/fa'; // Added FaEye and FaDownload
import { authenticatedFetch } from '../Latest/authService';

const DashboardTeam = ({ userType }) => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [headerData, setHeaderData] = useState({ page_title: '', page_description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showHeaderModal, setShowHeaderModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false); // State for the new view modal
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [viewMember, setViewMember] = useState(null); // State for the member being viewed
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        description: '',
        image: null,
        category: 'board',
        socials: { fb: '', tw: '', li: '' }
    });

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;

    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = 'http://localhost:5000';

    const fetchTeamData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/team/`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.ok) {
                setHeaderData(data.header);
                setTeamMembers(data.members);
            } else {
                setError(data.error || 'Failed to fetch team data.');
            }
        } catch (err) {
            console.error('Error fetching team data:', err);
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        fetchTeamData();
    }, [fetchTeamData]);

    const handleCreateClick = () => {
        setIsEditing(false);
        setCurrentMember(null);
        setFormData({
            name: '',
            role: '',
            description: '',
            image: null,
            category: 'board',
            socials: { fb: '', tw: '', li: '' }
        });
        setShowModal(true);
    };
    
    // Handler to show the view modal
    const handleViewClick = (member) => {
        setViewMember(member);
        setShowViewModal(true);
    };

    const handleEditClick = (member) => {
        setIsEditing(true);
        setCurrentMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            description: member.description,
            image: null,
            category: member.category,
            socials: member.socials
        });
        setShowModal(true);
    };

    const handleHeaderEdit = () => {
        setShowHeaderModal(true);
    };

    const handleHeaderSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/team/header`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(headerData),
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchTeamData();
                setShowHeaderModal(false);
            } else {
                alert(data.error || 'Failed to update header.');
            }
        } catch (err) {
            alert('Network error. Failed to update header.');
        }
    };

    const handleDelete = async (memberId) => {
        if (!window.confirm('Are you sure you want to delete this team member?')) return;
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/team/delete/${memberId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchTeamData();
                alert('Team member deleted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete team member.');
            }
        } catch (err) {
            alert('Network error. Failed to delete team member.');
        }
    };

    const handleDownload = () => {
        if (isSuperAdmin) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teamMembers, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "team_members.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('You do not have permission to download this data.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else if (name.startsWith('socials.')) {
            const socialKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socials: {
                    ...prev.socials,
                    [socialKey]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeaderData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('role', formData.role);
        form.append('description', formData.description);
        form.append('category', formData.category);
        
        if (formData.image) {
            form.append('image', formData.image);
        }
        
        form.append('facebook_url', formData.socials.fb);
        form.append('twitter_url', formData.socials.tw);
        form.append('linkedin_url', formData.socials.li);
        
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `${API_BASE_URL}/api/v1/team/edit/${currentMember.id}`
            : `${API_BASE_URL}/api/v1/team/create`;

        try {
            const res = await authenticatedFetch(url, {
                method,
                body: form,
            });
            if (res.ok) {
                fetchTeamData();
                setShowModal(false);
                alert(`Team member ${isEditing ? 'updated' : 'created'} successfully!`);
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${isEditing ? 'update' : 'create'} team member.`);
            }
        } catch (err) {
            alert('Network error. Failed to save team member.');
        }
    };

    const renderTeamTable = (members) => (
        <Table striped bordered hover responsive className="shadow-sm">
            <thead>
                <tr style={{ backgroundColor: '#521c23ff', color: 'white' }}>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {members.map(member => (
                    <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>
                            {member.image_url && (
                                <Image
                                    src={member.image_url}
                                    roundedCircle
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            )}
                        </td>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>{member.category === 'board' ? 'Board of Directors' : 'Operations'}</td>
                        <td>
                            <ButtonGroup size="sm">
                                <Button
                                    onClick={() => handleViewClick(member)}
                                    variant="info"
                                >
                                    <FaEye />
                                </Button>
                                <Button
                                    onClick={() => handleEditClick(member)}
                                    variant="success"
                                    disabled={!isAdmin}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    onClick={() => handleDelete(member.id)}
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
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Our Team</h1>
            
            <div className="d-flex justify-content-between mb-3">
                {isAdmin && (
                    <div>
                        <Button onClick={handleHeaderEdit} variant="outline-secondary" className="me-2">
                            <FaEdit /> Edit Header
                        </Button>
                        <Button onClick={handleCreateClick} style={{ backgroundColor: '#521c23ff', color: '#ffffff', outline: '#521c23ff' }}>
                            <FaPlus /> Add Member
                        </Button>
                    </div>
                )}
                {isSuperAdmin && (
                    <Button onClick={handleDownload} variant="primary">
                        <FaDownload /> Download Data
                    </Button>
                )}
            </div>
            
            <h2 style={{ color: '#3c0008' }}>Team Members</h2>
            
            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    {renderTeamTable(teamMembers)}
                </>
            )}

            {/* Modal for Add/Edit Team Member */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" name="role" value={formData.role} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleFormChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleFormChange} required={!isEditing} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleFormChange} required>
                                <option value="board">Board of Directors</option>
                                <option value="operations">Operations Team</option>
                            </Form.Select>
                        </Form.Group>
                        <hr />
                        <h6>Social Media Links</h6>
                        <Form.Group className="mb-3">
                            <Form.Label><FaFacebookF /> Facebook</Form.Label>
                            <Form.Control type="text" name="socials.fb" value={formData.socials.fb} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaTwitter /> Twitter</Form.Label>
                            <Form.Control type="text" name="socials.tw" value={formData.socials.tw} onChange={handleFormChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaLinkedinIn /> LinkedIn</Form.Label>
                            <Form.Control type="text" name="socials.li" value={formData.socials.li} onChange={handleFormChange} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                            <FaSave /> Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal for View Team Member */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Team Member</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {viewMember && (
                        <div>
                            {viewMember.image_url && (
                                <Image
                                    src={viewMember.image_url}
                                    roundedCircle
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', marginBottom: '1rem' }}
                                />
                            )}
                            <h4>{viewMember.name}</h4>
                            <p className="text-muted">{viewMember.role}</p>
                            <p>{viewMember.description}</p>
                            <hr />
                            <h6>Social Media</h6>
                            <div className="d-flex justify-content-center">
                                {viewMember.socials.fb && (
                                    <a href={viewMember.socials.fb} target="_blank" rel="noopener noreferrer" className="me-2 text-decoration-none">
                                        <FaFacebookF size={24} color="#3b5998" />
                                    </a>
                                )}
                                {viewMember.socials.tw && (
                                    <a href={viewMember.socials.tw} target="_blank" rel="noopener noreferrer" className="me-2 text-decoration-none">
                                        <FaTwitter size={24} color="#1da1f2" />
                                    </a>
                                )}
                                {viewMember.socials.li && (
                                    <a href={viewMember.socials.li} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                        <FaLinkedinIn size={24} color="#0077b5" />
                                    </a>
                                )}
                            </div>
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
                    <Modal.Title>Edit Team Page Header</Modal.Title>
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
                            <FaSave /> Save Header
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default DashboardTeam;
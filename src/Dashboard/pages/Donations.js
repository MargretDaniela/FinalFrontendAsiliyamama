import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaDollarSign, FaTag, FaStickyNote, FaRedoAlt, FaDownload, FaEye, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { authenticatedFetch } from './authService';

const Donations = ({ userType }) => {
    // Corrected API_BASE_URL for the backend
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    // const API_BASE_URL = 'http://localhost:5000';

    // Consolidated state for all donations
    const [donations, setDonations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        amount: '',
        currency: 'UGX',
        type: '',
        frequency: 'one_time',
        note: '',
    });

    const [newDonorDetails, setNewDonorDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
    });

    const [createLoading, setCreateLoading] = useState(false);
    const [createSuccessMessage, setCreateSuccessMessage] = useState('');
    const [createErrorMessage, setCreateErrorMessage] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDonation, setCurrentDonation] = useState(null);
    const [editFormData, setEditFormData] = useState({
        amount: '',
        currency: '',
        type: '',
        frequency: '',
        note: '',
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editSuccessMessage, setEditSuccessMessage] = useState('');
    const [editErrorMessage, setEditErrorMessage] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [donationToDelete, setDonationToDelete] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [donationToView, setDonationToView] = useState(null);

    const [downloadLoading, setDownloadLoading] = useState(false);

    const isSuperAdmin = userType === 'super_admin';
    const isAdmin = userType === 'admin' || isSuperAdmin;

    const ALLOWED_DONATION_TYPES = ['cash', 'goods', 'service'];
    const ALLOWED_FREQUENCIES = ['one_time', 'monthly', 'yearly'];
    const ALLOWED_CURRENCIES = ['UGX', 'USD', 'EUR'];

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getCurrencySymbol = (currency) => {
        switch (currency) {
            case 'UGX':
                return 'Shs';
            case 'EUR':
                return '€';
            case 'USD':
            default:
                return '$';
        }
    };

    const fetchDonations = useCallback(async () => {
        setLoading(true);
        setError('');
        setDonations([]);

        // Only admins and super admins are allowed to fetch donations
        if (!isAdmin && !isSuperAdmin) {
            setError("You do not have permission to view donations.");
            setLoading(false);
            return;
        }

        try {
            const endpoint = `${API_BASE_URL}/api/v1/donations/all/detailed`;
            const response = await authenticatedFetch(endpoint);
            const data = await response.json();

            if (response.ok) {
                const donationsData = data.donations;
                if (Array.isArray(donationsData)) {
                    setDonations(donationsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
                } else {
                    setError('Received invalid data from the server.');
                }
            } else {
                setError(data.message || data.error || `Failed to fetch donations. Status: ${response.status}`);
            }

        } catch (networkError) {
            console.error('Network error fetching donations:', networkError);
            setError('Could not connect to the server. Please ensure the backend is running and reachable.');
        } finally {
            setLoading(false);
        }
    }, [isAdmin, isSuperAdmin, API_BASE_URL]);


    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);


    // --- Create Donation Modal Handlers ---
    const handleCreateFormChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleDonorDetailsChange = (e) => {
        const { name, value } = e.target;
        setNewDonorDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleCreateDonationSubmit = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        setCreateSuccessMessage('');
        setCreateErrorMessage('');

        const { amount, note } = createFormData;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setCreateErrorMessage("Amount must be a positive number.");
            setCreateLoading(false);
            return;
        }

        const payload = {
            ...createFormData,
            amount: parseFloat(amount),
            note: note || null,
            ...newDonorDetails,
        };

        try {
            const endpoint = `${API_BASE_URL}/api/v1/donations/create`;

            // Note: The create endpoint is public, but we can still use authenticatedFetch
            // with an optional token if needed, as implemented in the backend.
            const response = await authenticatedFetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setCreateSuccessMessage(data.message || 'Donation created successfully!');
                setCreateFormData({ amount: '', currency: 'UGX', type: '', frequency: 'one_time', note: '' });
                setNewDonorDetails({ firstName: '', lastName: '', email: '', contact: '' });
                setTimeout(() => {
                    setShowCreateModal(false);
                    fetchDonations();
                }, 1500);
            } else {
                setCreateErrorMessage(data.message || data.error || 'Failed to create donation.');
            }
        } catch (networkError) {
            console.error('Network error during donation creation:', networkError);
            setCreateErrorMessage('Could not connect to the server. Please ensure the backend is running and reachable.');
        } finally {
            setCreateLoading(false);
        }
    };


    // --- Edit Donation Modal Handlers ---
    const handleEditClick = (donation) => {
        setCurrentDonation(donation);
        setEditFormData({
            amount: donation.amount,
            currency: donation.currency || 'UGX',
            type: donation.type,
            frequency: donation.frequency,
            note: donation.note || '',
            firstName: donation.first_name || '',
            lastName: donation.last_name || '',
            email: donation.email || '',
            contact: donation.contact || '',
        });
        setEditSuccessMessage('');
        setEditErrorMessage('');
        setShowEditModal(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdateDonation = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setEditSuccessMessage('');
        setEditErrorMessage('');

        if (!currentDonation || !currentDonation.id) {
            setEditErrorMessage('Donation ID not found for update.');
            setEditLoading(false);
            return;
        }

        const { amount } = editFormData;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setEditErrorMessage("Amount must be a positive number.");
            setEditLoading(false);
            return;
        }

        try {
            const payload = { ...editFormData, amount: parseFloat(editFormData.amount) };
            const endpoint = `${API_BASE_URL}/api/v1/donations/update/${currentDonation.id}`;
            const response = await authenticatedFetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setEditSuccessMessage(data.message || 'Donation updated successfully!');
                setTimeout(() => {
                    setShowEditModal(false);
                    fetchDonations();
                }, 1000);
            } else {
                setEditErrorMessage(data.message || data.error || 'Failed to update donation.');
            }
        } catch (networkError) {
            console.error('Network error updating donation:', networkError);
            setEditErrorMessage('Could not connect to the server. Please try again later.');
        } finally {
            setEditLoading(false);
        }
    };


    // --- Delete Donation Handlers ---
    const handleDeleteClick = (donation) => {
        setDonationToDelete(donation);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        setEditLoading(true);
        setEditSuccessMessage('');
        setEditErrorMessage('');
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/donations/delete/${donationToDelete.id}`, { method: 'DELETE' });
            const data = await response.json();
            if (response.ok) {
                setEditSuccessMessage(data.message || 'Donation deleted successfully!');
                fetchDonations();
            } else {
                setEditErrorMessage(data.message || data.error || 'Failed to delete donation.');
            }
        } catch (networkError) {
            setEditErrorMessage('Could not connect to the server. Please try again later.');
        } finally {
            setEditLoading(false);
            setDonationToDelete(null);
        }
    };


    // --- View Donation Handler ---
    const handleViewClick = (donation) => {
        setDonationToView(donation);
        setShowViewModal(true);
    };


    // --- Download Functionality ---
    const handleDownload = async () => {
        setDownloadLoading(true);
        setError('');
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/donations/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'donations_report.csv');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setEditSuccessMessage('Donations report downloaded successfully!');
            } else {
                const data = await response.json();
                setError(data.message || data.error || 'Failed to download.');
            }
        } catch (networkError) {
            setError('Could not connect to the server. Please try again later.');
        } finally {
            setDownloadLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <div className="d-flex flex-column align-items-center mb-4">
                <h1 className="text-3xl font-bold mb-3" style={{ color: '#3c0008' }}>Manage Donations</h1>
                <div className="d-flex justify-content-center gap-3">
                    {isAdmin && (
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="py-2 px-4 rounded-md shadow-md"
                            style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
                        >
                            <FaPlus className="me-2" /> Add New Donation
                        </Button>
                    )}

                    {isSuperAdmin && (
                        <Button
                            onClick={handleDownload}
                            className="py-2 px-4 rounded-md shadow-md"
                            style={{ backgroundColor: '#dc3545', borderColor: '#3c0008', color: 'white' }}
                            disabled={downloadLoading}
                        >
                            {downloadLoading ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                            ) : (
                                <FaDownload className="me-2" />
                            )}
                            {downloadLoading ? 'Downloading...' : 'Download'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages for general operations */}
            {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
            {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status" style={{ color: '#800000' }}>
                        <span className="visually-hidden">Loading donations...</span>
                    </Spinner>
                    <p className="mt-2 text-gray-600">Loading donations...</p>
                </div>
            ) : (
                <>
                    {donations.length > 0 ? (
                        <div className="my-5">
                            <h2 className="text-2xl font-bold mb-3" style={{ color: '#800000' }}>Donations</h2>
                            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                                <Table striped bordered hover responsive className="text-gray-700">
                                    <thead style={{ backgroundColor: '#800000', color: 'white' }}>
                                        <tr>
                                            <th>ID</th>
                                            <th>Amount</th>
                                            {isAdmin && (
                                                <>
                                                    <th>Donor Name</th>
                                                    <th>Donor Email</th>
                                                    <th>Donor Contact</th>
                                                </>
                                            )}
                                            <th>Type</th>
                                            <th>Frequency</th>
                                            <th>Note</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map((donation) => (
                                            <tr key={donation.id}>
                                                <td>{donation.id}</td>
                                                <td>{getCurrencySymbol(donation.currency)}{parseFloat(donation.amount).toFixed(2)}</td>
                                                {isAdmin && (
                                                    <>
                                                        <td>{donation.first_name || 'N/A'} {donation.last_name || ''}</td>
                                                        <td>{donation.email || 'N/A'}</td>
                                                        <td>{donation.contact || 'N/A'}</td>
                                                    </>
                                                )}
                                                <td>{donation.type}</td>
                                                <td>{donation.frequency.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
                                                <td>{donation.note || 'N/A'}</td>
                                                <td>{formatDateTime(donation.date)}</td>
                                                <td>
                                                    <div className="d-flex flex-row gap-2">
                                                        <Button variant="outline-info" size="sm" onClick={() => handleViewClick(donation)}><FaEye /></Button>
                                                        {isAdmin && (
                                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(donation)} style={{ borderColor: '#800000', color: '#800000' }}><FaEdit /></Button>
                                                        )}
                                                        {isSuperAdmin && (
                                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(donation)}><FaTrash /></Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <Alert variant="info" className="text-center">No donations found.</Alert>
                    )}
                </>
            )}

            {/* --- Modals --- */}
            {/* Create Donation Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
                    <Modal.Title>Add New Donation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#fff0f0' }}>
                    {createSuccessMessage && <Alert variant="success">{createSuccessMessage}</Alert>}
                    {createErrorMessage && <Alert variant="danger">{createErrorMessage}</Alert>}
                    <Form onSubmit={handleCreateDonationSubmit}>
                        <h5 className="mb-3" style={{ color: '#800000' }}>Donation Details (Required)</h5>
                        <Form.Group className="mb-3" controlId="createDonationAmount">
                            <Form.Label><FaDollarSign className="me-1" /> Amount</Form.Label>
                            <Form.Control type="number" name="amount" placeholder="Enter amount" value={createFormData.amount} onChange={handleCreateFormChange} required step="0.01" min="0.01" disabled={createLoading} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonationCurrency">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control as="select" name="currency" value={createFormData.currency} onChange={handleCreateFormChange} required disabled={createLoading}>
                                {ALLOWED_CURRENCIES.map(curr => <option key={curr} value={curr}>{curr === 'UGX' ? 'Ugandan Shillings (Shs)' : curr === 'USD' ? 'US Dollars ($)' : 'Euros (€)'}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonationType">
                            <Form.Label><FaTag className="me-1" /> Type</Form.Label>
                            <Form.Control as="select" name="type" value={createFormData.type} onChange={handleCreateFormChange} required disabled={createLoading}>
                                <option value="">Select Type</option>
                                {ALLOWED_DONATION_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonationFrequency">
                            <Form.Label><FaRedoAlt className="me-1" /> Frequency</Form.Label>
                            <Form.Control as="select" name="frequency" value={createFormData.frequency} onChange={handleCreateFormChange} required disabled={createLoading}>
                                {ALLOWED_FREQUENCIES.map(freq => <option key={freq} value={freq}>{freq.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonationNote">
                            <Form.Label><FaStickyNote className="me-1" /> Note (Optional)</Form.Label>
                            <Form.Control as="textarea" rows={2} name="note" placeholder="Add any notes about the donation" value={createFormData.note} onChange={handleCreateFormChange} disabled={createLoading} />
                        </Form.Group>

                        <hr />

                        <h5 className="my-3" style={{ color: '#800000' }}>Donor Details (Optional)</h5>
                        <Form.Group className="mb-3" controlId="createDonorFirstName">
                            <Form.Label><FaUser className="me-1" /> First Name</Form.Label>
                            <Form.Control type="text" name="firstName" placeholder="Enter first name" value={newDonorDetails.firstName} onChange={handleDonorDetailsChange} disabled={createLoading} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonorLastName">
                            <Form.Label><FaUser className="me-1" /> Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" placeholder="Enter last name" value={newDonorDetails.lastName} onChange={handleDonorDetailsChange} disabled={createLoading} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonorEmail">
                            <Form.Label><FaEnvelope className="me-1" /> Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="Enter email" value={newDonorDetails.email} onChange={handleDonorDetailsChange} disabled={createLoading} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="createDonorContact">
                            <Form.Label><FaPhone className="me-1" /> Contact</Form.Label>
                            <Form.Control type="tel" name="contact" placeholder="Enter contact number" value={newDonorDetails.contact} onChange={handleDonorDetailsChange} disabled={createLoading} />
                        </Form.Group>

                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="secondary" className="me-2" onClick={() => setShowCreateModal(false)} disabled={createLoading}>Cancel</Button>
                            <Button type="submit" style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }} disabled={createLoading}>
                                {createLoading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : null}
                                {createLoading ? 'Adding...' : 'Add Donation'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Donation Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
                    <Modal.Title>Edit Donation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#fff0f0' }}>
                    {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
                    {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
                    <Form onSubmit={handleUpdateDonation}>
                        <Form.Group className="mb-3" controlId="editDonationAmount">
                            <Form.Label className="font-semibold">Amount</Form.Label>
                            <Form.Control type="number" name="amount" value={editFormData.amount} onChange={handleEditFormChange} required step="0.01" min="0.01" disabled={editLoading} className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDonationCurrency">
                            <Form.Label className="font-semibold">Currency</Form.Label>
                            <Form.Control as="select" name="currency" value={editFormData.currency} onChange={handleEditFormChange} required disabled={editLoading} className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500">
                                {ALLOWED_CURRENCIES.map(curr => <option key={curr} value={curr}>{curr === 'UGX' ? 'Ugandan Shillings (Shs)' : curr === 'USD' ? 'US Dollars ($)' : 'Euros (€)'}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDonationType">
                            <Form.Label className="font-semibold">Type</Form.Label>
                            <Form.Control as="select" name="type" value={editFormData.type} onChange={handleEditFormChange} required disabled={editLoading} className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500">
                                {ALLOWED_DONATION_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDonationFrequency">
                            <Form.Label className="font-semibold">Frequency</Form.Label>
                            <Form.Control as="select" name="frequency" value={editFormData.frequency} onChange={handleEditFormChange} required disabled={editLoading} className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500">
                                {ALLOWED_FREQUENCIES.map(freq => <option key={freq} value={freq}>{freq.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="editDonationNote">
                            <Form.Label className="font-semibold">Note (Optional)</Form.Label>
                            <Form.Control as="textarea" rows={3} name="note" placeholder="Add any notes about the donation" value={editFormData.note} onChange={handleEditFormChange} disabled={editLoading} className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500" />
                        </Form.Group>
                        {isAdmin && (
                            <>
                                <hr />
                                <h5 className="my-3" style={{ color: '#800000' }}>Donor Details (Optional)</h5>
                                <Form.Group className="mb-3" controlId="editDonorFirstName">
                                    <Form.Label className="font-semibold">First Name</Form.Label>
                                    <Form.Control type="text" name="firstName" value={editFormData.firstName} onChange={handleEditFormChange} disabled={editLoading} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editDonorLastName">
                                    <Form.Label className="font-semibold">Last Name</Form.Label>
                                    <Form.Control type="text" name="lastName" value={editFormData.lastName} onChange={handleEditFormChange} disabled={editLoading} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editDonorEmail">
                                    <Form.Label className="font-semibold">Email</Form.Label>
                                    <Form.Control type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} disabled={editLoading} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editDonorContact">
                                    <Form.Label className="font-semibold">Contact</Form.Label>
                                    <Form.Control type="tel" name="contact" value={editFormData.contact} onChange={handleEditFormChange} disabled={editLoading} />
                                </Form.Group>
                            </>
                        )}
                        <Button type="submit" className="w-100 py-2 mt-3 rounded-md shadow-md" style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }} disabled={editLoading}>
                            {editLoading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : null}
                            {editLoading ? 'Updating Donation...' : 'Save Changes'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#fff0f0' }}>
                    <p>Are you sure you want to delete the donation from **{donationToDelete?.first_name || 'N/A'}** with an ID of **{donationToDelete?.id}**?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#fff0f0' }}>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete} disabled={editLoading}>
                        {editLoading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : null}
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Details Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
                    <Modal.Title>Donation Details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#fff0f0' }}>
                    {donationToView ? (
                        <div>
                            <p><strong>ID:</strong> {donationToView.id}</p>
                            <p><strong>Amount:</strong> {getCurrencySymbol(donationToView.currency)}{parseFloat(donationToView.amount).toFixed(2)} ({donationToView.currency})</p>
                            <p><strong>Type:</strong> {donationToView.type.charAt(0).toUpperCase() + donationToView.type.slice(1)}</p>
                            <p><strong>Frequency:</strong> {donationToView.frequency.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            <p><strong>Date:</strong> {formatDateTime(donationToView.date)}</p>
                            <p><strong>Note:</strong> {donationToView.note || 'N/A'}</p>
                            {isAdmin && (
                                <>
                                    <hr />
                                    <h5 className="mt-3" style={{ color: '#800000' }}>Donor Information</h5>
                                    <p><strong>Name:</strong> {donationToView.first_name || 'N/A'} {donationToView.last_name || ''}</p>
                                    <p><strong>Email:</strong> {donationToView.email || 'N/A'}</p>
                                    <p><strong>Contact:</strong> {donationToView.contact || 'N/A'}</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <p>Donation details not available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#fff0f0' }}>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Donations;
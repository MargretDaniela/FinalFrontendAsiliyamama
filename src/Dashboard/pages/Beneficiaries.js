import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card } from 'react-bootstrap';
import { FaEye, FaTrash, FaPlus, FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaVenusMars, FaCalendarAlt, FaDownload, FaPencilAlt } from 'react-icons/fa';
import { authenticatedFetch } from './authService'; // Adjust path as needed for authService

// Beneficiaries Component - Consolidates all beneficiary management (list, create, edit, delete)
const Beneficiaries = ({ userType }) => {
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_BASE_URL = 'http://127.0.0.1:5000';
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(''); // Error message state for fetching

  const [showCreateForm, setShowCreateForm] = useState(false); // Toggles visibility of embedded Create Beneficiary Form
  const [createFormData, setCreateFormData] = useState({ // State for Create Beneficiary form inputs
    first_name: '',
    last_name: '',
    contact: '', // Only contact field remains
    location: '',
    gender: '',
    date_of_birth: '', // YYYY-MM-DD format
    user_id: '', // Associated user ID
  });
  const [createLoading, setCreateLoading] = useState(false); // Loading state for Create Beneficiary operation
  const [createSuccessMessage, setCreateSuccessMessage] = useState(''); // Success message for Create Beneficiary
  const [createErrorMessage, setCreateErrorMessage] = useState(''); // Error message for Create Beneficiary

  // State for the new View Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentBeneficiary, setCurrentBeneficiary] = useState(null); // Holds beneficiary data for editing and viewing

  const [showEditModal, setShowEditModal] = useState(false); // Controls visibility of Edit Beneficiary Modal
  const [editFormData, setEditFormData] = useState({ // State for edit form inputs
    first_name: '',
    last_name: '',
    contact: '', // Only contact field remains
    location: '',
    gender: '',
    date_of_birth: '',
    user_id: '',
  });
  const [editLoading, setEditLoading] = useState(false); // Loading state for edit operations
  const [editSuccessMessage, setEditSuccessMessage] = useState(''); // Success message for edit
  const [editErrorMessage, setEditErrorMessage] = useState(''); // Error message for edit

  const [showDeleteModal, setShowDeleteModal] = useState(false); // Controls visibility of Delete Beneficiary Modal
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState(null); // Holds beneficiary ID for deletion
  const [beneficiaryNameToDelete, setBeneficiaryNameToDelete] = useState(''); // Holds beneficiary name for modal message
  const [deleteLoading, setDeleteLoading] = useState(false); // Loading state for delete operation

  // Determine if the current user has admin or super_admin privileges
  const isAdmin = userType === 'admin' || userType === 'super_admin';
  // Determine if the current user has super_admin privileges (only they can delete)
  const isSuperAdmin = userType === 'super_admin';

  // Helper function to format date to YYYY-MM-DD (for display and form pre-fill)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to fetch beneficiaries from the backend
  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    setError('');
    // Clear all messages on new fetch to ensure fresh state
    setCreateSuccessMessage('');
    setCreateErrorMessage('');
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/beneficiaries/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetch Beneficiaries Response:', data);

      if (response.ok) {
        // Backend now returns beneficiaries under a 'beneficiaries' key
        const formattedBeneficiaries = (data.beneficiaries || []).map(beneficiary => ({
          ...beneficiary,
          date_of_birth: beneficiary.date_of_birth ? formatDate(beneficiary.date_of_birth) : null,
          created_at: beneficiary.created_at ? formatDate(beneficiary.created_at) : null // Format created_at
        }));
        setBeneficiaries(formattedBeneficiaries);
      } else {
        setError(data.message || data.error || 'Failed to fetch beneficiaries.');
      }
    } catch (networkError) {
      console.error('Network error fetching beneficiaries:', networkError);
      setError('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch of beneficiaries when the component mounts
  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  // --- Create Beneficiary Form Handlers ---
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateBeneficiarySubmit = async (e) => {
    e.preventDefault();

    setCreateLoading(true);
    setCreateSuccessMessage('');
    setCreateErrorMessage('');

    // Only check for contact now
    if (!createFormData.contact) {
      setCreateErrorMessage("Contact number must be provided.");
      setCreateLoading(false);
      return;
    }

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/beneficiaries/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      });

      const data = await response.json();
      console.log('Beneficiary creation response:', data);

      if (response.ok) {
        setCreateSuccessMessage(data.message || 'Beneficiary created successfully!');
        setCreateFormData({ // Clear form fields on success
          first_name: '',
          last_name: '',
          contact: '',
          location: '',
          gender: '',
          date_of_birth: '',
          user_id: '',
        });
        // Hide the form and refresh the beneficiary list after a short delay
        setTimeout(() => {
          setShowCreateForm(false);
          fetchBeneficiaries();
        }, 1500);
      } else {
        setCreateErrorMessage(data.message || data.error || 'Failed to create beneficiary.');
      }
    } catch (networkError) {
      console.error('Network error during beneficiary creation:', networkError);
      setCreateErrorMessage('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setCreateLoading(false);
    }
  };

  // --- View Beneficiary Modal Handler ---
  const handleViewClick = (beneficiary) => {
    setCurrentBeneficiary(beneficiary);
    setShowViewModal(true);
  };

  // --- Edit Beneficiary Modal Handlers ---
  const handleEditClick = (beneficiary) => {
    setCurrentBeneficiary(beneficiary);
    setEditFormData({
      first_name: beneficiary.first_name,
      last_name: beneficiary.last_name,
      contact: beneficiary.contact || '', // Ensure it's an empty string if null
      location: beneficiary.location,
      gender: beneficiary.gender,
      date_of_birth: beneficiary.date_of_birth,
      user_id: beneficiary.user_id,
    });
    setEditSuccessMessage('');
    setEditErrorMessage('');
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateBeneficiary = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccessMessage('');
    setEditErrorMessage('');

    if (!currentBeneficiary || !currentBeneficiary.id) {
      setEditErrorMessage('Beneficiary ID not found for update.');
      setEditLoading(false);
      return;
    }

    // Only check for contact now
    if (!editFormData.contact) {
      setEditErrorMessage("Contact number must be provided.");
      setEditLoading(false);
      return;
    }

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/beneficiaries/update/${currentBeneficiary.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      console.log('Update Beneficiary Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Beneficiary updated successfully!');
        fetchBeneficiaries(); // Refresh list
        setShowEditModal(false); // Close modal
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to update beneficiary.');
      }
    } catch (networkError) {
      console.error('Network error updating beneficiary:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setEditLoading(false);
    }
  };

  // --- Delete Beneficiary Handlers (using a custom modal instead of window.confirm) ---
  const handleDeleteClick = (beneficiary) => {
    setBeneficiaryToDelete(beneficiary.id);
    setBeneficiaryNameToDelete(`${beneficiary.first_name} ${beneficiary.last_name}`);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/beneficiaries/delete/${beneficiaryToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Delete Beneficiary Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Beneficiary deleted successfully!');
        fetchBeneficiaries(); // Refresh list
        setShowDeleteModal(false); // Close modal
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to delete beneficiary.');
      }
    } catch (networkError) {
      console.error('Network error deleting beneficiary:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setDeleteLoading(false);
      setBeneficiaryToDelete(null);
      setBeneficiaryNameToDelete('');
    }
  };

  // --- Download Functionality ---
  const handleDownloadBeneficiaries = () => {
    if (beneficiaries.length === 0) {
      console.log('No beneficiaries to download.');
      return;
    }

    const headers = [
      'ID', 'First Name', 'Last Name', 'Contact Info', 'Location',
      'Gender', 'Date of Birth', 'Created At', 'User ID'
    ];
    // Create a CSV string from the beneficiaries data
    const csvContent = [
      headers.join(','),
      ...beneficiaries.map(b =>
        [
          b.id,
          b.first_name,
          b.last_name,
          b.contact, // Now only 'contact' is used
          b.location,
          b.gender,
          b.date_of_birth,
          b.created_at, // Include created_at
          b.user_id,
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'beneficiaries.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="flex-grow-1 text-center">
          <h1 className="text-3xl font-bold mb-0" style={{ color: '#800000' }}>Manage Beneficiaries</h1>
        </div>

        {isSuperAdmin && (
          <Button
            onClick={handleDownloadBeneficiaries}
            className="py-2 px-3 rounded-md shadow-lg"
            style={{ backgroundColor: '#803232', borderColor: '#803232', color: 'white' }}
          >
            <FaDownload className="me-2" /> Download
          </Button>
        )}
      </div>

      {isAdmin && (
        <div className="text-center mb-4">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="py-2 px-4 rounded-md shadow-md"
            style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
          >
            {showCreateForm ? <><FaTimes className="me-2" /> Close Form</> : <><FaPlus className="me-2" /> Add New Beneficiary</>}
          </Button>
        </div>
      )}

      {/* Embedded Create Beneficiary Form */}
      {showCreateForm && isAdmin && (
        <Card className="shadow-lg p-4 rounded-lg mb-4" style={{ backgroundColor: '#e7d5d5', border: '1px solid #800000' }}>
          <Card.Body>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#803232' }}>Add New Beneficiary</h2>
            {createSuccessMessage && <Alert variant="success">{createSuccessMessage}</Alert>}
            {createErrorMessage && <Alert variant="danger">{createErrorMessage}</Alert>}

            <Form onSubmit={handleCreateBeneficiarySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Group className="mb-3" controlId="createBeneficiaryFirstName">
                  <Form.Label className="font-semibold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="Enter first name"
                    value={createFormData.first_name}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createLoading}
                    className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="createBeneficiaryLastName">
                  <Form.Label className="font-semibold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder="Enter last name"
                    value={createFormData.last_name}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createLoading}
                    className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </Form.Group>
              </div>

              {/* Contact Section - Email field removed */}
              <Form.Group className="mb-3" controlId="createBeneficiaryContact">
                <Form.Label className="font-semibold"><FaPhone className="me-1" /> Contact </Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  placeholder="Enter contact number"
                  value={createFormData.contact}
                  onChange={handleCreateFormChange}
                  required
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="createBeneficiaryLocation">
                <Form.Label className="font-semibold"><FaMapMarkerAlt className="me-1" /> Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={createFormData.location}
                  onChange={handleCreateFormChange}
                  required
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="createBeneficiaryGender">
                <Form.Label className="font-semibold"><FaVenusMars className="me-1" /> Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={createFormData.gender}
                  onChange={handleCreateFormChange}
                  required
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="createBeneficiaryDateOfBirth">
                <Form.Label className="font-semibold"><FaCalendarAlt className="me-1" /> Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={createFormData.date_of_birth}
                  onChange={handleCreateFormChange}
                  required
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="createBeneficiaryUserId">
                <Form.Label className="font-semibold"><FaUser className="me-1" /> Associated User ID</Form.Label>
                <Form.Control
                  type="number"
                  name="user_id"
                  placeholder="Enter user ID (e.g., admin's ID)"
                  value={createFormData.user_id}
                  onChange={handleCreateFormChange}
                  required
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </Form.Group>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="secondary"
                  className="me-2 py-2 px-4 rounded-md shadow-md"
                  onClick={() => setShowCreateForm(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="py-2 px-4 rounded-md shadow-md"
                  style={{ backgroundColor: '#803232', borderColor: '#803232', color: 'white' }}
                  disabled={createLoading}
                >
                  {createLoading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  ) : null}
                  {createLoading ? 'Adding Beneficiary...' : 'Add Beneficiary'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Messages for general operations (delete, initial fetch) */}
      {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
      {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" style={{ color: '#800000' }}>
            <span className="visually-hidden">Loading beneficiaries...</span>
          </Spinner>
          <p className="mt-2 text-gray-600">Loading beneficiaries...</p>
        </div>
      ) : beneficiaries.length === 0 ? (
        <Alert variant="info" className="text-center">No beneficiaries found.</Alert>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <Table striped bordered hover responsive className="text-gray-700 text-sm">
            <thead style={{ backgroundColor: '#a05252', color: 'white' }}>
              <tr>
                <th className="text-sm">#</th>
                <th className="text-sm">ID</th>
                <th className="text-sm">First Name</th>
                <th className="text-sm">Last Name</th>
                <th className="text-sm">Contact Info</th>
                <th className="text-sm">Location</th>
                <th className="text-sm">Gender</th>
                <th className="text-sm">Date of Birth</th>
                <th className="text-sm">Created At</th> {/* New column header */}
                <th className="text-sm">User ID</th>
                <th className="text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...beneficiaries].sort((a, b) => b.id - a.id).map((beneficiary, index) => (
                <tr key={beneficiary.id}>
                  <td className="text-xs">{beneficiaries.length - index}</td>
                  <td className="text-xs">{beneficiary.id}</td>
                  <td className="text-xs">{beneficiary.first_name}</td>
                  <td className="text-xs">{beneficiary.last_name}</td>
                  <td className="text-xs">{beneficiary.contact}</td> {/* Display only contact */}
                  <td className="text-xs">{beneficiary.location}</td>
                  <td className="text-xs">{beneficiary.gender}</td>
                  <td className="text-xs">{beneficiary.date_of_birth}</td>
                  <td className="text-xs">{beneficiary.created_at}</td> {/* Display created_at */}
                  <td className="text-xs">{beneficiary.user_id}</td>
                  <td className="d-flex justify-content-start align-items-center text-xs">
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewClick(beneficiary)}
                          style={{ borderColor: '#800000', color: '#800000' }}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(beneficiary)}
                          style={{ borderColor: '#800000', color: '#800000' }}
                        >
                          <FaPencilAlt />
                        </Button>
                      </>
                    )}
                    {isSuperAdmin && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClick(beneficiary)}
                        style={{ borderColor: '#e67373', color: '#e67373' }}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* View Beneficiary Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Beneficiary Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#e7d5d5' }}>
          {currentBeneficiary && (
            <div className="text-gray-800">
              <p><strong>First Name:</strong> {currentBeneficiary.first_name}</p>
              <p><strong>Last Name:</strong> {currentBeneficiary.last_name}</p>
              <p><strong>Contact:</strong> {currentBeneficiary.contact}</p> {/* Display only contact */}
              <p><strong>Location:</strong> {currentBeneficiary.location}</p>
              <p><strong>Gender:</strong> {currentBeneficiary.gender}</p>
              <p><strong>Date of Birth:</strong> {currentBeneficiary.date_of_birth}</p>
              <p><strong>Created At:</strong> {currentBeneficiary.created_at}</p> {/* Added to view modal */}
              <p><strong>User ID:</strong> {currentBeneficiary.user_id}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#e7d5d5' }}>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Beneficiary Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Edit Beneficiary</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#e7d5d5' }}>
          {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
          {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
          <Form onSubmit={handleUpdateBeneficiary}>
            <Form.Group className="mb-3" controlId="editBeneficiaryFirstName">
              <Form.Label className="font-semibold">First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={editFormData.first_name}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editBeneficiaryLastName">
              <Form.Label className="font-semibold">Last Name</Form.Label> {/* Corrected closing tag */}
              <Form.Control
                type="text"
                name="last_name"
                value={editFormData.last_name}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500"
              />
            </Form.Group>

            {/* Contact Section for Edit - Email field removed */}
            <Form.Group className="mb-3" controlId="editBeneficiaryContact">
              <Form.Label className="font-semibold"><FaPhone className="me-1" /> Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                placeholder="Enter contact number"
                value={editFormData.contact}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editBeneficiaryLocation">
              <Form.Label className="font-semibold"><FaMapMarkerAlt className="me-1" /> Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editBeneficiaryGender">
              <Form.Label className="font-semibold"><FaVenusMars className="me-1" /> Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={editFormData.gender}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="editBeneficiaryDateOfBirth">
              <Form.Label className="font-semibold"><FaCalendarAlt className="me-1" /> Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={editFormData.date_of_birth}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-maroon-500 focus:ring-maroon-500"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editBeneficiaryUserId">
              <Form.Label className="font-semibold"><FaUser className="me-1" /> Associated User ID</Form.Label>
              <Form.Control
                type="number"
                name="user_id"
                placeholder="Enter user ID (e.g., admin's ID)"
                value={editFormData.user_id}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                className="me-2 py-2 px-4 rounded-md shadow-md"
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="py-2 px-4 rounded-md shadow-md"
                style={{ backgroundColor: '#803232', borderColor: '#803232', color: 'white' }}
                disabled={editLoading}
              >
                {editLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                ) : null}
                {editLoading ? 'Updating Beneficiary...' : 'Update Beneficiary'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Beneficiary Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#e7d5d5' }}>
          <p className="text-gray-800">Are you sure you want to delete beneficiary <strong>{beneficiaryNameToDelete}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#e7d5d5' }}>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            ) : null}
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Beneficiaries;

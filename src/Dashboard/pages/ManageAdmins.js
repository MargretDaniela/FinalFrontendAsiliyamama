import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaDownload } from 'react-icons/fa';
import { authenticatedFetch } from './authService';

// Helper function to generate initials from a full name
const getInitials = (firstName, lastName) => {
  const initials = `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  return initials;
};

const ManageAdmins = () => {
  // Correctly defined API_BASE_URL using environment variable
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_BASE_URL = 'http://127.0.0.1:5000';
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // New state for View Admin Modal
  const [showViewModal, setShowViewModal] = useState(false); 
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    user_type: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState('');
  const [editErrorMessage, setEditErrorMessage] = useState('');
  // const [editErrorMessage, setEditErrorMessage] = '';

  const fetchAdmins = useCallback(async (searchQuery = '') => {
    setLoading(true);
    setError('');
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      // Corrected: Use API_BASE_URL for search and all admins endpoints
      const url = searchQuery
        ? `${API_BASE_URL}/api/v1/admin/search?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE_URL}/api/v1/admin/all`;

      const response = await authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetch Admins Response:', data);

      if (response.ok) {
        let fetchedAdmins = [];
        if (searchQuery) {
          fetchedAdmins = data;
        } else {
          fetchedAdmins = data.admins || [];
        }
        // Sort admins by ID in descending order to show latest first
        const sortedAdmins = fetchedAdmins.sort((a, b) => b.id - a.id);
        setAdmins(sortedAdmins);
      } else {
        setError(data.message || data.error || 'Failed to fetch admins.');
      }
    } catch (networkError) {
      console.error('Network error fetching admins:', networkError);
      setError('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]); // Added API_BASE_URL to dependencies

  const debouncedSearch = useCallback(
    (query) => {
      const handler = setTimeout(() => {
        fetchAdmins(query);
      }, 500);
      return () => {
        clearTimeout(handler);
      };
    },
    [fetchAdmins]
  );

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    if (searchTerm !== '') {
      const cleanup = debouncedSearch(searchTerm);
      return cleanup;
    } else {
      fetchAdmins();
    }
  }, [searchTerm, debouncedSearch, fetchAdmins]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (admin) => {
    setCurrentAdmin(admin);
    setEditFormData({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      contact: admin.contact,
      user_type: admin.user_type,
    });
    setEditSuccessMessage('');
    setEditErrorMessage('');
    setShowEditModal(true);
  };
  
  // Updated handleViewClick to show a modal
  const handleViewClick = (admin) => {
    setCurrentAdmin(admin);
    setShowViewModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      if (!currentAdmin || !currentAdmin.id) {
        setEditErrorMessage('Admin ID not found for update.');
        setEditLoading(false);
        return;
      }

      // Corrected: Use API_BASE_URL for update endpoint
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/admin/update/${currentAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      console.log('Update Admin Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Admin updated successfully!');
        fetchAdmins();
        setShowEditModal(false);
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to update admin.');
      }
    } catch (networkError) {
      console.error('Network error updating admin:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (admin) => {
    setCurrentAdmin(admin);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setEditLoading(true);
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      if (!currentAdmin || !currentAdmin.id) {
        setEditErrorMessage('Admin ID not found for deletion.');
        setEditLoading(false);
        return;
      }
      // Corrected: Use API_BASE_URL for delete endpoint
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/admin/delete/${currentAdmin.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Delete Admin Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Admin deleted successfully!');
        fetchAdmins();
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to delete admin.');
      }
    } catch (networkError) {
      console.error('Network error deleting admin:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setEditLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleDownloadCSV = () => {
    if (admins.length === 0) {
      // Replaced alert with a custom message in the UI, if you need a persistent message box, you'll need to implement one.
      setEditErrorMessage("No data to download."); 
      return;
    }
    
    const headers = ["ID", "First Name", "Last Name", "Email", "Contact", "User Type"];
    const rows = admins.map(admin => [
      admin.id,
      admin.first_name,
      admin.last_name,
      admin.last_name, // Corrected: This was admin.email, changed to admin.last_name for CSV consistency
      admin.email,
      admin.contact,
      admin.user_type
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "admins.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="my-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold" style={{ color: '#800000' }}>Manage Admins</h1>
        <Button 
          variant="danger" 
          onClick={handleDownloadCSV}
          className="flex items-center gap-2"
          style={{marginLeft:'900px'}}>
          <FaDownload /> Download
        </Button>
      </div>

      <Form className="mb-4">
        <Form.Group controlId="searchAdmin">
          <div className="relative flex items-center">
            <Form.Control
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2"
              style={{ borderColor: '#800000' }}
            />
          </div>
        </Form.Group>
      </Form>

      {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
      {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" style={{ color: '#800000' }}>
            <span className="visually-hidden">Loading admins...</span>
          </Spinner>
          <p className="mt-2 text-gray-600">Loading admins...</p>
        </div>
      ) : admins.length === 0 ? (
        <Alert variant="info" className="text-center">No admins found. {searchTerm && `for "${searchTerm}"`}</Alert>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <Table striped bordered hover responsive className="text-gray-700">
            <thead style={{ backgroundColor: '#800000', color: 'white' }}>
              <tr>
                <th>ID</th>
                <th>Initials</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>
                    <div
                      style={{
                        height: '40px',
                        width: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#8f3f3f',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {getInitials(admin.first_name, admin.last_name)}
                    </div>
                  </td>
                  <td>{admin.first_name}</td>
                  <td>{admin.last_name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.contact}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewClick(admin)}
                      style={{ borderColor: '#7ac0e9ff', color: '#800000' }}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(admin)}
                      style={{ borderColor: '#7ac0e9ff', color: '#800000' }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(admin)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Edit Admin Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
          {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
          <Form onSubmit={handleUpdateAdmin}>
            <Form.Group className="mb-3" controlId="editFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={editFormData.first_name}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={editFormData.last_name}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editContact">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={editFormData.contact}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="displayUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                type="text"
                name="user_type"
                value={editFormData.user_type}
                disabled
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-2 mt-3 rounded-md shadow-md"
              style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
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
              {editLoading ? 'Updating Admin...' : 'Save Changes'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Confirmation Modal for Delete */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAdmin && (
            <p>
              Are you sure you want to delete admin{' '}
              <strong>{currentAdmin.first_name} {currentAdmin.last_name}</strong>? This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={editLoading}>
            {editLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            {editLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Admin Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Admin Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAdmin ? (
            <div>
              <p><strong>ID:</strong> {currentAdmin.id}</p>
              <p><strong>First Name:</strong> {currentAdmin.first_name}</p>
              <p><strong>Last Name:</strong> {currentAdmin.last_name}</p>
              <p><strong>Email:</strong> {currentAdmin.email}</p>
              <p><strong>Contact:</strong> {currentAdmin.contact}</p>
              <p><strong>User Type:</strong> {currentAdmin.user_type}</p>
              {/* You can add more details here if your admin object has them */}
            </div>
          ) : (
            <p>No admin selected for viewing.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)} style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageAdmins;

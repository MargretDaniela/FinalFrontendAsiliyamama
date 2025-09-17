import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUser, FaListAlt, FaCheckCircle, FaEye, FaDownload } from 'react-icons/fa';
import { authenticatedFetch } from './authService'; // Adjust path as needed

// Enrollments Component - Consolidates all enrollment management (list, create, edit, delete)
const Enrollments = ({ userType }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(''); // Error message state for fetching

  const [showCreateForm, setShowCreateForm] = useState(false); // Toggles visibility of embedded Create Enrollment Form
  const [createFormData, setCreateFormData] = useState({ // State for Create Enrollment form inputs
    program_id: '',
    user_id: '',
    // Removed 'enrolled_at' from createFormData as it will be automatic
    status: 'active', // Default status, changed to 'active' for consistency with model default
  });
  const [createLoading, setCreateLoading] = useState(false); // Loading state for Create Enrollment operation
  const [createSuccessMessage, setCreateSuccessMessage] = useState(''); // Success message for Create Enrollment
  const [createErrorMessage, setCreateErrorMessage] = useState(''); // Error message for Create Enrollment

  const [showEditModal, setShowEditModal] = useState(false); // Controls visibility of Edit Enrollment Modal
  const [currentEnrollment, setCurrentEnrollment] = useState(null); // Holds enrollment data for editing or viewing
  const [editFormData, setEditFormData] = useState({ // State for edit form inputs
    program_id: '',
    user_id: '',
    // Removed 'enrolled_at' from editFormData as it will be automatic
    status: '',
  });
  const [editLoading, setEditLoading] = useState(false); // Loading state for edit/delete operations
  const [editSuccessMessage, setEditSuccessMessage] = useState(''); // Success message for edit/delete
  const [editErrorMessage, setEditErrorMessage] = useState(''); // Error message for edit/delete

  const [showViewModal, setShowViewModal] = useState(false); // New state to control View Modal visibility

  // Determine if the current user has admin or super_admin privileges
  const isAdmin = userType === 'admin' || userType === 'super_admin';
  const isSuperAdmin = userType === 'super_admin';

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to fetch enrollments from the backend
  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError('');
    // Clear all messages on new fetch to ensure fresh state
    setCreateSuccessMessage('');
    setCreateErrorMessage('');
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      // This endpoint requires authentication as per your backend configuration
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/enrollments/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetch Enrollments Response:', data);

      if (response.ok) {
        // Backend returns enrollments under an 'enrollments' key
        const fetchedEnrollments = data.enrollments || [];
        // Sort enrollments by ID in descending order to show most recent first
        const sortedEnrollments = fetchedEnrollments.sort((a, b) => b.id - a.id);

        // Format enrolled_at for display in date inputs
        const formattedEnrollments = sortedEnrollments.map(enrollment => ({
          ...enrollment,
          enrolled_at: enrollment.enrolled_at ? formatDate(enrollment.enrolled_at) : 'N/A' // Handle potential null/empty
        }));
        setEnrollments(formattedEnrollments);
      } else {
        setError(data.message || data.error || 'Failed to fetch enrollments.');
      }
    } catch (networkError) {
      console.error('Network error fetching enrollments:', networkError);
      setError('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch of enrollments when the component mounts
  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // --- Create Enrollment Form Handlers ---
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateEnrollmentSubmit = async (e) => {
    e.preventDefault();

    setCreateLoading(true);
    setCreateSuccessMessage('');
    setCreateErrorMessage('');

    try {
      // Convert IDs to numbers before sending to backend
      // 'enrolled_at' is intentionally excluded from the payload
      // so the backend's default (datetime.utcnow) will be used.
      const payload = {
        program_id: parseInt(createFormData.program_id),
        user_id: parseInt(createFormData.user_id),
        status: createFormData.status,
      };

      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/enrollments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Enrollment creation response:', data);

      if (response.ok) {
        setCreateSuccessMessage(data.message || 'Enrollment created successfully!');
        setCreateFormData({ // Clear form fields on success
          program_id: '',
          user_id: '',
          status: 'active', // Reset to default
        });
        // Hide the form and refresh the enrollment list after a short delay
        setTimeout(() => {
          setShowCreateForm(false);
          fetchEnrollments();
        }, 1500);
      } else {
        setCreateErrorMessage(data.message || data.error || 'Failed to create enrollment.');
      }
    } catch (networkError) {
      console.error('Network error during enrollment creation:', networkError);
      setCreateErrorMessage('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setCreateLoading(false);
    }
  };

  // --- View Enrollment Modal Handlers ---
  const handleViewClick = (enrollment) => {
    setCurrentEnrollment(enrollment);
    setShowViewModal(true);
  };

  // --- Edit Enrollment Modal Handlers ---
  const handleEditClick = (enrollment) => {
    setCurrentEnrollment(enrollment);
    setEditFormData({
      program_id: enrollment.program_id,
      user_id: enrollment.user_id,
      // 'enrolled_at' is intentionally not set here as it's automatic
      status: enrollment.status,
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

  const handleUpdateEnrollment = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      if (!currentEnrollment || !currentEnrollment.id) {
        setEditErrorMessage('Enrollment ID not found for update.');
        setEditLoading(false);
        return;
      }

      // Convert IDs to numbers before sending to backend
      // 'enrolled_at' is intentionally excluded from the payload
      // to prevent overwriting the automatic timestamp.
      const payload = {
        program_id: parseInt(editFormData.program_id),
        user_id: parseInt(editFormData.user_id),
        status: editFormData.status,
      };

      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/enrollments/update/${currentEnrollment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Update Enrollment Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Enrollment updated successfully!');
        fetchEnrollments();
        setShowEditModal(false);
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to update enrollment.');
      }
    } catch (networkError) {
      console.error('Network error updating enrollment:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setEditLoading(false);
    }
  };

  // --- Delete Enrollment Handler ---
  const handleDeleteClick = async (enrollmentId, programId, userId) => {
    if (window.confirm(`Are you sure you want to delete enrollment for Program ID: ${programId}, User ID: ${userId}? This action cannot be undone.`)) {
      setEditLoading(true);
      setEditSuccessMessage('');
      setEditErrorMessage('');

      try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/enrollments/delete/${enrollmentId}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        console.log('Delete Enrollment Response:', data);

        if (response.ok) {
          setEditSuccessMessage(data.message || 'Enrollment deleted successfully!');
          fetchEnrollments();
        } else {
          setEditErrorMessage(data.message || data.error || 'Failed to delete enrollment.');
        }
      } catch (networkError) {
        console.error('Network error deleting enrollment:', networkError);
        setEditErrorMessage('Could not connect to the server. Please try again later.');
      } finally {
        setEditLoading(false);
      }
    }
  };

  // --- Download CSV Handler ---
  const handleDownloadCsv = () => {
    const header = ["ID", "Program ID", "User ID", "Enrollment Date", "Status"]; // Removed Created At, Updated At as they are not explicitly in the current frontend data structure for display
    const rows = enrollments.map(e => [
      e.id,
      e.program_id,
      e.user_id,
      e.enrolled_at, // This will be the formatted date string
      e.status,
    ]);

    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'enrollments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Container className="my-4">
      <div className="d-flex flex-column align-items-center mb-4">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#831120ff' }}>Manage Enrollments</h1>
        <div className="d-flex gap-2">
          {isAdmin && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="py-2 px-4 rounded-md shadow-md"
              style={{ backgroundColor: '#831120ff', borderColor: '#831120ff', color: 'white' }}
            >
              {showCreateForm ? <><FaTimes className="me-2" /> Close Form</> : <><FaPlus className="me-2" /> Create Enrollment</>}
            </Button>
          )}
          {isSuperAdmin && (
            <Button
              onClick={handleDownloadCsv}
              className="py-2 px-4 rounded-md shadow-md"
              style={{ backgroundColor: '#8f3f3f', borderColor: '#8f3f3f', color: 'white' }}
            >
              <FaDownload className="me-2" /> Download 
            </Button>
          )}
        </div>
      </div>

      {/* Embedded Create Enrollment Form */}
      {showCreateForm && isAdmin && (
        <Card className="shadow-lg p-4 rounded-lg mb-4" style={{ backgroundColor: '#e7d5d5ff', border: '1px solid #800000' }}>
          <Card.Body>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#9c4444ff' }}>Add New Enrollment</h2>
            {createSuccessMessage && <Alert variant="success">{createSuccessMessage}</Alert>}
            {createErrorMessage && <Alert variant="danger">{createErrorMessage}</Alert>}
            <Form onSubmit={handleCreateEnrollmentSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Group className="mb-3" controlId="createEnrollmentProgramId">
                  <Form.Label className="font-semibold"><FaListAlt className="me-1" /> Program ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="program_id"
                    placeholder="Enter Program ID"
                    value={createFormData.program_id}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createLoading}
                    className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="createEnrollmentUserId">
                  <Form.Label className="font-semibold"><FaUser className="me-1" /> User ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="user_id"
                    placeholder="Enter User ID"
                    value={createFormData.user_id}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createLoading}
                    className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Form.Group>
              </div>
              {/* Removed Enrollment Date field as it will be automatically populated by the backend */}
              <Form.Group className="mb-3" controlId="createEnrollmentStatus">
                <Form.Label className="font-semibold"><FaCheckCircle className="me-1" /> Status</Form.Label>
                <Form.Select
                  name="status"
                  value={createFormData.status}
                  onChange={handleCreateFormChange}
                  required
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option> {/* Changed default selected to 'active' */}
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
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
                  style={{ backgroundColor: '#803232ff', borderColor: '#803232ff', color: 'white' }}
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
                  {createLoading ? 'Creating Enrollment...' : 'Create Enrollment'}
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
          <Spinner animation="border" role="status" style={{ color: '#831120ff' }}>
            <span className="visually-hidden">Loading enrollments...</span>
          </Spinner>
          <p className="mt-2 text-gray-600">Loading enrollments...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <Alert variant="info" className="text-center">No enrollments found.</Alert>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <Table striped bordered hover responsive className="text-gray-700">
            <thead style={{ backgroundColor: '#831120ff', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>Enrollment ID</th>
                <th>Program ID</th>
                <th>User ID</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={enrollment.id}>
                  <td>{index + 1}</td>
                  <td>{enrollment.id}</td>
                  <td>{enrollment.program_id}</td>
                  <td>{enrollment.user_id}</td>
                  <td>{enrollment.enrolled_at}</td>
                  <td>{enrollment.status}</td>
                  <td>
                    <div className="d-flex">
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleViewClick(enrollment)}
                        style={{ backgroundColor: '#ADD8E6', borderColor: '#ADD8E6' }}
                      >
                        <FaEye /> View
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(enrollment)}
                            style={{ borderColor: '#803232ff', color: '#803232ff' }}
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(enrollment.id, enrollment.program_id, enrollment.user_id)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* View Enrollment Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#314483ff', color: 'white' }}>
          <Modal.Title>Enrollment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#e0f2f7' }}>
          {currentEnrollment && (
            <div className="p-3">
              <p><strong>Enrollment ID:</strong> {currentEnrollment.id}</p>
              <p><strong>Program ID:</strong> {currentEnrollment.program_id}</p>
              <p><strong>User ID:</strong> {currentEnrollment.user_id}</p>
              <p><strong>Enrollment Date:</strong> {currentEnrollment.enrolled_at}</p>
              <p><strong>Status:</strong> {currentEnrollment.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#e0f2f7' }}>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Enrollment Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#803232ff', color: 'white' }}>
          <Modal.Title>Edit Enrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f5e9e9' }}>
          {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
          {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
          <Form onSubmit={handleUpdateEnrollment}>
            <Form.Group className="mb-3" controlId="editEnrollmentProgramId">
              <Form.Label className="font-semibold"><FaListAlt className="me-1" /> Program ID</Form.Label>
              <Form.Control
                type="number"
                name="program_id"
                value={editFormData.program_id}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editEnrollmentUserId">
              <Form.Label className="font-semibold"><FaUser className="me-1" /> User ID</Form.Label>
              <Form.Control
                type="number"
                name="user_id"
                value={editFormData.user_id}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Group>
            {/* Removed Enrollment Date field from edit form as it will be automatically populated/managed by the backend */}
            <Form.Group className="mb-3" controlId="editEnrollmentStatus">
              <Form.Label className="font-semibold"><FaCheckCircle className="me-1" /> Status</Form.Label>
              <Form.Select
                name="status"
                value={editFormData.status}
                onChange={handleEditFormChange}
                required
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
            <Button
              type="submit"
              className="w-100 py-2 mt-3 rounded-md shadow-md"
              style={{ backgroundColor: '#803232ff', borderColor: '#803232ff', color: 'white' }}
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
              {editLoading ? 'Updating Enrollment...' : 'Save Changes'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Enrollments;

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card } from 'react-bootstrap';
// Added FaPhone icon for the new contact field
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUser, FaLightbulb, FaClock, FaInfoCircle, FaImage, FaEye, FaDownload, FaEnvelope } from 'react-icons/fa'; // Changed FaPhone to FaEnvelope
// Assuming `authenticatedFetch` and `authService` are correctly configured
// NOTE: I'm leaving this import but the actual service is not provided.
import { authenticatedFetch } from './authService';

/**
 * A reusable modal component for confirmation dialogs.
 * Replaces browser-native `window.confirm()` with a custom UI.
 */
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel, loading }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
          style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
          ) : null}
          {loading ? 'Processing...' : 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

/**
 * Volunteers Component - Handles all volunteer management functionalities.
 * @param {object} props - Component props.
 * @param {string} props.userType - The role of the currently logged-in user ('admin' or 'super_admin').
 */
const Volunteers = ({ userType }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  // State for storing the list of volunteers
  const [volunteers, setVolunteers] = useState([]);
  // State for managing the initial loading of the volunteer list
  const [loading, setLoading] = useState(true);
  // State for displaying general errors when fetching data
  const [error, setError] = useState('');

  // State to control the visibility of the "Add New Volunteer" form
  const [showCreateForm, setShowCreateForm] = useState(false);
  // State for the form data of a new volunteer - 'contact' has been replaced with 'email'
  const [createFormData, setCreateFormData] = useState({
    first_name: '',
    last_name: '',
    email: '', // Changed from 'contact' to 'email'
    skills: '',
    availability: '',
    bio: '',
    image: '',
  });
  // State for create form validation errors
  const [createValidationErrors, setCreateValidationErrors] = useState({});
  // Loading state for the create operation
  const [createLoading, setCreateLoading] = useState(false);
  // State for success/error messages after creating a volunteer
  const [createSuccessMessage, setCreateSuccessMessage] = useState('');
  const [createErrorMessage, setCreateErrorMessage] = useState('');

  // State to control the visibility of the Edit Volunteer modal
  const [showEditModal, setShowEditModal] = useState(false);
  // State to hold the volunteer data currently being edited
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  // State for the form data within the edit modal - 'contact' has been replaced with 'email'
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '', // Changed from 'contact' to 'email'
    skills: '',
    availability: '',
    bio: '',
    image: '',
  });
  // State for edit form validation errors
  const [editValidationErrors, setEditValidationErrors] = useState({});
  // Loading state for the edit operation
  const [editLoading, setEditLoading] = useState(false);
  // State for success/error messages after an edit or delete
  const [editSuccessMessage, setEditSuccessMessage] = useState('');
  const [editErrorMessage, setEditErrorMessage] = useState('');

  // State to control the visibility of the View Volunteer modal
  const [showViewModal, setShowViewModal] = useState(false);
  // State to hold the volunteer data for the read-only view modal
  const [volunteerToView, setVolunteerToView] = useState(null);

  // State for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State to hold the volunteer to be deleted
  const [volunteerToDelete, setVolunteerToDelete] = useState(null);
  // Loading state for the delete operation
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Define user permissions based on the userType prop
  const isSuperAdmin = userType === 'super_admin';
  const isAdmin = userType === 'admin' || isSuperAdmin;
  const canCreate = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isSuperAdmin;
  // New variable to control the download button's visibility
  const canDownload = isSuperAdmin;

  /**
   * Helper function to format a date string to 'YYYY-MM-DD'
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Fetches the list of volunteers from the backend API.
   * This function is memoized with `useCallback` to prevent unnecessary re-creation.
   */
  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError('');
    // Clear all messages on a new fetch to ensure a fresh state
    setCreateSuccessMessage('');
    setCreateErrorMessage('');
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      // This endpoint requires authentication
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/volunteers/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetch Volunteers Response:', data);
      if (response.ok) {
        const formattedVolunteers = (data.volunteers || []).map(volunteer => ({
          ...volunteer,
          joined_at: volunteer.joined_at ? formatDate(volunteer.joined_at) : null // Format if it exists
        }));
        setVolunteers(formattedVolunteers);
      } else {
        setError(data.message || data.error || 'Failed to fetch volunteers.');
      }
    } catch (networkError) {
      console.error('Network error fetching volunteers:', networkError);
      setError('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handles the download of volunteer data as a CSV file.
   * This is now only accessible to super_admin via button visibility.
   * The CSV headers and content have been updated to use the new 'email' field.
   */
  const handleDownload = () => {
    if (volunteers.length === 0) {
      // Replaced `alert()` with a console log and early return, as per instructions.
      console.warn("No volunteers to download.");
      // Could also display a temporary message on the UI.
      return;
    }

    // CSV header row - 'Contact' has been changed to 'Email'
    const headers = [
      "First Name",
      "Last Name",
      "Email", // Changed from 'Contact' to 'Email'
      "Skills",
      "Availability",
      "Bio",
      "Joined At",
      "User ID",
    ];

    // Map the volunteer data to CSV rows, handling commas and quotes
    const csvContent = [
      headers.join(','),
      ...volunteers.map(v =>
        [
          `"${v.first_name?.replace(/"/g, '""') || ''}"`, // Escape quotes and handle null values
          `"${v.last_name?.replace(/"/g, '""') || ''}"`,
          `"${v.email?.replace(/"/g, '""') || ''}"`, // Changed from 'v.contact' to 'v.email'
          `"${v.skills?.replace(/"/g, '""') || ''}"`,
          `"${v.availability?.replace(/"/g, '""') || ''}"`,
          `"${v.bio?.replace(/"/g, '""') || ''}"`,
          v.joined_at || '',
          v.user_id || '',
        ].join(',') // Join the values with commas
      )
    ].join('\n'); // Join the rows with newlines

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'volunteers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  // Initial fetch of volunteers when the component mounts
  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // --- Create Volunteer Form Handlers ---
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateVolunteerSubmit = async (e) => {
    e.preventDefault();

    setCreateSuccessMessage('');
    setCreateErrorMessage('');
    setCreateValidationErrors({}); // Clear validation errors on new submission

    // New validation for the 'email' field
    const { email, first_name, last_name } = createFormData; // Changed from 'contact' to 'email'
    const newErrors = {};

    if ((first_name || '').trim() === '') {
      newErrors.first_name = 'First name is required.';
    }

    if ((last_name || '').trim() === '') {
      newErrors.last_name = 'Last name is required.';
    }

    // Email validation
    if ((email || '').trim() === '') {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email regex
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setCreateValidationErrors(newErrors);
      setCreateErrorMessage('Please correct the highlighted fields.');
      return;
    }

    setCreateLoading(true);

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/volunteers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      });

      const data = await response.json();
      console.log('Volunteer creation response:', data);

      if (response.ok) {
        setCreateSuccessMessage(data.message || 'Volunteer created successfully!');
        setCreateFormData({ // Clear form fields on success
          first_name: '',
          last_name: '',
          email: '', // Changed from 'contact' to 'email'
          skills: '',
          availability: '',
          bio: '',
          image: '',
        });
        // Hide the form and refresh the volunteer list after a short delay
        setTimeout(() => {
          setShowCreateForm(false);
          fetchVolunteers();
        }, 1500);
      } else {
        setCreateErrorMessage(data.message || data.error || 'Failed to create volunteer.');
      }
    } catch (networkError) {
      console.error('Network error during volunteer creation:', networkError);
      setCreateErrorMessage('Could not connect to the server. Please ensure the backend is running and reachable.');
    } finally {
      setCreateLoading(false);
    }
  };

  // --- View Volunteer Modal Handlers ---
  const handleViewClick = (volunteer) => {
    setVolunteerToView(volunteer);
    setShowViewModal(true);
  };

  // --- Edit Volunteer Modal Handlers ---
  const handleEditClick = (volunteer) => {
    setCurrentVolunteer(volunteer);
    // Populate form with existing data, using 'email' instead of 'contact'
    setEditFormData({
      first_name: volunteer.first_name,
      last_name: volunteer.last_name,
      email: volunteer.email, // Changed from 'contact' to 'email'
      skills: volunteer.skills,
      availability: volunteer.availability,
      bio: volunteer.bio,
      image: volunteer.image,
    });
    setEditSuccessMessage('');
    setEditErrorMessage('');
    setEditValidationErrors({}); // Clear validation errors
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateVolunteer = async (e) => {
    e.preventDefault();
    setEditSuccessMessage('');
    setEditErrorMessage('');
    setEditValidationErrors({}); // Clear validation errors

    // New validation for the 'email' field
    const { email, first_name, last_name } = editFormData; // Changed from 'contact' to 'email'
    const newErrors = {};

    if ((first_name || '').trim() === '') {
      newErrors.first_name = 'First name is required.';
    }

    if ((last_name || '').trim() === '') {
      newErrors.last_name = 'Last name is required.';
    }

    // Email validation
    if ((email || '').trim() === '') {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email regex
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setEditValidationErrors(newErrors);
      setEditErrorMessage('Please correct the highlighted fields.');
      return;
    }

    setEditLoading(true);

    try {
      if (!currentVolunteer || !currentVolunteer.id) {
        setEditErrorMessage('Volunteer ID not found for update.');
        setEditLoading(false);
        return;
      }

      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/volunteers/update/${currentVolunteer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      console.log('Update Volunteer Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Volunteer updated successfully!');
        fetchVolunteers();
        setShowEditModal(false);
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to update volunteer.');
      }
    } catch (networkError) {
      console.error('Network error updating volunteer:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setEditLoading(false);
    }
  };

  // --- Delete Volunteer Handlers using a custom modal ---
  const handleDeleteClick = (volunteer) => {
    setVolunteerToDelete(volunteer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!volunteerToDelete) {
      setEditErrorMessage('No volunteer selected for deletion.');
      setShowDeleteModal(false);
      return;
    }

    setDeleteLoading(true);
    setEditSuccessMessage('');
    setEditErrorMessage('');

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/v1/volunteers/delete/${volunteerToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Delete Volunteer Response:', data);

      if (response.ok) {
        setEditSuccessMessage(data.message || 'Volunteer deleted successfully!');
        fetchVolunteers();
      } else {
        setEditErrorMessage(data.message || data.error || 'Failed to delete volunteer.');
      }
    } catch (networkError) {
      console.error('Network error deleting volunteer:', networkError);
      setEditErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setVolunteerToDelete(null);
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex flex-column align-items-center mb-4">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#3c0008' }}><FaUser className="me-2" />Manage Volunteers</h1>
        <div className="d-flex justify-content-center">
          {canCreate && (
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="py-2 px-4 rounded-md shadow-md me-2"
              style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
            >
              {showCreateForm ? <><FaTimes className="me-2" /> Close Form</> : <><FaPlus className="me-2" /> Add New Volunteer</>}
            </Button>
          )}
          {canDownload && (
            <Button
              onClick={handleDownload}
              className="py-2 px-4 rounded-md shadow-md"
              style={{ backgroundColor: '#800000', borderColor: '#800000', color: 'white' }}
            >
              <FaDownload className="me-2" /> Download Volunteers
            </Button>
          )}
        </div>
      </div>

      {showCreateForm && canCreate && (
        <Card className="shadow-lg p-4 rounded-lg mb-4" style={{ backgroundColor: '#e7d5d3', border: '1px solid #800000' }}>
          <Card.Body>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: '#803232' }}>Add New Volunteer</h2>
            {createSuccessMessage && <Alert variant="success">{createSuccessMessage}</Alert>}
            {createErrorMessage && <Alert variant="danger">{createErrorMessage}</Alert>}

            <Form onSubmit={handleCreateVolunteerSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Group className="mb-3" controlId="createVolunteerFirstName">
                  <Form.Label className="font-semibold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="Enter first name"
                    value={createFormData.first_name}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createLoading}
                    isInvalid={!!createValidationErrors.first_name}
                    className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <Form.Control.Feedback type="invalid">
                    {createValidationErrors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="createVolunteerLastName">
                  <Form.Label className="font-semibold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder="Enter last name"
                    value={createFormData.last_name}
                    onChange={handleCreateFormChange}
                    required
                    disabled={createLoading}
                    isInvalid={!!createValidationErrors.last_name}
                    className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <Form.Control.Feedback type="invalid">
                    {createValidationErrors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              {/* This is the new email field, replacing the contact field. */}
              <Form.Group className="mb-3" controlId="createVolunteerEmail">
                <Form.Label className="font-semibold"><FaEnvelope className="me-1" /> Email</Form.Label>
                <Form.Control
                  type="email" // Changed type to email for better browser validation
                  name="email"
                  placeholder="Enter volunteer's email"
                  value={createFormData.email}
                  onChange={handleCreateFormChange}
                  disabled={createLoading}
                  required
                  isInvalid={!!createValidationErrors.email}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
                <Form.Control.Feedback type="invalid">
                  {createValidationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="createVolunteerSkills">
                <Form.Label className="font-semibold"><FaLightbulb className="me-1" /> Skills</Form.Label>
                <Form.Control
                  type="text"
                  name="skills"
                  placeholder="e.g., Teaching, Fundraising, Marketing (comma-separated)"
                  value={createFormData.skills}
                  onChange={handleCreateFormChange}
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="createVolunteerAvailability">
                <Form.Label className="font-semibold"><FaClock className="me-1" /> Availability</Form.Label>
                <Form.Control
                  type="text"
                  name="availability"
                  placeholder="e.g., Weekends, Mon-Wed evenings"
                  value={createFormData.availability}
                  onChange={handleCreateFormChange}
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="createVolunteerBio">
                <Form.Label className="font-semibold"><FaInfoCircle className="me-1" /> Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  placeholder="Tell us about the volunteer"
                  value={createFormData.bio}
                  onChange={handleCreateFormChange}
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="createVolunteerImage">
                <Form.Label className="font-semibold"><FaImage className="me-1" /> Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  placeholder="Enter image URL (optional)"
                  value={createFormData.image}
                  onChange={handleCreateFormChange}
                  disabled={createLoading}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                  {createLoading ? 'Adding Volunteer...' : 'Add Volunteer'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
      {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" style={{ color: '#800000' }}>
            <span className="visually-hidden">Loading volunteers...</span>
          </Spinner>
          <p className="mt-2 text-gray-600">Loading volunteers...</p>
        </div>
      ) : volunteers.length === 0 ? (
        <Alert variant="info" className="text-center">No volunteers found.</Alert>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <Table striped bordered hover responsive className="text-gray-700">
            <thead style={{ backgroundColor: '#800000', color: 'white' }}>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                {/* Changed header from 'Contact' to 'Email' */}
                <th>Email</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Bio</th>
                <th>Image</th>
                <th>Joined At</th>
                <th>User ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* This line reverses the array to show the newest volunteer first */}
              {volunteers.slice().reverse().map((volunteer, index) => (
                <tr key={volunteer.id}>
                  <td>{volunteers.length - index}</td>
                  <td>{volunteer.first_name}</td>
                  <td>{volunteer.last_name}</td>
                  {/* Changed from 'volunteer.contact' to 'volunteer.email' */}
                  <td>{volunteer.email}</td>
                  <td>
                    {volunteer.skills?.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {volunteer.skills.split(',').map((skill, skillIndex) => (
                          <li key={skillIndex}>{skill.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{volunteer.availability}</td>
                  <td>{volunteer.bio}</td>
                  <td>
                    {volunteer.image ? (
                      <img
                        src={volunteer.image}
                        alt={`${volunteer.first_name} ${volunteer.last_name}`}
                        className="w-16 h-16 object-cover rounded-md shadow"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/cccccc/000000?text=No+Image"; }}
                      />
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td>{volunteer.joined_at}</td>
                  <td>{volunteer.user_id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {/* View button is visible to all admins and super admins */}
                      {isAdmin && (
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleViewClick(volunteer)}
                          style={{ borderColor: '#21739f', color: '#21739f' }}
                        >
                          <FaEye />
                        </Button>
                      )}
                      {/* Edit button is visible to all admins and super admins */}
                      {canEdit && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(volunteer)}
                          style={{ borderColor: '#62a1be', color: '#800000' }}
                        >
                          <FaEdit />
                        </Button>
                      )}
                      {/* Delete button is only visible to super admins */}
                      {canDelete && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(volunteer)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* View Volunteer Modal (read-only) */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>{volunteerToView?.first_name} {volunteerToView?.last_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fdf3f3' }}>
          {volunteerToView && (
            <Card>
              <Card.Body>
                {/* Changed from 'Contact' to 'Email' */}
                <div className="mb-3">
                  <h5 className="font-semibold text-lg" style={{ color: '#800000' }}><FaEnvelope className="me-1" /> Email</h5>
                  <p>{volunteerToView.email || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <h5 className="font-semibold text-lg" style={{ color: '#800000' }}><FaLightbulb className="me-1" /> Skills</h5>
                  <p>{volunteerToView.skills}</p>
                </div>
                <div className="mb-3">
                  <h5 className="font-semibold text-lg" style={{ color: '#800000' }}><FaClock className="me-1" /> Availability</h5>
                  <p>{volunteerToView.availability}</p>
                </div>
                <div className="mb-3">
                  <h5 className="font-semibold text-lg" style={{ color: '#800000' }}><FaInfoCircle className="me-1" /> Bio</h5>
                  <p>{volunteerToView.bio}</p>
                </div>
                <div className="mb-3">
                  <h5 className="font-semibold text-lg" style={{ color: '#800000' }}><FaImage className="me-1" /> Image</h5>
                  {volunteerToView.image ? (
                    <img
                      src={volunteerToView.image}
                      alt={`${volunteerToView.first_name} ${volunteerToView.last_name}`}
                      className="w-100 object-cover rounded-md shadow"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/cccccc/000000?text=No+Image"; }}
                    />
                  ) : (
                    <p className="text-gray-500">N/A</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Volunteer Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#800000', color: 'white' }}>
          <Modal.Title>Edit {currentVolunteer?.first_name} {currentVolunteer?.last_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fdf3f3' }}>
          {editSuccessMessage && <Alert variant="success">{editSuccessMessage}</Alert>}
          {editErrorMessage && <Alert variant="danger">{editErrorMessage}</Alert>}
          <Form onSubmit={handleUpdateVolunteer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group className="mb-3" controlId="editVolunteerFirstName">
                <Form.Label className="font-semibold">First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditFormChange}
                  required
                  disabled={editLoading}
                  isInvalid={!!editValidationErrors.first_name}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
                <Form.Control.Feedback type="invalid">
                  {editValidationErrors.first_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="editVolunteerLastName">
                <Form.Label className="font-semibold">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditFormChange}
                  required
                  disabled={editLoading}
                  isInvalid={!!editValidationErrors.last_name}
                  className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
                <Form.Control.Feedback type="invalid">
                  {editValidationErrors.last_name}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            {/* This is the new email field, replacing the contact field. */}
            <Form.Group className="mb-3" controlId="editVolunteerEmail">
              <Form.Label className="font-semibold"><FaEnvelope className="me-1" /> Email</Form.Label>
              <Form.Control
                type="email" // Changed type to email
                name="email"
                placeholder="Enter volunteer's email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                disabled={editLoading}
                required
                isInvalid={!!editValidationErrors.email}
                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
              <Form.Control.Feedback type="invalid">
                {editValidationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="editVolunteerSkills">
              <Form.Label className="font-semibold"><FaLightbulb className="me-1" /> Skills</Form.Label>
              <Form.Control
                type="text"
                name="skills"
                placeholder="e.g., Teaching, Fundraising, Marketing (comma-separated)"
                value={editFormData.skills}
                onChange={handleEditFormChange}
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editVolunteerAvailability">
              <Form.Label className="font-semibold"><FaClock className="me-1" /> Availability</Form.Label>
              <Form.Control
                type="text"
                name="availability"
                placeholder="e.g., Weekends, Mon-Wed evenings"
                value={editFormData.availability}
                onChange={handleEditFormChange}
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editVolunteerBio">
              <Form.Label className="font-semibold"><FaInfoCircle className="me-1" /> Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                placeholder="Tell us about the volunteer"
                value={editFormData.bio}
                onChange={handleEditFormChange}
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editVolunteerImage">
              <Form.Label className="font-semibold"><FaImage className="me-1" /> Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image"
                placeholder="Enter image URL (optional)"
                value={editFormData.image}
                onChange={handleEditFormChange}
                disabled={editLoading}
                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500"
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
                {editLoading ? 'Updating Volunteer...' : 'Update Volunteer'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Volunteer Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete volunteer ${volunteerToDelete?.first_name} ${volunteerToDelete?.last_name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleteLoading}
      />
    </Container>
  );
};

export default Volunteers;

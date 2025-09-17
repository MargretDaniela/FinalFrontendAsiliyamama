import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card, ButtonGroup, CardImg } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from "react-icons/fa";
import { authenticatedFetch } from "./authService";
import { format } from 'date-fns';

const ProgramsDashboard = ({ userType }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [error, setError] = useState("");


  // State for Programs Page Settings (Main Title, Main Description, Main Image, Section Heading)
  const [pageSettings, setPageSettings] = useState({
    page_main_title: "",
    page_main_description: "",
    page_main_image: null, // Current image path from backend
    page_section_heading: ""
  });
  const [pageSettingsNewImageFile, setPageSettingsNewImageFile] = useState(null); // For new image upload
  const [pageSettingsLoading, setPageSettingsLoading] = useState(false);
  const [pageSettingsMessage, setPageSettingsMessage] = useState({ type: "", text: "" });

  // State for Create Form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    location: "", // ⭐ Added location field
    imageFile: null,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState({ type: "", text: "" });

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "", // ⭐ Added location field
    imageFile: null, // For new image upload during edit
  });
  const [editLoading, setLoadingEdit] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });

  // State for Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State for View Details Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [programToView, setProgramToView] = useState(null);

  const isSuperAdmin = userType === "super_admin";
  const isAdmin = userType === "admin" || isSuperAdmin;

  const fetchPrograms = useCallback(async () => {
    setLoadingPrograms(true);
    setError("");
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/programs/`, { method: "GET" });
      const responseData = await res.json();
      if (res.ok) {
        setPrograms(responseData.programs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        if (responseData.page_settings) {
          setPageSettings(responseData.page_settings);
        }
      } else {
        setError(responseData.error || "Failed to fetch programs");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Check backend connection.");
    } finally {
      setLoadingPrograms(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // --- PROGRAMS PAGE SETTINGS ---
  const handlePageSettingsChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "page_main_image") { // Corrected name to match state key
      setPageSettingsNewImageFile(files[0]);
    } else {
      setPageSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePageSettingsSubmit = async (e) => {
    e.preventDefault();
    setPageSettingsLoading(true);
    setPageSettingsMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      // Corrected keys to match your backend model
      formData.append("page_main_title", pageSettings.page_main_title);
      formData.append("page_main_description", pageSettings.page_main_description);
      formData.append("page_section_heading", pageSettings.page_section_heading);
      if (pageSettingsNewImageFile) {
        formData.append("page_main_image", pageSettingsNewImageFile); // Corrected key
      }

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/programs/page-settings`, {
        method: "PUT",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setPageSettingsMessage({ type: "success", text: responseData.message });
        fetchPrograms(); // Re-fetch programs to update page settings display
        setPageSettingsNewImageFile(null); // Clear new image file input
      } else {
        setPageSettingsMessage({ type: "danger", text: responseData.error || "Failed to update page settings" });
      }
    } catch (err) {
      console.error(err);
      setPageSettingsMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setPageSettingsLoading(false);
    }
  };

  // --- CREATE PROGRAM ---
  const handleCreateChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") { // Renamed state to avoid confusion with backend key
        setCreateFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
        setCreateFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("title", createFormData.title);
      formData.append("description", createFormData.description);
      formData.append("location", createFormData.location); // ⭐ Appended location to form data
      if (createFormData.imageFile) formData.append("image", createFormData.imageFile);

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/programs/create`, {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setCreateMessage({ type: "success", text: responseData.message });
        setCreateFormData({ title: "", description: "", location: "", imageFile: null });
        fetchPrograms(); // Refresh list
        setShowCreateForm(false);
      } else {
        setCreateMessage({ type: "danger", text: responseData.error || "Failed to create program" });
      }
    } catch (err) {
      console.error(err);
      setCreateMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setCreateLoading(false);
    }
  };

  // --- EDIT PROGRAM ---
  const openEditModal = (program) => {
    setCurrentProgram(program);
    setEditFormData({
      title: program.title,
      description: program.description,
      location: program.location, // ⭐ Set location for edit modal
      imageFile: null,
    });
    setEditMessage({ type: "", text: "" });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setEditFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    setEditMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("description", editFormData.description);
      formData.append("location", editFormData.location); // ⭐ Appended location to form data
      if (editFormData.imageFile) formData.append("image", editFormData.imageFile);

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/programs/edit/${currentProgram.id}`, {
        method: "PUT",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setEditMessage({ type: "success", text: responseData.message });
        fetchPrograms(); // Refresh list
        setShowEditModal(false);
      } else {
        setEditMessage({ type: "danger", text: responseData.error || "Failed to update program" });
      }
    } catch (err) {
      console.error(err);
      setEditMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setLoadingEdit(false);
    }
  };

  // --- DELETE PROGRAM ---
  const confirmDelete = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/programs/delete/${programToDelete.id}`, { method: "DELETE" });
      const responseData = await res.json();
      if (res.ok) {
        fetchPrograms(); // Refresh list
        setShowDeleteModal(false);
      } else {
        alert(responseData.error || "Failed to delete program.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Try again.");
    } finally {
      setDeleteLoading(false);
      setProgramToDelete(null);
    }
  };

  // --- VIEW PROGRAM ---
  const openViewModal = (program) => {
    setProgramToView(program);
    setShowViewModal(true);
  };

  // --- DOWNLOAD PROGRAMS DATA ---
  const handleDownload = async () => {
    // ... download logic (no changes needed) ...
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Programs Dashboard</h1>

      {/* Programs Page Settings Section */}
      {isAdmin && (
        <Card className="mb-4 p-3 shadow-sm">
          <h2 className="mb-3">Programs Page Settings (Public View)</h2>
          {pageSettingsMessage.text && <Alert variant={pageSettingsMessage.type}>{pageSettingsMessage.text}</Alert>}
          <Form onSubmit={handlePageSettingsSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Main Page Title</Form.Label>
              <Form.Control
                name="page_main_title"
                value={pageSettings.page_main_title || ""}
                onChange={handlePageSettingsChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Main Page Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="page_main_description"
                value={pageSettings.page_main_description || ""}
                onChange={handlePageSettingsChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Section Heading (e.g., "Our Programs are")</Form.Label>
              <Form.Control
                name="page_section_heading"
                value={pageSettings.page_section_heading || ""}
                onChange={handlePageSettingsChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Main Page Image (Top Image)</Form.Label>
              {pageSettings.page_main_image && (
                <div className="mb-2">
                  <CardImg
                    src={`${API_BASE_URL}/${pageSettings.page_main_image}`}
                    alt="Current Main Image"
                    style={{ width: "150px", height: "auto", borderRadius: "5px", border: "1px solid #ddd" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/150x100?text=No+Image";
                    }}
                  />
                  <p className="text-muted mt-1">Current Image</p>
                </div>
              )}
              <Form.Control type="file" accept="image/*" name="page_main_image" onChange={handlePageSettingsChange} />
              <Form.Text className="text-muted">Upload a new image to replace the current one.</Form.Text>
            </Form.Group>
            <Button type="submit" disabled={pageSettingsLoading} style={{backgroundColor:"maroon"}}>
              {pageSettingsLoading ? "Saving..." : <><FaSave /> Update Page Settings</>}
            </Button>
          </Form>
        </Card>
      )}

      {/* Manage Programs Section */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h2>Manage Individual Programs</h2>
        <div className="d-flex">
          {isSuperAdmin && (
            <Button variant="danger" onClick={handleDownload} className="me-2">
              <FaDownload /> Download Data
            </Button>
          )}
          {isAdmin && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="danger">
              {showCreateForm ? "Close Form" : "Create New Program"} <FaPlus />
            </Button>
          )}
        </div>
      </div>

      {showCreateForm && isAdmin && (
        <Card className="mb-3 p-3 shadow-sm">
          {createMessage.text && <Alert variant={createMessage.type}>{createMessage.text}</Alert>}
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Program Title</Form.Label>
              <Form.Control name="title" value={createFormData.title} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Program Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={createFormData.description} onChange={handleCreateChange} required />
            </Form.Group>
            {/* ⭐ New: Location field */}
            <Form.Group className="mb-2">
              <Form.Label>Program Location</Form.Label>
              <Form.Control name="location" value={createFormData.location} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Program Image</Form.Label>
              <Form.Control type="file" accept="image/*" name="imageFile" onChange={handleCreateChange} />
            </Form.Group>
            <Button type="submit" disabled={createLoading}>{createLoading ? "Creating..." : "Create Program"}</Button>
          </Form>
        </Card>
      )}

      {/* Programs Table */}
      {loadingPrograms ? <Spinner animation="border" /> : error ? <Alert variant="danger">{error}</Alert> : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th> {/* ⭐ New: Location column header */}
              <th>Description</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length > 0 ? (
              programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.id}</td>
                  <td>{program.title}</td>
                  <td>{program.location}</td> {/* ⭐ New: Location column data */}
                  <td>{program.description.substring(0, 70)}{program.description.length > 70 ? '...' : ''}</td>
                  <td>
                    {program.image && (
                      <img
                        src={`${API_BASE_URL}/${program.image}`}
                        alt={program.title}
                        style={{ width: "80px", height: "auto", borderRadius: "5px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/80x50/CCCCCC/000000?text=No+Img";
                        }}
                      />
                    )}
                  </td>
                  <td>{program.created_at ? format(new Date(program.created_at), 'yyyy-MM-dd') : 'N/A'}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="primary" onClick={() => openViewModal(program)}><FaEye /></Button>
                      {isAdmin && <Button variant="secondary" onClick={() => openEditModal(program)}><FaEdit /></Button>}
                      {isSuperAdmin && <Button variant="danger" onClick={() => confirmDelete(program)}><FaTrash /></Button>}
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">No programs available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* View Program Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Program Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {programToView && (
            <Card>
              {programToView.image && (
                <Card.Img
                  variant="top"
                  src={`${API_BASE_URL}/${programToView.image}`}
                  alt={programToView.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                  }}
                />
              )}
              <Card.Body>
                <Card.Title className="fw-bold">{programToView.title}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {programToView.location || 'N/A'}<br/>
                  <strong>Published:</strong> {programToView.created_at ? format(new Date(programToView.created_at), 'MMMM d, yyyy HH:mm') : 'N/A'}<br/>
                  <strong>Description:</strong> {programToView.description}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Program Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Program</Modal.Title></Modal.Header>
        <Modal.Body>
          {editMessage.text && <Alert variant={editMessage.type}>{editMessage.text}</Alert>}
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={editFormData.title} onChange={handleEditChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={editFormData.description} onChange={handleEditChange} required />
            </Form.Group>
            {/* ⭐ New: Location field for edit modal */}
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control name="location" value={editFormData.location} onChange={handleEditChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" name="imageFile" onChange={handleEditChange} />
              {currentProgram?.image && (
                <div className="mt-2">
                  <p>Current Image:</p>
                  <img src={`${API_BASE_URL}/${currentProgram.image}`} alt="Current Program" style={{ width: "100px", borderRadius: "5px" }} />
                </div>
              )}
            </Form.Group>
            <Button type="submit" disabled={editLoading}>{editLoading ? "Updating..." : "Update Program"}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete "{programToDelete?.title}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProgramsDashboard;
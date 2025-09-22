import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card, ButtonGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from "react-icons/fa";
import { authenticatedFetch } from "./authService";
import { format } from 'date-fns';

const EventsDashboard = ({ userType }) => {
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_BASE_URL = 'http://127.0.0.1:5000';
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");

  const [pageSettings, setPageSettings] = useState({
    pageTitle: "",
    pageDescription: "",
  });
  const [pageSettingsLoading, setPageSettingsLoading] = useState(false);
  const [pageSettingsMessage, setPageSettingsMessage] = useState({ type: "", text: "" });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageFile: null,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState({ type: "", text: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageFile: null,
  });
  const [editLoading, setLoadingEdit] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [eventToView, setEventToView] = useState(null);

  const isSuperAdmin = userType === "super_admin";
  const isAdmin = userType === "admin" || isSuperAdmin;

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    setError("");
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/events/`, { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events.sort((a, b) => b.id - a.id));
        setPageSettings(data.page_settings);
      } else {
        setError(data.error || "Failed to fetch events");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Check backend connection.");
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --- PAGE SETTINGS ---
  const handlePageSettingsChange = (e) => {
    const { name, value } = e.target;
    setPageSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageSettingsSubmit = async (e) => {
    e.preventDefault();
    setPageSettingsLoading(true);
    setPageSettingsMessage({ type: "", text: "" });

    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/events/page-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageSettings),
      });

      const data = await res.json();
      if (res.ok) {
        setPageSettingsMessage({ type: "success", text: data.message });
      } else {
        setPageSettingsMessage({ type: "danger", text: data.error || "Failed to update page settings" });
      }
    } catch (err) {
      console.error(err);
      setPageSettingsMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setPageSettingsLoading(false);
    }
  };

  // --- CREATE EVENT ---
  const handleCreateChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setCreateFormData((prev) => ({ ...prev, imageFile: files[0] }));
    else setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("title", createFormData.title);
      formData.append("description", createFormData.description);
      formData.append("date", createFormData.date);
      formData.append("location", createFormData.location);
      if (createFormData.imageFile) formData.append("image", createFormData.imageFile);

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/events/create`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCreateMessage({ type: "success", text: data.message });
        setCreateFormData({ title: "", description: "", date: "", location: "", imageFile: null });
        fetchEvents();
        setShowCreateForm(false);
      } else {
        setCreateMessage({ type: "danger", text: data.error || "Failed to create event" });
      }
    } catch (err) {
      console.error(err);
      setCreateMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setCreateLoading(false);
    }
  };

  // --- EDIT EVENT ---
  const openEditModal = (event) => {
    setCurrentEvent(event);
    setEditFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      imageFile: null,
    });
    setEditMessage({ type: "", text: "" });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setEditFormData((prev) => ({ ...prev, imageFile: files[0] }));
    else setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    setEditMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("description", editFormData.description);
      formData.append("date", editFormData.date);
      formData.append("location", editFormData.location);
      if (editFormData.imageFile) formData.append("image", editFormData.imageFile);

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/events/edit/${currentEvent.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setEditMessage({ type: "success", text: data.message });
        fetchEvents();
        setShowEditModal(false);
      } else {
        setEditMessage({ type: "danger", text: data.error || "Failed to update event" });
      }
    } catch (err) {
      console.error(err);
      setEditMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setLoadingEdit(false);
    }
  };

  // --- DELETE EVENT ---
  const confirmDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/events/delete/${eventToDelete.id}`, { method: "DELETE" });
      //const data = await res.json();
      if (res.ok) fetchEvents();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setEventToDelete(null);
    }
  };

  // --- VIEW EVENT ---
  const openViewModal = (event) => {
    setEventToView(event);
    setShowViewModal(true);
  };

  // --- DOWNLOAD EVENTS DATA ---
  const handleDownload = async () => {
    try {
      const csvHeader = ["ID", "Title", "Description", "Date", "Location", "Image URL"].join(",");
      const csvRows = events.map(event =>
        [
          event.id,
          `"${event.title.replace(/"/g, '""')}"`,
          `"${event.description.replace(/"/g, '""')}"`,
          event.date,
          `"${event.location.replace(/"/g, '""')}"`,
          `${API_BASE_URL}/${event.image}`
        ].join(",")
      );
      const csvString = [csvHeader, ...csvRows].join("\n");

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "events.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error downloading events:", err);
    }
  };


  return (
    <Container className="my-4">
      <h1 className="mb-4" style={{color:"#3c0008"}}>Events Dashboard</h1>
      {isAdmin && (
        <Card className="mb-4 p-3">
          <h2 className="mb-3">Events Page Settings</h2>
          {pageSettingsMessage.text && <Alert variant={pageSettingsMessage.type}>{pageSettingsMessage.text}</Alert>}
          <Form onSubmit={handlePageSettingsSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Page Title</Form.Label>
              <Form.Control
                name="pageTitle"
                value={pageSettings.pageTitle || ""}
                onChange={handlePageSettingsChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Page Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="pageDescription"
                value={pageSettings.pageDescription || ""}
                onChange={handlePageSettingsChange}
                required
              />
            </Form.Group>
            <Button type="submit" disabled={pageSettingsLoading} style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}} >
              {pageSettingsLoading ? "Saving..." : <><FaSave /> Update Page Text</>}
            </Button>
          </Form>
        </Card>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={{color:"#3c0008"}}>Manage Events</h2>
        <div className="d-flex">
          {isSuperAdmin && (
            <Button onClick={handleDownload} className="me-2" style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}}>
              <FaDownload /> Download
            </Button>
          )}
          {isAdmin && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}}>
              {showCreateForm ? "Close Form" : "Create Event"} <FaPlus />
            </Button>
          )}
        </div>
      </div>

      {showCreateForm && isAdmin && (
        <Card className="mb-3 p-3">
          {createMessage.text && <Alert variant={createMessage.type}>{createMessage.text}</Alert>}
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={createFormData.title} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={createFormData.description} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={createFormData.date} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control name="location" value={createFormData.location} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" name="image" onChange={handleCreateChange} />
            </Form.Group>
            <Button type="submit" disabled={createLoading}>{createLoading ? "Creating..." : "Create Event"}</Button>
          </Form>
        </Card>
      )}

      {loadingEvents ? <Spinner animation="border" /> : error ? <Alert variant="danger">{error}</Alert> : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.title}</td>
                  <td>{ev.date}</td>
                  <td>{ev.location}</td>
                  <td>
                    {ev.image && (
                      <img
                        src={`${API_BASE_URL}/${ev.image}`}
                        alt={ev.title}
                        style={{ width: "80px", height: "auto", borderRadius: "5px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/80x50/CCCCCC/000000?text=No+Img";
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="primary" onClick={() => openViewModal(ev)}><FaEye /></Button>
                      {isAdmin && <Button variant="success" onClick={() => openEditModal(ev)}><FaEdit /></Button>}
                      {isSuperAdmin && <Button variant="danger" onClick={() => confirmDelete(ev)}><FaTrash /></Button>}
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">No events available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Event Details</Modal.Title></Modal.Header>
        <Modal.Body>
          {eventToView && (
            <Card>
              {eventToView.image && (
                <Card.Img
                  variant="top"
                  src={`${API_BASE_URL}/${eventToView.image}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                  }}
                />
              )}
              <Card.Body>
                <Card.Title>{eventToView.title}</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> {eventToView.date ? format(new Date(eventToView.date), 'MMMM d, yyyy') : 'N/A'}<br/>
                  <strong>Location:</strong> {eventToView.location}<br/>
                  <strong>Description:</strong> {eventToView.description}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Event</Modal.Title></Modal.Header>
        <Modal.Body>
          {editMessage.text && <Alert variant={editMessage.type}>{editMessage.text}</Alert>}
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control name="title" value={editFormData.title} onChange={handleEditChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} name="description" value={editFormData.description} onChange={handleEditChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Date</Form.Label><Form.Control type="date" name="date" value={editFormData.date} onChange={handleEditChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Location</Form.Label><Form.Control name="location" value={editFormData.location} onChange={handleEditChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Image</Form.Label><Form.Control type="file" accept="image/*" name="image" onChange={handleEditChange} /></Form.Group>
            <Button type="submit" disabled={editLoading}>{editLoading ? "Updating..." : "Update Event"}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete "{eventToDelete?.title}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventsDashboard;
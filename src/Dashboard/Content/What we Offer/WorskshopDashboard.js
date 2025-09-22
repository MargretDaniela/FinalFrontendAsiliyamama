import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card, ButtonGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from "react-icons/fa";
import { authenticatedFetch } from '../../pages/authService';

const WorkshopsDashboard = ({ userType }) => {
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = 'http://127.0.0.1:5000';
    // State for managing workshops
    const [workshops, setWorkshops] = useState([]);
    const [loadingWorkshops, setLoadingWorkshops] = useState(true);
    const [error, setError] = useState("");

    // State for managing workshop creation/editing
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentWorkshop, setCurrentWorkshop] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", image: null });
    const [formLoading, setFormLoading] = useState(false);
    const [formMessage, setFormMessage] = useState({ type: "", text: "" });

    // State for managing page content
    const [pageContent, setPageContent] = useState({ title: "", description: "" });
    const [showPageContentForm, setShowPageContentForm] = useState(false);
    const [pageContentLoading, setPageContentLoading] = useState(false);
    const [pageContentMessage, setPageContentMessage] = useState({ type: "", text: "" });

    // State for managing CTA content
    const [ctaContent, setCtaContent] = useState({ header: "", text: "", button_text: "" });
    const [showCtaForm, setShowCtaForm] = useState(false);
    const [ctaLoading, setCtaLoading] = useState(false);
    const [ctaMessage, setCtaMessage] = useState({ type: "", text: "" });

    // State for viewing a single workshop
    const [showViewModal, setShowViewModal] = useState(false);
    const [workshopToView, setWorkshopToView] = useState(null);


    const isSuperAdmin = userType === "super_admin";
    const isAdmin = userType === "admin" || isSuperAdmin;

    const fetchWorkshops = useCallback(async () => {
        setLoadingWorkshops(true);
        setError("");
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/workshops/`, { method: "GET" });
            const data = await res.json();
            if (res.ok) {
                setWorkshops(data.workshops.sort((a, b) => b.id - a.id));
                setPageContent({ title: data.page_content.title, description: data.page_content.description });
                setCtaContent({
                    header: data.page_content.cta_header,
                    text: data.page_content.cta_text,
                    button_text: data.page_content.cta_button_text
                });
            } else {
                setError(data.error || "Failed to fetch workshops");
            }
        } catch (err) {
            console.error(err);
            setError("Network error. Check backend connection.");
        } finally {
            setLoadingWorkshops(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkshops();
    }, [fetchWorkshops]);

    const handleCreateClick = () => {
        setShowForm(true);
        setIsEditing(false);
        setCurrentWorkshop(null);
        setFormData({ title: "", description: "", image: null });
        setFormMessage({ type: "", text: "" });
    };

    const handleEditClick = (workshop) => {
        setShowForm(true);
        setIsEditing(true);
        setCurrentWorkshop(workshop);
        setFormData({ title: workshop.title, description: workshop.description, image: null });
        setFormMessage({ type: "", text: "" });
    };

    const handleDelete = async (id) => {
        // Replace window.confirm with a custom modal if preferred
        if (!window.confirm("Are you sure you want to delete this workshop?")) return;

        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/workshops/delete/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                // Replace alert with a custom message display if preferred
                alert(data.message);
                fetchWorkshops();
            } else {
                alert(data.error || "Failed to delete workshop");
            }
        } catch (err) {
            console.error("Error deleting workshop:", err);
            alert("Network error. Failed to delete workshop.");
        }
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormMessage({ type: "", text: "" });

        const url = isEditing
            ? `${API_BASE_URL}/api/v1/workshops/edit/${currentWorkshop.id}`
            : `${API_BASE_URL}/api/v1/workshops/create`;

        const method = isEditing ? "PUT" : "POST";

        const form = new FormData();
        form.append("title", formData.title);
        form.append("description", formData.description);
        if (formData.image) {
            form.append("image", formData.image);
        }

        try {
            const res = await authenticatedFetch(url, {
                method,
                body: form,
            });
            const data = await res.json();
            if (res.ok) {
                setFormMessage({ type: "success", text: data.message });
                setShowForm(false);
                fetchWorkshops();
            } else {
                setFormMessage({ type: "danger", text: data.error || "Failed to save workshop" });
            }
        } catch (err) {
            console.error(err);
            setFormMessage({ type: "danger", text: "Network error. Failed to save workshop." });
        } finally {
            setFormLoading(false);
        }
    };
    
    // --- Page Content Edit Handlers ---
    const handlePageContentChange = (e) => {
        const { name, value } = e.target;
        setPageContent(prev => ({ ...prev, [name]: value }));
    };

    const handlePageContentSubmit = async (e) => {
        e.preventDefault();
        setPageContentLoading(true);
        setPageContentMessage({ type: "", text: "" });

        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/workshops/page-content/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pageContent),
            });
            const data = await res.json();
            if (res.ok) {
                setPageContentMessage({ type: "success", text: data.message });
                fetchWorkshops();
                setShowPageContentForm(false);
            } else {
                setPageContentMessage({ type: "danger", text: data.error || "Failed to update page content" });
            }
        } catch (err) {
            console.error(err);
            setPageContentMessage({ type: "danger", text: "Network error. Try again." });
        } finally {
            setPageContentLoading(false);
        }
    };
    
    // --- CTA Content Edit Handlers ---
    const handleCtaChange = (e) => {
        const { name, value } = e.target;
        setCtaContent(prev => ({ ...prev, [name]: value }));
    };

    const handleCtaSubmit = async (e) => {
        e.preventDefault();
        setCtaLoading(true);
        setCtaMessage({ type: "", text: "" });

        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/workshops/cta-content/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ctaContent),
            });
            const data = await res.json();
            if (res.ok) {
                setCtaMessage({ type: "success", text: data.message });
                fetchWorkshops();
                setShowCtaForm(false);
            } else {
                setCtaMessage({ type: "danger", text: data.error || "Failed to update CTA content" });
            }
        } catch (err) {
            console.error(err);
            setCtaMessage({ type: "danger", text: "Network error. Try again." });
        } finally {
            setCtaLoading(false);
        }
    };

    // --- View Workshop Modal Handlers ---
    const openViewModal = (workshop) => {
        setWorkshopToView(workshop);
        setShowViewModal(true);
    };

    // --- Download Workshops Data ---
    const handleDownload = async () => {
        try {
            const csvHeader = ["ID", "Title", "Description", "Image URL"].join(",");
            const csvRows = workshops.map(workshop =>
                [
                    workshop.id,
                    `"${workshop.title.replace(/"/g, '""')}"`,
                    `"${workshop.description.replace(/"/g, '""')}"`,
                    `${API_BASE_URL}/${workshop.image}`
                ].join(",")
            );
            const csvString = [csvHeader, ...csvRows].join("\n");

            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "workshops.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            console.error("Error downloading workshops:", err);
            alert("Error downloading data."); // Fallback alert
        }
    };

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: "#3c0008" }}>Workshops Dashboard</h1>

            {/* --- Workshops Page Content Section --- */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#3c0008" }}>Workshops Page Content</h2>
                {isAdmin && (
                    <>
                        <Button onClick={() => setShowPageContentForm(!showPageContentForm)} className="me-2" style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            {showPageContentForm ? "Close" : "Edit Page Content"} <FaEdit />
                        </Button>
                        <Button onClick={() => setShowCtaForm(!showCtaForm)} style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            {showCtaForm ? "Close" : "Edit CTA"} <FaEdit />
                        </Button>
                    </>
                )}
            </div>

            {/* Form for editing page title and description */}
            {showPageContentForm && isAdmin && (
                <Card className="mb-3 p-3">
                    <h4 className="mb-3">Edit Page Header</h4>
                    {pageContentMessage.text && <Alert variant={pageContentMessage.type}>{pageContentMessage.text}</Alert>}
                    <Form onSubmit={handlePageContentSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>Page Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={pageContent.title}
                                onChange={handlePageContentChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Page Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={pageContent.description}
                                onChange={handlePageContentChange}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" disabled={pageContentLoading} style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            {pageContentLoading ? "Saving..." : <><FaSave /> Save Content</>}
                        </Button>
                    </Form>
                </Card>
            )}

            {/* Form for editing CTA content */}
            {showCtaForm && isAdmin && (
                <Card className="mb-3 p-3">
                    <h4 className="mb-3">Edit Call to Action Section</h4>
                    {ctaMessage.text && <Alert variant={ctaMessage.type}>{ctaMessage.text}</Alert>}
                    <Form onSubmit={handleCtaSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>CTA Header</Form.Label>
                            <Form.Control
                                type="text"
                                name="header"
                                value={ctaContent.header}
                                onChange={handleCtaChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>CTA Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="text"
                                value={ctaContent.text}
                                onChange={handleCtaChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>CTA Button Text</Form.Label>
                            <Form.Control
                                type="text"
                                name="button_text"
                                value={ctaContent.button_text}
                                onChange={handleCtaChange}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" disabled={ctaLoading} style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}}>
                            {ctaLoading ? "Saving..." : <><FaSave /> Save CTA</>}
                        </Button>
                    </Form>
                </Card>
            )}

            <hr className="my-4" />

            {/* --- Workshops List Section --- */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#3c0008" }}>Manage Workshops</h2>
                <div className="d-flex">
                    {isSuperAdmin && (
                        <Button onClick={handleDownload} className="me-2" style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            <FaDownload /> Download Data
                        </Button>
                    )}
                    {isAdmin && (
                        <Button onClick={handleCreateClick} style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            Add New Workshop <FaPlus />
                        </Button>
                    )}
                </div>
            </div>
            
            {loadingWorkshops ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : workshops.length === 0 ? (
                <Alert variant="info" className="text-center">No workshops have been created yet.</Alert>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr style={{ backgroundColor: "#521c23ff", color: "white" }}>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workshops.map((workshop) => (
                            <tr key={workshop.id}>
                                <td>{workshop.id}</td>
                                <td>{workshop.title}</td>
                                <td>{workshop.description.substring(0, 100)}...</td>
                                <td>
                                    {workshop.image && (
                                        <img
                                            src={`${API_BASE_URL}/${workshop.image}`}
                                            alt={workshop.title}
                                            style={{ width: "80px", height: "auto", borderRadius: "5px" }}
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80x60?text=Image+Error"; }}
                                        />
                                    )}
                                </td>
                                <td>
                                    <ButtonGroup size="sm">
                                        <Button
                                            variant="info" // Changed to info for view
                                            onClick={() => openViewModal(workshop)}
                                            style={{ color: "#ffffff" }}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="success"
                                            onClick={() => handleEditClick(workshop)}
                                            style={{ backgroundColor: "#521c23ff", borderColor: "#521c23ff", color: "#ffffff" }}
                                            disabled={!isAdmin}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(workshop.id)}
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
            )}

            {/* --- Modal for Create/Edit Workshop --- */}
            <Modal show={showForm} onHide={() => setShowForm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Workshop" : "Add New Workshop"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body>
                        {formMessage.text && <Alert variant={formMessage.type}>{formMessage.text}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleFormChange}
                                required={!isEditing} // Image is only required for new creation
                            />
                            {isEditing && currentWorkshop?.image && (
                                <div className="mt-2">
                                    <p>Current Image:</p>
                                    <img src={`${API_BASE_URL}/${currentWorkshop.image}`} alt="Current" style={{ width: "100px", height: "auto", borderRadius: "5px" }} />
                                </div>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowForm(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={formLoading}
                            style={{ backgroundColor: "#521c23ff", borderColor: "#521c23ff" }}
                        >
                            {formLoading ? "Saving..." : <><FaSave /> Save Changes</>}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* --- View Workshop Details Modal --- */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Workshop Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {workshopToView && (
                        <Card>
                            {workshopToView.image && (
                                <Card.Img
                                    variant="top"
                                    src={`${API_BASE_URL}/${workshopToView.image}`}
                                    alt={workshopToView.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                                    }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title className="fw-bold">{workshopToView.title}</Card.Title>
                                <Card.Text>
                                    <strong>Description:</strong> {workshopToView.description}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default WorkshopsDashboard;
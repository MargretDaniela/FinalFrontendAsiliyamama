import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card, ButtonGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from "react-icons/fa";
import { authenticatedFetch } from "./authService";
import { format } from 'date-fns';


const BlogDashboard = ({ userType }) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(true);
  const [error, setError] = useState("");

  // State for Blog Page Settings (Title and Description)
  const [pageSettings, setPageSettings] = useState({
    pageTitle: "",
    pageDescription: "",
  });
  const [pageSettingsLoading, setPageSettingsLoading] = useState(false);
  const [pageSettingsMessage, setPageSettingsMessage] = useState({ type: "", text: "" });

  // State for Create Form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState({ type: "", text: "" });

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBlogPost, setCurrentBlogPost] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
  });
  const [editLoading, setLoadingEdit] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: "", text: "" });

  // State for Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogPostToDelete, setBlogPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State for View Details Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [blogPostToView, setBlogPostToView] = useState(null);

  const isSuperAdmin = userType === "super_admin";
  const isAdmin = userType === "admin" || isSuperAdmin;

  // Fetch all blog posts and page settings
  const fetchBlogPosts = useCallback(async () => {
    setLoadingBlogPosts(true);
    setError("");
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/blogs/`, { method: "GET" });
      const responseData = await res.json();
      if (res.ok) {
        setBlogPosts(responseData.blogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setPageSettings(responseData.page_settings);
      } else {
        setError(responseData.error || "Failed to fetch blog posts");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Check backend connection.");
    } finally {
      setLoadingBlogPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  // --- BLOG PAGE SETTINGS ---
  const handlePageSettingsChange = (e) => {
    const { name, value } = e.target;
    setPageSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageSettingsSubmit = async (e) => {
    e.preventDefault();
    setPageSettingsLoading(true);
    setPageSettingsMessage({ type: "", text: "" });

    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/blogs/page-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageSettings),
      });

      const responseData = await res.json();
      if (res.ok) {
        setPageSettingsMessage({ type: "success", text: responseData.message });
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

  // --- CREATE BLOG POST ---
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
      if (createFormData.imageFile) formData.append("image", createFormData.imageFile);

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/blogs/create`, {
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setCreateMessage({ type: "success", text: responseData.message });
        setCreateFormData({ title: "", description: "", imageFile: null });
        fetchBlogPosts(); // Refresh list
        setShowCreateForm(false);
      } else {
        setCreateMessage({ type: "danger", text: responseData.error || "Failed to create blog post" });
      }
    } catch (err) {
      console.error(err);
      setCreateMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setCreateLoading(false);
    }
  };

  // --- EDIT BLOG POST ---
  const openEditModal = (blogPost) => {
    setCurrentBlogPost(blogPost);
    setEditFormData({
      title: blogPost.title,
      description: blogPost.description,
      imageFile: null, // Image will be handled separately if updated
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
      if (editFormData.imageFile) formData.append("image", editFormData.imageFile);

      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/blogs/edit/${currentBlogPost.id}`, {
        method: "PUT",
        body: formData,
      });

      const responseData = await res.json();
      if (res.ok) {
        setEditMessage({ type: "success", text: responseData.message });
        fetchBlogPosts(); // Refresh list
        setShowEditModal(false);
      } else {
        setEditMessage({ type: "danger", text: responseData.error || "Failed to update blog post" });
      }
    } catch (err) {
      console.error(err);
      setEditMessage({ type: "danger", text: "Network error. Try again." });
    } finally {
      setLoadingEdit(false);
    }
  };

  // --- DELETE BLOG POST ---
  const confirmDelete = (blogPost) => {
    setBlogPostToDelete(blogPost);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/blogs/delete/${blogPostToDelete.id}`, { method: "DELETE" });
      const responseData = await res.json();
      if (res.ok) {
        fetchBlogPosts(); // Refresh list
        setShowDeleteModal(false);
      } else {
        // Handle specific error messages from backend, e.g., permission denied
        alert(responseData.error || "Failed to delete blog post.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Try again.");
    } finally {
      setDeleteLoading(false);
      setBlogPostToDelete(null);
    }
  };

  // --- VIEW BLOG POST ---
  const openViewModal = (blogPost) => {
    setBlogPostToView(blogPost);
    setShowViewModal(true);
  };

  // --- DOWNLOAD BLOG POSTS DATA ---
  const handleDownload = async () => {
    try {
      const csvHeader = ["ID", "Title", "Description", "Image URL", "Created At"].join(",");
      const csvRows = blogPosts.map(post =>
        [
          post.id,
          `"${post.title.replace(/"/g, '""')}"`,
          `"${post.description.replace(/"/g, '""')}"`,
          `${API_BASE_URL}/${post.image}`,
          post.created_at
        ].join(",")
      );
      const csvString = [csvHeader, ...csvRows].join("\n");

      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) { // Feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "blog_posts.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error downloading blog posts:", err);
      alert("Failed to download blog posts data.");
    }
  };


  return (
    <Container className="my-4">
      <h1 className="mb-4" style={{color:"#3c0008"}}>Blog Dashboard</h1>

      {/* Blog Page Settings Section */}
      {isAdmin && (
        <Card className="mb-4 p-3 shadow-sm">
          <h2 className="mb-3">Blog Page Settings</h2>
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
            <Button type="submit" disabled={pageSettingsLoading} style={{backgroundColor:"#8f2d2dff", color:"#ffffff"}}>
              {pageSettingsLoading ? "Saving..." : <><FaSave /> Update Page Text</>}
            </Button>
          </Form>
        </Card>
      )}

      {/* Manage Blog Posts Section */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h2 style={{color:"#3c0008"}}>Manage Blog Posts</h2>
        <div className="d-flex">
          {isSuperAdmin && (
            <Button onClick={handleDownload} className="me-2"  style={{backgroundColor:"#8f2d2dff", color:"#ffffff"}}>
              <FaDownload /> Download Data
            </Button>
          )}
          {isAdmin && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} style={{backgroundColor:"#8f2d2dff", color:"#ffffff"}}>
              {showCreateForm ? "Close Form" : "Create Blog Post"} <FaPlus />
            </Button>
          )}
        </div>
      </div>

      {showCreateForm && isAdmin && (
        <Card className="mb-3 p-3 shadow-sm">
          {createMessage.text && <Alert variant={createMessage.type}>{createMessage.text}</Alert>}
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={createFormData.title} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={createFormData.description} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" name="image" onChange={handleCreateChange} />
            </Form.Group>
            <Button type="submit" disabled={createLoading}>{createLoading ? "Creating..." : "Create Blog Post"}</Button>
          </Form>
        </Card>
      )}

      {/* Blog Posts Table */}
      {loadingBlogPosts ? <Spinner animation="border" /> : error ? <Alert variant="danger">{error}</Alert> : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.description.substring(0, 50)}{post.description.length > 50 ? '...' : ''}</td>
                  <td>
                    {post.image && (
                      <img
                        src={`${API_BASE_URL}/${post.image}`}
                        alt={post.title}
                        style={{ width: "80px", height: "auto", borderRadius: "5px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/80x50/CCCCCC/000000?text=No+Img";
                        }}
                      />
                    )}
                  </td>
                  <td>{post.created_at ? format(new Date(post.created_at), 'yyyy-MM-dd') : 'N/A'}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <Button variant="primary" onClick={() => openViewModal(post)}><FaEye /></Button>
                      {isAdmin && <Button variant="success" onClick={() => openEditModal(post)}><FaEdit /></Button>}
                      {isSuperAdmin && <Button variant="danger" onClick={() => confirmDelete(post)}><FaTrash /></Button>}
                    </ButtonGroup>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">No blog posts available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* View Blog Post Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Blog Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {blogPostToView && (
            <Card>
              {blogPostToView.image && (
                <Card.Img
                  variant="top"
                  src={`${API_BASE_URL}/${blogPostToView.image}`}
                  alt={blogPostToView.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                  }}
                />
              )}
              <Card.Body>
                <Card.Title className="fw-bold">{blogPostToView.title}</Card.Title>
                <Card.Text>
                  <strong>Published:</strong> {blogPostToView.created_at ? format(new Date(blogPostToView.created_at), 'MMMM d, yyyy HH:mm') : 'N/A'}<br/>
                  <strong>Description:</strong> {blogPostToView.description}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Blog Post Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Blog Post</Modal.Title></Modal.Header>
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
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" name="image" onChange={handleEditChange} />
            </Form.Group>
            <Button type="submit" disabled={editLoading}>{editLoading ? "Updating..." : "Update Blog Post"}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete "{blogPostToDelete?.title}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BlogDashboard;
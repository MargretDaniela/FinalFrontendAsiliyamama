// import React, { useState, useEffect, useCallback } from "react";
// import { Container, Table, Button, Form, Modal, Alert, Spinner, Card, ButtonGroup } from "react-bootstrap";
// import { FaEdit, FaTrash, FaPlus, FaSave, FaEye, FaDownload } from "react-icons/fa";
// import { authenticatedFetch } from "../Latest/authService";

// const ProductsDashboard = ({ userType }) => {
//   const [products, setProducts] = useState([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [error, setError] = useState("");

//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [createFormData, setCreateFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     imageFile: null,
//   });
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createMessage, setCreateMessage] = useState({ type: "", text: "" });

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     imageFile: null,
//   });
//   const [editLoading, setLoadingEdit] = useState(false);
//   const [editMessage, setEditMessage] = useState({ type: "", text: "" });

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const [showViewModal, setShowViewModal] = useState(false);
//   const [productToView, setProductToView] = useState(null);

//   const isSuperAdmin = userType === "super_admin";
//   const isAdmin = userType === "admin" || isSuperAdmin;

//   const fetchProducts = useCallback(async () => {
//     setLoadingProducts(true);
//     setError("");
//     try {
//       const res = await authenticatedFetch("${API_BASE_URL}/api/v1/products/", { method: "GET" });
//       const data = await res.json();
//       if (res.ok) {
//         setProducts(data.products.sort((a, b) => b.id - a.id));
//       } else {
//         setError(data.error || "Failed to fetch products");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Network error. Check backend connection.");
//     } finally {
//       setLoadingProducts(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   // --- CREATE PRODUCT ---
//   const handleCreateChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") setCreateFormData((prev) => ({ ...prev, imageFile: files[0] }));
//     else setCreateFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     setCreateLoading(true);
//     setCreateMessage({ type: "", text: "" });

//     try {
//       const formData = new FormData();
//       formData.append("name", createFormData.name);
//       formData.append("description", createFormData.description);
//       formData.append("price", createFormData.price);
//       if (createFormData.imageFile) formData.append("image", createFormData.imageFile);

//       const res = await authenticatedFetch("${API_BASE_URL}/api/v1/products/create", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setCreateMessage({ type: "success", text: data.message });
//         setCreateFormData({ name: "", description: "", price: "", imageFile: null });
//         fetchProducts();
//         setShowCreateForm(false);
//       } else {
//         setCreateMessage({ type: "danger", text: data.error || "Failed to create product" });
//       }
//     } catch (err) {
//       console.error(err);
//       setCreateMessage({ type: "danger", text: "Network error. Try again." });
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   // --- EDIT PRODUCT ---
//   const openEditModal = (product) => {
//     setCurrentProduct(product);
//     setEditFormData({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       imageFile: null,
//     });
//     setEditMessage({ type: "", text: "" });
//     setShowEditModal(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") setEditFormData((prev) => ({ ...prev, imageFile: files[0] }));
//     else setEditFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     setLoadingEdit(true);
//     setEditMessage({ type: "", text: "" });

//     try {
//       const formData = new FormData();
//       formData.append("name", editFormData.name);
//       formData.append("description", editFormData.description);
//       formData.append("price", editFormData.price);
//       if (editFormData.imageFile) formData.append("image", editFormData.imageFile);

//       const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/edit/${currentProduct.id}`, {
//         method: "PUT",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setEditMessage({ type: "success", text: data.message });
//         fetchProducts();
//         setShowEditModal(false);
//       } else {
//         setEditMessage({ type: "danger", text: data.error || "Failed to update product" });
//       }
//     } catch (err) {
//       console.error(err);
//       setEditMessage({ type: "danger", text: "Network error. Try again." });
//     } finally {
//       setLoadingEdit(false);
//     }
//   };

//   // --- DELETE PRODUCT ---
//   const confirmDelete = (product) => {
//     setProductToDelete(product);
//     setShowDeleteModal(true);
//   };

//   const handleDelete = async () => {
//     setDeleteLoading(true);
//     try {
//       const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/delete/${productToDelete.id}`, { method: "DELETE" });
//       if (res.ok) fetchProducts();
//       setShowDeleteModal(false);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setDeleteLoading(false);
//       setProductToDelete(null);
//     }
//   };

//   // --- VIEW PRODUCT ---
//   const openViewModal = (product) => {
//     setProductToView(product);
//     setShowViewModal(true);
//   };
  
//   // --- DOWNLOAD PRODUCTS DATA ---
//   const handleDownload = async () => {
//     try {
//       const csvHeader = ["ID", "Name", "Description", "Price", "Image URL"].join(",");
//       const csvRows = products.map(product =>
//         [
//           product.id,
//           `"${product.name.replace(/"/g, '""')}"`,
//           `"${product.description.replace(/"/g, '""')}"`,
//           product.price,
//           `${API_BASE_URL}/${product.image}`
//         ].join(",")
//       );
//       const csvString = [csvHeader, ...csvRows].join("\n");

//       const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement("a");
//       if (link.download !== undefined) {
//         const url = URL.createObjectURL(blob);
//         link.setAttribute("href", url);
//         link.setAttribute("download", "products.csv");
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (err) {
//       console.error("Error downloading products:", err);
//     }
//   };


//   return (
//     <Container className="my-4">
//       <h1 className="mb-4" style={{color:"#3c0008"}}>Products Dashboard</h1>
      
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2 style={{color:"#3c0008"}}>Manage Products</h2>
//         <div className="d-flex">
//           {isSuperAdmin && (
//             <Button onClick={handleDownload} className="me-2" style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}}>
//               <FaDownload /> Download
//             </Button>
//           )}
//           {isAdmin && (
//             <Button onClick={() => setShowCreateForm(!showCreateForm)} style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}}>
//               {showCreateForm ? "Close Form" : "Create Product"} <FaPlus />
//             </Button>
//           )}
//         </div>
//       </div>

//       {showCreateForm && isAdmin && (
//         <Card className="mb-3 p-3">
//           {createMessage.text && <Alert variant={createMessage.type}>{createMessage.text}</Alert>}
//           <Form onSubmit={handleCreateSubmit}>
//             <Form.Group className="mb-2">
//               <Form.Label>Name</Form.Label>
//               <Form.Control name="name" value={createFormData.name} onChange={handleCreateChange} required />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={2} name="description" value={createFormData.description} onChange={handleCreateChange} required />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Price</Form.Label>
//               <Form.Control type="number" name="price" value={createFormData.price} onChange={handleCreateChange} required />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Image</Form.Label>
//               <Form.Control type="file" accept="image/*" name="image" onChange={handleCreateChange} />
//             </Form.Group>
//             <Button type="submit" disabled={createLoading}>{createLoading ? "Creating..." : "Create Product"}</Button>
//           </Form>
//         </Card>
//       )}

//       {loadingProducts ? <Spinner animation="border" /> : error ? <Alert variant="danger">{error}</Alert> : (
//         <Table striped bordered hover responsive className="shadow-sm">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Price</th>
//               <th>Image</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <tr key={product.id}>
//                   <td>{product.id}</td>
//                   <td>{product.name}</td>
//                   <td>UGX {product.price.toLocaleString()}</td>
//                   <td>
//                     {product.image && (
//                       <img
//                         src={`${API_BASE_URL}/${product.image}`}
//                         alt={product.name}
//                         style={{ width: "80px", height: "auto", borderRadius: "5px" }}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "https://placehold.co/80x50/CCCCCC/000000?text=No+Img";
//                         }}
//                       />
//                     )}
//                   </td>
//                   <td>
//                     <ButtonGroup size="sm">
//                       <Button variant="primary" onClick={() => openViewModal(product)}><FaEye /></Button>
//                       {isAdmin && <Button variant="success" onClick={() => openEditModal(product)}><FaEdit /></Button>}
//                       {isSuperAdmin && <Button variant="danger" onClick={() => confirmDelete(product)}><FaTrash /></Button>}
//                     </ButtonGroup>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center text-muted">No products available.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}

//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
//         <Modal.Header closeButton><Modal.Title>Product Details</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {productToView && (
//             <Card>
//               {productToView.image && (
//                 <Card.Img
//                   variant="top"
//                   src={`${API_BASE_URL}/${productToView.image}`}
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
//                   }}
//                 />
//               )}
//               <Card.Body>
//                 <Card.Title>{productToView.name}</Card.Title>
//                 <Card.Text>
//                   <strong>Price:</strong> UGX {productToView.price.toLocaleString()}<br/>
//                   <strong>Description:</strong> {productToView.description}
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton><Modal.Title>Edit Product</Modal.Title></Modal.Header>
//         <Modal.Body>
//           {editMessage.text && <Alert variant={editMessage.type}>{editMessage.text}</Alert>}
//           <Form onSubmit={handleEditSubmit}>
//             <Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control name="name" value={editFormData.name} onChange={handleEditChange} required /></Form.Group>
//             <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} name="description" value={editFormData.description} onChange={handleEditChange} required /></Form.Group>
//             <Form.Group className="mb-2"><Form.Label>Price</Form.Label><Form.Control type="number" name="price" value={editFormData.price} onChange={handleEditChange} required /></Form.Group>
//             <Form.Group className="mb-2"><Form.Label>Image</Form.Label><Form.Control type="file" accept="image/*" name="image" onChange={handleEditChange} /></Form.Group>
//             <Button type="submit" disabled={editLoading}>{editLoading ? "Updating..." : "Update Product"}</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
//         <Modal.Body>Are you sure you want to delete "{productToDelete?.name}"?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
//           <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default ProductsDashboard;

import React, { useState, useEffect, useCallback } from "react";
import { Container, Table, Button, Form, Modal, Alert, Spinner, Card, ButtonGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaEye, FaDownload } from "react-icons/fa";
import { authenticatedFetch } from "../Latest/authService";

const ProductsDashboard = ({ userType }) => {
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = 'http://127.0.0.1:5000';
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageFile: null,
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createMessage, setCreateMessage] = useState({ type: "", text: "" });

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        price: "",
        imageFile: null,
    });
    const [editLoading, setLoadingEdit] = useState(false);
    const [editMessage, setEditMessage] = useState({ type: "", text: "" });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);
    const [productToView, setProductToView] = useState(null);

    const [pageContent, setPageContent] = useState({ title: "", description: "" });
    const [showPageContentForm, setShowPageContentForm] = useState(false);
    const [pageContentLoading, setPageContentLoading] = useState(false);
    const [pageContentMessage, setPageContentMessage] = useState({ type: "", text: "" });

    const isSuperAdmin = userType === "super_admin";
    const isAdmin = userType === "admin" || isSuperAdmin;

    const fetchProducts = useCallback(async () => {
        setLoadingProducts(true);
        setError("");
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/`, { method: "GET" });
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products.sort((a, b) => b.id - a.id));
                setPageContent(data.page_content);
            } else {
                setError(data.error || "Failed to fetch products");
            }
        } catch (err) {
            console.error(err);
            setError("Network error. Check backend connection.");
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- CREATE PRODUCT ---
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
            formData.append("name", createFormData.name);
            formData.append("description", createFormData.description);
            formData.append("price", createFormData.price);
            if (createFormData.imageFile) formData.append("image", createFormData.imageFile);

            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/create`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setCreateMessage({ type: "success", text: data.message });
                setCreateFormData({ name: "", description: "", price: "", imageFile: null });
                fetchProducts();
                setShowCreateForm(false);
            } else {
                setCreateMessage({ type: "danger", text: data.error || "Failed to create product" });
            }
        } catch (err) {
            console.error(err);
            setCreateMessage({ type: "danger", text: "Network error. Try again." });
        } finally {
            setCreateLoading(false);
        }
    };

    // --- EDIT PRODUCT ---
    const openEditModal = (product) => {
        setCurrentProduct(product);
        setEditFormData({
            name: product.name,
            description: product.description,
            price: product.price,
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
            formData.append("name", editFormData.name);
            formData.append("description", editFormData.description);
            formData.append("price", editFormData.price);
            if (editFormData.imageFile) formData.append("image", editFormData.imageFile);

            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/edit/${currentProduct.id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setEditMessage({ type: "success", text: data.message });
                fetchProducts();
                setShowEditModal(false);
            } else {
                setEditMessage({ type: "danger", text: data.error || "Failed to update product" });
            }
        } catch (err) {
            console.error(err);
            setEditMessage({ type: "danger", text: "Network error. Try again." });
        } finally {
            setLoadingEdit(false);
        }
    };

    // --- DELETE PRODUCT ---
    const confirmDelete = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/delete/${productToDelete.id}`, { method: "DELETE" });
            if (res.ok) fetchProducts();
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleteLoading(false);
            setProductToDelete(null);
        }
    };

    // --- VIEW PRODUCT ---
    const openViewModal = (product) => {
        setProductToView(product);
        setShowViewModal(true);
    };
    
    // --- DOWNLOAD PRODUCTS DATA ---
    const handleDownload = async () => {
        try {
            const csvHeader = ["ID", "Name", "Description", "Price", "Image URL"].join(",");
            const csvRows = products.map(product =>
                [
                    product.id,
                    `"${product.name.replace(/"/g, '""')}"`,
                    `"${product.description.replace(/"/g, '""')}"`,
                    product.price,
                    `${API_BASE_URL}/${product.image}`
                ].join(",")
            );
            const csvString = [csvHeader, ...csvRows].join("\n");

            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "products.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            console.error("Error downloading products:", err);
        }
    };

    // --- PAGE CONTENT EDIT ---
    const handlePageContentChange = (e) => {
        const { name, value } = e.target;
        setPageContent(prev => ({ ...prev, [name]: value }));
    };

    const handlePageContentSubmit = async (e) => {
        e.preventDefault();
        setPageContentLoading(true);
        setPageContentMessage({ type: "", text: "" });

        try {
            const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/products/page-content/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pageContent),
            });
            const data = await res.json();
            if (res.ok) {
                setPageContentMessage({ type: "success", text: data.message });
                fetchProducts();
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

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: "#3c0008" }}>Products Dashboard</h1>

            {/* --- Products Page Content Section --- */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#3c0008" }}>Products Page Content</h2>
                {isAdmin && (
                    <Button onClick={() => setShowPageContentForm(!showPageContentForm)} style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                        {showPageContentForm ? "Close" : "Edit Content"} <FaEdit />
                    </Button>
                )}
            </div>

            {showPageContentForm && isAdmin && (
                <Card className="mb-3 p-3">
                    {pageContentMessage.text && <Alert variant={pageContentMessage.type}>{pageContentMessage.text}</Alert>}
                    <Form onSubmit={handlePageContentSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>Page Title</Form.Label>
                            <Form.Control 
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
                                rows={2} 
                                name="description" 
                                value={pageContent.description} 
                                onChange={handlePageContentChange} 
                                required 
                            />
                        </Form.Group>
                        <Button type="submit" disabled={pageContentLoading} style={{backgroundColor:"#521c23ff", color:"#ffffff", outline:"#521c23ff"}}>
                            {pageContentLoading ? "Saving..." : "Save Content"}
                        </Button>
                    </Form>
                </Card>
            )}

            {/* --- Manage Products Section (Existing code) --- */}
            <hr className="my-4" />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#3c0008" }}>Manage Products</h2>
                <div className="d-flex">
                    {isSuperAdmin && (
                        <Button onClick={handleDownload} className="me-2" style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            <FaDownload /> Download
                        </Button>
                    )}
                    {isAdmin && (
                        <Button onClick={() => setShowCreateForm(!showCreateForm)} style={{ backgroundColor: "#521c23ff", color: "#ffffff", outline: "#521c23ff" }}>
                            {showCreateForm ? "Close Form" : "Create Product"} <FaPlus />
                        </Button>
                    )}
                </div>
            </div>

            {showCreateForm && isAdmin && (
                <Card className="mb-3 p-3">
                    {createMessage.text && <Alert variant={createMessage.type}>{createMessage.text}</Alert>}
                    <Form onSubmit={handleCreateSubmit}>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" value={createFormData.name} onChange={handleCreateChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} name="description" value={createFormData.description} onChange={handleCreateChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={createFormData.price} onChange={handleCreateChange} required />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" accept="image/*" name="image" onChange={handleCreateChange} />
                        </Form.Group>
                        <Button type="submit" disabled={createLoading}>{createLoading ? "Creating..." : "Create Product"}</Button>
                    </Form>
                </Card>
            )}

            {loadingProducts ? <Spinner animation="border" /> : error ? <Alert variant="danger">{error}</Alert> : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>UGX {product.price.toLocaleString()}</td>
                                    <td>
                                        {product.image && (
                                            <img
                                                src={`${API_BASE_URL}/${product.image}`}
                                                alt={product.name}
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
                                            <Button variant="primary" onClick={() => openViewModal(product)}><FaEye /></Button>
                                            {isAdmin && <Button variant="success" onClick={() => openEditModal(product)}><FaEdit /></Button>}
                                            {isSuperAdmin && <Button variant="danger" onClick={() => confirmDelete(product)}><FaTrash /></Button>}
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No products available.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Product Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    {productToView && (
                        <Card>
                            {productToView.image && (
                                <Card.Img
                                    variant="top"
                                    src={`${API_BASE_URL}/${productToView.image}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                                    }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{productToView.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> UGX {productToView.price.toLocaleString()}<br />
                                    <strong>Description:</strong> {productToView.description}
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
                <Modal.Header closeButton><Modal.Title>Edit Product</Modal.Title></Modal.Header>
                <Modal.Body>
                    {editMessage.text && <Alert variant={editMessage.type}>{editMessage.text}</Alert>}
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control name="name" value={editFormData.name} onChange={handleEditChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} name="description" value={editFormData.description} onChange={handleEditChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Price</Form.Label><Form.Control type="number" name="price" value={editFormData.price} onChange={handleEditChange} required /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Image</Form.Label><Form.Control type="file" accept="image/*" name="image" onChange={handleEditChange} /></Form.Group>
                        <Button type="submit" disabled={editLoading}>{editLoading ? "Updating..." : "Update Product"}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
                <Modal.Body>Are you sure you want to delete "{productToDelete?.name}"?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductsDashboard;
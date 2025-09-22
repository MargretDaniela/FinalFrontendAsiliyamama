// // src/Dashboard/pages/HomePage.js

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Alert } from 'react-bootstrap';
// import axios from 'axios';

// const HomePage = () => {
//     const [formData, setFormData] = useState({
//         hero_headline: '',
//         hero_subheadline: '',
//         join_button_text: '',
//         join_button_link: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const API_BASE_URL = 'http://127.0.0.1:5000';

//     // Fetch current homepage content to populate the form
//     useEffect(() => {
//         const fetchContent = async () => {
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/api/home`);
//                 setFormData(response.data);
//             } catch (err) {
//                 setError('Failed to fetch homepage content.');
//                 console.error('Error fetching homepage content:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchContent();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');
//         setError('');
        
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             setError('Authentication token missing. Please log in again.');
//             setLoading(false);
//             return;
//         }

//         try {
//             await axios.put(`${API_BASE_URL}/api/home`, formData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             setMessage('Homepage content updated successfully!');
//         } catch (err) {
//             setError('Failed to update homepage content.');
//             console.error('Error updating homepage content:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Card className="shadow-sm">
//             <Card.Header as="h5" style={{ backgroundColor: '#800000', color: 'white' }}>
//                 Edit Home Page Content
//             </Card.Header>
//             <Card.Body>
//                 {loading && <p>Loading...</p>}
//                 {message && <Alert variant="success">{message}</Alert>}
//                 {error && <Alert variant="danger">{error}</Alert>}
//                 {!loading && (
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3" controlId="hero_headline">
//                             <Form.Label>Hero Headline</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="hero_headline"
//                                 value={formData.hero_headline}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="hero_subheadline">
//                             <Form.Label>Hero Subheadline</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="hero_subheadline"
//                                 value={formData.hero_subheadline}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="join_button_text">
//                             <Form.Label>Join Button Text</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="join_button_text"
//                                 value={formData.join_button_text}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="join_button_link">
//                             <Form.Label>Join Button Link</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="join_button_link"
//                                 value={formData.join_button_link}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Button variant="primary" type="submit" style={{ backgroundColor: '#800000', borderColor: '#800000' }}>
//                             Save Changes
//                         </Button>
//                     </Form>
//                 )}
//             </Card.Body>
//         </Card>
//     );
// };

// export default HomePage;

// src/Dashboard/pages/HomePage.js

// src/Content/LandingPage/HomePage.js

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Alert } from 'react-bootstrap';
// import axios from 'axios';

// // Ensure `onUpdate` is accepted as a prop here
// const HomePage = ({ onUpdate }) => { 
//     const [formData, setFormData] = useState({
//         hero_headline: '',
//         hero_subheadline: '',
//         hero_headline_emphasis_word: '', 
//         join_button_text: '',
//         join_button_link: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const API_BASE_URL = 'http://127.0.0.1:5000';

//     // Fetch current homepage content to populate the form
//     useEffect(() => {
//         const fetchContent = async () => {
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/api/home/`);
//                 setFormData(response.data);
//             } catch (err) {
//                 setError('Failed to fetch homepage content.');
//                 console.error('Error fetching homepage content:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchContent();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');
//         setError('');
        
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             setError('Authentication token missing. Please log in again.');
//             setLoading(false);
//             return;
//         }

//         try {
//             await axios.put(`${API_BASE_URL}/api/home/`, formData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             setMessage('Homepage content updated successfully!');
            
//             // Call the `onUpdate` prop after a successful submission
//             // This triggers the `handleHomepageUpdate` in DashboardApp,
//             // which increments the `refreshKey` and forces the public Home component to re-render.
//             if (onUpdate) {
//                 onUpdate(); 
//             }

//         } catch (err) {
//             setError('Failed to update homepage content.');
//             console.error('Error updating homepage content:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Card className="shadow-sm">
//             <Card.Header as="h5" style={{ backgroundColor: '#800000', color: 'white' }}>
//                 Edit Home Page Content
//             </Card.Header>
//             <Card.Body>
//                 {loading && <p>Loading...</p>}
//                 {message && <Alert variant="success">{message}</Alert>}
//                 {error && <Alert variant="danger">{error}</Alert>}
//                 {!loading && (
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3" controlId="hero_headline">
//                             <Form.Label>Hero Headline</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="hero_headline"
//                                 value={formData.hero_headline}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="hero_headline_emphasis_word">
//                             <Form.Label>Word to Emphasize (e.g., "YOUNG LIVES")</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="hero_headline_emphasis_word"
//                                 value={formData.hero_headline_emphasis_word}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="hero_subheadline">
//                             <Form.Label>Hero Subheadline</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="hero_subheadline"
//                                 value={formData.hero_subheadline}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="join_button_text">
//                             <Form.Label>Join Button Text</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="join_button_text"
//                                 value={formData.join_button_text}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="join_button_link">
//                             <Form.Label>Join Button Link</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="join_button_link"
//                                 value={formData.join_button_link}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Button variant="primary" type="submit" style={{ backgroundColor: '#800000', borderColor: '#800000' }}>
//                             Save Changes
//                         </Button>
//                     </Form>
//                 )}
//             </Card.Body>
//         </Card>
//     );
// };

// export default HomePage;

// import React, { useState, useEffect } from 'react';
// import { Form, Button, Card, Alert } from 'react-bootstrap';
// import axios from 'axios';

// // Ensure `onUpdate` is accepted as a prop here (though we're now primarily using localStorage for cross-component refresh)
// const HomePage = ({ onUpdate }) => {
//     const [formData, setFormData] = useState({
//         hero_headline: '',
//         hero_subheadline: '',
//         hero_headline_emphasis_word: '',
//         join_button_text: '',
//         join_button_link: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const API_BASE_URL = 'http://127.0.0.1:5000';

//     // Fetch current homepage content to populate the form
//     useEffect(() => {
//         const fetchContent = async () => {
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/api/home/`);
//                 setFormData(response.data);
//             } catch (err) {
//                 setError('Failed to fetch homepage content.');
//                 console.error('Error fetching homepage content:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchContent();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');
//         setError('');

//         const token = localStorage.getItem('authToken');
//         if (!token) {
//             setError('Authentication token missing. Please log in again.');
//             setLoading(false);
//             return;
//         }

//         try {
//             await axios.put(`${API_BASE_URL}/api/home/`, formData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             setMessage('Homepage content updated successfully!');

//             const timestamp = Date.now().toString();
//             localStorage.setItem('lastHomepageUpdateTimestamp', timestamp);
//             // --- ADDED CONSOLE LOG HERE ---
//             console.log('Admin HomePage: Set lastHomepageUpdateTimestamp in localStorage to', timestamp);


//             if (onUpdate) {
//                 onUpdate();
//             }

//         } catch (err) {
//             setError('Failed to update homepage content.');
//             console.error('Error updating homepage content:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Card className="shadow-sm">
//             <Card.Header as="h5" style={{ backgroundColor: '#800000', color: 'white' }}>
//                 Edit Home Page Content
//             </Card.Header>
//             <Card.Body>
//                 {loading && <p>Loading...</p>}
//                 {message && <Alert variant="success">{message}</Alert>}
//                 {error && <Alert variant="danger">{error}</Alert>}
//                 {!loading && (
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3" controlId="hero_headline">
//                             <Form.Label>Hero Headline</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="hero_headline"
//                                 value={formData.hero_headline}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="hero_headline_emphasis_word">
//                             <Form.Label>Word to Emphasize (e.g., "YOUNG LIVES")</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="hero_headline_emphasis_word"
//                                 value={formData.hero_headline_emphasis_word}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="hero_subheadline">
//                             <Form.Label>Hero Subheadline</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="hero_subheadline"
//                                 value={formData.hero_subheadline}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="join_button_text">
//                             <Form.Label>Join Button Text</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="join_button_text"
//                                 value={formData.join_button_text}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3" controlId="join_button_link">
//                             <Form.Label>Join Button Link</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="join_button_link"
//                                 value={formData.join_button_link}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Button variant="primary" type="submit" style={{ backgroundColor: '#800000', borderColor: '#800000' }}>
//                             Save Changes
//                         </Button>
//                     </Form>
//                 )}
//             </Card.Body>
//         </Card>
//     );
// };

// export default HomePage;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { FaSave, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'; // Added FaPlus for "Add Images"
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000'; // Flask backend URL
// const API_BASE_URL = process.env.REACT_APP_API_URL;
const HomePageDashboard = () => {
    const [formData, setFormData] = useState({
        headline: '',
        description: '',
        join_button_text: '',
        join_button_url: '',
    });
    // Renamed 'images' to 'newImagesToUpload' for clarity
    const [newImagesToUpload, setNewImagesToUpload] = useState([]); 
    const [currentImageUrls, setCurrentImageUrls] = useState([]); // Array of current image URLs from backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Ref to programmatically click the hidden file input
    const fileInputRef = useRef(null);

    const fetchHomePageData = useCallback(async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/home/`);
            const data = response.data;
            setFormData({
                headline: data.headline,
                description: data.description,
                join_button_text: data.join_button_text,
                join_button_url: data.join_button_url,
            });
            setCurrentImageUrls(data.images || []); // Set current images from backend
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setMessage('No home page content found. Fill out the form to create it!');
                // Reset form data if no content exists
                setFormData({
                    headline: '',
                    description: '',
                    join_button_text: '',
                    join_button_url: '',
                });
                setCurrentImageUrls([]);
            } else {
                setError('Failed to fetch home page content.');
                console.error('Error fetching home page data:', err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHomePageData();
    }, [fetchHomePageData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // This now handles selecting files from the triggered input
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewImagesToUpload(prev => [...prev, ...files]); // Add new files to the list
        e.target.value = null; // Clear the input so same file can be selected again
    };

    // Function to trigger the hidden file input
    const handleAddImagesClick = () => {
        fileInputRef.current.click();
    };

    // Function to remove an image from the 'newImagesToUpload' list before submission
    const handleRemoveNewImage = (indexToRemove) => {
        setNewImagesToUpload(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveCurrentImage = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image from the server?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/home/images/${imageId}`);
            setMessage('Image deleted successfully!');
            fetchHomePageData(); // Re-fetch data to update the UI
        } catch (err) {
            setError('Failed to delete image.');
            console.error('Error deleting image:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const form = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== undefined) {
                form.append(key, formData[key]);
            }
        }
        // Append all newly selected image files
        newImagesToUpload.forEach((image) => {
            form.append('images', image);
        });

        try {
            await axios.post(`${API_BASE_URL}/api/v1/home/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Home page content saved successfully!');
            setNewImagesToUpload([]); // Clear new images after successful upload
            fetchHomePageData(); // Refresh current images and form data
        } catch (err) {
            setError('Failed to save home page content.');
            console.error('Error saving home page:', err);
        }
    };
    
    const handleDeleteHomePage = async () => {
        if (!window.confirm('Are you sure you want to delete all home page content? This action is irreversible.')) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/api/v1/home/`);
            setMessage('Home page content deleted successfully!');
            fetchHomePageData(); // This will clear the form and show "No content found"
        } catch (err) {
            setError('Failed to delete home page content.');
            console.error('Error deleting home page:', err);
        }
    };

    if (loading) {
        return <Container className="text-center my-5"><Spinner animation="border" /></Container>;
    }

    return (
        <Container className="my-4">
            <h1 className="mb-4" style={{ color: '#3c0008' }}>Manage Home Page</h1>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {currentImageUrls.length > 0 && ( // Only show delete all button if content exists
                <div className="mb-4">
                    <Button variant="danger" onClick={handleDeleteHomePage}><FaTrash /> Delete All Home Page Content</Button>
                </div>
            )}

            <Form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-light">
                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Main Content</h2>
                <Form.Group className="mb-3">
                    <Form.Label>Headline</Form.Label>
                    <Form.Control type="text" name="headline" value={formData.headline} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Join Button Text</Form.Label>
                    <Form.Control type="text" name="join_button_text" value={formData.join_button_text} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-5">
                    <Form.Label>Join Button URL</Form.Label>
                    <Form.Control type="text" name="join_button_url" value={formData.join_button_url} onChange={handleChange} required />
                </Form.Group>

                <h2 className="mb-3" style={{ color: '#521c23ff' }}>Background Images</h2>
                <Form.Group className="mb-3">
                    {/* Hidden file input */}
                    <Form.Control 
                        type="file" 
                        multiple 
                        name="images" 
                        onChange={handleFileSelect} 
                        accept=".png,.jpg,.jpeg,.gif" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                    />
                    <Button variant="info" onClick={handleAddImagesClick}>
                        <FaPlus /> Add Images
                    </Button>
                    <Form.Text className="text-muted ms-2">Select multiple images to add to the carousel.</Form.Text>
                </Form.Group>
                
                {newImagesToUpload.length > 0 && (
                    <div className="mb-4">
                        <h5 className="mb-3">New Images Selected for Upload:</h5>
                        <Row>
                            {newImagesToUpload.map((imageFile, index) => (
                                <Col md={4} key={index} className="mb-3">
                                    <Card>
                                        <Card.Img 
                                            variant="top" 
                                            src={URL.createObjectURL(imageFile)} 
                                            alt={imageFile.name} 
                                            style={{ height: '150px', objectFit: 'cover' }} 
                                        />
                                        <Card.Body className="text-center">
                                            <Card.Text className="text-truncate">{imageFile.name}</Card.Text>
                                            <Button variant="secondary" size="sm" onClick={() => handleRemoveNewImage(index)}><FaTimes /> Discard</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {currentImageUrls.length > 0 && (
                    <div className="mb-5">
                        <h5 className="mb-3">Current Images (Saved on Server):</h5>
                        <Row>
                            {currentImageUrls.map((image) => (
                                <Col md={4} key={image.id} className="mb-3">
                                    <Card>
                                        <Card.Img variant="top" src={image.image_url} alt="Current Home Page" style={{ height: '150px', objectFit: 'cover' }} />
                                        <Card.Body className="text-center">
                                            <Button variant="danger" size="sm" onClick={() => handleRemoveCurrentImage(image.id)}><FaTrash /> Remove</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
                
                <Button type="submit" style={{ backgroundColor: '#521c23ff', borderColor: '#521c23ff' }}>
                    <FaSave /> Save Home Page Content
                </Button>
            </Form>
        </Container>
    );
};

export default HomePageDashboard;

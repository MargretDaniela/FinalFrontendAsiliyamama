// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

// const Footer = () => {
//     const [footerContent, setFooterContent] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your Flask backend URL

//     useEffect(() => {
//         const fetchFooterContent = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/api/v1/footer/`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch footer content.');
//                 }
//                 const data = await response.json();
//                 setFooterContent(data);
//             } catch (err) {
//                 console.error('Error fetching footer content:', err);
//                 setError('Network error. Failed to load footer content.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFooterContent();
//     }, [API_BASE_URL]);

//     if (loading) {
//         return (
//             <footer className="footer-area footer-bg">
//                 <Container className="text-center py-5 text-white">
//                     Loading Footer...
//                 </Container>
//             </footer>
//         );
//     }

//     if (error) {
//         return (
//             <footer className="footer-area footer-bg">
//                 <Container className="text-center py-5 text-danger">
//                     Error: {error}
//                 </Container>
//             </footer>
//         );
//     }

//     if (!footerContent) {
//         return (
//             <footer className="footer-area footer-bg">
//                 <Container className="text-center py-5 text-white">
//                     No footer content available.
//                 </Container>
//             </footer>
//         );
//     }

//     return (
//         <footer className="footer-area footer-bg" style={{backgroundColor:"#832b2bff"}}>
//             <Container className="py-5">
//                 <Row className="justify-content-center text-white">
//                     <Col lg={4} md={6} className="mb-4 mb-lg-0 text-center text-md-start">
//                         <h5 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Contact Info</h5>
//                         <p className="mb-1">{footerContent.address}</p>
//                         <p className="mb-1">Phone: <a href={`tel:${footerContent.phone}`} className="text-white-50">{footerContent.phone}</a></p>
//                         <p className="mb-0">Email: <a href={`mailto:${footerContent.email}`} className="text-white-50">{footerContent.email}</a></p>
//                     </Col>

//                     <Col lg={4} md={6} className="mb-4 mb-lg-0 text-center">
//                         <h5 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Quick Links</h5>
//                         <ul className="list-unstyled">
//                             {footerContent.link1_text && footerContent.link1_url && (
//                                 <li><a href={footerContent.link1_url} className="text-white-50 text-decoration-none">{footerContent.link1_text}</a></li>
//                             )}
//                             {footerContent.link2_text && footerContent.link2_url && (
//                                 <li><a href={footerContent.link2_url} className="text-white-50 text-decoration-none">{footerContent.link2_text}</a></li>
//                             )}
//                             {footerContent.link3_text && footerContent.link3_url && (
//                                 <li><a href={footerContent.link3_url} className="text-white-50 text-decoration-none">{footerContent.link3_text}</a></li>
//                             )}
//                             {/* Add more dynamic links here if you add them to the model */}
//                         </ul>
//                     </Col>

//                     <Col lg={4} md={6} className="text-center text-md-end">
//                         <h5 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Connect With Us</h5>
//                         <div className="social-links d-flex justify-content-center justify-content-md-end gap-3">
//                             {footerContent.facebook_url && (
//                                 <a href={footerContent.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white-50 fs-4"><FaFacebookF /></a>
//                             )}
//                             {footerContent.twitter_url && (
//                                 <a href={footerContent.twitter_url} target="_blank" rel="noopener noreferrer" className="text-white-50 fs-4"><FaTwitter /></a>
//                             )}
//                             {footerContent.instagram_url && (
//                                 <a href={footerContent.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white-50 fs-4"><FaInstagram /></a>
//                             )}
//                              {footerContent.linkedin_url && (
//                                 <a href={footerContent.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white-50 fs-4"><FaLinkedinIn /></a>
//                             )}
//                         </div>
//                     </Col>
//                 </Row>
//                 <hr className="bg-white-50 my-4" />
//                 <div className="text-center text-white-50">
//                     <p className="mb-0">{footerContent.copyright_text}</p>
//                 </div>
//             </Container>
//         </footer>
//     );
// };

// export default Footer;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Facebook, Instagram, Twitter, Youtube } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://127.0.0.1:5000'; 

    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/footer/all`);
                setFooterData(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Footer content not found. Please create it in the dashboard.");
                } else {
                    setError("Failed to load footer content. Please try again later.");
                }
                console.error("Error fetching footer data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFooterData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-5">
                <Alert variant="warning" className="text-center">{error}</Alert>
            </div>
        );
    }

    if (!footerData) {
        return null; // Don't render anything if no data is available
    }

    const currentYear = new Date().getFullYear();
    const copyrightText = footerData.copyright_text.replace('{YEAR}', currentYear);
    
    return (
        <footer
            style={{
                backgroundColor: 'rgba(128, 0, 0, 0.66)',
                color: 'white',
                paddingTop: '1rem',
                paddingBottom: '1rem',
            }}
        >
            <Container>
                {/* Top Section */}
                <Row className="align-items-start text-center text-md-start">
                    {/* Logo */}
                    <Col md={3} sm={12} className="mb-4 mb-md-0 d-flex justify-content-md-start justify-content-center">
                        <img
                            src={footerData.logo_url}
                            alt={footerData.logo_alt_text}
                            style={{ maxWidth: '120px', height: 'auto', marginLeft: '-20px', borderRadius: '20px' }}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x120?text=Logo'; }}
                        />
                    </Col>

                    {/* Description + Connect */}
                    <Col md={6} sm={12} className="d-flex flex-column align-items-center text-center">
                        <p style={{ fontSize: '1rem', lineHeight: '1.4', maxWidth: '500px' }}>
                            {footerData.description}
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-5 mt-2">
                            <h5 className="mb-0">Connect</h5>
                            {footerData.social_media.facebook_url && (
                                <a href={footerData.social_media.facebook_url} target="_blank" rel="noreferrer" className="text-white fs-4">
                                    <Facebook />
                                </a>
                            )}
                            {footerData.social_media.instagram_url && (
                                <a href={footerData.social_media.instagram_url} target="_blank" rel="noreferrer" className="text-white fs-4">
                                    <Instagram />
                                </a>
                            )}
                            {footerData.social_media.twitter_url && (
                                <a href={footerData.social_media.twitter_url} target="_blank" rel="noreferrer" className="text-white fs-4">
                                    <Twitter />
                                </a>
                            )}
                            {footerData.social_media.youtube_url && (
                                <a href={footerData.social_media.youtube_url} target="_blank" rel="noreferrer" className="text-white fs-4">
                                    <Youtube />
                                </a>
                            )}
                        </div>
                    </Col>

                    <Col md={3} sm={12}></Col>
                </Row>

                <hr style={{ borderColor: '#fff', margin: '1rem 0', width: '100%' }} />

                {/* Bottom Links */}
                <Row className="text-white text-center text-md-start">
                    {/* Outreach */}
                    <Col md={4} sm={12} className="mb-4 mb-md-0">
                        <h5>{footerData.outreach.heading}</h5>
                        <p className="mb-1">{footerData.outreach.address}</p>
                        <p className="mb-1">{footerData.outreach.phone}</p>
                        <p className="mb-1">
                            Email:{' '}
                            <a href={`mailto:${footerData.outreach.email}`} className="text-white text-decoration-none">
                                {footerData.outreach.email}
                            </a>
                        </p>
                    </Col>

                    {/* Get Involved */}
                    <Col md={4} sm={12} className="mb-4 mb-md-0 text-center">
                        <h5>
                            <Link to={footerData.get_involved.donor_url} className="text-white text-decoration-none">{footerData.get_involved.heading}</Link>
                        </h5>
                        <Link to={footerData.get_involved.donor_url} className="d-block mb-1 text-white text-decoration-none">{footerData.get_involved.donor_text}</Link>
                        <a href={footerData.get_involved.volunteer_url} className="d-block mb-1 text-white text-decoration-none">{footerData.get_involved.volunteer_text}</a>
                        <a href={footerData.get_involved.membership_url} className="d-block mb-1 text-white text-decoration-none">{footerData.get_involved.membership_text}</a>
                    </Col>

                    {/* Committee Links */}
                    <Col md={4} sm={12} className="text-md-end text-center">
                        <h5><Link to={footerData.committee.directors_url} className="text-white text-decoration-none">{footerData.committee.heading}</Link></h5>
                        <Link to={footerData.committee.directors_url} className="d-block mb-1 text-white text-decoration-none">{footerData.committee.directors_text}</Link>
                        <Link to={footerData.committee.volunteers_url} className="d-block mb-1 text-white text-decoration-none">{footerData.committee.volunteers_text}</Link>
                        <Link to={footerData.committee.partners_url} className="d-block mb-1 text-white text-decoration-none">{footerData.committee.partners_text}</Link>
                    </Col>
                </Row>

                {/* Copyright */}
                <Row className="pt-3">
                    <Col className="text-center" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        {copyrightText}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
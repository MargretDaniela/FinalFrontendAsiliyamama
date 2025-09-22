import React, { useState } from 'react';
import '../Styles/Contact.css';
import Footer from './Footer';

const Contact = () => {
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const API_BASE_URL = 'http://127.0.0.1:5000'; 
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        message: '',
    });

    // State for UI feedback
    // Removed submissionStatus as it's no longer used
    const [isLoading, setIsLoading] = useState(false);
    // New state to manage the success message display
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Function to handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Removed setSubmissionStatus('') as it's no longer used

        // The name and message fields are required by your backend
        if (!formData.name || !formData.message) {
            // Removed setSubmissionStatus('error')
            // Replaced alert with a more user-friendly message, potentially in a modal or inline error.
            // For now, keeping alert as per previous code, but noting this is generally discouraged.
            alert('Name and message are required.');
            setIsLoading(false);
            return;
        }

        // Your backend requires either email OR contact, but not both.
        let dataToSend = {
            name: formData.name,
            message: formData.message,
        };

        if (formData.email && formData.contact) {
            // Removed setSubmissionStatus('error')
            alert('Please provide either an email or a contact number, not both.');
            setIsLoading(false);
            return;
        } else if (formData.email) {
            dataToSend.email = formData.email;
        } else if (formData.contact) {
            dataToSend.contact = formData.contact;
        } else {
            // Removed setSubmissionStatus('error')
            alert('Please provide either an email or a contact number.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/contact_bp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();

            if (response.ok) {
                // Removed setSubmissionStatus('success')
                setIsSubmitted(true); // Set state to true on success to show thank you message
                // Clear the form after a successful submission
                setFormData({
                    name: '',
                    email: '',
                    contact: '',
                    message: '',
                });
            } else {
                // Removed setSubmissionStatus('error')
                alert(result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Removed setSubmissionStatus('error')
            alert('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'hsla(0, 72%, 34%, 0.50)', marginTop: '120px', color: 'black' }}>
            <div className="container py-5 px-4 rounded" style={{ backgroundColor: 'rgba(253, 229, 229, 0.3)' }}>
                {isSubmitted ? (
                    // Display the thank you message if the form was submitted successfully
                    <div className="text-center py-5">
                        <h1 className="mb-4">Thank You for Your Message!</h1>
                        <p className="lead">We appreciate you reaching out and providing your feedback. We'll get back to you as soon as possible.</p>
                        <button className="btn mt-4 custom-send-btn" onClick={() => setIsSubmitted(false)}>Send Another Message</button>
                    </div>
                ) : (
                    // Display the contact form if the form has not been submitted
                    <div className="row g-4">
                        {/* Contact Info */}
                        <div className="col-md-6" style={{ paddingLeft: '60px', paddingTop: '100px' }}>
                            <p>
                                If you want to join us, donate to us or you <br />
                                want to contact us for any reason please <br />
                                do using this contact form on the right <br />
                                or directly by the use of the email.
                            </p>
                            <h5 style={{ color: ' #992525', paddingLeft: '30px', paddingTop: '10px' }}>Call Us</h5>
                            <p>+256-(0)-783-979-292</p>

                            <h5 style={{ color: ' #992525', paddingLeft: '30px', paddingTop: '10px' }}>Email Us</h5>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=asiliyamamagenerationcareltd.com"
                                className="text-decoration-none text-dark"
                                style={{ color: 'black' }}
                            >
                                asiliyamamagenerationcareltd.com
                            </a>
                            <h5 style={{ color: ' #992525', paddingLeft: '30px', paddingTop: '10px' }}>Follow Us</h5>
                            <p>
                                <a href="/" className="text-dark text-decoration-none">Facebook</a> /{' '}
                                <a href="https://www.instagram.com/asili_yamama/" className="text-dark text-decoration-none">Instagram</a> /{' '}
                                <a href="https://x.com/AsiliYamama" className="text-decoration-none text-dark">Twitter</a>
                            </p>
                            <h5 style={{ color: ' #992525', paddingTop: '20px' }}>Subscribe to our channel</h5>
                            <p>
                                <a href="/" className="text-decoration-none text-dark">Y0U TUBE CHANNEL</a>
                            </p>
                            <button type='submit' className='btn mt-2 custom-subscribe-btn'>SUBSCRIBE</button>
                        </div>

                        {/* Contact Form */}
                        <div className="col-md-6">
                            <h1 className="text-center mb-4">GET IN TOUCH</h1>
                            <form onSubmit={handleSubmit} style={{marginTop:"80px"}}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control border-0 border-bottom border-dark rounded-0"
                                        style={{ backgroundColor: 'transparent' }}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email </label>
                                    <input
                                        type="email"
                                        className="form-control border-0 border-bottom border-dark rounded-0"
                                        style={{ backgroundColor: 'transparent' }}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">Contact Number </label>
                                    <input
                                        type="tel"
                                        className="form-control border-0 border-bottom border-dark rounded-0"
                                        style={{ backgroundColor: 'transparent' }}
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter your message:"
                                        rows={4}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        style={{backgroundColor:"#f8e6e9"}}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn mt-2 custom-send-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Contact;

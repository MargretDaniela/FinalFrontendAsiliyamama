// import React, { useState } from 'react';
// import '../Styles/Donate.css';
// import Footer from './Footer';
// import airtelBanner from './Images/Airtel banner.jpg';
// import mtnBanner from './Images/Mtn banner.jpg';

// // Corrected: Use environment variable for the base API URL
// // const API_BASE_URL = process.env.REACT_APP_API_URL; 
// const API_BASE_URL = 'http://127.0.0.1:5000'; 

// const Donate = () => {
//     const [formData, setFormData] = useState({
//         amount: '',
//         currency: '',
//         type: '',
//         frequency: 'one_time',
//         firstName: '',
//         lastName: '',
//         email: '',
//         contact: '',
//     });

//     const [loading, setLoading] = useState(false);
//     const [successMsg, setSuccessMsg] = useState('');
//     const [errorMsg, setErrorMsg] = useState('');

//     const handleChange = (e) => {
//         const { name, value, type: inputType } = e.target;
//         if (inputType === 'radio') {
//             setFormData(prev => ({ ...prev, frequency: value }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setSuccessMsg('');
//         setErrorMsg('');
//         setLoading(true);

//         const payload = {
//             ...formData,
//             amount: parseFloat(formData.amount),
//         };
        
//         try {
//             // Corrected: Append the full API endpoint path here
//             const response = await fetch(`${API_BASE_URL}/api/v1/donations/create_general`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 setErrorMsg(data.error || data.message || `Failed to submit donation. Status: ${response.status}`);
//             } else {
//                 setSuccessMsg('Thank you for your generous donation! A receipt has been sent to your email.');
//                 setFormData({
//                     amount: '',
//                     currency: '',
//                     type: '',
//                     frequency: 'one_time',
//                     firstName: '',
//                     lastName: '',
//                     email: '',
//                     contact: '',
//                 });
//             }
//         } catch (error) {
//             console.error('Error submitting donation:', error);
//             setErrorMsg('Network error. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     };
//     return (
//         <div id="donate" style={{ marginTop: '120px' }}>
//             <section className="text-center py-5 bg-light">
//                 <div className="container">
//                     <h2 className="mb-4 fw-bold">Your Support Makes a Difference</h2>
//                     <p className="lead">
//                         Every contribution you make helps us reach one more child with hope, care, and opportunity.
//                         Join us in transforming lives, one donation at a time.
//                     </p>
//                     <div className="row justify-content-center mt-4">
//                         <div className="col-md-5 mb-3">
//                             <div className="card shadow border-0">
//                                 <img src={airtelBanner} alt="Airtel Money" className="card-img-top" />
//                                 <div className="card-body text-center">
//                                     <h5 className="card-title">Airtel Money</h5>
//                                     <p className="card-text fw-bold text-danger">+256-(0)-755-722-853</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-md-5 mb-3">
//                             <div className="card shadow border-0">
//                                 <img src={mtnBanner} alt="MTN Mobile Money" className="card-img-top" />
//                                 <div className="card-body text-center">
//                                     <h5 className="card-title">MTN Mobile Money</h5>
//                                     <p className="card-text fw-bold text-warning">+256-(0)-783-979-292</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-12 text-center mt-3">
//                             <p className="text-dark fst-italic" style={{ fontWeight: '600', fontSize: '1rem' }}>
//                                 The numbers are registered in the name of <span style={{ color: '#992525' }}>Aarakit Doreen</span>.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <section className="donate-form-section d-flex align-items-center">
//                 <div className="container">
//                     <div className="row justify-content-center">
//                         <div className="col-lg-8">
//                             <div className="p-5 shadow-lg rounded form-box bg-dark bg-opacity-75 text-white">
//                                 <h3 className="text-center mb-4">Your Kindness Can Change a Life</h3>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="row mb-3">
//                                         <div className="col-md-4 mb-3 mb-md-0">
//                                             <input
//                                                 type="number"
//                                                 name="amount"
//                                                 className="form-control"
//                                                 placeholder="Amount"
//                                                 required
//                                                 value={formData.amount}
//                                                 onChange={handleChange}
//                                                 min="1"
//                                                 step="any"
//                                             />
//                                         </div>
//                                         <div className="col-md-4 mb-3 mb-md-0">
//                                             <select
//                                                 name="currency"
//                                                 className="form-select"
//                                                 required
//                                                 value={formData.currency}
//                                                 onChange={handleChange}
//                                             >
//                                                 <option value="">Currency</option>
//                                                 <option value="UGX">UGX</option>
//                                                 <option value="USD">USD</option>
//                                                 <option value="EUR">EUR</option>
//                                             </select>
//                                         </div>
//                                         <div className="col-md-4">
//                                             <select
//                                                 name="type"
//                                                 className="form-select"
//                                                 required
//                                                 value={formData.type}
//                                                 onChange={handleChange}
//                                             >
//                                                 <option value="">Type</option>
//                                                 <option value="cash">Cash</option>
//                                                 <option value="goods">Goods</option>
//                                                 <option value="service">Service</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                     <div className="mb-4 text-center">
//                                         <label className="form-label d-block mb-2">Donation Frequency</label>
//                                         <div className="btn-group" role="group" aria-label="Frequency">
//                                             <input
//                                                 type="radio"
//                                                 className="btn-check"
//                                                 name="frequency"
//                                                 id="one_time"
//                                                 value="one_time"
//                                                 autoComplete="off"
//                                                 checked={formData.frequency === 'one_time'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="btn btn-outline-light" htmlFor="one_time">One-Time</label>
//                                             <input
//                                                 type="radio"
//                                                 className="btn-check"
//                                                 name="frequency"
//                                                 id="monthly"
//                                                 value="monthly"
//                                                 autoComplete="off"
//                                                 checked={formData.frequency === 'monthly'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="btn btn-outline-light" htmlFor="monthly">Monthly</label>
//                                             <input
//                                                 type="radio"
//                                                 className="btn-check"
//                                                 name="frequency"
//                                                 id="yearly"
//                                                 value="yearly"
//                                                 autoComplete="off"
//                                                 checked={formData.frequency === 'yearly'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="btn btn-outline-light" htmlFor="yearly">Yearly</label>
//                                         </div>
//                                     </div>
//                                     <div className="mt-4">
//                                         <h5 className="text-center mb-3 text-warning">Optional Donor Information</h5>
//                                         <div className="row mb-3">
//                                             <div className="col-md-4 mb-3 mb-md-0">
//                                                 <input
//                                                     type="text"
//                                                     name="firstName"
//                                                     className="form-control"
//                                                     placeholder="First Name (Optional)"
//                                                     value={formData.firstName}
//                                                     onChange={handleChange}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4 mb-3 mb-md-0">
//                                                 <input
//                                                     type="text"
//                                                     name="lastName"
//                                                     className="form-control"
//                                                     placeholder="Last Name (Optional)"
//                                                     value={formData.lastName}
//                                                     onChange={handleChange}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <input
//                                                     type="email"
//                                                     name="email"
//                                                     className="form-control"
//                                                     placeholder="Email (Optional)"
//                                                     value={formData.email}
//                                                     onChange={handleChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="row mb-3">
//                                             <div className="col-md-12">
//                                                 <input
//                                                     type="text"
//                                                     name="contact"
//                                                     className="form-control"
//                                                     placeholder="Contact (Optional)"
//                                                     value={formData.contact}
//                                                     onChange={handleChange}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <p className="text-center fst-italic mb-4">
//                                         "You may not be able to change the world for everyone,
//                                         but for one child, your gift changes everything."
//                                     </p>
//                                     <div className="text-center">
//                                         <button
//                                             type="submit"
//                                             className="btn px-4 py-2 text-white"
//                                             style={{ backgroundColor: '#992525' }}
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Processing...' : 'DONATE NOW'}
//                                         </button>
//                                     </div>
//                                     {successMsg && (
//                                         <p className="text-center mt-3 "style={{color:"#006400", fontWeight:"bolder", backgroundColor:"#e7d5d5", padding:"10px"}}>{successMsg}</p>
//                                     )}
//                                     {errorMsg && (
//                                         <p className="text-center mt-3 text-danger fw-bold">{errorMsg}</p>
//                                     )}
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <Footer />
//         </div>
//     );
// };

// export default Donate;
import React, { useState } from 'react';
import '../Styles/Donate.css';
import Footer from './Footer';
import airtelBanner from './Images/Airtel banner.jpg';
import mtnBanner from './Images/Mtn banner.jpg';

// Corrected: Use environment variable for the base API URL
// const API_BASE_URL = process.env.REACT_APP_API_URL; 
const API_BASE_URL = 'http://127.0.0.1:5000'; 

const Donate = () => {
    const [formData, setFormData] = useState({
        amount: '',
        currency: '',
        type: '',
        frequency: 'one_time',
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value, type: inputType } = e.target;
        if (inputType === 'radio') {
            setFormData(prev => ({ ...prev, frequency: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMsg('');
        setErrorMsg('');
        setLoading(true);

        const payload = {
            ...formData,
            amount: parseFloat(formData.amount),
        };
        
        try {
            // Corrected: Append the full API endpoint path here
            const response = await fetch(`${API_BASE_URL}/api/v1/donations/create_general`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error || data.message || `Failed to submit donation. Status: ${response.status}`);
            } else {
                setSuccessMsg('Thank you for your generous donation! A receipt has been sent to your email.');
                setFormData({
                    amount: '',
                    currency: '',
                    type: '',
                    frequency: 'one_time',
                    firstName: '',
                    lastName: '',
                    email: '',
                    contact: '',
                });
            }
        } catch (error) {
            console.error('Error submitting donation:', error);
            setErrorMsg('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="donate" style={{ marginTop: '120px' }}>
            {/* Hero Section */}
            <section className="text-center py-5" style={{ backgroundColor: '#992525' }}>
                <div className="container">
                    <h2 className="mb-4 fw-bold text-white">Your Support Makes a Difference</h2>
                    <p className="lead text-white" style={{ fontSize: '1.2rem' }}>
                        Every contribution you make helps us reach one more child with hope, care, and opportunity.
                        Join us in transforming lives, one donation at a time.
                    </p>
                </div>
            </section>

            {/* Mobile Money Cards Section */}
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <h3 className="text-center mb-5 fw-bold" style={{ color: '#992525' }}>Direct Mobile Money Donations</h3>
                            <div className="row justify-content-center g-4">
                                <div className="col-md-6 col-lg-5">
                                    <div className="card shadow-lg border-0 h-100 donate-card" style={{ borderTop: '5px solid #992525' }}>
                                        <div className="card-header text-center py-3" style={{ backgroundColor: '#992525' }}>
                                            <h5 className="card-title text-white mb-0">Airtel Money</h5>
                                        </div>
                                        <div className="card-body text-center p-4">
                                            <div className="mb-3">
                                                <img 
                                                    src={airtelBanner} 
                                                    alt="Airtel Money" 
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                                                />
                                            </div>
                                            <div className="donation-number mb-3">
                                                <span className="fw-bold fs-4" style={{ color: '#992525' }}>+256-(0)-755-722-853</span>
                                            </div>
                                            <button 
                                                className="btn text-white mt-2"
                                                style={{ backgroundColor: '#992525' }}
                                                onClick={() => navigator.clipboard.writeText('+2560755722853')}
                                            >
                                                Copy Number
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-5">
                                    <div className="card shadow-lg border-0 h-100 donate-card" style={{ borderTop: '5px solid #992525' }}>
                                        <div className="card-header text-center py-3" style={{ backgroundColor: '#992525' }}>
                                            <h5 className="card-title text-white mb-0">MTN Mobile Money</h5>
                                        </div>
                                        <div className="card-body text-center p-4">
                                            <div className="mb-3">
                                                <img 
                                                    src={mtnBanner} 
                                                    alt="MTN Mobile Money" 
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                                                />
                                            </div>
                                            <div className="donation-number mb-3">
                                                <span className="fw-bold fs-4" style={{ color: '#992525' }}>+256-(0)-783-979-292</span>
                                            </div>
                                            <button 
                                                className="btn text-white mt-2"
                                                style={{ backgroundColor: '#992525' }}
                                                onClick={() => navigator.clipboard.writeText('+2560783979292')}
                                            >
                                                Copy Number
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-dark fst-italic" style={{ fontWeight: '600', fontSize: '1rem', color: '#992525' }}>
                                    The numbers are registered in the name of <span style={{ color: '#992525', fontWeight: 'bold' }}>Aarakit Doreen</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Donation Form Section */}
            <section className="py-5" style={{ backgroundColor: '#992525' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="p-4 p-lg-5 shadow-lg rounded form-box" style={{ backgroundColor: '#ffffff' }}>
                                <div className="text-center mb-4">
                                    <h3 className="fw-bold" style={{ color: '#992525' }}>Your Kindness Can Change a Life</h3>
                                    <p className="text-muted">Fill out the form below to make a donation</p>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    {/* Donation Details */}
                                    <div className="mb-4">
                                        <h5 className="mb-3" style={{ color: '#992525', borderBottom: '2px solid #992525', paddingBottom: '0.5rem' }}>
                                            Donation Details
                                        </h5>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label htmlFor="amount" className="form-label fw-semibold">Amount *</label>
                                                <input
                                                    type="number"
                                                    id="amount"
                                                    name="amount"
                                                    className="form-control"
                                                    placeholder="Enter amount"
                                                    required
                                                    value={formData.amount}
                                                    onChange={handleChange}
                                                    min="1"
                                                    step="any"
                                                    style={{ borderColor: '#992525' }}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="currency" className="form-label fw-semibold">Currency *</label>
                                                <select
                                                    id="currency"
                                                    name="currency"
                                                    className="form-select"
                                                    required
                                                    value={formData.currency}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#992525' }}
                                                >
                                                    <option value="">Select Currency</option>
                                                    <option value="UGX">UGX</option>
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="type" className="form-label fw-semibold">Type *</label>
                                                <select
                                                    id="type"
                                                    name="type"
                                                    className="form-select"
                                                    required
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#992525' }}
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="goods">Goods</option>
                                                    <option value="service">Service</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Donation Frequency */}
                                    <div className="mb-4">
                                        <h5 className="mb-3" style={{ color: '#992525', borderBottom: '2px solid #992525', paddingBottom: '0.5rem' }}>
                                            Donation Frequency
                                        </h5>
                                        <div className="d-flex flex-wrap gap-2">
                                            {['one_time', 'monthly', 'yearly'].map((freq) => (
                                                <div key={freq} className="form-check form-check-inline">
                                                    <input
                                                        type="radio"
                                                        className="form-check-input"
                                                        name="frequency"
                                                        id={freq}
                                                        value={freq}
                                                        checked={formData.frequency === freq}
                                                        onChange={handleChange}
                                                        style={{ accentColor: '#992525' }}
                                                    />
                                                    <label 
                                                        className="form-check-label fw-semibold" 
                                                        htmlFor={freq}
                                                        style={{ color: '#992525' }}
                                                    >
                                                        {freq === 'one_time' ? 'One-Time' : 
                                                         freq === 'monthly' ? 'Monthly' : 'Yearly'}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Donor Information */}
                                    <div className="mb-4">
                                        <h5 className="mb-3" style={{ color: '#992525', borderBottom: '2px solid #992525', paddingBottom: '0.5rem' }}>
                                            Optional Donor Information
                                        </h5>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="firstName" className="form-label fw-semibold">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    className="form-control"
                                                    placeholder="First Name (Optional)"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#992525' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="lastName" className="form-label fw-semibold">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    className="form-control"
                                                    placeholder="Last Name (Optional)"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#992525' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Email (Optional)"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#992525' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="contact" className="form-label fw-semibold">Contact</label>
                                                <input
                                                    type="text"
                                                    id="contact"
                                                    name="contact"
                                                    className="form-control"
                                                    placeholder="Contact (Optional)"
                                                    value={formData.contact}
                                                    onChange={handleChange}
                                                    style={{ borderColor: '#992525' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inspirational Quote */}
                                    <div className="text-center my-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #992525' }}>
                                        <p className="fst-italic mb-0" style={{ color: '#992525', fontSize: '1.1rem' }}>
                                            "You may not be able to change the world for everyone,
                                            but for one child, your gift changes everything."
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn px-5 py-3 fw-bold text-white"
                                            style={{ 
                                                backgroundColor: '#992525',
                                                fontSize: '1.1rem',
                                                border: 'none',
                                                transition: 'all 0.3s ease'
                                            }}
                                            disabled={loading}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#600000';
                                                e.target.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#992525';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                'DONATE NOW'
                                            )}
                                        </button>
                                    </div>

                                    {/* Messages */}
                                    {successMsg && (
                                        <div className="alert alert-success mt-4 text-center fw-bold" role="alert">
                                            {successMsg}
                                        </div>
                                    )}
                                    {errorMsg && (
                                        <div className="alert alert-danger mt-4 text-center fw-bold" role="alert">
                                            {errorMsg}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Donate;
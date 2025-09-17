// import React from 'react';
// import '../Styles/Donate.css'; 
// import Footer from './Footer';

// const Donate = () => {
//   return (
//     <div id='donate' style={{ marginTop: '120px' }}>

//       {/* Emotional Appeal*/}
//       <section className="text-center py-5 bg-light">
//         <div className="container">
//           <h2 className="mb-4 fw-bold">Your Support Makes a Difference</h2>
//           <p className="lead">
//             Every contribution you make helps us reach one more child with hope, care, and opportunity. 
//             Join us in transforming lives, one donation at a time.
//           </p>
//         </div>
//       </section>

//       {/*Form Over Background Image */}
//       <section className="donate-form-section d-flex align-items-center">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-8">
//               <div className="p-5 shadow-lg rounded form-box bg-dark bg-opacity-75 text-white">
//                 <h3 className="text-center mb-4">Your Kindness Can Change a Life</h3>
//                 <form>
//                   <div className="row mb-3">
//                     <div className="col-md-6">
//                       <input type="text" className="form-control" placeholder="First Name" required />
//                     </div>
//                     <div className="col-md-6">
//                       <input type="text" className="form-control" placeholder="Last Name" required />
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <input type="email" className="form-control" placeholder="Email or Contact" required />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Payment Method</label>
//                     <select className="form-select" required>
//                       <option value="">Choose...</option>
//                       <option value="mobile-money">Mobile Money (+256782446763)</option>
//                       <option value="paypal">PayPal</option>
//                       <option value="credit-card">Credit Card</option>
//                     </select>
//                   </div>

//                   <div className="mb-4 text-center">
//                     <label className="form-label d-block mb-2">Donation Frequency</label>
//                     <div className="btn-group" role="group" aria-label="Frequency">
//                       <input type="radio" className="btn-check" name="frequency" id="one-time" autoComplete="off" defaultChecked />
//                       <label className="btn btn-outline-light" htmlFor="one-time">One-Time</label>

//                       <input type="radio" className="btn-check" name="frequency" id="monthly" autoComplete="off" />
//                       <label className="btn btn-outline-light" htmlFor="monthly">Monthly</label>

//                       <input type="radio" className="btn-check" name="frequency" id="yearly" autoComplete="off" />
//                       <label className="btn btn-outline-light" htmlFor="yearly">Yearly</label>
//                     </div>
//                   </div>

//                   <p className="text-center fst-italic mb-4">
//                     "You may not be able to change the world for everyone, 
//                     but for one child, your gift changes everything."
//                   </p>

//                   <div className="text-center">
//                     <button type="submit" className="btn px-4 py-2 text-white" style={{ backgroundColor: '#992525' }}>
//                       DONATE NOW
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//         <Footer />
//     </div>
//   );
// };

// export default Donate;

import React, { useState } from 'react';
import '../Styles/Donate.css';
import Footer from './Footer';
import airtelBanner from './Images/Airtel banner.jpg';
import mtnBanner from './Images/Mtn banner.jpg';

// Corrected: Use environment variable for the base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL; 

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
            <section className="text-center py-5 bg-light">
                <div className="container">
                    <h2 className="mb-4 fw-bold">Your Support Makes a Difference</h2>
                    <p className="lead">
                        Every contribution you make helps us reach one more child with hope, care, and opportunity.
                        Join us in transforming lives, one donation at a time.
                    </p>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-5 mb-3">
                            <div className="card shadow border-0">
                                <img src={airtelBanner} alt="Airtel Money" className="card-img-top" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">Airtel Money</h5>
                                    <p className="card-text fw-bold text-danger">+256-(0)-755-722-853</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 mb-3">
                            <div className="card shadow border-0">
                                <img src={mtnBanner} alt="MTN Mobile Money" className="card-img-top" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">MTN Mobile Money</h5>
                                    <p className="card-text fw-bold text-warning">+256-(0)-783-979-292</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 text-center mt-3">
                            <p className="text-dark fst-italic" style={{ fontWeight: '600', fontSize: '1rem' }}>
                                The numbers are registered in the name of <span style={{ color: '#992525' }}>Aarakit Doreen</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="donate-form-section d-flex align-items-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="p-5 shadow-lg rounded form-box bg-dark bg-opacity-75 text-white">
                                <h3 className="text-center mb-4">Your Kindness Can Change a Life</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <input
                                                type="number"
                                                name="amount"
                                                className="form-control"
                                                placeholder="Amount"
                                                required
                                                value={formData.amount}
                                                onChange={handleChange}
                                                min="1"
                                                step="any"
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <select
                                                name="currency"
                                                className="form-select"
                                                required
                                                value={formData.currency}
                                                onChange={handleChange}
                                            >
                                                <option value="">Currency</option>
                                                <option value="UGX">UGX</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <select
                                                name="type"
                                                className="form-select"
                                                required
                                                value={formData.type}
                                                onChange={handleChange}
                                            >
                                                <option value="">Type</option>
                                                <option value="cash">Cash</option>
                                                <option value="goods">Goods</option>
                                                <option value="service">Service</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4 text-center">
                                        <label className="form-label d-block mb-2">Donation Frequency</label>
                                        <div className="btn-group" role="group" aria-label="Frequency">
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="frequency"
                                                id="one_time"
                                                value="one_time"
                                                autoComplete="off"
                                                checked={formData.frequency === 'one_time'}
                                                onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-light" htmlFor="one_time">One-Time</label>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="frequency"
                                                id="monthly"
                                                value="monthly"
                                                autoComplete="off"
                                                checked={formData.frequency === 'monthly'}
                                                onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-light" htmlFor="monthly">Monthly</label>
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="frequency"
                                                id="yearly"
                                                value="yearly"
                                                autoComplete="off"
                                                checked={formData.frequency === 'yearly'}
                                                onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-light" htmlFor="yearly">Yearly</label>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h5 className="text-center mb-3 text-warning">Optional Donor Information</h5>
                                        <div className="row mb-3">
                                            <div className="col-md-4 mb-3 mb-md-0">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    className="form-control"
                                                    placeholder="First Name (Optional)"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3 mb-md-0">
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    className="form-control"
                                                    placeholder="Last Name (Optional)"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Email (Optional)"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    className="form-control"
                                                    placeholder="Contact (Optional)"
                                                    value={formData.contact}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center fst-italic mb-4">
                                        "You may not be able to change the world for everyone,
                                        but for one child, your gift changes everything."
                                    </p>
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn px-4 py-2 text-white"
                                            style={{ backgroundColor: '#992525' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : 'DONATE NOW'}
                                        </button>
                                    </div>
                                    {successMsg && (
                                        <p className="text-center mt-3 "style={{color:"#006400", fontWeight:"bolder", backgroundColor:"#e7d5d5", padding:"10px"}}>{successMsg}</p>
                                    )}
                                    {errorMsg && (
                                        <p className="text-center mt-3 text-danger fw-bold">{errorMsg}</p>
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


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../Styles/Mission.css'; 
// import Footer from './Footer';
// import { Spinner, Alert } from 'react-bootstrap';

// const Mission = () => {
//     const [missionData, setMissionData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const API_BASE_URL = 'http://localhost:5000';

//     useEffect(() => {
//         const fetchMissionData = async () => {
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/api/v1/mission`);
//                 setMissionData(response.data);
//             } catch (err) {
//                 setError('Failed to fetch mission content. Please try again later.');
//                 console.error('Error fetching mission data:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMissionData();
//     }, []);

//     if (loading) {
//         return <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}><Spinner animation="border" /></div>;
//     }

//     if (error) {
//         return <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}><Alert variant="danger">{error}</Alert></div>;
//     }

//     if (!missionData) {
//         return <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}><Alert variant="info">No mission content available. Please check the backend.</Alert></div>;
//     }

//     return (
//         <div className="mission-page" style={{ marginTop: '120px' }} id="mission">
//             <div className="container py-5">
//                 {/* Mission Intro */}
//                 <div className="text-center mb-5">
//                     <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>{missionData.page_title}</h2>
//                     <p className="lead mt-3">{missionData.page_intro}</p>
//                 </div>

//                 {/* Section 1 */}
//                 <div className="row align-items-center mb-5">
//                     <div className="col-md-6">
//                         <img 
//                             src={missionData.section1_image_url} 
//                             className="img-fluid rounded shadow" 
//                             alt={missionData.section1_heading}
//                             style={{height:'300px', width:'470px', objectFit: 'cover'}} 
//                         />
//                     </div>
//                     <div className="col-md-6">
//                         <h4 className="fw-bold mb-3">{missionData.section1_heading}</h4>
//                         <p>{missionData.section1_content}</p>
//                     </div>
//                 </div>

//                 {/* Section 2 */}
//                 <div className="row align-items-center flex-md-row-reverse mb-5">
//                     <div className="col-md-6">
//                         <img 
//                             src={missionData.section2_image_url} 
//                             className="img-fluid rounded shadow" 
//                             alt={missionData.section2_heading}
//                             style={{height:'300px', width:'470px', objectFit: 'cover'}}
//                         />
//                     </div>
//                     <div className="col-md-6">
//                         <h4 className="fw-bold mb-3">{missionData.section2_heading}</h4>
//                         <p>{missionData.section2_content}</p>
//                     </div>
//                 </div>

//                 {/* Call to Action */}
//                 <div className="text-center bg-light rounded p-5 shadow-sm" style={{ borderLeft: '8px solid #992525' }}>
//                     <h5 className="fw-bold mb-3">{missionData.cta_heading}</h5>
//                     <p className="mb-4">{missionData.cta_content}</p>
//                     <a href={missionData.cta_button_url} className="btn btn-outline-danger px-4 py-2">
//                         {missionData.cta_button_text}
//                     </a>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default Mission;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Mission.css';
import Footer from './Footer';
import { Spinner, Alert } from 'react-bootstrap';

const Mission = () => {
    const [missionData, setMissionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    const API_BASE_URL = 'http://localhost:5000'; // Flask backend URL

    useEffect(() => {
        const fetchMissionData = async () => {
            try {
                // THIS IS THE CRITICAL LINE: Ensure NO trailing slash in the URL
                const response = await axios.get(`${API_BASE_URL}/api/v1/mission/all`); // Corrected: NO trailing slash
                setMissionData(response.data);
            } catch (err) {
                // Handle 404 specifically to show a custom message if content is not found
                if (err.response && err.response.status === 404 && err.response.data && err.response.data.error) {
                    setError(err.response.data.error); // Display specific backend error for 404
                } else {
                    setError('Failed to fetch mission content. Please try again later.');
                }
                console.error('Error fetching mission data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMissionData();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Spinner animation="border" />
        </div>
    );

    if (error) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Alert variant="danger">{error}</Alert>
        </div>
    );

    if (!missionData) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Alert variant="info">No mission content available.</Alert>
        </div>
    );

    return (
        <div className="mission-page" style={{ marginTop: '120px' }} id="mission">
            <div className="container py-5">
                {/* Mission Header */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>{missionData.page_title}</h2>
                    <p className="lead mt-3">{missionData.page_intro}</p>
                </div>

                {/* Section 1 */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-6">
                        <img
                            src={missionData.section1_image_url}
                            className="img-fluid rounded shadow"
                            alt={missionData.section1_heading}
                            style={{height:'300px', width:'470px', objectFit: 'cover'}}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/470x300/CCCCCC/000000?text=Image+Not+Found'; }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h4 className="fw-bold mb-3">{missionData.section1_heading}</h4>
                        <p>{missionData.section1_content}</p>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="row align-items-center flex-md-row-reverse mb-5">
                    <div className="col-md-6">
                        <img
                            src={missionData.section2_image_url}
                            className="img-fluid rounded shadow"
                            alt={missionData.section2_heading}
                            style={{height:'300px', width:'470px', objectFit: 'cover'}}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/470x300/CCCCCC/000000?text=Image+Not+Found'; }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h4 className="fw-bold mb-3">{missionData.section2_heading}</h4>
                        <p>{missionData.section2_content}</p>
                    </div>
                </div>

                {/* Call-to-Action */}
                <div className="text-center bg-light rounded p-5 shadow-sm" style={{ borderLeft: '8px solid #992525' }}>
                    <h5 className="fw-bold mb-3">{missionData.cta_heading}</h5>
                    <p className="mb-4">{missionData.cta_content}</p>
                    <a href={missionData.cta_button_url} className="btn btn-outline-danger px-4 py-2">
                        {missionData.cta_button_text}
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Mission;

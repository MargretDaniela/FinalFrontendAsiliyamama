// import React from 'react';
// import '../Styles/Vision.css';
// import visionBg from './Images/Vision banner.jpeg';
// import Footer from './Footer';

// const Vision = () => {
//   return (
//     <div className="vision-page" style={{ marginTop: '120px' }} id="vision">
//       <div>
//         <img 
//           src={visionBg} 
//           alt="Vision Banner" 
//           className="img-fluid w-70" 
//           style={{ maxHeight: '200px', objectFit: 'cover', maxWidth:'100px', marginLeft:'620px' }} 
//         />
//       </div>
//       <div className="container text-center">
//         <h1 className="fw-bold">Our Vision</h1>
//         <p className="fst-italic lead">
//           Building a world where children and youth thrive with dignity, voice, and opportunity.
//         </p>
//       </div>
//       <div className="container py-3">
//         <div className="row justify-content-center">
//           <div className="col-lg-10 text-center">
//             <h4 className="fw-bold mb-4" style={{ color: '#992525' }}>Our Vision Statement</h4>
//             <p className="lead">
//               We envision a world where every child, adolescent, and youth thrives in a safe,
//               inclusive, and empowered environment — nurtured by responsive families and resilient
//               communities. A future where:
//             </p>
//           </div>
//         </div>
//         <div className="row text-center mt-5 g-4">
//           <div className="col-md-4">
//             <div className="p-4 border rounded shadow-sm h-100">
//               <i className="bi bi-megaphone" style={{ fontSize: '2rem', color: '#992525' }}></i>
//               <h5 className="fw-bold mt-3">Children's Voices Matter</h5>
//               <p>
//                 Children lead their growth journey — their ideas and rights shape programs and communities.
//               </p>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="p-4 border rounded shadow-sm h-100">
//               <i className="bi bi-heart-pulse" style={{ fontSize: '2rem', color: '#992525' }}></i>
//               <h5 className="fw-bold mt-3">Well-being is Central</h5>
//               <p>
//                 We prioritize emotional, mental, and psychosocial wellness for lifelong resilience and confidence.
//               </p>
//             </div>
//           </div>

//           <div className="col-md-4">
//             <div className="p-4 border rounded shadow-sm h-100">
//               <i className="bi bi-globe" style={{ fontSize: '2rem', color: '#992525' }}></i>
//               <h5 className="fw-bold mt-3">A Sustainable Future</h5>
//               <p>
//                 We nurture youth as stewards of change through climate action, innovation, and education.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="text-center mt-5">
//           <p className="lead">Together, let's raise a generation that transforms the world.</p>
//           <a href="/programs" className="btn btn-outline-danger px-4 py-2">Explore Our Programs</a>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Vision;

import React, { useState, useEffect } from 'react';
import '../Styles/Vision.css'; 
import Footer from './Footer'; 

const Vision = () => {
    const [visionContent, setVisionContent] = useState(null);
    const [visionPoints, setVisionPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:5000'; 
    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchVisionData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/vision/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch vision data.');
                }
                const data = await response.json();
                setVisionContent(data.content);
                setVisionPoints(data.points);
            } catch (err) {
                console.error('Error fetching vision data:', err);
                setError('Network error. Failed to load vision content.');
            } finally {
                setLoading(false);
            }
        };

        fetchVisionData();
    }, [API_BASE_URL]);

    if (loading) {
        return <div className="text-center" style={{ marginTop: '150px' }}>Loading vision...</div>;
    }

    if (error) {
        return <div className="text-center text-danger" style={{ marginTop: '150px' }}>Error: {error}</div>;
    }

    if (!visionContent) {
        return <div className="text-center" style={{ marginTop: '150px' }}>No vision content available.</div>;
    }

    return (
        <div className="vision-page" style={{ marginTop: '120px' }} id="vision">
            <div>
                <img 
                    src={visionContent.banner_image_url || 'https://placehold.co/1200x200/cccccc/333333?text=Vision+Banner'} 
                    alt="Vision Banner" 
                    className="img-fluid w-70" 
                    style={{ maxHeight: '200px', objectFit: 'cover', maxWidth:'100px', marginLeft:'620px' }} 
                />
            </div>
            <div className="container text-center">
                <h1 className="fw-bold">{visionContent.page_title}</h1>
                <p className="fst-italic lead">
                    {visionContent.page_subtitle}
                </p>
            </div>
            <div className="container py-3">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <h4 className="fw-bold mb-4" style={{ color: '#992525' }}>{visionContent.statement_title}</h4>
                        <p className="lead">
                            {visionContent.statement_text}
                        </p>
                    </div>
                </div>
                <div className="row text-center mt-5 g-4">
                    {visionPoints.map((point) => (
                        <div className="col-md-4" key={point.id}>
                            <div className="p-4 border rounded shadow-sm h-100">
                                <i className={point.icon_class} style={{ fontSize: '2rem', color: '#992525' }}></i>
                                <h5 className="fw-bold mt-3">{point.title}</h5>
                                <p>{point.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-5">
                    <p className="lead">{visionContent.call_to_action_text}</p>
                    <a href={visionContent.button_url} className="btn btn-outline-danger px-4 py-2">{visionContent.button_text}</a>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Vision;

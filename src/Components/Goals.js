// import React from 'react';
// import '../Styles/Goals.css'; 
// import supportImg from './Images/feeding.jpg';
// import empowerImg from './Images/Mentoring kids.jpg'; 
// import sustainImg from './Images/woman farming.jpg'; 
// import Footer from './Footer';

// const Goals = () => {
//   return (
//     <div className="goals-page" style={{ marginTop: '120px' }} id='goals'>
//       <div className="container py-5">
//         {/* Title */}
//         <div className="text-center mb-5">
//           <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>Core Areas of Impact</h2>
//           <p className="lead text-muted">Our focused goals that drive positive change for children and youth.</p>
//         </div>

//         {/* Goal 1 */}
//         <div className="row align-items-center mb-5">
//           <div className="col-md-6">
//             <img src={supportImg} alt="Support Children" className="img-fluid rounded shadow" />
//           </div>
//           <div className="col-md-6">
//             <h4 className="fw-bold mb-3" style={{ color: '#992525' }}>
//               Support Children and Youth Survival
//             </h4>
//             <p>
//               Ensuring access to protection, healthcare, nutrition, reproductive health, and psychological support 
//               for every child and young person. We prioritize their basic rights and well-being to nurture safe and healthy lives.
//             </p>
//           </div>
//         </div>

//         {/* Goal 2 */}
//         <div className="row align-items-center mb-5 flex-md-row-reverse">
//           <div className="col-md-6">
//             <img src={empowerImg} alt="Empower Youth" className="img-fluid rounded shadow" />
//           </div>
//           <div className="col-md-6">
//             <h4 className="fw-bold mb-3" style={{ color: '#992525' }}>
//               Empower Young Lives to Thrive
//             </h4>
//             <p>
//               Through mentorship, life skills training, talent development, and career guidance, we build confident, 
//               independent, and emotionally strong individuals prepared for meaningful futures.
//             </p>
//           </div>
//         </div>

//         {/* Goal 3 */}
//         <div className="row align-items-center mb-5">
//           <div className="col-md-6">
//             <img src={sustainImg} alt="Sustainable Development" className="img-fluid rounded shadow" />
//           </div>
//           <div className="col-md-6">
//             <h4 className="fw-bold mb-3" style={{ color: '#992525' }}>
//               Promote Sustainable Youth and Child Development
//             </h4>
//             <p>
//               Encouraging environmental stewardship through gardening, recycling, tree planting, horticulture, 
//               and olericulture, fostering sustainable practices and green livelihoods.
//             </p>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Goals;


import React, { useState, useEffect } from 'react';
import '../Styles/Goals.css'; 
import Footer from './Footer';

// This component fetches and displays the goals data from your backend
const Goals = () => {
    const [header, setHeader] = useState({ page_title: '', page_description: '' });
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your Flask backend URL

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                // Use a standard fetch since this is a public-facing page
                const response = await fetch(`${API_BASE_URL}/api/v1/goals/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch goals data');
                }
                const data = await response.json();
                setHeader(data.header);
                setGoals(data.goals);
            } catch (err) {
                console.error('Error fetching goals data:', err);
                setError('Network error. Failed to load goals.');
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [API_BASE_URL]);

    if (loading) {
        return <div className="loading-state text-center">Loading goals...</div>;
    }

    if (error) {
        return <div className="error-state text-center text-danger">Error: {error}</div>;
    }

    return (
        <div className="goals-page" style={{ marginTop: '120px' }} id='goals'>
            <div className="container py-5">
                {/* Dynamic Title */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>{header.page_title}</h2>
                    <p className="lead text-muted">{header.page_description}</p>
                </div>

                {/* Dynamic Goals List */}
                {goals.map((goal, index) => (
                    <div 
                        key={goal.id} 
                        className={`row align-items-center mb-5 ${index % 2 !== 0 ? 'flex-md-row-reverse' : ''}`}
                    >
                        <div className="col-md-6">
                            <img src={goal.image_url} alt={goal.title} className="img-fluid rounded shadow"/>
                        </div>
                        <div className="col-md-6">
                            <h4 className="fw-bold mb-3" style={{ color: '#992525' }}>{goal.title}</h4>
                            <p>{goal.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Goals;
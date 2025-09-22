// import React from 'react';
// import CountUp from 'react-countup';

// const Impact = () => {
//   return (
//     <div
//       id="impact"
//       className="d-flex flex-column justify-content-between"
//       style={{
//         marginTop: '160px'
//       }}
//     >
//       <div>
//         <h2 className="text-center mb-4">Empowered Lives</h2>
//         <div className="d-flex justify-content-center flex-wrap gap-5 text-center mb-4">
//           {/* Card 1 */}
//           <div
//             className="border rounded-4 p-4"
//             style={{
//               width: '200px',
//               boxShadow: '0 0.5rem 1rem rgba(128, 0, 0, 0.4)'
//             }}
//           >
//             <h3 className="text-dark fw-bold display-6">
//               <CountUp start={0} end={45} duration={2} />
//             </h3>
//             <p className="mb-0">Children & Youth Empowered</p>
//           </div>

//           {/* Card 2 */}
//           <div
//             className="border rounded-4 p-4"
//             style={{
//               width: '200px',
//               boxShadow: '0 0.5rem 1rem rgba(128, 0, 0, 0.4)'
//             }}
//           >
//             <h3 className="text-dark fw-bold display-6">
//               <CountUp start={0} end={8} duration={2} />
//             </h3>
//             <p className="mb-0">Dedicated Staff Members</p>
//           </div>

//           {/* Card 3 */}
//           <div
//             className="border rounded-4 p-4"
//             style={{
//               width: '200px',
//               boxShadow: '0 0.5rem 1rem rgba(128, 0, 0, 0.4)'
//             }}
//           >
//             <h3 className="text-dark fw-bold display-6">
//               <CountUp start={0} end={4} duration={2} />
//             </h3>
//             <p className="mb-0">Years of Impact</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Impact;

import React, { useState, useEffect, useCallback } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import { Alert } from 'react-bootstrap'; // Import Alert for error display

// const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_BASE_URL = 'http://127.0.0.1:5000'; // Your backend API base URL

const Impact = () => {
    const [impactData, setImpactData] = useState({
        main_headline: 'Loading Impact...',
        card1_value: 0,
        card1_description: 'Loading...',
        card2_value: 0,
        card2_description: 'Loading...',
        card3_value: 0,
        card3_description: 'Loading...',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch Impact data
    const fetchImpactData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/impact/`);
            setImpactData(response.data);
        } catch (err) {
            console.error('Error fetching Impact content:', err);
            setError('Failed to load Impact content. Please ensure your backend is running.');
            // Set fallback data if fetch fails
            setImpactData({
                main_headline: "Empowered Lives",
                card1_value: 45,
                card1_description: "Children & Youth Empowered",
                card2_value: 8,
                card2_description: "Dedicated Staff Members",
                card3_value: 4,
                card3_description: "Years of Impact",
            });
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies for API_BASE_URL as it's a constant

    // Initial fetch on component mount
    useEffect(() => {
        fetchImpactData();
    }, [fetchImpactData]);

    // Listen for localStorage changes to re-fetch Impact data (for real-time updates from admin)
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'lastImpactUpdateTimestamp' && event.newValue !== event.oldValue) {
                console.log('Impact content updated via localStorage event. Re-fetching data...');
                fetchImpactData(); // Re-fetch the data when the timestamp changes
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchImpactData]);

    if (loading) {
        return <div className="text-center mt-5">Loading Impact content...</div>;
    }

    return (
        <div
            id="impact"
            className="d-flex flex-column justify-content-between"
            style={{
                marginTop: '160px'
            }}
        >
            {error && <Alert variant="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}
            <div>
                <h2 className="text-center mb-4">{impactData.main_headline}</h2>
                <div className="d-flex justify-content-center flex-wrap gap-5 text-center mb-4">
                    {/* Card 1 */}
                    <div
                        className="border rounded-4 p-4"
                        style={{
                            width: '200px',
                            boxShadow: '0 0.5rem 1rem rgba(128, 0, 0, 0.4)'
                        }}
                    >
                        <h3 className="text-dark fw-bold display6">
                            <CountUp start={0} end={impactData.card1_value} duration={2} />
                        </h3>
                        <p className="mb-0">{impactData.card1_description}</p>
                    </div>

                    {/* Card 2 */}
                    <div
                        className="border rounded-4 p-4"
                        style={{
                            width: '200px',
                            boxShadow: '0 0.5rem 1rem rgba(128, 0, 0, 0.4)'
                        }}
                    >
                        <h3 className="text-dark fw-bold display6">
                            <CountUp start={0} end={impactData.card2_value} duration={2} />
                        </h3>
                        <p className="mb-0">{impactData.card2_description}</p>
                    </div>

                    {/* Card 3 */}
                    <div
                        className="border rounded-4 p-4"
                        style={{
                            width: '200px',
                            boxShadow: '0 0.5rem 1rem rgba(128, 0, 0, 0.4)'
                        }}
                    >
                        <h3 className="text-dark fw-bold display6">
                            <CountUp start={0} end={impactData.card3_value} duration={2} />
                        </h3>
                        <p className="mb-0">{impactData.card3_description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Impact;

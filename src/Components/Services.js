// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import knitting from './Images/Girl knitting.jpg';
// import farming from './Images/Farming.jpg';
// import liquid from './Images/Liquid soap making.jpg';
// import '../Styles/Services.css'
// const Services = () => {
//   const { hash } = useLocation();
//   const isServicesView = hash === '#services';

//   return (
//     <div className={`py-5 text-center ${isServicesView ? 'services-top-margin' : ''}`} id="services">
//       <h2 className="mb-5 fw-bold text-uppercase">Our Services</h2>

//       <div className="row justify-content-center px-5  g-4">
//         {/* Card 1 */}
//         <div className="col-md-4">
//           <div className="card h-100 shadow">
//             <img src={knitting} className="card-img-top" alt="Knitting and crocheting" />
//             <div className="card-body">
//               <h5 className="card-title fw-bold">Knitting and crocheting</h5>
//               <p className="card-text">
//                 We introduce young people to the rewarding craft of knitting, helping them create with both hands and heart.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Card 2 */}
//         <div className="col-md-4">
//           <div className="card h-100 shadow">
//             <img src={farming} className="card-img-top" alt="Horticulture and Olericulture" />
//             <div className="card-body">
//               <h5 className="card-title fw-bold">Horticulture and Olericulture</h5>
//               <p className="card-text">
//                 The young people learn how to grow fruits, herbs, and vegetables, fostering healthy living.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Card 3 */}
//         <div className="col-md-4">
//           <div className="card h-100 shadow">
//             <img src={liquid} className="card-img-top" alt="Liquid soap making" />
//             <div className="card-body">
//               <h5 className="card-title fw-bold">Liquid soap making</h5>
//               <p className="card-text">
//                 Young lives gain a skill of manufacturing liquid soap that nurtures their focus and pride in work.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* View All Button */}
//       <div className="mt-5">
//         <a href="/programs" className="btn btn-danger btn-lg">View All Programs</a>
//       </div>
//     </div>
//   );
// };

// export default Services;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
// No longer importing local images directly as they will come from the backend

const Services = () => {
  const { hash } = useLocation();
  const isServicesView = hash === '#services';

  const [services, setServices] = useState([]);
  // Updated headerData state to include button_text and button_url
  const [headerData, setHeaderData] = useState({ 
    page_title: '', 
    page_description: '',
    button_text: 'View All Programs', // Default
    button_url: '/programs' // Default
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your Flask backend URL

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/services`);
        const data = response.data;
        setHeaderData(data.header);
        setServices(data.services);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch services data:', err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };
    fetchServicesData();
  }, []);

  return (
    <div className={`py-5 text-center ${isServicesView ? 'services-top-margin' : ''}`} id="services" style={{marginTop:'120px'}}>
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : (
        <>
          {/* Dynamic Page Header */}
          <h2 className="mb-5 fw-bold text-uppercase">{headerData.page_title}</h2>
          <p className="text-muted">{headerData.page_description}</p>

          <div className="row justify-content-center px-5 g-4">
            {services.map((service) => (
              <div key={service.id} className="col-md-4">
                <div className="card h-100 shadow">
                  <img 
                    src={service.image_url || `https://placehold.co/400x200/cccccc/333333?text=No+Image`} 
                    className="card-img-top" 
                    alt={service.name} 
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{service.name}</h5>
                    <p className="card-text">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dynamic View All Button */}
      <div className="mt-5">
        {/* Use headerData.button_url and headerData.button_text */}
        <a href={headerData.button_url} className="btn btn-danger btn-lg">{headerData.button_text}</a>
      </div>
    </div>
  );
};

export default Services;

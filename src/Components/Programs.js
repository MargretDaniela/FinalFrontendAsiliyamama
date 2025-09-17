// import React from 'react';
// import '../Styles/Programs.css';
// import lifeSkills from './Images/LifeSkills.jpg'
// import mentorship from './Images/Mentorship and coaching.jpg'
// import protectionServices from './Images/ChildProtection.jpg'
// import farming from './Images/Sikuma growth.jpg'
// import Footer from './Footer'
// const Programs = () => { 
//   return (
//     <div className="" style={{marginTop:'150px'}}>

//       {/* View Our Programs */}
//       <div className="text-center mb-3">
//         <div className="section-line mb-2"></div>
//         <h2 className="sub-heading">View Our  <br />
//         <span>Programs.</span></h2>
//       </div>

//         <div className="row align-items-center mb-3">
//         {/* Image Left */}
//         <div className="col-md-6">
//             <img src={farming} alt="Programs" className="img-fluid rounded shadow program-image-small"
//              style={{ height: '200px', width: '70%', objectFit: 'cover', marginLeft:'40px' }} />
//         </div>
//         {/* Text Right */}
//         <div className="col-md-6">
//             <p className="lead">
//             This actually teaches children and the youth small-space <br />
//             gardening (soil, composting, seeds, pest control, watering) to <br />
//             grow nutritious local food. It promotes healthy diets, reduces <br />
//             market reliance and fosters teamwork, patience, and a connection with nature. <br />
//             </p>
//         </div>
//         </div>

//       {/* Our Programs Heading */}
//       <div className="text-center mb-4">
//         <div className="section-line mb-2"></div>
//         <h3 className="sub-heading1">Our Programs are</h3>
//       </div>

//       {/* Program Boxes */}
//      <div className='boxes px-3'>
//          <div className="row text-center ">
//         {/* Box 1 */}
//         <div className="col-md-4">
//           <div className="program-box p-3 h-100">
//             <h5 className="fw-bold mb-3">LIFE SKILLS EDUCATION</h5>
//             <img src={lifeSkills} alt="Life Skills" className="program-image img-fluid mb-3" />
//             <p>
//                 Programs under this activity teach key skills like communication, problem-sloving
//                 ,self-awareness, emotional regulation and decision-making.
//             </p>
//             <p>
//                 Life skills education is vital for youth development. It goes beyond academics
//             , given children and youth tools to thrive socially, emotionally and econmically.
//             </p>
//           </div>
//         </div>

//         {/* Box 2 */}
//         <div className="col-md-4">
//           <div className="program-box p-3 h-100">
//             <h5 className="fw-bold mb-3">MENTORSHIP AND COACHING</h5>
//             <img src={mentorship} alt="Mentorship" className="program-image img-fluid mb-3" 
//             style={{ height: '260px', width: '100%', objectFit: 'cover' }}/>
//             <p>
//                 These sessions support children, adolscents and the youth through mentoring.
//                 Mentors guide personal, academic and career growth.
//             </p>
//             <p>
//                 It strengthens social bonds and emotional well-being, reducing youth
//                 isolation.A supportive adult boosts self-esteem and inspires lasting
//                 positive behavior.
//             </p>
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="program-box p-3 h-100">
//             <h5 className="fw-bold mb-3">CLIMATE CHILD PROTECTION SERVICES</h5>
//             <img src={protectionServices} alt="Environment" className="program-image img-fluid mb-3"
//             style={{height:'260px'}} />
//             <p>
//                 Child Protection Services identity risks, rise awareness, and  prevent abuse,
//                 neglect and exploitation through community sensizatio, reprting and support
//                 affected children.  
//             </p>
//             <p>
//                 Without safety, children cannot benefit from empowerment efforts
//             . A secure enviroment supports emotional stability, learning and healthy 
//             relationships.
//             </p>
//           </div>
//         </div>
//       </div>
//      </div>
//       <Footer/>
//     </div>
//   );
// };

// export default Programs;

import React, { useState, useEffect } from 'react';
import { Container, Spinner, Row, Col, Card } from "react-bootstrap";
import Footer from './Footer';
import '../Styles/Programs.css';

const Programs = () => {
    // Define API_BASE_URL inside the component to ensure it's in scope
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const [programs, setPrograms] = useState([]);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [pageSettings, setPageSettings] = useState({
        page_main_title: "View Our Programs",
        page_main_description: "A default description to be shown when no specific program is configured for the main page.",
        page_main_image: null,
        page_section_heading: "Our Programs"
    });

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoadingPrograms(true);
            try {
                // Use the constant here
                const res = await fetch(`${API_BASE_URL}/api/v1/programs/`, { method: "GET" });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const responseData = await res.json();

                setPrograms(responseData.programs);
                if (responseData.page_settings) {
                    setPageSettings(responseData.page_settings);
                }
            } catch (err) {
                console.error("Error fetching programs:", err);
            } finally {
                setLoadingPrograms(false);
            }
        };

        fetchPrograms();
    }, []);

    const renderHeader = () => {
        const titleWords = pageSettings.page_main_title ? pageSettings.page_main_title.split(' ') : [];
        const firstWord = titleWords[0];
        const restOfTitle = titleWords.slice(1).join(' ');

        return (
            <div className="row align-items-center mb-5" style={{ marginTop: "150px" }}>
                <Col md={6}>
                    <div className="section-line"></div>
                    <h2 className="sub-heading mb-4">
                        {firstWord} <br />
                        <span>{restOfTitle}</span>
                    </h2>
                    <p className="lead">{pageSettings.page_main_description}</p>
                </Col>
                <Col md={6} className="text-center">
                    {pageSettings.page_main_image ? (
                        <Card.Img
                            // Use the constant here
                            src={`${API_BASE_URL}/${pageSettings.page_main_image}`}
                            alt="Main program page image"
                            className="program-image-small"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                            }}
                        />
                    ) : (
                        <div style={{ height: '200px', width: '70%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '40px' }}>
                            <p className="text-muted">No header image set.</p>
                        </div>
                    )}
                </Col>
            </div>
        );
    };

    if (loadingPrograms) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <div className="program-wrapper" style={{ marginTop: '100px' }}>
            <Container>
                {renderHeader()}
                <div className="my-5">
                    <div className="section-line"></div>
                    <h3 className="sub-heading1">{pageSettings.page_section_heading}</h3>
                </div>
                <div className='boxes'>
                    <Row className="text-center justify-content-center g-4">
                        {programs.length > 0 ? (
                            programs.map((program) => (
                                <Col key={program.id} md={4} className="d-flex">
                                    <div className="program-box p-4">
                                        <h5 className="fw-bold">{program.title.toUpperCase()}</h5>
                                        {program.image ? (
                                            <Card.Img
                                                // Use the constant here
                                                src={`${API_BASE_URL}/${program.image}`}
                                                alt={`Image for ${program.title}`}
                                                className="program-image img-fluid"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/260x200/CCCCCC/000000?text=No+Image";
                                                }}
                                            />
                                        ) : (
                                            <div style={{ height: '260px', width: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                                <p className="text-muted">No image available.</p>
                                            </div>
                                        )}
                                        <p><strong>Location:</strong> {program.location}</p>
                                        <p>{program.description}</p>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <p className="text-center text-muted">No programs found.</p>
                            </Col>
                        )}
                    </Row>
                </div>
            </Container>
            <Footer />
        </div>
    );
};

export default Programs;
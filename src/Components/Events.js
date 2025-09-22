// // import React from 'react';
// // import '../Styles/Events.css';
// // import Footer from './Footer';
// // import event1 from './Images/Adolscent gals hug.jpg';
// // import event2 from './Images/Psychrist.jpg';
// // import event3 from './Images/Sikuma growth.jpg';

// // const Events = () => {
// //   return (
// //     <div id="events" style={{ marginTop: '120px' }}>

// //       {/*Header*/}
// //       <section className="text-center py-5 bg-light">
// //         <div className="container">
// //           <h2 className="fw-bold mb-3">Upcoming Events</h2>
// //           <p className="lead">
// //             Join us in our upcoming outreach programs,
// //              workshops, and community events that create lasting impact.
// //           </p>
// //         </div>
// //       </section>

// //       {/*Event Cards*/}
// //       <section className="container py-5">
// //         <div className="row g-4">

// //           {/* Event 1 */}
// //           <div className="col-md-4">
// //             <div className="card h-100 shadow event-card">
// //               <img src={event1} className="card-img-top" alt="Event 1" />
// //               <div className="card-body">
// //                 <h5 className="card-title fw-bold">Girls Empowerment Camp</h5>
// //                 <p className="card-text"><strong>Date:</strong> August 12, 2025</p>
// //                 <p className="card-text"><strong>Location:</strong> Wakiso District</p>
// //                 <p className="card-text">A 3-day camp filled with mentorship, workshops, and creative sessions for adolescent girls.</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Event 2 */}
// //           <div className="col-md-4">
// //             <div className="card h-100 shadow event-card">
// //               <img src={event2} className="card-img-top" alt="Event 2" />
// //               <div className="card-body">
// //                 <h5 className="card-title fw-bold">Youth Mental Health Forum</h5>
// //                 <p className="card-text"><strong>Date:</strong> September 5, 2025</p>
// //                 <p className="card-text"><strong>Location:</strong> Kampala City</p>
// //                 <p className="card-text">Bringing together youth, psychologists, and educators to discuss mental wellness in schools and homes.</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Event 3 */}
// //           <div className="col-md-4">
// //             <div className="card h-100 shadow event-card">
// //               <img src={event3} className="card-img-top" alt="Event 3" />
// //               <div className="card-body">
// //                 <h5 className="card-title fw-bold">Backyard Farming Expo</h5>
// //                 <p className="card-text"><strong>Date:</strong> October 3, 2025</p>
// //                 <p className="card-text"><strong>Location:</strong> Gulu District</p>
// //                 <p className="card-text">Hands-on demonstrations and training for families on small-scale farming and food security.</p>
// //               </div>
// //             </div>
// //           </div>

// //         </div>
// //       </section>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Events;

// // import React, { useState, useEffect } from 'react';
// // import '../Styles/Events.css'; // Assuming your custom styles are here
// // import Footer from './Footer'; // Assuming Footer component is in the same directory

// // const Events = () => {
// //   const [events, setEvents] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Function to fetch events from the backend
// //   useEffect(() => {
// //     const fetchEvents = async () => {
// //       try {
// //         // Replace with your actual backend URL
// //         const response = await fetch('${API_BASE_URL}/api/v1/events/');
// //         if (!response.ok) {
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }
// //         const data = await response.json();
// //         setEvents(data.events); // Assuming the API returns { events: [...] }
// //       } catch (err) {
// //         console.error("Failed to fetch events:", err);
// //         setError("Failed to load events. Please try again later.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchEvents();
// //   }, []); // Empty dependency array means this runs once on mount

// //   if (loading) {
// //     return (
// //       <div id="events" className="container text-center py-5" style={{ marginTop: '120px' }}>
// //         <p>Loading events...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div id="events" className="container text-center py-5" style={{ marginTop: '120px' }}>
// //         <p className="text-danger">{error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div id="events" style={{ marginTop: '120px' }}>

// //       {/* Header */}
// //       <section className="text-center py-5 bg-light">
// //         <div className="container">
// //           <h2 className="fw-bold mb-3">Upcoming Events</h2>
// //           <p className="lead">
// //             Join us in our upcoming outreach programs, workshops, and community events that create lasting impact.
// //           </p>
// //         </div>
// //       </section>

// //       {/* Event Cards */}
// //       <section className="container py-5">
// //         <div className="row g-4">
// //           {events.length === 0 ? (
// //             <div className="col-12 text-center">
// //               <p>No upcoming events at the moment. Check back soon!</p>
// //             </div>
// //           ) : (
// //             events.map((event) => (
// //               <div key={event.id} className="col-md-4">
// //                 <div className="card h-100 shadow event-card">
// //                   {/* Construct the image URL from the backend path */}
// //                   <img 
// //                     src={`${API_BASE_URL}/${event.image}`} 
// //                     className="card-img-top" 
// //                     alt={event.title} 
// //                     onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/cccccc/ffffff?text=Image+Not+Found'; }}
// //                   />
// //                   <div className="card-body">
// //                     <h5 className="card-title fw-bold">{event.title}</h5>
// //                     <p className="card-text"><strong>Date:</strong> {event.date}</p>
// //                     <p className="card-text"><strong>Location:</strong> {event.location}</p>
// //                     <p className="card-text">{event.description}</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </section>
// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Events;

// import React, { useState, useEffect } from 'react';
// import '../Styles/Events.css'; // Your custom styles for this page
// import Footer from './Footer'; // Assuming Footer component is located here

// /**
//  * Events Component
//  * @description Displays a list of events fetched from the backend.
//  * This is the public-facing page for viewing events.
//  */
// const Events = () => {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Effect hook to fetch events when the component mounts
//     useEffect(() => {
//         const fetchEvents = async () => {
//             try {
//                 // Fetch events from your Flask backend's public endpoint
//                 // Ensure this URL matches where your Flask app is running
//                 const response = await fetch('http://localhost:5000/api/v1/events/');
                
//                 // Check if the network response was successful
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
                
//                 // Parse the JSON response
//                 const data = await response.json();
                
//                 // Set the events state with the 'events' array from the backend response
//                 // Use `data.events || []` to ensure it's an array even if empty or null
//                 setEvents(data.events || []); 
//             } catch (err) {
//                 // Log and set error message if fetching fails
//                 console.error("Failed to fetch events:", err);
//                 setError("Failed to load events. Please try again later.");
//             } finally {
//                 // Set loading to false once fetching is complete (success or failure)
//                 setLoading(false);
//             }
//         };

//         fetchEvents(); // Call the fetch function
//     }, []); // Empty dependency array ensures this effect runs only once on mount

//     // Display loading message while data is being fetched
//     if (loading) {
//         return (
//             <div id="events" className="container text-center py-5" style={{ marginTop: '120px' }}>
//                 <p>Loading events...</p>
//             </div>
//         );
//     }

//     // Display error message if fetching failed
//     if (error) {
//         return (
//             <div id="events" className="container text-center py-5" style={{ marginTop: '120px' }}>
//                 <p className="text-danger">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div id="events" style={{ marginTop: '120px' }}>
//             {/* Header Section */}
//             <section className="text-center py-5 bg-light">
//                 <div className="container">
//                     <h2 className="fw-bold mb-3">Upcoming Events</h2>
//                     <p className="lead">
//                         Join us in our upcoming outreach programs, workshops, and community events that create lasting impact.
//                     </p>
//                 </div>
//             </section>

//             {/* Event Cards Section */}
//             <section className="container py-5">
//                 <div className="row g-4">
//                     {events.length === 0 ? (
//                         // Display message if no events are found
//                         <div className="col-12 text-center">
//                             <p>No upcoming events at the moment. Check back soon!</p>
//                         </div>
//                     ) : (
//                         // Map through the events array and render each event as a card
//                         events.map((event) => (
//                             <div key={event.id} className="col-md-4">
//                                 <div className="card h-100 shadow event-card">
//                                     {/* Construct the image URL from the backend path.
//                                         Assuming backend serves static files from its root. */}
//                                     <img 
//                                         src={`http://localhost:5000/${event.image}`} 
//                                         className="card-img-top" 
//                                         alt={event.title} 
//                                         // Fallback image in case the actual image fails to load
//                                         onError={(e) => { 
//                                             e.target.onerror = null; // Prevent infinite loop if fallback also fails
//                                             e.target.src = 'https://placehold.co/400x250/cccccc/ffffff?text=Image+Not+Found'; 
//                                         }}
//                                     />
//                                     <div className="card-body">
//                                         <h5 className="card-title fw-bold">{event.title}</h5>
//                                         <p className="card-text"><strong>Date:</strong> {event.date}</p>
//                                         <p className="card-text"><strong>Location:</strong> {event.location}</p>
//                                         <p className="card-text">{event.description}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </section>
//             <Footer />
//         </div>
//     );
// };

// export default Events;

// import React, { useState, useEffect } from "react";
// import { Card, Container, Spinner } from "react-bootstrap";
// import { authenticatedFetch } from "../Dashboard/pages/authService";
// import '../Styles/Events.css'
// const EventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await authenticatedFetch("http://localhost:5000/api/v1/events/", { method: "GET" });
//         const data = await res.json();
//         if (res.ok) setEvents(data.events);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   if (loading) return <Spinner animation="border" />;

//   return (
//     <Container className="my-4">
//       <h2 className="mb-4">Upcoming Events</h2>
//       {events.map((ev) => (
//         <Card key={ev.id} className="mb-3">
//           {ev.image && <Card.Img src={`http://localhost:5000/${ev.image}`} alt={ev.title} />}
//           <Card.Body>
//             <Card.Title>{ev.title}</Card.Title>
//             <Card.Text>{ev.description}</Card.Text>
//             <Card.Text><small>{ev.date} | {ev.location}</small></Card.Text>
//           </Card.Body>
//         </Card>
//       ))}
//     </Container>
//   );
// };

// export default EventsPage;

// import React, { useState, useEffect } from "react";
// import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
// import { authenticatedFetch } from "../Dashboard/pages/authService";
// import "./EventsPage.css"; // Import the CSS file

// const EventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await authenticatedFetch("http://localhost:5000/api/v1/events/", { method: "GET" });
//         const data = await res.json();
//         if (res.ok) setEvents(data.events);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   if (loading) return <Spinner animation="border" />;

//   return (
//     <Container className="my-5">
//       <div className="text-center mb-5">
//         <h2 className="fw-bold">Upcoming Events</h2>
//         <p className="text-secondary">
//           Join us in our upcoming events, training workshops, and community events that create lasting impact.
//         </p>
//       </div>
//       <Row xs={1} md={2} lg={3} className="g-4">
//         {events.map((ev) => (
//           <Col key={ev.id}>
//             <Card className="event-card">
//               {ev.image && <Card.Img variant="top" src={`http://localhost:5000/${ev.image}`} alt={ev.title} />}
//               <Card.Body>
//                 <Card.Title>{ev.title}</Card.Title>
//                 {/* Add a subtitle and description section as requested */}
//                 <p className="card-subtitle">Some simple subtitle about the event</p>
//                 <Card.Text className="description">{ev.description}</Card.Text>
//                 <Card.Text className="text-muted"><small>📅 {ev.date} | 📍 {ev.location}</small></Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// };

// export default EventsPage;

// import React, { useState, useEffect } from "react";
// import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
// import { authenticatedFetch } from "../Dashboard/pages/authService"; // Assuming this handles authentication
// import "../Styles/Events.css"; // Import the CSS file

// const EventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loadingEvents, setLoadingEvents] = useState(true);

//   // Hardcoded page title and description as originally requested
//   const pageTitle = "Upcoming Events";
//   const pageDescription = "Join us in our upcoming events, training workshops, and community events that create lasting impact.";

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoadingEvents(true);
//       try {
//         const res = await authenticatedFetch("http://localhost:5000/api/v1/events/", { method: "GET" });
//         const data = await res.json();
//         if (res.ok) setEvents(data.events);
//       } catch (err) {
//         console.error("Error fetching events:", err);
//       } finally {
//         setLoadingEvents(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loadingEvents) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   return (
//     <Container className="my-5">
//       <div className="text-center mb-5 event-page-header">
//         <h2 className="fw-bold">{pageTitle}</h2>
//         <p className="text-secondary">{pageDescription}</p>
//       </div>
//       <Row xs={1} md={2} lg={3} className="g-4">
//         {events.length > 0 ? (
//           events.map((ev) => (
//             <Col key={ev.id} className="d-flex"> {/* d-flex to ensure cards align vertically */}
//               <Card className="event-card">
//                 {ev.image && (
//                   <Card.Img
//                     variant="top"
//                     src={`http://localhost:5000/${ev.image}`}
//                     alt={ev.title}
//                     onError={(e) => {
//                       e.target.onerror = null; // Prevent looping
//                       e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found"; // Fallback placeholder
//                     }}
//                   />
//                 )}
//                 <Card.Body>
//                   <Card.Title>{ev.title}</Card.Title>
//                   {/* Subtitle is dynamically generated from event date and location */}
//                   <p className="card-subtitle">{ev.date} at {ev.location}</p>
//                   <Card.Text className="description">{ev.description}</Card.Text>
//                   <Card.Text className="text-muted mt-auto"> {/* mt-auto pushes this to the bottom */}
//                     <small>Learn More</small>
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col xs={12}>
//             <p className="text-center text-muted">No upcoming events found.</p>
//           </Col>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default EventsPage;

// import React, { useState, useEffect } from "react";
// import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
// import { authenticatedFetch } from "../Dashboard/pages/authService";
// import "../Styles/Events.css";
//  import Footer from './Footer'; 

// const EventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loadingEvents, setLoadingEvents] = useState(true);
//   const [pageTitle, setPageTitle] = useState("Upcoming Events"); // Default state
//   const [pageDescription, setPageDescription] = useState("Join us in our upcoming events, training workshops, and community events that create lasting impact."); // Default state

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoadingEvents(true);
//       try {
//         const res = await authenticatedFetch("http://localhost:5000/api/v1/events/", { method: "GET" });
//         const data = await res.json();
//         if (res.ok) {
//           setEvents(data.events);
//           // Set the page title and description from the backend response
//           if (data.page_settings) {
//             setPageTitle(data.page_settings.page_title);
//             setPageDescription(data.page_settings.page_description);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching events:", err);
//       } finally {
//         setLoadingEvents(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loadingEvents) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </Spinner>
//       </Container>
//     );
//   }

//   return (
//     <div>
//       <Container className="my-5" style={{paddingTop:"150px"}}>
//       <div className="text-center mb-5 event-page-header">
//         <h2 className="fw-bold">{pageTitle}</h2>
//         <p className="text-secondary">{pageDescription}</p>
//       </div>
//       <Row xs={1} md={2} lg={3} className="g-4">
//         {events.length > 0 ? (
//           events.map((ev) => (
//             <Col key={ev.id} className="d-flex">
//               <Card className="event-card">
//                 {ev.image && (
//                   <Card.Img
//                     variant="top"
//                     src={`http://localhost:5000/${ev.image}`}
//                     alt={ev.title}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
//                     }}
//                   />
//                 )}
//                 <Card.Body>
//                   <Card.Title>{ev.title}</Card.Title>
//                   <p className="card-subtitle">{ev.date} at {ev.location}</p>
//                   <Card.Text className="description">{ev.description}</Card.Text>
//                   <Card.Text className="text-muted mt-auto">
//                   </Card.Text>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col xs={12}>
//             <p className="text-center text-muted">No upcoming events found.</p>
//           </Col>
//         )}
//       </Row>
//     </Container>
//     <Footer/>
//   </div>
//   );
// };

// export default EventsPage;

import React, { useState, useEffect } from "react";
import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
import { authenticatedFetch } from "../Dashboard/pages/authService";
import "../Styles/Events.css";
import Footer from './Footer';

const EventsPage = () => {
  // const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_BASE_URL = 'http://127.0.0.1:5000'; 
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [pageTitle, setPageTitle] = useState("Upcoming Events");
  const [pageDescription, setPageDescription] = useState("Join us in our upcoming events, training workshops, and community events that create lasting impact.");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/events/`, { method: "GET" });
        const responseData = await res.json();
        if (res.ok) {
          setEvents(responseData.events);
          if (responseData.page_settings) {
            setPageTitle(responseData.page_settings.page_title);
            setPageDescription(responseData.page_settings.page_description);
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  if (loadingEvents) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div>
      <Container className="my-5" style={{paddingTop:"150px"}}>
      <div className="text-center mb-5 event-page-header">
        <h2 className="fw-bold">{pageTitle}</h2>
        <p className="text-secondary">{pageDescription}</p>
      </div>
      <Row xs={1} md={2} lg={3} className="g-4">
        {events.length > 0 ? (
          events.map((ev) => (
            <Col key={ev.id} className="d-flex">
              <Card className="event-card">
                {ev.image && (
                  <Card.Img
                    variant="top"
                    src={`${API_BASE_URL}/${ev.image}`}
                    alt={ev.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{ev.title}</Card.Title>
                  <p className="card-subtitle">{ev.date} at {ev.location}</p>
                  <Card.Text className="description">{ev.description}</Card.Text>
                  <Card.Text className="text-muted mt-auto">
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <p className="text-center text-muted">No upcoming events found.</p>
          </Col>
        )}
      </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default EventsPage;
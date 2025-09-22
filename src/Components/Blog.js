// import React from 'react';
// import '../Styles/Blog.css';
// import Footer from './Footer';
// import blog1 from './Images/Smiling children.jpg';
// import blog2 from './Images/Farming.jpg';
// import blog3 from './Images/YOUTH.jpg';

// const Blog = () => {
//   return (
//     <div id="blog" style={{ marginTop: '120px' }}>

//       {/* Blog Hero Header */}
//       <section className="text-center py-5 bg-light">
//         <div className="container">
//           <h2 className="fw-bold mb-3">Our Stories & Insights</h2>
//           <p className="lead">
//             Dive into real-life stories, updates, and reflections from
//              our programs and the lives we touch.
//           </p>
//         </div>
//       </section>

//       {/* Blog Cards Section  */}
//       <section className="container py-5">
//         <div className="row g-4">

//           {/* Blog Post 1 */}
//           <div className="col-md-4">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog1} className="card-img-top" alt="Blog 1" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">Empowering Girls Through Life Skills</h5>
//                 <p className="card-text">
//                   Discover how our life skills workshops are equipping young girls with confidence, leadership, and self-reliance.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Blog Post 2 */}
//           <div className="col-md-4">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog2} className="card-img-top" alt="Blog 2" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">From Backyard Gardens to Full Plates</h5>
//                 <p className="card-text">
//                   A look into how our community farming project is feeding families and fostering sustainability in local homes.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Blog Post 3 */}
//           <div className="col-md-4">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog3} className="card-img-top" alt="Blog 3" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">Voices of Change: Youth Testimonials</h5>
//                 <p className="card-text">
//                   Hear directly from the youth whose lives have been transformed through mentorship, coaching, and safe spaces.
//                 </p>

//               </div>
//             </div>
//           </div>

//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// };

// export default Blog;

// import React from 'react';
// import '../Styles/Blog.css';
// import Footer from './Footer';
// import blog1 from './Images/Mentorship and coaching.jpg';
// import blog2 from './Images/Psychrist.jpg';
// import blog3 from './Images/Mentoring kids.jpg';
// import blog4 from './Images/youth joint.jpg';
// import blog5 from './Images/woman farming.jpg';
// import blog6 from './Images/Two Babies smiling.jpg';
// import blog7 from './Images/Gal on mic.jpg';
// import blog8 from './Images/Tree.jpg'; // New tree planting image

// const Blog = () => {
//   return (
//     <div className="blog-wrapper">

//       <section className="container py-5">
//         <div className="card shadow text-center p-4 bg-light">
//           <h1 className="text-4xl font-extrabold text-blue-600 mb-3" style={{ padding: '0.5rem 0' }}>Planned Activities </h1>
//           <div className="card-body">
//             <h2 className="fw-bold mb-3">Action Plan Highlights</h2>
//             <p className="lead">
//               Our comprehensive activities focus on empowering children, youth, women and communities through education, mentorship, advocacy and sustainability.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="container py-5">
//         <div className="row g-4">

//           {/* Empowerment & Mentorship */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog1} className="card-img-top" alt="Empowerment" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Sparkles" style={{ marginRight: '8px' }}>✨</span>
//                   Empowerment & Mentorship
//                 </h5>
//                 <p>
//                   We aim to empower children, adolescents and youth through the identification of vulnerable families, collaborative activities with children and caregivers and the establishment of public libraries. Our mentorship and coaching sessions are complemented by holiday programs, internship opportunities, capacity-building initiatives and talent development. We also provide child protection services, promote child-led research, offer life skills education, champion inclusive activities, provide career guidance, sensitize on reproductive health rights and organize exchange programs to broaden young people's exposure and growth.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Psychosocial Support */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog2} className="card-img-top" alt="Psychosocial Support" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Heart" style={{ marginRight: '8px' }}>❤️</span>
//                   Psychosocial Support
//                 </h5>
//                 <p>
//                   Our psychosocial support program enhances emotional well-being through school-based educative programs and community outreach. We offer counseling, psychosocial therapy and wellness initiatives to support mental and emotional health. The program strengthens family and community ties, facilitates peer support groups and promotes awareness around mental health and reproductive health rights.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Advocacy */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog3} className="card-img-top" alt="Advocacy" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Megaphone" style={{ marginRight: '8px' }}>📣</span>
//                   Advocacy for Children
//                 </h5>
//                 <p>
//                   We engage in child advocacy by mobilizing resources through grants, crafts and training programs. Our efforts include co-design workshops with stakeholders to ensure children’s needs are prioritized. We conduct research on children’s rights and lead awareness campaigns to educate communities and institutions on the importance of upholding these rights.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Community Engagement */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog4} className="card-img-top" alt="Community Engagement" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Users" style={{ marginRight: '8px' }}>👥</span>
//                   Community Engagement
//                 </h5>
//                 <p>
//                   To foster sustainable community engagement, we focus on partnership mapping, stakeholders’ analysis and community resilience building. We support knowledge management, promote learning and networking opportunities and facilitate the formation of project clusters. Additionally, we use platforms such as radio and TV talk shows, skits and community meetings to strengthen outreach and engagement.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Environmental & Social Issues */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog5} className="card-img-top" alt="Environmental" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Leaf" style={{ marginRight: '8px' }}>🍃</span>
//                   Environmental & Social Issues
//                 </h5>
//                 <p>
//                   Our environmental and social initiatives empower youth and communities with practical skills. These include hand skills training, sanitation and hygiene education, backyard gardening and tree planting. We promote health awareness, community sensitization and youth leadership. We also integrate advocacy on child rights and the environment, support cognitive development and promote eco-friendly practices like recycling and demonstration farms.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Growth & Life Choices */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog6} className="card-img-top" alt="Child Growth" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Sprout" style={{ marginRight: '8px' }}>🌱</span>
//                   Growth & Life Choices
//                 </h5>
//                 <p>
//                   We support children's growth and life choices through targeted programs such as research, welfare assistance, play therapy and interactive games. Early childhood education is a key focus, supported by nutrition initiatives and training programs for parents. Our child-centered approach ensures every child receives the foundation needed for lifelong development and informed decision-making.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* 🌳 Tree Planting Activity */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card">
//               <img src={blog8} className="card-img-top" alt="Tree Planting" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Tree" style={{ marginRight: '8px' }}>🌳</span>
//                   Tree Planting Initiatives
//                 </h5>
//                 <p>
//                   Our tree planting program is a hands-on environmental action aimed at combating climate change and promoting ecological awareness among youth and communities. Through organized tree planting drives in schools, local centers and open community spaces, we encourage responsibility toward nature. The initiative nurtures environmental stewardship, enhances green cover, and integrates sustainability education into community development efforts.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Organizational Development */}
//           <div className="col-md-6">
//             <div className="card h-100 shadow blog-card" style={{ maxWidth: '540px', width: '100%' }}>
//               <img src={blog7} className="card-img-top" alt="Organizational Development" />
//               <div className="card-body">
//                 <h5 className="card-title fw-bold">
//                   <span role="img" aria-label="Briefcase" style={{ marginRight: '8px' }}>💼</span>
//                   Organizational Development
//                 </h5>
//                 <p>
//                   To maintain a strong foundation, we focus on developing our organization through strategic staff recruitment, procurement of necessary office items and conducting regular internal meetings. We ensure legal compliance through organizational registration, enhance visibility via profiling and maintain program effectiveness through systematic monitoring and evaluation.
//                 </p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Blog;

import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Row, Col } from "react-bootstrap";
import { authenticatedFetch } from "../Dashboard/pages/authService";
import '../Styles/Blog.css';
import Footer from './Footer';

const Blog = () => {
    const API_BASE_URL = 'http://127.0.0.1:5000';
    // const API_BASE_URL = process.env.REACT_APP_API_URL;
    const [blogPosts, setBlogPosts] = useState([]);
    const [loadingBlogPosts, setLoadingBlogPosts] = useState(true);
    const [pageTitle, setPageTitle] = useState("Our Blog Posts");
    const [pageDescription, setPageDescription] = useState("Dive into our latest insights, stories, and updates.");

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setLoadingBlogPosts(true);
            try {
                const res = await authenticatedFetch(`${API_BASE_URL}/api/v1/blogs/`, { method: "GET" });
                const responseData = await res.json();
                if (res.ok) {
                    setBlogPosts(responseData.blogs);
                    if (responseData.page_settings) {
                        setPageTitle(responseData.page_settings.page_title);
                        setPageDescription(responseData.page_settings.page_description);
                    }
                }
            } catch (err) {
                console.error("Error fetching blog posts:", err);
            } finally {
                setLoadingBlogPosts(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loadingBlogPosts) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <div className="blog-wrapper">
            <section className="container py-5">
                <div className="card shadow text-center p-4 bg-light">
                    <h1 className="text-4xl font-extrabold text-blue-600 mb-3" style={{ padding: '0.5rem 0' }}>{pageTitle}</h1>
                    <div className="card-body">
                        <h2 className="fw-bold mb-3">{pageTitle}</h2>
                        <p className="lead">{pageDescription}</p>
                    </div>
                </div>
            </section>

            <section className="container py-5">
                <Row xs={1} sm={1} md={2} className="g-4">
                    {blogPosts.length > 0 ? (
                        blogPosts.map((post) => (
                            <Col key={post.id} className="d-flex">
                                <Card className="h-100 shadow blog-card">
                                    {post.image && (
                                        <Card.Img
                                            variant="top"
                                            src={`${API_BASE_URL}/${post.image}`}
                                            alt={post.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
                                            }}
                                        />
                                    )}
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fw-bold">
                                            {post.title}
                                        </Card.Title>
                                        <Card.Text className="flex-grow-1">
                                            {post.description}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col xs={12}>
                            <p className="text-center text-muted">No blog posts found.</p>
                        </Col>
                    )}
                </Row>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
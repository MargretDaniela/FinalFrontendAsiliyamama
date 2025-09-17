// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import kids1 from './Images/Kids 1.jpeg';
// import kids2 from './Images/First family.jpg';
// import kids3 from './Images/Kids playing.jpeg';
// import '../Styles/Home.css';
// import AboutUs from './AboutUs';
// import Services from './Services';
// import Impact from './Impact';
// import Footer from './Footer';
// import { useScrollAnimation } from './useScrollAnimation';  

// const images = [kids1, kids2, kids3];

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Animation hooks for main headline and join button
//   const [headlineRef, headlineVisible] = useScrollAnimation();
//   const [buttonRef, buttonVisible] = useScrollAnimation();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prev => (prev + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div>
//       <div className="position-relative w-80 vh-100 overflow-hidden mt-5 pt-4">
//         <img
//           src={images[currentIndex]}
//           alt={`background-${currentIndex + 1}`}
//           className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
//         />
//         <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>

//         {/* Headline sliding from left */}
//         <div
//           ref={headlineRef}
//           className={`position-absolute top-50 start-50 translate-middle text-white text-center p-4 z-2 slide-left ${
//             headlineVisible ? 'visible' : ''
//           }`}
//         >
//           <h2>
//             SUPPORT <span className="text-danger fw-bold fst-italic">YOUNG LIVES</span>
//           </h2>
//           <p className="fs-5">
//             Empowers youth via mentorship, protection <br />
//             skills, health support, advocacy and <br />
//             community engagement <br />
//             for holistic growth
//           </p>
//         </div>

//         {/* Join Button sliding from right */}
//         <div
//           ref={buttonRef}
//           className={`position-absolute bottom-0 end-0 m-4 z-2 slide-right ${
//             buttonVisible ? 'visible' : ''
//           }`}
//         >
//           <Link to="/join" className="btn btn-danger fw-bold shadow">
//             JOIN US
//           </Link>
//         </div>
//       </div>

//       {/* Other sections slide up from left or right */}
//       <SectionWrapper direction="left">
//         <AboutUs />
//       </SectionWrapper>
//       <SectionWrapper direction="right" delay={150}>
//         <Impact />
//       </SectionWrapper>
//       <SectionWrapper direction="left" delay={300}>
//         <Services />
//       </SectionWrapper>

//       <Footer />
//     </div>
//   );
// };

// // Helper component to wrap sections with slide animations
// const SectionWrapper = ({ direction, delay = 0, children }) => {
//   const [ref, visible] = useScrollAnimation();

//   return (
//     <div
//       ref={ref}
//       style={{ transitionDelay: `${delay}ms` }}
//       className={`${direction === 'left' ? 'slide-left' : 'slide-right'} ${visible ? 'visible' : ''} mt-5`}
//     >
//       {children}
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useEffect, useCallback } from 'react'; // <-- useCallback added here
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import kids1 from './Images/Kids 1.jpeg';
// import kids2 from './Images/First family.jpg';
// import kids3 from './Images/Kids playing.jpeg';
// import '../Styles/Home.css';
// import AboutUs from './AboutUs';
// import Services from './Services';
// import Impact from './Impact';
// import Footer from './Footer';
// import { useScrollAnimation } from './useScrollAnimation';

// const images = [kids1, kids2, kids3];
// const API_BASE_URL = 'http://127.0.0.1:5000';

// const Home = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [homepageData, setHomepageData] = useState({
//         hero_headline: '',
//         hero_subheadline: '',
//         hero_headline_emphasis_word: '', // <-- Holds the word to emphasize from the dashboard
//         join_button_text: '',
//         join_button_link: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Function to fetch data, made into a useCallback to prevent re-creation
//     const fetchHomepageData = useCallback(async () => {
//         setLoading(true);
//         setError(null); // Clear previous errors
//         try {
//             const response = await axios.get(`${API_BASE_URL}/api/home/`);
//             setHomepageData(response.data);
//         } catch (err) {
//             console.error('Error fetching homepage content:', err);
//             setError('Failed to load homepage content. Please try again later.');
//         } finally {
//             setLoading(false);
//         }
//     }, []); // No dependencies for this specific fetch function, as it's meant to be called on demand

//     // Initial fetch when the component mounts
//     useEffect(() => {
//         fetchHomepageData();
//     }, [fetchHomepageData]); // Dependency ensures it runs on mount and if fetchHomepageData changes (though it won't here)

//     // --- IMPORTANT CHANGE HERE ---
//     // Listen for localStorage changes to re-fetch homepage data
//     useEffect(() => {
//         const handleStorageChange = (event) => {
//             // Check if the change is for our specific key 'lastHomepageUpdateTimestamp'
//             if (event.key === 'lastHomepageUpdateTimestamp' && event.newValue !== event.oldValue) {
//                 console.log('Homepage content updated via localStorage event. Re-fetching data...');
//                 fetchHomepageData(); // Re-fetch the data when the timestamp changes
//             }
//         };

//         window.addEventListener('storage', handleStorageChange);

//         // Cleanup the event listener when the component unmounts
//         return () => {
//             window.removeEventListener('storage', handleStorageChange);
//         };
//     }, [fetchHomepageData]); // Add fetchHomepageData to dependencies

//     // Image carousel effect
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentIndex(prev => (prev + 1) % images.length);
//         }, 3000);
//         return () => clearInterval(interval);
//     }, []);

//     if (loading) {
//         return <div className="text-center mt-5">Loading...</div>;
//     }

//     if (error) {
//         return <div className="text-center mt-5 text-danger">{error}</div>;
//     }

//     // Function to dynamically render the headline with a styled span
//     const renderHeadline = () => {
//         const { hero_headline, hero_headline_emphasis_word } = homepageData;

//         // If no headline or no emphasis word is provided, just return the plain headline.
//         if (!hero_headline) {
//             return '';
//         }

//         const trimmedEmphasisWord = hero_headline_emphasis_word ? hero_headline_emphasis_word.trim() : '';

//         if (!trimmedEmphasisWord) {
//             return hero_headline; // If no word to emphasize, return the headline as is
//         }

//         // Escape special characters in the emphasis word for use in RegExp constructor
//         const escapedEmphasisWord = trimmedEmphasisWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//         // Create a RegExp for global (g) and case-insensitive (i) matching
//         const regex = new RegExp(`(${escapedEmphasisWord})`, 'gi');

//         const parts = hero_headline.split(regex);

//         return (
//             <>
//                 {parts.map((part, index) => {
//                     // Check if the current part matches the emphasized word (case-insensitive)
//                     if (part.toLowerCase() === trimmedEmphasisWord.toLowerCase()) {
//                         return (
//                             <span
//                                 key={index}
//                                 className="hero-headline-emphasis"
//                                 style={{ color: '#800000', fontStyle: 'italic' }} // Inline CSS for maroon & italic
//                             >
//                                 {part}
//                             </span>
//                         );
//                     }
//                     return part; // Return non-matching parts as plain text
//                 })}
//             </>
//         );
//     };

//     return (
//         <div>
//             <div className="position-relative w-100 vh-100 overflow-hidden mt-5 pt-4">
//                 <img
//                     src={images[currentIndex]}
//                     alt={`background-${currentIndex + 1}`}
//                     className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
//                 />
//                 <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>

//                 <div
//                     className={`position-absolute top-50 start-50 translate-middle text-white text-center p-4 z-2`}
//                 >
//                     <h2>{renderHeadline()}</h2>
//                     <p className="fs-5 hero-subheadline">{homepageData.hero_subheadline}</p>
//                 </div>

//                 <div
//                     className={`position-absolute bottom-0 end-0 m-4 z-2`}
//                 >
//                     <Link to={homepageData.join_button_link} className="btn btn-danger fw-bold shadow">
//                         {homepageData.join_button_text}
//                     </Link>
//                 </div>
//             </div>

//             <SectionWrapper direction="left">
//                 <AboutUs />
//             </SectionWrapper>
//             <SectionWrapper direction="right" delay={150}>
//                 <Impact />
//             </SectionWrapper>
//             <SectionWrapper direction="left" delay={300}>
//                 <Services />
//             </SectionWrapper>

//             <Footer />
//         </div>
//     );
// };

// const SectionWrapper = ({ direction, delay = 0, children }) => {
//     const [ref, visible] = useScrollAnimation();

//     return (
//         <div
//             ref={ref}
//             style={{ transitionDelay: `${delay}ms` }}
//             className={`${direction === 'left' ? 'slide-left' : 'slide-right'} ${visible ? 'visible' : ''} mt-5`}
//         >
//             {children}
//         </div>
//     );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, Spinner } from 'react-bootstrap';
import '../Styles/Home.css';
import AboutUs from './AboutUs';
import Services from './Services';
import Impact from './Impact';
import Footer from './Footer';
import { useScrollAnimation } from './useScrollAnimation'; // Assuming this hook is correctly defined elsewhere

// const API_BASE_URL = 'http://localhost:5000'; // Flask backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL;
const Home = () => {
    const [homeData, setHomeData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Animation hooks for main headline and join button
    const [headlineRef] = useScrollAnimation();
    const [buttonRef] = useScrollAnimation();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/home/`);
                setHomeData(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Home page content is not yet available. Please add content through the dashboard.');
                } else {
                    setError('Failed to load home page content. Please try again later.');
                }
                console.error('Error fetching home data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    useEffect(() => {
        // Only set up interval if homeData is loaded and there are images
        if (homeData && homeData.images && homeData.images.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % homeData.images.length);
            }, 2000); // Set to 2000 milliseconds (2 seconds) for sliding
            return () => clearInterval(interval);
        }
    }, [homeData]); // Re-run effect if homeData changes

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center text-center" style={{ height: '100vh' }}>
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }
    
    // If no data is available after loading, show a message
    if (!homeData || !homeData.headline) {
        return (
            <div className="d-flex justify-content-center align-items-center text-center" style={{ height: '100vh' }}>
                <Alert variant="info">Content will be added soon. Please configure the home page in the dashboard.</Alert>
            </div>
        );
    }

    // Determine current image, with a robust fallback
    const currentImage = homeData.images && homeData.images.length > 0
        ? homeData.images[currentIndex].image_url
        : 'https://via.placeholder.com/1920x1080.png?text=No+Image+Found'; // Fallback image

    return (
        <div>
            <div className="position-relative w-100 vh-100 overflow-hidden mt-5 pt-4">
                <img
                    src={currentImage}
                    alt="Background"
                    // Add a unique key to the image to force re-render on change, helping with transitions
                    key={currentImage} 
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    // Explicitly setting a low z-index for the image
                />
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                   // Explicitly setting z-index for the dark overlay
                ></div>

                {/* Headline sliding from left - uses z-2 for layering */}
                <div
                    ref={headlineRef}
                    className={`position-absolute top-50 start-50 translate-middle text-white text-center p-4 z-2`}
                >
                    <h2>
                        {homeData.headline.split(' ').map((word, index) => (
                            word.toLowerCase() === 'young' || word.toLowerCase() === 'lives' ? (
                                <span key={index} className="text-danger fw-bold fst-italic hero-headline-emphasis">{word} </span>
                            ) : (
                                <span key={index}>{word} </span>
                            )
                        ))}
                    </h2>
                    <p className="fs-5 hero-subheadline">{homeData.description}</p>
                </div>

                {/* Join Button sliding from right - uses z-2 for layering */}
                <div
                    ref={buttonRef}
                    className={`position-absolute bottom-0 end-0 m-4 z-2`}
                >
                    <Link to={homeData.join_button_url} className="btn btn-danger fw-bold shadow">
                        {homeData.join_button_text}
                    </Link>
                </div>
            </div>

            {/* Other sections slide up from left or right */}
            <SectionWrapper direction="left">
                <AboutUs />
            </SectionWrapper>
            <SectionWrapper direction="right" delay={150}>
                <Impact />
            </SectionWrapper>
            <SectionWrapper direction="left" delay={300}>
                <Services />
            </SectionWrapper>

            <Footer />
        </div>
    );
};

// Helper component to wrap sections with slide animations
const SectionWrapper = ({ direction, delay = 0, children }) => {
    const [ref, visible] = useScrollAnimation();

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`${direction === 'left' ? 'slide-left' : 'slide-right'} ${visible ? 'visible' : ''} mt-5`}
        >
            {children}
        </div>
    );
};

export default Home;

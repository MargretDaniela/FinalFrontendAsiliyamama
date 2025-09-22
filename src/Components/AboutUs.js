import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap'; // <--- Added Alert import here
import '../Styles/AboutUs.css';

const API_BASE_URL = 'http://127.0.0.1:5000'; 
// const API_BASE_URL = process.env.REACT_APP_API_URL;

const AboutUs = () => {
    const { hash } = useLocation();
    const [aboutUsData, setAboutUsData] = useState({
        our_story: 'Loading story...',
        vision_title: 'Loading Vision...',
        vision_content: 'Loading vision content...',
        mission_title: 'Loading Mission...',
        mission_content: 'Loading mission content...',
        goals_title: 'Loading Goals...',
        goals_list: [] // Initialize as an empty array
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch About Us data, memoized with useCallback
    const fetchAboutUsData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/aboutus/`);
            setAboutUsData(response.data); // Backend should return the data directly
        } catch (err) {
            console.error('Error fetching About Us content:', err);
            setError('Failed to load About Us content. Please ensure your backend is running and configured correctly.');
            // Set default fallback data if fetch fails
            setAboutUsData({
                our_story: 'We nurture children and empower the youth through care, skills, health support, advocacy and inclusive, community-led programs and foster lasting change and local collaboration.',
                vision_title: 'VISION',
                vision_content: 'Empowering young generations and caregivers to lead self-sustaining, impactful, resilient, healthy and purpose-driven lives that create an impact by having dreamers.',
                mission_title: 'MISSION',
                mission_content: 'Engage communities through child-centered approaches to support child\'s survival, growth and transformative development that can create a bright future.',
                goals_title: 'GOALS',
                goals_list: [
                    'Empower young lives to thrive.',
                    'Support children and youth survival.',
                    'Promote sustainable youth and child development.',
                    'Engage youth with hands-on skills.'
                ]
            });
        } finally {
            setLoading(false);
        }
    }, []); // <--- Removed API_BASE_URL from dependencies here

    // Initial fetch on component mount
    useEffect(() => {
        fetchAboutUsData();
    }, [fetchAboutUsData]);

    // Listen for localStorage changes to re-fetch About Us data
    useEffect(() => {
        const handleStorageChange = (event) => {
            // Check if the change is for our specific key 'lastAboutUsUpdateTimestamp'
            if (event.key === 'lastAboutUsUpdateTimestamp' && event.newValue !== event.oldValue) {
                console.log('About Us content updated via localStorage event. Re-fetching data...');
                fetchAboutUsData(); // Re-fetch the data when the timestamp changes
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchAboutUsData]);

    // Scroll to section based on hash in URL
    useEffect(() => {
        if (hash === '#story') {
            const el = document.getElementById('story');
            if (el) {
                const yOffset = -30;
                const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                setTimeout(() => {
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    if (loading) {
        return <div className="text-center mt-5">Loading About Us content...</div>;
    }

    if (error) {
        // If there's an error, display the error message but still show fallback content below
        return (
            <div className="text-center mt-5">
                <Alert variant="danger">{error}</Alert>
                {/* Fallback content will be rendered below if 'aboutUsData' has values */}
            </div>
        );
    }

    return (
        <div className="about-us-wrapper text-center" style={{ marginTop: '140px' }}>
            <h2
                className="fw-bold section-title"
                id="story"
            >
                OUR STORY
            </h2>

            <div
                className="bg-white p-7 mx-auto rounded shadow-sm"
                style={{ maxWidth: '900px' }}
            >
                <p>
                    {aboutUsData.our_story}
                </p>
            </div>

            <div className="vision-mission-goals">
                {/* Vision */}
                <div
                    className="border border-danger rounded-5 p-4 shadow hover-box d-flex flex-column justify-content-between"
                    style={{ width: '240px', height: '270px' }}
                >
                    <div>
                        <h4 className="fw-bold">{aboutUsData.vision_title}</h4>
                        <p className="mb-3">
                            {aboutUsData.vision_content}
                        </p>
                    </div>
                    {/* Note: These links still point to static pages unless you create dynamic routes for them too */}
                    <a
                        href="/vision#vision"
                        className="btn btn-danger mt-auto"
                        style={{ fontSize: '0.75rem', marginLeft: '40px', marginRight: '40px' }}
                    >
                        READ MORE
                    </a>
                </div>

                {/* Mission */}
                <div
                    className="border border-danger rounded-5 p-4 shadow hover-box d-flex flex-column justify-content-between"
                    style={{ width: '240px', height: '270px' }}
                >
                    <div>
                        <h4 className="fw-bold">{aboutUsData.mission_title}</h4>
                        <p className="mb-3">
                            {aboutUsData.mission_content}
                        </p>
                    </div>
                    <a
                        href="/mission#mission"
                        className="btn btn-danger"
                        style={{ fontSize: '0.75rem', marginTop: '-15px', marginLeft: '40px', marginRight: '40px' }}
                    >
                        READ MORE
                    </a>
                </div>

                {/* Goals */}
                <div
                    className="border border-danger rounded-5 p-2 shadow hover-box d-flex flex-column justify-content-between"
                    style={{ width: '240px', height: '270px' }}
                >
                    <div>
                        <h4 className="fw-bold">{aboutUsData.goals_title}</h4>
                        <ul className="text-start ps-3 mb-3">
                            {Array.isArray(aboutUsData.goals_list) && aboutUsData.goals_list.map((goal, index) => (
                                <li key={index}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                    <a
                        href="/goals#goals"
                        className="btn btn-danger mt-auto pt-1.5"
                        style={{ fontSize: '0.75rem', marginLeft: '58px', marginRight: '58px' }}
                    >
                        READ MORE
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

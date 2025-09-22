import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Sidebar from './components/SideBar';
import AdminLogin from './components/Login';
import CreateAdmin from './pages/CreateAdmin';
import ManageAdmins from './pages/ManageAdmins';
import Programs from './pages/Programs';
import Events from './pages/Events';
import ProductsDashboard from './Content/What we Offer/ProductsDashboard';
import WorkshopsDashboard from './Content/What we Offer/WorskshopDashboard';
import DashboardTeam from '../Dashboard/Content/WhoWeAre/TeamDashboard'; // 🌟 Correct import for the new DashboardTeam component
import Enrollments from './pages/Enrollments';
import Volunteers from './pages/volunteerPage';
import Beneficiaries from './pages/Beneficiaries';
import Donations from './pages/Donations';
import Dashboard from './pages/DashboardOverview';
import ContactMessage from './pages/ContactMessage';
import ResetPasswordPage from './components/ResetPassword';
import AdminProfileSettingsPage from './pages/AdminProfileSettingsPage';
import PagesTopBar from './Content/PagesTopbar';
import HomePage from './Content/LandingPage/HomePage';
import AdminAboutUsPage from './Content/WhoWeAre/AboutUsPage';
import AdminImpactPage from './Content/Latest/ImpactPage';
import BlogDashboard from './Content/Latest/BlogDashboard';
import ServicesDashboard from './Content/What we Offer/ServicesDashboard';
import MissionDashboard from './Content/WhoWeAre/MissionDashboard';
import GoalsDashboard from './Content/Aim/GoalsDashboard';
import VisionDashboard from './Content/Aim/VisionDashboard';
import FooterDashboard from './Content/LandingPage/FooterDashboard';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const DashboardApp = ({ onHomepageUpdate }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [currentPage, setCurrentPage] = useState('dashboard');

    const location = useLocation();
    // const API_BASE_URL = process.env.REACT_APP_API_URL;

    const API_BASE_URL = 'http://127.0.0.1:5000';

    const fetchUserProfileDetails = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            handleLogout();
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = response.data;
            setFirstName(userData.first_name || '');
            setLastName(userData.last_name || '');
            setUserType(userData.user_type || userType);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            handleLogout();
        }
    }, [API_BASE_URL, userType]);

    const handleProfileUpdate = useCallback((newFirstName = null, newLastName = null) => {
        if (newFirstName) setFirstName(newFirstName);
        if (newLastName) setLastName(newLastName);
    }, []);

    useEffect(() => {
        if (location.pathname === '/reset-password') {
            setIsLoggedIn(false);
            setUserType(null);
        }
    }, [location.pathname]);

    const handleLogin = (type) => {
        setIsLoggedIn(true);
        setUserType(type);
        fetchUserProfileDetails();
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserType(null);
        setFirstName('');
        setLastName('');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
        setCurrentPage('dashboard');
    };

    const userInitials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
    const userFullName = `${firstName} ${lastName}`.trim();

    const renderDashboardContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />;
            case 'create-admin':
                return <CreateAdmin />;
            case 'manage-admins':
                return <ManageAdmins />;
            case 'programs':
                return <Programs userType={userType} />;
            case 'events':
                return <Events userType={userType} />;
            case 'products':
                return <ProductsDashboard userType={userType} />;
            case 'workshops':
                return <WorkshopsDashboard userType={userType} />;
            case 'our_team': // 🌟 New case for the Our Team dashboard
                return <DashboardTeam userType={userType} />;
            case 'enrollments':
                return <Enrollments userType={userType} />;
            case 'volunteers':
                return <Volunteers userType={userType} />;
            case 'services':
                return <ServicesDashboard userType={userType} />;
            case 'beneficiaries':
                return <Beneficiaries userType={userType} />;
            case 'donations':
                return <Donations userType={userType} />;
            case 'pages':
            case 'homepage':
                return <HomePage userType={userType} onUpdate={onHomepageUpdate} />;
            case 'about-us':
                return <AdminAboutUsPage />;
            case 'impact':
                return <AdminImpactPage />;
            case 'blog':
                return <BlogDashboard userType={userType} />;
            case 'goals':
                return <GoalsDashboard userType={userType} /> ;
            case 'contact-messages':
                return <ContactMessage userType={userType} />;
            case 'footer':
                return <FooterDashboard userType={userType} /> ;
            case 'vision':
                return <VisionDashboard userType={userType} />;
            case 'our_mission':
                return <MissionDashboard userType={userType} />;
            case 'profile-settings':
                return (
                    <AdminProfileSettingsPage
                        onProfileUpdate={handleProfileUpdate}
                        userName={userFullName}
                        userRole={userType}
                    />
                );
            case 'navbar':
            case 'contact':
            case 'donate':
            case 'volunteer':
                return <h1 className="mt-3 text-2xl font-bold text-gray-800">{currentPage.replace(/[-_]/g, ' ').toUpperCase()} Content Management Coming Soon!</h1>;
            default:
                return <h1 className="mt-3 text-2xl font-bold text-gray-800">Page Not Found or Not Mapped</h1>;
        }
    };

    if (location.pathname === '/reset-password') {
        return <ResetPasswordPage />;
    }

    if (!isLoggedIn) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    const showPagesTopBar = currentPage === 'pages' || currentPage === 'homepage' || currentPage === 'about-us' || currentPage === 'impact' || currentPage === 'navbar' || currentPage === 'footer' || currentPage === 'our_team' || currentPage === 'our_mission' || currentPage === 'services' || currentPage === 'workshops' || currentPage === 'products' || currentPage === 'blog' || currentPage === 'contact' || currentPage === 'goals' || currentPage === 'volunteer';
    const contentPaddingTop = showPagesTopBar ? '60px' : '20px';

    return (
        <Container fluid className="p-0">
            <Row className="flex-nowrap" style={{ height: '100vh' }}>
                <Col
                    md={3}
                    lg={2}
                    className="p-0 d-none d-md-block"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        zIndex: 99999,
                        backgroundColor: '#800000',
                        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div className="p-3 d-flex flex-column align-items-center" style={{ backgroundColor: '#800000', color: 'white', flexShrink: 0 }}>
                        {isLoggedIn ? (
                            <>
                                {(firstName || lastName) ? (
                                    <>
                                        <div
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                fontSize: '1.5rem',
                                                backgroundColor: '#FFFFFF',
                                                color: '#800000',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                                zIndex: "1030"
                                            }}
                                        >
                                            {userInitials}
                                        </div>
                                        <span
                                            className="text-white text-center"
                                            style={{ fontWeight: 500, fontSize: '1rem', marginBottom: '4px', zIndex: "1030" }}
                                        >
                                            {userFullName}
                                        </span>
                                    </>
                                ) : (
                                    <div style={{ color: 'white', fontSize: '0.9rem', textAlign: 'center', padding: '10px' }}>
                                        Loading profile data...
                                    </div>
                                )}
                                {userType && (
                                    <span className="text-white text-center" style={{ fontWeight: '300', fontSize: '0.8rem', zIndex: "1030" }}>
                                        Logged in as: <span style={{ fontWeight: '300', zIndex: "1030" }}>{userType}</span>
                                    </span>
                                )}
                            </>
                        ) : (
                            <div style={{ color: 'white', fontSize: '0.9rem', textAlign: 'center', padding: '10px' }}>
                                Not logged in.
                            </div>
                        )}
                    </div>

                    <div style={{ flexGrow: 1, overflowY: 'auto', paddingTop: '10px' }}>
                        <Sidebar
                            userType={userType}
                            onLogout={handleLogout}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </Col>

                <Col
                    md={{ span: 9, offset: 3 }}
                    lg={{ span: 10, offset: 2 }}
                    className="px-md-4"
                    style={{ paddingTop: contentPaddingTop, zIndex: 1 }}
                >
                    {showPagesTopBar && <PagesTopBar setCurrentPage={setCurrentPage} currentPage={currentPage} />}
                    {renderDashboardContent()}
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardApp;
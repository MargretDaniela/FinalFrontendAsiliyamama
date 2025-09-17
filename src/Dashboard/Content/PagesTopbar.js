// import React, { useState } from 'react';
// import { Nav, NavDropdown } from 'react-bootstrap';
// import {
//     FaRegFileAlt,
//     FaUsers,
//     FaTools,
//     FaBullhorn,
//     FaHandshake,
//     FaFileImage,
//     FaRunning,
//     FaCalendarAlt,
//     FaBlog,
//     FaUser,
//     FaHandHoldingUsd,
//     FaHandsHelping,
//     FaEnvelope,
//     FaRegLightbulb,
//     FaSitemap,
//     FaBookOpen,
// } from 'react-icons/fa';

// import './PagesTopbar.css';

// const PagesTopBar = ({ setCurrentPage }) => {
//     const [openDropdown, setOpenDropdown] = useState(null);

//     const handleNavLinkClick = (page) => {
//         setCurrentPage(page);
//     };

//     const handleDropdownHover = (dropdownId) => {
//         setOpenDropdown(dropdownId);
//     };

//     const handleDropdownLeave = () => {
//         setOpenDropdown(null);
//     };

//     const navLinkStyle = {
//         color: '#fff',
//         backgroundColor: '#800000',
//         fontWeight: 'bold',
//         padding: '10px 15px',
//         cursor: 'pointer',
//         transition: 'background-color 0.2s',
//     };

//     const dropdownItemStyle = {
//         color: '#333',
//         backgroundColor: '#fff',
//         transition: 'background-color 0.2s',
//     };

//     return (
//         <Nav
//             id='pages-top-bar'
//             className="justify-content-center"
//             style={{
//                 backgroundColor: '#800000',
//                 height: '60px',
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//             }}
//         >
//             {/* Landing Page Dropdown */}
//             <NavDropdown
//                 title={
//                     <span className="dropdown-title" style={navLinkStyle}>
//                         <FaRegFileAlt className="me-2" /> Landing Page
//                     </span>
//                 }
//                 id="nav-dropdown-landing"
//                 show={openDropdown === 'nav-dropdown-landing'}
//                 onMouseEnter={() => handleDropdownHover('nav-dropdown-landing')}
//                 onMouseLeave={handleDropdownLeave}
//             >
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('navbar')} style={dropdownItemStyle}>
//                     <FaSitemap className="me-2" /> NavBar
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('footer')} style={dropdownItemStyle}>
//                     <FaBookOpen className="me-2" /> Footer
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('homepage')} style={dropdownItemStyle}>
//                     <FaFileImage className="me-2" /> Home Page
//                 </NavDropdown.Item>
//             </NavDropdown>

//             {/* Who We Are Dropdown */}
//             <NavDropdown
//                 title={
//                     <span className="dropdown-title" style={navLinkStyle}>
//                         <FaUsers className="me-2" /> Who We Are
//                     </span>
//                 }
//                 id="nav-dropdown-who-we-are"
//                 show={openDropdown === 'nav-dropdown-who-we-are'}
//                 onMouseEnter={() => handleDropdownHover('nav-dropdown-who-we-are')}
//                 onMouseLeave={handleDropdownLeave}
//             >
//                 {/* CORRECTED LINE HERE: Changed 'aboutus_page' to 'about-us' */}
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('about-us')} style={dropdownItemStyle}>
//                     <FaRegLightbulb className="me-2" /> Our Story
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('our_team')} style={dropdownItemStyle}>
//                     <FaUser className="me-2" /> Our Team
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('our_mission')} style={dropdownItemStyle}>
//                     <FaRunning className="me-2" /> Our Mission
//                 </NavDropdown.Item>
//             </NavDropdown>

//             {/* What We Offer Dropdown */}
//             <NavDropdown
//                 title={
//                     <span className="dropdown-title" style={navLinkStyle}>
//                         <FaTools className="me-2" /> What We Offer
//                     </span>
//                 }
//                 id="nav-dropdown-what-we-offer"
//                 show={openDropdown === 'nav-dropdown-what-we-offer'}
//                 onMouseEnter={() => handleDropdownHover('nav-dropdown-what-we-offer')}
//                 onMouseLeave={handleDropdownLeave}
//             >
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('services')} style={dropdownItemStyle}>
//                     <FaHandsHelping className="me-2" /> Services
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('workshops')} style={dropdownItemStyle}>
//                     <FaCalendarAlt className="me-2" /> Workshops
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('training')} style={dropdownItemStyle}>
//                     <FaBookOpen className="me-2" /> Training
//                 </NavDropdown.Item>
//             </NavDropdown>

//             {/* Latest Dropdown */}
//             <NavDropdown
//                 title={
//                     <span className="dropdown-title" style={navLinkStyle}>
//                         <FaBullhorn className="me-2" /> Latest
//                     </span>
//                 }
//                 id="nav-dropdown-latest"
//                 show={openDropdown === 'nav-dropdown-latest'}
//                 onMouseEnter={() => handleDropdownHover('nav-dropdown-latest')}
//                 onMouseLeave={handleDropdownLeave}
//             >
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('impact')} style={dropdownItemStyle}>
//                     <FaRegLightbulb className="me-2" /> Impact
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('events')} style={dropdownItemStyle}>
//                     <FaCalendarAlt className="me-2" /> Events
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('blog')} style={dropdownItemStyle}>
//                     <FaBlog className="me-2" /> Blog
//                 </NavDropdown.Item>
//             </NavDropdown>

//             {/* Connect With Us Dropdown */}
//             <NavDropdown
//                 title={
//                     <span className="dropdown-title" style={navLinkStyle}>
//                         <FaHandshake className="me-2" /> Connect With Us
//                     </span>
//                 }
//                 id="nav-dropdown-connect"
//                 show={openDropdown === 'nav-dropdown-connect'}
//                 onMouseEnter={() => handleDropdownHover('nav-dropdown-connect')}
//                 onMouseLeave={handleDropdownLeave}
//             >
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('contact')} style={dropdownItemStyle}>
//                     <FaEnvelope className="me-2" /> Contact
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('donate')} style={dropdownItemStyle}>
//                     <FaHandHoldingUsd className="me-2" /> Donate
//                 </NavDropdown.Item>
//                 <NavDropdown.Item onClick={() => handleNavLinkClick('volunteer')} style={dropdownItemStyle}>
//                     <FaHandsHelping className="me-2" /> Volunteer
//                 </NavDropdown.Item>
//             </NavDropdown>
//         </Nav>
//     );
// };

// export default PagesTopBar;

import React, { useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import {
    FaRegFileAlt,
    FaUsers,
    FaTools,
    FaBullhorn,
    FaFileImage,
    FaRunning,
    FaCalendarAlt,
    FaBlog,
    FaUser,
    FaHandsHelping,
    FaRegLightbulb,
    FaSitemap,
    FaBookOpen,
    FaBoxOpen, 
    FaBinoculars,
    FaBullseye
} from 'react-icons/fa';

import './PagesTopbar.css';

const PagesTopBar = ({ setCurrentPage, currentPage }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleNavLinkClick = (page) => {
        setCurrentPage(page);
    };

    const handleDropdownHover = (dropdownId) => {
        setOpenDropdown(dropdownId);
    };

    const handleDropdownLeave = () => {
        setOpenDropdown(null);
    };

    const navLinkStyle = {
        color: '#fff',
        backgroundColor: '#800000',
        fontWeight: 'bold',
        padding: '10px 15px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    };

    const dropdownItemStyle = {
        color: '#333',
        backgroundColor: '#fff',
        transition: 'background-color 0.2s',
    };

    const PAGES_THAT_USE_THIS_TOP_BAR = [
        'pages',
        'navbar',
        'footer',
        'homepage',
        'about-us',
        'our_team',
        'our_mission',
        'services',
        'workshops',
        'products',
        'impact',
        'blog',
        'contact',
        'vision',
        'goals'
    ];

    if (!PAGES_THAT_USE_THIS_TOP_BAR.includes(currentPage)) {
        return null;
    }

    return (
        <Nav
            id='pages-top-bar'
            className="justify-content-center"
            style={{
                backgroundColor: '#800000',
                height: '60px',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >
            {/* Landing Page Dropdown */}
            <NavDropdown
                title={
                    <span className="dropdown-title" style={navLinkStyle}>
                        <FaRegFileAlt className="me-2" /> Landing Page
                    </span>
                }
                id="nav-dropdown-landing"
                show={openDropdown === 'nav-dropdown-landing'}
                onMouseEnter={() => handleDropdownHover('nav-dropdown-landing')}
                onMouseLeave={handleDropdownLeave}
            >
                <NavDropdown.Item onClick={() => handleNavLinkClick('navbar')} style={dropdownItemStyle}>
                    <FaSitemap className="me-2" /> NavBar
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('footer')} style={dropdownItemStyle}>
                    <FaBookOpen className="me-2" /> Footer
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('homepage')} style={dropdownItemStyle}>
                    <FaFileImage className="me-2" /> Home Page
                </NavDropdown.Item>
            </NavDropdown>

            {/* Who We Are Dropdown */}
            <NavDropdown
                title={
                    <span className="dropdown-title" style={navLinkStyle}>
                        <FaUsers className="me-2" /> Who We Are
                    </span>
                }
                id="nav-dropdown-who-we-are"
                show={openDropdown === 'nav-dropdown-who-we-are'}
                onMouseEnter={() => handleDropdownHover('nav-dropdown-who-we-are')}
                onMouseLeave={handleDropdownLeave}
            >
                <NavDropdown.Item onClick={() => handleNavLinkClick('about-us')} style={dropdownItemStyle}>
                    <FaRegLightbulb className="me-2" /> Our Story
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('our_team')} style={dropdownItemStyle}>
                    <FaUser className="me-2" /> Our Team
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('our_mission')} style={dropdownItemStyle}>
                    <FaRunning className="me-2" /> Our Mission
                </NavDropdown.Item>
            </NavDropdown>

            {/* What We Offer Dropdown */}
            <NavDropdown
                title={
                    <span className="dropdown-title" style={navLinkStyle}>
                        <FaTools className="me-2" /> What We Offer
                    </span>
                }
                id="nav-dropdown-what-we-offer"
                show={openDropdown === 'nav-dropdown-what-we-offer'}
                onMouseEnter={() => handleDropdownHover('nav-dropdown-what-we-offer')}
                onMouseLeave={handleDropdownLeave}
            >
                <NavDropdown.Item onClick={() => handleNavLinkClick('services')} style={dropdownItemStyle}>
                    <FaHandsHelping className="me-2" /> Services
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('workshops')} style={dropdownItemStyle}>
                    <FaCalendarAlt className="me-2" /> Workshops
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('products')} style={dropdownItemStyle}>
                    <FaBoxOpen className="me-2" /> Products
                </NavDropdown.Item>
            </NavDropdown>

            {/* Latest Dropdown */}
            <NavDropdown
                title={
                    <span className="dropdown-title" style={navLinkStyle}>
                        <FaBullhorn className="me-2" /> Latest
                    </span>
                }
                id="nav-dropdown-latest"
                show={openDropdown === 'nav-dropdown-latest'}
                onMouseEnter={() => handleDropdownHover('nav-dropdown-latest')}
                onMouseLeave={handleDropdownLeave}
            >
                <NavDropdown.Item onClick={() => handleNavLinkClick('impact')} style={dropdownItemStyle}>
                    <FaRegLightbulb className="me-2" /> Impact
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('events')} style={dropdownItemStyle}>
                    <FaCalendarAlt className="me-2" /> Events
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('blog')} style={dropdownItemStyle}>
                    <FaBlog className="me-2" /> Blog
                </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
                title={
                    <span className="dropdown-title" style={navLinkStyle}>
                        <FaBullhorn className="me-2" /> Aim
                    </span>
                }
                id="nav-dropdown-aim"
                show={openDropdown === 'nav-dropdown-aim'}
                onMouseEnter={() => handleDropdownHover('nav-dropdown-aim')}
                onMouseLeave={handleDropdownLeave}
            >
                <NavDropdown.Item onClick={() => handleNavLinkClick('goals')} style={dropdownItemStyle}>
                    <FaBullseye className="me-2" /> Goals
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleNavLinkClick('vision')} style={dropdownItemStyle}>
                    <FaBinoculars className="me-2" /> Vision
                </NavDropdown.Item>
                {/* <NavDropdown.Item onClick={() => handleNavLinkClick('blog')} style={dropdownItemStyle}>
                    <FaBlog className="me-2" /> Blog
                </NavDropdown.Item> */}
            </NavDropdown>
        </Nav>
    );
};

export default PagesTopBar;
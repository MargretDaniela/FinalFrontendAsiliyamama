// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'
// import { Container, Nav, Navbar } from 'react-bootstrap';
// import logo from './Images/AYGCL Logo.jpg';
// import '../Styles/Navbar.css';

// const CustomNavbar = () => {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <>
//       {/*Logo + Home Button + Donate */}
//       <div className="header-bar d-flex justify-content-between align-items-center px-4">
//         {/* Left side: Logo */}
//         <Link to="/">
//           <img src={logo} alt="Logo" height="60" />
//         </Link>

//         {/*Home button */}
//         <div className="mx-auto">
//           <Link to="/" className="btn btn-outline-danger btn-sm back-home-btn" style={{
            
//           }}>
//              Back to home
//           </Link>
//         </div>

//         {/*Donate button */}
//         <Link to="/donate" className="donate-btn">
//           DONATE <span className="rotating-heart">🤍</span>
//         </Link>
//       </div>

//       {/* Navigation Section */}
//       <Navbar
//         expand="lg"
//         expanded={expanded}
//         className="nav-links-bar"
//         collapseOnSelect
//         style={{
//           position: 'fixed',
//           top: '80px',
//           left: 0,
//           right: 0,
//           zIndex: 1040,
//         }}
//       >
//         <Container className="d-flex justify-content-between align-items-center" >
//           <Navbar.Toggle
//             aria-controls="responsive-navbar-nav"
//             onClick={() => setExpanded(!expanded)}
//             className="ms-auto border-0"
//           />
//           <Navbar.Collapse id="responsive-navbar-nav" className="navhead">
//             <Nav className="main-nav flex-column flex-lg-row w-100 justify-content-center">
//               {/*Who we are */}
//               <div className="nav-item-with-dropdown">
//                 <span className="nav-link">Who we are</span>
//                 <div className="custom-dropdown">
//                   <Link to="/about#story" className="dropdown-item">Our Story</Link>
//                   <Link to="/team#team" className="dropdown-item">Our Team</Link>
//                   <Link to="/mission#mission" className="dropdown-item">Our Mission</Link>
//                 </div>
//               </div>

//               {/* Other dropdowns */}
//               <div className="nav-item-with-dropdown">
//                 <span className="nav-link">What we offer</span>
//                 <div className="custom-dropdown">
//                   <Link to="/services#services" className="dropdown-item">Services</Link>
//                   <Link to="/workshops#workshops" className="dropdown-item">Workshops</Link>
//                   <Link to="/products" className="dropdown-item">Products</Link>
//                 </div>
//               </div>

//               <div className="nav-item-with-dropdown">
//                 <span className="nav-link">Latest</span>
//                 <div className="custom-dropdown">
//                   <Link to="/impact#impact" className="dropdown-item">Impact</Link>
//                   <Link to="/events#events" className="dropdown-item">Events</Link>
//                   <Link to="/blog#blog" className="dropdown-item">Blog</Link>
//                 </div>
//               </div>

//               <div className="nav-item-with-dropdown">
//                 <span className="nav-link">Connect with us</span>
//                 <div className="custom-dropdown">
//                   <Link to="/join" className="dropdown-item">Contact</Link>
//                   <Link to="/donate#donate" className="dropdown-item">Donate</Link>
//                   <Link to="/volunteerForm#volunteerForm" className="dropdown-item">Volunteer With Us</Link>
//                 </div>
//               </div>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>
//     </>
//   );
// };

// export default CustomNavbar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import logo from './Images/AYGCL Logo.jpg';
import '../Styles/Navbar.css';

const CustomNavbar = () => {
  const [expanded, setExpanded] = useState(false);

  // Function to close the navbar when a link is clicked
  const closeNavbar = () => setExpanded(false);

  return (
    <>
      {/*Logo + Home Button + Donate */}
      <div className="header-bar d-flex justify-content-between align-items-center px-4">
        {/* Left side: Logo */}
        <Link to="/" onClick={closeNavbar}>
          <img src={logo} alt="Logo" height="60" />
        </Link>

        {/*Home button */}
        <div className="mx-auto">
          <Link to="/" className="btn btn-outline-danger btn-sm back-home-btn" onClick={closeNavbar}>
            Back to home
          </Link>
        </div>

        {/*Donate button */}
        <Link to="/donate" className="donate-btn" onClick={closeNavbar}>
          DONATE <span className="rotating-heart">🤍</span>
        </Link>
      </div>

      {/* Navigation Section */}
      <Navbar
        expand="lg"
        expanded={expanded}
        className="nav-links-bar"
        onToggle={setExpanded} // Use onToggle for internal state management of Bootstrap's expanded prop
        collapseOnSelect
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          zIndex: 1040,
        }}
      >
        <Container className="d-flex justify-content-between align-items-center" >
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="ms-auto border-0"
          />
          <Navbar.Collapse id="responsive-navbar-nav" className="navhead">
            {/* Added a custom class 'expanded-nav-menu' for mobile styling */}
            <Nav className="main-nav flex-column flex-lg-row w-100 justify-content-center expanded-nav-menu">
              {/*Who we are */}
              <div className="nav-item-with-dropdown">
                {/* Span used for dropdown trigger, doesn't navigate */}
                <span className="nav-link">Who we are</span> 
                <div className="custom-dropdown">
                  <Link to="/about#story" className="dropdown-item" onClick={closeNavbar}>Our Story</Link>
                  <Link to="/team#team" className="dropdown-item" onClick={closeNavbar}>Our Team</Link>
                  <Link to="/mission#mission" className="dropdown-item" onClick={closeNavbar}>Our Mission</Link>
                </div>
              </div>

              {/* What we offer */}
              <div className="nav-item-with-dropdown">
                <span className="nav-link">What we offer</span>
                <div className="custom-dropdown">
                  <Link to="/services#services" className="dropdown-item" onClick={closeNavbar}>Services</Link>
                  <Link to="/workshops#workshops" className="dropdown-item" onClick={closeNavbar}>Workshops</Link>
                  <Link to="/products" className="dropdown-item" onClick={closeNavbar}>Products</Link>
                </div>
              </div>

              {/* Latest */}
              <div className="nav-item-with-dropdown">
                <span className="nav-link">Latest</span>
                <div className="custom-dropdown">
                  <Link to="/impact#impact" className="dropdown-item" onClick={closeNavbar}>Impact</Link>
                  <Link to="/events#events" className="dropdown-item" onClick={closeNavbar}>Events</Link>
                  <Link to="/blog#blog" className="dropdown-item" onClick={closeNavbar}>Blog</Link>
                </div>
              </div>

              {/* Connect with us */}
              <div className="nav-item-with-dropdown">
                <span className="nav-link">Connect with us</span>
                <div className="custom-dropdown">
                  <Link to="/join" className="dropdown-item" onClick={closeNavbar}>Contact</Link>
                  <Link to="/donate#donate" className="dropdown-item" onClick={closeNavbar}>Donate</Link>
                  <Link to="/volunteerForm#volunteerForm" className="dropdown-item" onClick={closeNavbar}>Volunteer With Us</Link>
                </div>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomNavbar;


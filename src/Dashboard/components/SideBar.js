// import React from 'react';
// import { Nav } from 'react-bootstrap';
// import { FaTachometerAlt, FaUserPlus, FaUsersCog, FaSignOutAlt, FaTasks, FaCalendarCheck, FaClipboardList, FaUserFriends, FaHandHoldingHeart, FaDonate, FaCommentAlt, FaUserCircle } from 'react-icons/fa'; // Added FaUserCircle
// import DashboardHeader from './DashboardHeader';
// // Sidebar Component
// // Now accepts 'userType', 'onLogout', and 'setCurrentPage' props
// const Sidebar = ({ userType, onLogout, setCurrentPage }) => {
//   const isSuperAdmin = userType === 'super_admin'; // Matches backend's user_type value
//   // Determine if the current user has admin or super_admin privileges
//   const isAdmin = userType === 'admin' || userType === 'super_admin';

//   // Function to handle navigation link clicks
//   const handleNavLinkClick = (page) => {
//     setCurrentPage(page); // Update the currentPage state in DashboardApp
//   };

//   return (
//     <Nav
//       className="col-md-3 col-lg-2 d-md-block sidebar collapse"
//       style={{
//         backgroundColor: '#800000', // Maroon background
//         height: '100vh',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         paddingTop: '56px', // Account for fixed top Navbar height
//         zIndex: 1000, // Ensure sidebar is above other content but below Navbar
//         display: 'flex', // Use flexbox for spacing out logout
//         flexDirection: 'column',
//       }}
//     >
//       <DashboardHeader />
//       <div className="position-sticky pt-3 flex-grow-1">
//         {/* Dashboard Link */}
//         <Nav.Item>
//           <Nav.Link
//             href="#dashboard"
//             onClick={() => handleNavLinkClick('dashboard')} // Call handler with page name
//             className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//             style={{ '--maroon': '#800000' }}
//           >
//             <FaTachometerAlt className="me-2" /> Dashboard
//           </Nav.Link>
//         </Nav.Item>

//         {/* New Profile Settings Link */}
//         <Nav.Item>
//           <Nav.Link
//             href="#profile-settings"
//             onClick={() => handleNavLinkClick('profile-settings')}
//             className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//             style={{ '--maroon': '#800000' }}
//           >
//             <FaUserCircle className="me-2" /> Profile Settings
//           </Nav.Link>
//         </Nav.Item>

//         {/* Create Admin Link - Only visible to Super Admins */}
//         {isSuperAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#create-admin"
//               onClick={() => handleNavLinkClick('create-admin')} // Call handler with page name
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaUserPlus className="me-2" /> Create Admin
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {/* Manage Admins Link - Only visible to Super Admins */}
//         {isSuperAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#manage-admins"
//               onClick={() => handleNavLinkClick('manage-admins')} // Call handler with page name
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaUsersCog className="me-2" /> Manage Admins
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {/* Programs Link - Visible to all admins (admin and super_admin) */}
//         {isAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#programs"
//               onClick={() => handleNavLinkClick('programs')}
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaTasks className="me-2" /> Programs
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {isAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#events"
//               onClick={() => handleNavLinkClick('events')}
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaCalendarCheck className="me-2" /> Events
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {isAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#enrollments"
//               onClick={() => handleNavLinkClick('enrollments')}
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaClipboardList className="me-2" /> Enrollments
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {isAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#volunteers"
//               onClick={() => handleNavLinkClick('volunteers')} // Call handler with page name
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaUserFriends className="me-2" /> Volunteers
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {/* Beneficiaries Link - Added for beneficiaries management */}
//         {isAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#beneficiaries"
//               onClick={() => handleNavLinkClick('beneficiaries')}
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaHandHoldingHeart className="me-2" /> Beneficiaries
//             </Nav.Link>
//           </Nav.Item>
//         )}

//         {/* Donations Link - Visible to all authenticated users */}
//         <Nav.Item>
//           <Nav.Link
//             href="#donations"
//             onClick={() => handleNavLinkClick('donations')}
//             className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//             style={{ '--maroon': '#800000' }}
//           >
//             <FaDonate className="me-2" /> Donations
//           </Nav.Link>
//         </Nav.Item>

//         {/* Contact Messages Link - Visible to all admins (admin and super_admin) */}
//         {isAdmin && (
//           <Nav.Item>
//             <Nav.Link
//               href="#contact-messages"
//               onClick={() => handleNavLinkClick('contact-messages')}
//               className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//               style={{ '--maroon': '#800000' }}
//             >
//               <FaCommentAlt className="me-2" /> Contact Messages
//             </Nav.Link>
//           </Nav.Item>
//         )}

//       </div>

//       {/* Logout Button at the bottom of the sidebar */}
//       <div className="mt-auto pb-3">
//         <Nav.Item>
//           <Nav.Link
//             onClick={onLogout}
//             className="text-white py-2 px-3 rounded-md hover:bg-white hover:text-maroon transition-colors duration-200"
//             style={{ '--maroon': '#800000', cursor: 'pointer' }}
//           >
//             <FaSignOutAlt className="me-2" /> Logout
//           </Nav.Link>
//         </Nav.Item>
//       </div>
//     </Nav>
//   );
// };

// export default Sidebar;

import React from 'react';
import { Nav } from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaUserPlus,
  FaUsersCog,
  FaSignOutAlt,
  FaTasks,
  FaCalendarCheck,
  FaClipboardList,
  FaUserFriends,
  FaHandHoldingHeart,
  FaDonate,
  FaCommentAlt,
  FaUserCircle,
  FaFileAlt
} from 'react-icons/fa';

const Sidebar = ({ firstName, lastName, userType, onLogout, setCurrentPage }) => {
  const isSuperAdmin = userType === 'super_admin';
  const isAdmin = userType === 'admin' || userType === 'super_admin';

  const handleNavLinkClick = (page) => {
    setCurrentPage(page);
  };

  const navLinkStyle = {
    fontSize: '0.9rem', // Reduced font size
    padding: '7px 6px', // Reduced padding
    '--maroon': '#800000',
    color: 'white',
    transition: 'color 0.2s, background-color 0.2s',
  };

  const navLinkHoverStyle = {
    color: '#800000',
  };

  return (
    <Nav
      className="col-md-3 col-lg-2 d-md-block sidebar collapse"
      style={{
        backgroundColor: '#800000',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        paddingTop: '130px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="position-sticky pt-3 flex-grow-1">
        <Nav.Item>
          <Nav.Link
            href="#dashboard"
            onClick={() => handleNavLinkClick('dashboard')}
            style={navLinkStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
          >
            <FaTachometerAlt className="me-2" /> Dashboard
          </Nav.Link>
        </Nav.Item>

        {isSuperAdmin && (
          <>
            <Nav.Item>
              <Nav.Link
                href="#create-admin"
                onClick={() => handleNavLinkClick('create-admin')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaUserPlus className="me-2" /> Create Admin
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#manage-admins"
                onClick={() => handleNavLinkClick('manage-admins')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaUsersCog className="me-2" /> Manage Admins
              </Nav.Link>
            </Nav.Item>
          </>
        )}

        {isAdmin && (
          <>
            <Nav.Item>
              <Nav.Link
                href="#programs"
                onClick={() => handleNavLinkClick('programs')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaTasks className="me-2" /> Programs
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#events"
                onClick={() => handleNavLinkClick('events')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaCalendarCheck className="me-2" /> Events
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#enrollments"
                onClick={() => handleNavLinkClick('enrollments')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaClipboardList className="me-2" /> Enrollments
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#volunteers"
                onClick={() => handleNavLinkClick('volunteers')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaUserFriends className="me-2" /> Volunteers
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#beneficiaries"
                onClick={() => handleNavLinkClick('beneficiaries')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaHandHoldingHeart className="me-2" /> Beneficiaries
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                href="#contact-messages"
                onClick={() => handleNavLinkClick('contact-messages')}
                style={navLinkStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
              >
                <FaCommentAlt className="me-2" /> Contact Messages
              </Nav.Link>
            </Nav.Item>
          </>
        )}

        <Nav.Item>
          <Nav.Link
            href="#donations"
            onClick={() => handleNavLinkClick('donations')}
            style={navLinkStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
          >
            <FaDonate className="me-2" /> Donations
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            href="#pages"
            onClick={() => handleNavLinkClick('pages')}
            style={navLinkStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
          >
            <FaFileAlt className="me-2" /> Other Pages
          </Nav.Link>
        </Nav.Item>
      </div>

      <Nav.Item>
        <Nav.Link
          href="#profile-settings"
          onClick={() => handleNavLinkClick('profile-settings')}
          style={navLinkStyle}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
        >
          <FaUserCircle className="me-2" /> Profile Settings
        </Nav.Link>
      </Nav.Item>

      <div className="mt-auto pb-3">
        <Nav.Item>
          <Nav.Link
            onClick={onLogout}
            style={navLinkStyle}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = navLinkHoverStyle.backgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = navLinkStyle.backgroundColor}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav.Item>
      </div>
    </Nav>
  );
};

export default Sidebar;
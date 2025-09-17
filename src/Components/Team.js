// import React from 'react';
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

// import board1 from './Images/team/Peter Obo.jpg';
// import board2 from './Images/team/Ivan LLL.jpg';
// import board3 from './Images/team/Mine.jpg';
// import board4 from './Images/team/NMD Old.jpg';
// import team1 from './Images/team/Doreen a.jpg';
// import team2 from './Images/team/julie .jpg';
// import team3 from './Images/team/Beatrice Aneno.jpg';
// import Footer from './Footer';

// const Team = () => {
//   const renderMemberCard = (member) => (
//     <div className="col-md-6 col-lg-3" id='team'>
//       <div className="card h-100 shadow rounded-4 border-0 text-center p-3" style={{marginLeft:'30px', marginRight:'10px'}}>
//         <img
//           src={member.image}
//           className="card-img-top rounded-circle mx-auto mt-3"
//           alt={member.name}
//           style={{ width: '120px', height: '120px', objectFit: 'cover' }}
//         />
//         <div className="card-body">
//           <h5 className="card-title fw-bold" style={{ color: '#992525' }}>{member.name}</h5>
//           <p className="text-muted mb-1">{member.role}</p>
//           <p className="card-text small">{member.description}</p>
//           <div className="d-flex justify-content-center gap-3 mt-3">
//             <a href={member.socials.fb}><FaFacebookF color="#992525" /></a>
//             <a href={member.socials.tw}><FaTwitter color="#992525" /></a>
//             <a href={member.socials.li}><FaLinkedinIn color="#992525" /></a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const boardMembers = [
//     {
//       image: board1,
//       name: 'Obbo Peter',
//       role: 'Chairperson',
//       description: 'Provides strategic guidance and ensures alignment with our mission.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board2,
//       name: 'Ivan Luwaga',
//       role: 'Treasurer',
//       description: 'Manages financial oversight and supports strategic budgeting.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board3,
//       name: 'Margret Daniela',
//       role: 'Board Secretary',
//       description: 'Ensures governance and record keeping within the organization.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board4,
//       name: 'Nyaburu Margaret',
//       role: 'Board Member',
//       description: 'Brings decades of experience in education to guide child-focused strategies and learning programs.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//   ];

//   const opsTeam = [
//     {
//       image: team1,
//       name: 'Doreen Aarakit',
//       role: 'Programs Manager',
//       description: 'Coordinates field programs and monitors community impact.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: team2,
//       name: 'Julie Aryenyo',
//       role: 'HR and Administration ',
//       description: 'Manages logistics and ensures smooth execution of activities.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: team3,
//       name: 'Aneno Beatrice',
//       role: 'Counselor',
//       description: 'Offers emotional support and counseling to youth, children, and caregivers.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//   ];

//   return (
//     <div className="" style={{ marginTop: '150px' }}>
//       {/* Page Title */}
//       <div className="text-center mb-5">
//         <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>Our Leadership Team</h2>
//         <p className="text-muted">Meet the passionate individuals guiding our vision and mission.</p>
//       </div>

//       {/* Board of Directors */}
//       <h4 className="text-uppercase fw-bold mb-4" style={{ color: '#992525', marginLeft:'80px' }}>Board of Directors</h4>
//       <div className="row g-4 mb-5">
//         {boardMembers.map((member, index) => (
//           <React.Fragment key={index}>{renderMemberCard(member)}</React.Fragment>
//         ))}
//       </div>

//       {/* Programs and Operations Team */}
//       <h4 className="text-uppercase fw-bold mb-4" style={{ color: '#992525', marginLeft:'80px' }}>Programs and Operations Team</h4>
//       <div className="row g-4 mb-5">
//         {opsTeam.map((member, index) => (
//           <React.Fragment key={index}>{renderMemberCard(member)}</React.Fragment>
//         ))}
//       </div>
//       <Footer/>
//     </div>
    
//   );
// };

// export default Team;

// import React from 'react';
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

// import board1 from './Images/team/Peter Obo.jpg';
// import board2 from './Images/team/Ivan LLL.jpg';
// import board3 from './Images/team/Mine.jpg';
// import board4 from './Images/team/NMD Old.jpg';
// import board5 from './Images/team/Asao Christine.jpg';
// import board6 from './Images/team/Okoth Dida.jpg';
// import board7 from './Images/team/Nakyanze Jackline.jpg';
// import board8 from './Images/team/Egwalu Rapheal.jpg';
// import board9 from './Images/team/Abeja Agatha.jpg';
// import board0 from './Images/team/Atwiine Chrisbel.png'
// import team1 from './Images/team/Doreen a.jpg';
// import team2 from './Images/team/julie .jpg';
// import board22 from './Images/team/Nakintu Jeska.jpg'
// import team3 from './Images/team/Beatrice Aneno.jpg';


// import Footer from './Footer';

// const Team = () => {
//   const renderMemberCard = (member) => {
//     const isAbeja = member.name === 'Abeja Agatha';
//     const isJeska = member.name === 'Nakintu Jeska';

//     return (
//       <div className={`col-md-6 col-lg-3 mt-3 ${(isAbeja || isJeska)? 'mx-auto' : ''}`}>
//         <div className="card h-100 shadow rounded-4 border-0 text-center p-3">
//           <img
//             src={member.image || 'https://via.placeholder.com/120'}
//             className="card-img-top rounded-circle mx-auto mt-3"
//             alt={member.name}
//             style={{ width: '120px', height: '120px', objectFit: 'cover' }}
//           />
//           <div className="card-body">
//             <h5 className="card-title fw-bold" style={{ color: '#992525' }}>{member.name}</h5>
//             <p className="text-muted mb-1">{member.role}</p>
//             <p className="card-text small">{member.description}</p>
//             <div className="d-flex justify-content-center gap-3 mt-3">
//               <a href={member.socials.fb}><FaFacebookF color="#992525" /></a>
//               <a href={member.socials.tw}><FaTwitter color="#992525" /></a>
//               <a href={member.socials.li}><FaLinkedinIn color="#992525" /></a>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const boardMembers = [
//     {
//       image: board1,
//       name: 'Obbo Peter',
//       role: 'Chairperson',
//       description: 'Provides strategic guidance and ensures alignment with our mission.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board2,
//       name: 'Ivan Luwaga',
//       role: 'Treasurer',
//       description: 'Manages financial oversight and supports strategic budgeting.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board0, 
//       name: 'Atwiine Chrisbel ',
//       role: 'Board Secretary',
//       description: 'Dedicated social worker, entrepreneur, uplifting leader, empowering women, fostering collaboration, inspiring communities.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board5,
//       name: 'Asao Christine',
//       role: 'Vice Board Chairperson',
//       description: 'She advances libraries, youth literacy, academic leadership, modernization, access, and lifelong learning.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board6,
//       name: 'Didacus Okoth',
//       role: 'Evidence-Based Adviser',
//       description: 'He bridges data and communication, driving evidence-based strategy, advocacy, and inclusive development.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board7,
//       name: 'Nakayenze Jackline',
//       role: 'Community Linkages Coordinator',
//       description: 'She empowers communities, connects marginalized groups, fosters inclusion, builds partnerships, and amplifies local voices.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board4,
//       name: 'Nyaburu Margaret',
//       role: 'Board Member',
//       description: 'Brings decades of experience in education to guide child-focused strategies and learning programs.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board8,
//       name: 'Egwalu Raphael',
//       role: 'Board Member',
//       description: 'He brings decades of security, governance, investigations, counterterrorism, leadership, and youth empowerment experience.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board9,
//       name: 'Abeja Agatha',
//       role: 'Board Member',
//       description: 'She excels in infrastructure, finance, governance, administration, education, and urban development.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//   ];

//   const opsTeam = [
//     {
//       image: team1,
//       name: 'Doreen Aarakit',
//       role: 'Programs Manager',
//       description: 'Coordinates field programs and monitors community impact.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: team2,
//       name: 'Julie Aryenyo',
//       role: 'HR and Administration',
//       description: 'Manages logistics and ensures smooth execution of activities.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: team3,
//       name: 'Aneno Beatrice',
//       role: 'Counselor',
//       description: 'Provides emotional support and counseling to youth, children, and caregivers.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },
//     {
//       image: board3,
//       name: 'Margret Daniela',
//       role: 'IT Specialist',
//       description: 'Manages digital systems, data security, network operations, and supports technology-driven organizational efficiency',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },    {
//       image: board22,
//       name: 'Nakintu Jeska',
//       role: 'Entrepreneurship and Resilience Officer',
//       description: 'Passionate fashion entrepreneur empowering women through skills, creativity, mentorship, and community upliftment.',
//       socials: { fb: '#', tw: '#', li: '#' },
//     },

//   ];

//   return (
//     <div style={{ marginTop: '150px' }}>
//       {/* Page Title */}
//       <div className="text-center mb-5">
//         <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>Our Leadership Team</h2>
//         <p className="text-muted">Meet the passionate individuals guiding our vision and mission.</p>
//       </div>

//       {/* Board of Directors */}
//       <h4 className="text-uppercase fw-bold mb-4" style={{ color: '#992525', marginLeft: '80px' }}>Board of Directors</h4>
//       <div className="row g-4 mb-5 px-4">
//         {boardMembers.map((member, index) => (
//           <React.Fragment key={index}>
//             {renderMemberCard(member)}
//           </React.Fragment>
//         ))}
//       </div>

//       {/* Operations Team */}
//       <h4 className="text-uppercase fw-bold mt-5 mb-4" style={{ color: '#992525', marginLeft: '20px' }}>Programs and Operations Team</h4>
//       <div className="row px-4">
//         {opsTeam.map((member, index) => (
//           <React.Fragment key={index}>
//             {renderMemberCard(member)}
//           </React.Fragment>
//         ))}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Team;

// Team.js
import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';
import Footer from './Footer';
import { Spinner, Alert } from 'react-bootstrap';

const Team = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [headerData, setHeaderData] = useState({ page_title: '', page_description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_URL;
    // const API_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/team`);
                const data = response.data;
                setHeaderData(data.header);
                setTeamMembers(data.members);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch team data:', err);
                setError('Failed to load team data. Please try again later.');
                setLoading(false);
            }
        };
        fetchTeamData();
    }, []);

    const renderMemberCard = (member) => {
        return (
            <div key={member.id} className="col-md-6 col-lg-3 mt-3">
                <div className="card h-100 shadow rounded-4 border-0 text-center p-3">
                    <img
                        src={member.image_url || 'https://via.placeholder.com/120?text=No+Image'}
                        className="card-img-top rounded-circle mx-auto mt-3"
                        alt={member.name}
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                        <h5 className="card-title fw-bold" style={{ color: '#992525' }}>{member.name}</h5>
                        <p className="text-muted mb-1">{member.role}</p>
                        <p className="card-text small">{member.description}</p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            {member.socials.fb && <a href={member.socials.fb}><FaFacebookF color="#992525" /></a>}
                            {member.socials.tw && <a href={member.socials.tw}><FaTwitter color="#992525" /></a>}
                            {member.socials.li && <a href={member.socials.li}><FaLinkedinIn color="#992525" /></a>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const boardMembers = teamMembers.filter(member => member.category === 'board');
    const opsTeam = teamMembers.filter(member => member.category === 'operations');

    return (
        <div style={{ marginTop: '150px' }}>
            <div className="text-center mb-5">
                <h2 className="fw-bold text-uppercase" style={{ color: '#992525' }}>{headerData.page_title}</h2>
                <p className="text-muted">{headerData.page_description}</p>
            </div>

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : error ? (
                <Alert variant="danger" className="text-center">{error}</Alert>
            ) : (
                <>
                    {/* Board of Directors */}
                    <h4 className="text-uppercase fw-bold mb-4" style={{ color: '#992525', marginLeft: '80px' }}>Board of Directors</h4>
                    <div className="row g-4 mb-5 px-4">
                        {boardMembers.map(renderMemberCard)}
                    </div>

                    {/* Operations Team */}
                    <h4 className="text-uppercase fw-bold mt-5 mb-4" style={{ color: '#992525', marginLeft: '20px' }}>Programs and Operations Team</h4>
                    <div className="row px-4">
                        {opsTeam.map(renderMemberCard)}
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
};

export default Team;
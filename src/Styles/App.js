import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// General site pages
import AboutUs from './Components/AboutUs';
import Blog from './Components/Blog';
import Contact from './Components/Contact';
import CustomNavbar from './Components/Navbar';
import Donate from './Components/Donate';
import Events from './Components/Events';
import Goals from './Components/Goals';
import Home from './Components/Home';
import Impact from './Components/Impact';
import Mission from './Components/Mission';
import Programs from './Components/Programs';
import Services from './Components/Services';
import Workshops from './Components/Workshops';
import Team from './Components/Team';
import Vision from './Components/Vision';
import VolunteerForm from './Components/VolunteerForm';
import DashboardApp from './Dashboard/DashboardApp';
import ProductsPage from './Components/Products';
// The import for AdminLogin is removed from here as it's only needed in DashboardApp.js

const AppWrapper = () => {
  const location = useLocation();

  // Hide navbar on all secure routes and login
  const hideNavbar =
    location.pathname.startsWith('/amamayilisa*secure') || location.pathname === '/admin-login';

  return (
    <>
      {!hideNavbar && <CustomNavbar />}
      <Routes>
        {/* Public site routes */}
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/events" element={<Events />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/team" element={<Team />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/vision" element={<Vision />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/volunteerForm" element={<VolunteerForm />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/amamayilisa*secure/*" element={<DashboardApp />} /> {/* Secure dashboard with nested routes */}
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

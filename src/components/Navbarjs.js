import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from './images/bloodlogo.png';
import { Navbar } from 'react-bootstrap';

const Navbarjs = ({ setToken, setsignup }) => {
  const navigate = useNavigate();
  const [token, settoken] = useState('');
  const [htoken, sethtoken] = useState('');
  const [atoken, setatoken] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const htoken = localStorage.getItem('htoken');
    const atoken = localStorage.getItem('adminToken');
    settoken(token);
    sethtoken(htoken);
    setatoken(atoken);
  }, []);

  useEffect(() => {
    // Disable scrolling when sidebar is open, and re-enable when closed
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Close sidebar when clicking outside of it
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto'; // Ensure scroll is re-enabled on cleanup
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('htoken');
    localStorage.removeItem('adminToken');
    setToken('');
    navigate('/loginsignup');
    setSidebarOpen(false);
  };

  const handleSignup = () => {
    setsignup(true);
    navigate('/loginsignup');
    setSidebarOpen(false);
  };

  const handleLogin = () => {
    setsignup(false);
    navigate('/loginsignup');
    setSidebarOpen(false);
  };

  return (
    <div>
      <Navbar
        expand="lg"
        className=" bg-body-tertiary position-sticky top-0 border z-20"
      >
        <Container fluid style={{ paddingLeft: '0px', paddingRight: '0px' }}>
          <Navbar.Brand as={Link} to="/" className="flex-grow-1 flex ml-4">
            <img style={{ height: '50px' }} src={logo} alt="logo" />
          </Navbar.Brand>
          <button
            className="hamburger-icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            &#9776;
          </button>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar ${sidebarOpen ? 'open sm:mt-[118px] mt-[173px]' : 'mt-[118px]'} overflow-y-auto sidebar-responsive-height`}
      // style={{ maxHeight: 'md:calc(100vh - 118px) calc(100vh-148px)' }}
      >
        <Nav className="sidebar-nav">
          {htoken ? (
            <>
              <Nav.Link as={Link} to="/hospitaldashboard" onClick={() => setSidebarOpen(false)}>
                Dashboard
              </Nav.Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : atoken ? (
            <>
              <Nav.Link as={Link} to="/home" onClick={() => setSidebarOpen(false)}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/eventsadmin" onClick={() => setSidebarOpen(false)}>
                Events
              </Nav.Link>
              <Nav.Link as={Link} to="/admin" onClick={() => setSidebarOpen(false)}>
                Admin Home
              </Nav.Link>
              <Nav.Link as={Link} to="/manageUsers" onClick={() => setSidebarOpen(false)}>
                Manage-Users
              </Nav.Link>
              <Nav.Link as={Link} to="/adminimageupload" onClick={() => setSidebarOpen(false)}>
                Images
              </Nav.Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : token ? (
            <>
              <Nav.Link as={Link} to="/bloodRequirement" onClick={() => setSidebarOpen(false)}>
                Post Blood Request
              </Nav.Link>
              <Nav.Link as={Link} to="/bloodRequirement?query=campRequest" onClick={() => setSidebarOpen(false)}>
                Post Camps Request
              </Nav.Link>
              <Nav.Link as={Link} to="/RequestsNearMe" onClick={() => setSidebarOpen(false)}>
                Requests Near Me
              </Nav.Link>
              <Nav.Link as={Link} to={`/bloodRequirement?query=UserBloodRequests`} onClick={() => setSidebarOpen(false)}>
                Your Blood Requests
              </Nav.Link>
              <Nav.Link as={Link} to={`/bloodRequirement?query=UserCampRequests`} onClick={() => setSidebarOpen(false)}>
                Your Camp Requests
              </Nav.Link>
              <Nav.Link as={Link} to="/home" onClick={() => setSidebarOpen(false)}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={() => setSidebarOpen(false)}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/userprofile" onClick={() => setSidebarOpen(false)}>
                Profile
              </Nav.Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/" onClick={() => setSidebarOpen(false)}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/loginsignup" onClick={() => setSidebarOpen(false)}>
                Emergency Blood Request
              </Nav.Link>
              <Nav.Link as={Link} to="#" onClick={() => setSidebarOpen(false)}>
                Volunteer Vehicle
              </Nav.Link>
              <Nav.Link as={Link} to="/hospitalLoginSignup" onClick={() => setSidebarOpen(false)}>
                Hospital / Organization
              </Nav.Link>
              <Nav.Link as={Link} to="/loginsignup" onClick={handleLogin}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/loginsignup" onClick={handleSignup}>
                Register As a Donor
              </Nav.Link>
            </>
          )}
        </Nav>
      </div>

      {/* Sidebar Styling */}
      <style jsx>{`
  .hamburger-icon {
    font-size: 2.5rem;
    border: none;
    background: none;
    cursor: pointer;
    margin-right: 50px;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 110%;
    width: 280px;
    background-color: #ffffff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    z-index: 999;
    overflow-y: auto; /* Allows scrolling */
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
  }
  .sidebar-nav .nav-link,
  .logout-button {
    margin: 0.5rem 0;
    font-size: 1.2rem;
  }
  .logout-button {
    background-color: #4c51bf;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .sidebar-responsive-height {
    max-height: calc(100vh - 148px);
  }
  @media (min-width: 768px) {
    .sidebar-responsive-height {
      max-height: calc(100vh - 118px);
    }
    .logout-button {
      position:absolute;
      bottom:0px;
      left:96px;
    }
  }
`}</style>
    </div>
  );
};

export default Navbarjs;

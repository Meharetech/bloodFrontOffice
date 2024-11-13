// app.js

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import Hero from './components/Hero';
import LoginSignup from './components/LoginSignup';
import { useState, useEffect } from 'react';
import BloodRequirement from './components/BloodRequirement';
import DonationDetails from './components/DonationDetails';
import DonorResponse from './components/DonorResponse';
import AdminPanel from './components/AdminPanel';
import AdminLogSign from './components/AdminLogSign';
import UserDetails from './components/UserDetails';
import DonorResponseAdmin from './components/DonorResponseAdmin';
import Navbarjs from './components/Navbarjs';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import WelcomePage from './components/WelcomePage';
import HospitalLoginSignup from './components/Hospitalpages/HospitalLoginSignup';
import HospitalDashboard from './components/Hospitalpages/HospitalDashboard';
import Profile from './components/Hospitalpages/Profile';
import HospitalDetails from './components/Hospitalpages/HospitalDetails';
import AdminManageUsers from './components/AdminManageUsers';
import HospitalDonorsResponsesDetails from './components/Hospitalpages/HospitalDonorsResponses';
import HospitalDonationDetails from './components/HospitalDonationDetails';
import DonorResponseHospitalAdmin from './components/DonorResponseHospitalAdmin';
import UserProfile from './components/User/UserProfile';
import EventsAdmin from './components/EventsAdmin';
import ForgetPassword from './components/ForgetPassword';
import TopHeader from './components/Util/TopHeader'
import UpdateImageComponent from './components/Admin/Uploadsphotos';
import VolunteerVechile from './components/volunteervechile/VolunteerVechile';
import ButtonComponent from './components/Button/ButtonComponent';
import ScrolltoTop from './components/ScrolltoTop';
import AdminVechile from './components/Admin/AdminVechile';
import HospitalBloodInfo from './components/Hospitalpages/HospitalBloodInfo';
import AllRequests from './components/AllRequests';
import EmergencyRequest from './components/EmeregencyRequest';
import PostBloodRequest from './components/Hospitalpages/PostBloodRequest';
import HospitalNgoMembers from './components/Hospitalpages/HospitalNgoMembers';
import Events from './components/Hospitalpages/Events';
import HProfile from './components/Hospitalpages/Profile';
import HHome from './components/Hospitalpages/Home';
function App() {

  const [token, setToken] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [htoken, setHtoken] = useState('')
  const location = useLocation(); // Get current location
  const isLoginPage = location.pathname === "/loginsignup";

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token');
    const adminStoredToken = localStorage.getItem('adminToken');
    const hstoredToken = localStorage.getItem('htoken')
    setToken(storedToken || '');
    setAdminToken(adminStoredToken || '')
    setHtoken(hstoredToken || '')
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const [signup, setsignup] = useState(false);


  return (
    <div className="App">
      <TopHeader />

      {<Navbarjs setsignup={setsignup} setToken={setToken} />
      }
      <div>
        {/* <ButtonComponent/>
             */}
        <ScrolltoTop />

        <ToastContainer className='mt-10 ml-1 mr-1' />

        <div className='Sidebar-container'>

        </div>
        <div className='Routes-container'>
          <Routes>
            <Route path="/loginsignup" element={token ? <Navigate to="/home" />
              : <LoginSignup setsignup={setsignup} signup={signup} setToken={setToken} />
            } />

            <Route path="/admin" element={adminToken ? <AdminPanel setAdminToken={setAdminToken} />
              : <Navigate to="/adminLogin" />
            } />

            <Route path="/adminLogin" element={adminToken ? <Navigate to="/admin" />
              : <AdminLogSign setAdminToken={setAdminToken} />
            } />

            <Route path="/home" element={token ? <Hero setToken={setToken} />
              : <Navigate to="/" />
            } />

            <Route path="/RequestsNearMe" element={<AllRequests />
            } />

            <Route path="/bloodRequirement" element={<BloodRequirement setToken={setToken} />
            } />
            <Route path="/EmergencyBloodRequest" element={<EmergencyRequest />
            } />

            <Route path="/donationDetails" element={token ? <DonationDetails setToken={setToken} />
              : <Navigate to="/" />
            } />

            <Route path="/donorsResponse" element={<DonorResponse setToken={setToken} />
            } />

            <Route path="/userDetails" element={adminToken ? <UserDetails />
              : <Navigate to="/adminLogin" />
            } />

            <Route path='/hospitalDetails' element={adminToken ? <HospitalDetails />
              : <Navigate to='/adminLogin' />
            } />

            <Route path="/donorsResponseAdmin" element={<DonorResponseAdmin />
            } />

            <Route path='/about' element={<AboutPage />
            } />

            <Route path='/' element={<WelcomePage />
            } />

            <Route path='/hospitalLoginSignup' element={<HospitalLoginSignup />
            } />
            <Route path='/HospitalHome' element={<HHome />
            } />
            <Route path='/hospitalProfile' element={<HProfile />
            } />
            <Route path='/HospitalPostRequest' element={<PostBloodRequest />
            } />
            <Route path='/RegisteredMembers' element={<HospitalNgoMembers />
            } />
            <Route path='/HEvents' element={<Events />
            } />


            <Route path='/manageUsers' element={<AdminManageUsers />
            } />

            <Route path='/HospitalDonorsResponses' element={<HospitalDonorsResponsesDetails />
            } />

            <Route path='/hospitaldonationDetails' element={<HospitalDonationDetails />
            } />

            <Route path='/donorresponsehospitaladmin' element={<DonorResponseHospitalAdmin />
            } />

            <Route path='/userprofile' element={<UserProfile />
            } />

            <Route path='/eventsadmin' element={<EventsAdmin />
            } />

            <Route path='/forgetPassword' element={<ForgetPassword />
            } />

            <Route path='/adminimageupload' element={<UpdateImageComponent />
            } />

            <Route path='/volunteervechile' element={<VolunteerVechile />
            } />

            <Route path='/adminvechile' element={<AdminVechile />
            } />

            <Route path='/hospitalbloodinfo' element={<HospitalBloodInfo />
            } />

          </Routes>
        </div>
      </div>
      {!isLoginPage && <Footer />
      }
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import aosx from 'aosx';
// import 'aosx/dist/aosx.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './images/iinsaf.png';

// import left from './images/bloodDonationLogin3.jpg';
// import login1 from './images/bloodDonationLogin1.jpg';
// import login2 from './images/bloodDonationLogin2.jpg';
// import login3 from './images/bloodDonationLogin3.jpg';
// import login4 from './images/bloodDonationLogin4.jpg';
// import login5 from './images/bloodDonationLogin5.jpg';

import loginleftImage from './images/loginleftImage.png'
import loginrightImage from './images/loginrightImage.png'
import bloodRegister from './images/bloodregister.png'
import bloodRegister2 from './images/6553556[1].webp'
import { BaseUrl } from './Util/util';

// const images = [left, login1, login2, login3, login4, login5];

const LoginSignup = ({ setToken, signup, setsignup }) => {
  const [name, setname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [email, setEmail] = useState('');
  const [ngoName, setngoName] = useState('');
  const [location, setLocation] = useState({ longitude: null, latitude: null });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signupbuttonclick, setsignupbutton] = useState(false);
  const [otp, setotp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    // aosx.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
              longitude,
              latitude
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert("Please enable location permissions for this app.");
                break;
              case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable. Please try again later.");
                break;
              case error.TIMEOUT:
                alert("The request to get your location timed out. Please try again.");
                break;
              case error.UNKNOWN_ERROR:
                alert("An unknown error occurred. Please try again.");
                break;
              default:
                console.log("There is no error is fetching location");
            }
          }
        );
      } else {
        alert('Geolocation is not supported by this browser');
      }
    };
    getLocation();
  }, [])

  // Slide effect for images
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, 3000); // Change slide every 3 seconds

  //   return () => clearInterval(intervalId); // Cleanup on unmount
  // }, []);

  const handleLogin = async () => {
    if (location.longitude === null || location.latitude === null) {
      toast.error('Location not set. Please enable location services and try again.');
      return; // Stop function execution if location is null
    }

    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      toast.error('Invalid phone number. It must be exactly 10 digits.');
      return;
    }

    // Password validation: Ensure the password is at least 6 characters long (you can add more rules like including numbers or special characters)
    if (!password || password.length < 6) {
      window.scroll(0, 0);
      toast.error('Invalid password. It must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BaseUrl}/loginUser`, { phoneNumber, password, location });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      console.log(response);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }

    }
    setLoading(false);

  };

  const handleSignup = async () => {
    // Phone number validation: Check if it's exactly 10 digits
    if (!phoneNumber || phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      window.scrollTo(0, 0)
      // window.alert('Invalid phone number. It must be exactly 10 digits --.')
      toast.error('Invalid phone number. It must be exactly 10 digits.');
      return;
    }
    // Name validation: Ensure the name is not empty
    if (!name || name.trim() === "") {
      window.scrollTo(0, 0)
      toast.error('Name is required.');
      return;
    }

    // Email validation: Using a regular expression to check if the email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      window.scroll(0, 0);
      toast.error('Invalid email format.');
      return;
    }

    // Password validation: Ensure the password is at least 6 characters long (you can add more rules like including numbers or special characters)
    if (!password || password.length < 6) {
      window.scroll(0, 0);
      toast.error('Invalid password. It must be at least 6 characters long.');
      return;
    }


    // Blood group validation: Check if the blood group is valid (new blood group options added)
    const validBloodGroups = [
      'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-',
      'a2+', 'a2-', 'a2b+', 'a2b-', 'hh', 'inra'
    ];

    if (!bloodGroup || !validBloodGroups.includes(bloodGroup.toLowerCase())) {
      window.scroll(0, 0);
      toast.error('Invalid blood group. Please select a valid blood group.');
      return;
    }

    // Proceed with signup if all validations pass
    try {
      const response = await axios.post(`${BaseUrl}/addUser`, { phoneNumber, password, bloodGroup, email, name, ngoName });
      console.log(response.data);
      toast.success(` ${response.data.message}`);
      setsignupbutton(true);
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.error);
    }
    // finally {
    //   setsignupbutton(true);
    // }
  };




  // for otp veryficatoin 
  const handelotpvery = async () => {

    try {
      const response = await axios.post(`${BaseUrl}/verifyOtp`, { email, otp });
      console.log(response.data);
      window.scroll(0, 0)
      toast.success("Otp Verify Successfully");
      navigate('/')

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.error)
    }
  }

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/resendOtp`, { email });
      console.log(response.data);
      toast.success("OTP Resent Successfully On WhatsApp !");
    } catch (error) {
      console.log(error);
      toast.error('Failed to resend OTP !');
    }
  };


  return (
    <div
      className={`min-h-screen flex items-center ${signup ? 'justify-center ' : "justify-center"}  bg-gray-100`}
      style={{
        backgroundImage: signup
          ? `url(${bloodRegister2})`
          : `url(${loginleftImage}), url(${loginrightImage})`,
        backgroundSize: signup ? 'cover' : '40%, 40%',
        backgroundPosition: signup ? 'right' : 'left, right',
        backgroundRepeat: 'no-repeat, no-repeat' // Prevent images from repeating
      }}
    >

      <h1>{signupbuttonclick}</h1>
      <div className={`w-5/6 md:w-full ${signup ? "max-w-2xl" : "max-w-md"} bg-white bg-opacity-50 backdrop-blur-lg border-4 border-gray-300 rounded-lg shadow-lg p-6 ${signup ? " mt-[4%] mb-36" : ""}`} data-aosx="fade-left">

        {/* Logo and Title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm " data-aosx="zoom-in">
          <img alt="Your Company" src={logo} className="mx-auto h-15 w-[200px]" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {signup ? 'Sign Up to Your Account' : 'Log in to Your Account'}
          </h2>
        </div>

        {/* Form Inputs */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl ">
          <div
            className={` gap-6 space-y-0 ${signup ? "grid" : "flex flex-col"}`} // Add spacing between fields
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' // Use minmax to define responsive columns
            }}
          >

            {/* Phone Number Input */}
            <div
              data-aosx="fade-up"
              className={signupbuttonclick ? "hidden" : "flex flex-col space-y-4"}
            >
              {/* Label for the input field */}
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-900 leading-6 flex p-2"
              >
                Phone Number
              </label>

              {/* Input wrapper with relative positioning for the icon */}
              <div className="relative mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    if (numericValue.length <= 10) {
                      setPhoneNumber(numericValue);
                    }
                  }}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm placeholder-gray-400 
        focus:outline-none focus:outline-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                />

                {/* Icon positioned inside the input field */}
                <span
                  className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                >
                  📞
                </span>
              </div>
            </div>



            {/* email input  */}
            {signup && (
              <>
                {/* name input  */}
                <div
                  data-aosx="fade-up"
                  className={signupbuttonclick ? "opacity-50 pointer-events-none" : "flex flex-col space-y-4"}
                >
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-900 leading-6 flex p-2"
                  >
                    Name
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      disabled={signupbuttonclick}
                      className={`block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm placeholder-gray-400 
        focus:outline-none focus:outline-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 
        ${signupbuttonclick ? "cursor-not-allowed bg-gray-100" : ""}`}
                    />
                    <span
                      className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                    >
                      👤
                    </span>
                  </div>
                </div>


                <div
                  data-aosx="fade-up"
                  className={signupbuttonclick ? "opacity-50 pointer-events-none" : "flex flex-col space-y-4"}
                >
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 leading-6 flex p-2"
                  >
                    Email
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={signupbuttonclick}
                      className={`block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm placeholder-gray-400 
        focus:outline-none focus:outline-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 
        ${signupbuttonclick ? "cursor-not-allowed bg-gray-100" : ""}`}
                    />
                    <span
                      className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                    >
                      📧
                    </span>
                  </div>
                </div>

                <div
                  data-aosx="fade-up"
                  className={signupbuttonclick ? "opacity-50 pointer-events-none" : "flex flex-col space-y-4"}
                >
                  {/* Label for NGO Name */}
                  <label
                    htmlFor="ngoName"
                    className="text-sm font-medium text-gray-900 leading-6 flex p-2"
                  >
                    Ngo Name <span className="text-gray-500">(Optional)</span>
                  </label>

                  {/* Input Wrapper with Icon */}
                  <div className="relative mt-1">
                    <input
                      id="ngoName"
                      name="ngoName"
                      type="text"
                      placeholder="Enter Your Ngo Name"
                      value={ngoName}
                      onChange={(e) => setngoName(e.target.value)}
                      disabled={signupbuttonclick}
                      className={`block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm placeholder-gray-400 
        focus:outline-none focus:outline-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 
        ${signupbuttonclick ? "cursor-not-allowed bg-gray-100" : ""}`}
                    />
                    {/* Icon Positioned Inside Input */}
                    <span
                      className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                    >
                      🏢
                    </span>
                  </div>
                </div>

              </>
            )}


            {signupbuttonclick && signup && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">Enter OTP</label>
                <input
                  id='otp'
                  name='otp'
                  type='number'
                  required
                  placeholder='Enter  OTP'
                  value={otp}
                  onChange={(e) => setotp(e.target.value)}
                  className="block w-full rounded-md border-1 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {/* Add the missing onClick handler for OTP verification */}
                <button
                  className='border-2 py-1 rounded-2xl text-white px-4 mt-3 bg-green-600'
                  onClick={handelotpvery}
                >
                  Verify
                </button>
                <button
                  className='border-2 py-1 rounded-2xl text-white px-4 mt-3 bg-green-600'
                  onClick={handleResendOtp}
                >
                  Resend Otp
                </button>
              </div>
            )}


            {/* Password Input */}
            <div
              data-aosx="fade-up"
              className={signupbuttonclick ? "hidden" : "flex flex-col space-y-4"}
            >
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 leading-6 flex p-2"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:outline-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>



            {/* Conditional Blood Group Selection - Shown only if signup is true */}
            {signup && (
              <div
                data-aosx="fade-up"
                className={signupbuttonclick ? "hidden" : "flex flex-col space-y-4"}
              >
                {/* Label for Blood Group */}
                <label
                  htmlFor="bloodGroup"
                  className="text-sm font-medium text-gray-900 leading-6 flex p-2"
                >
                  Blood Group
                </label>

                {/* Select Wrapper with Icon */}
                <div className="relative mt-1">
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    required
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className={`block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 shadow-sm placeholder-gray-400 
                    focus:outline-none focus:outline-2 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6`}
                  >
                    <option value="">Select Your Blood Group</option>
                    <option value="a+">A+</option>
                    <option value="a-">A-</option>
                    <option value="b+">B+</option>
                    <option value="b-">B-</option>
                    <option value="ab+">AB+</option>
                    <option value="ab-">AB-</option>
                    <option value="o+">O+</option>
                    <option value="o-">O-</option>
                    <option value="a2+">A2+</option>
                    <option value="a2-">A2-</option>
                    <option value="a2b+">A2B+</option>
                    <option value="a2b-">A2B-</option>
                    <option value="hh">HH (Bombay Blood Group)</option>
                    <option value="inra">INRA</option>
                  </select>

                  {/* Icon Positioned Inside Select */}
                  <span
                    className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                  >
                    🩸
                  </span>
                </div>
              </div>

            )}

          </div>
          {/* Login and Signup Buttons */}
          {signup ? (
            <div data-aosx="fade-left" className={`${signupbuttonclick ? "hidden" : "flex justify-center"} mt-6`}>
              <button
                onClick={handleSignup}
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          ) : (
            <div>
              <div data-aosx="fade-left" className="mt-6 flex justify-center">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className={`flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${loading ? 'bg-indigo-400' : 'hover:bg-indigo-500'
                    } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </div>

              <div className="mt-6 flex justify-center" data-aosx="fade-left">
                <button
                  onClick={() => setsignup(true)}
                  className=" flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}

          {/* Toggle between Login and Signup */}
          {signup && (
            <div className="mt-9 flex justify-center" data-aosx="fade-left" >
              <button
                onClick={() => { setsignup(false); setsignupbutton(false) }}
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Already have an account ? Login
              </button>
            </div>
          )}


          <div>
            {!signup &&
              <Link className='text-blue-700' to="/forgetPassword">Forget Password</Link>
            }
          </div>
        </div>
      </div>
    </div>
  );

};

export default LoginSignup;

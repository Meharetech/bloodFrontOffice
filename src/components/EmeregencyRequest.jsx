import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BaseUrl } from './Util/util';
import './styles/BloodRequirement.css';
import { useNavigate } from 'react-router-dom';

const EmergencyRequest = () => {
    const [bloodGroup, setBloodGroup] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('')
    const [hospitalName, setHospitalName] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });
    const [requestPhone, setRequestPhone] = useState('');
    const [existingRequests, setExistingRequests] = useState([]);


    const navigate = useNavigate();

    // Fetch user location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ longitude, latitude });
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
                            console.log("There is no error in fetching location");
                    }
                }
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    };

    // Initialize location on mount
    useEffect(() => {
        getLocation();
    }, []);

    // Function to submit blood request
    const bloodRequest = async () => {
        if (!bloodGroup || !location.latitude || !location.longitude || !name || !phoneNumber) {
            alert("All fields are required for submitting a blood request.");
            return;
        }

        const userData = { bloodGroup, location, name, phoneNumber, city, hospitalName };

        try {
            const response = await axios.post(`${BaseUrl}/sendEmergencyBloodRequest`, userData);
            toast.success("Blood request submitted successfully! Please check your phone for the OTP.");
            window.alert("Blood request submitted successfully! Please check your phone for the OTP.")
            setIsOtpSent(true); // Enable OTP input section
            console.log("Blood request response:", response.data);
        } catch (error) {
            console.error('Request failed:', error);
            toast.error('Failed to send blood request. Please try again.');
        }
    };

    // Function to verify OTP
    const verifyOtp = async () => {
        if (!otp || !phoneNumber) {
            alert("OTP and Phone Number are required for verification.");
            return;
        }

        try {
            const response = await axios.post(`${BaseUrl}/verifyEmergencyOtp`, { otp, phoneNumber });
            window.alert("OTP verified successfully! Your request has been approved.")
            toast.success("OTP verified successfully! Your request has been approved.");

            console.log("OTP verification response:", response.data);
        } catch (error) {
            console.error('OTP verification failed:', error);
            toast.error('Failed to verify OTP. Please check your code and try again.');
        }
        navigate('/');
    };

    // Function to check existing blood requests based on phone number
    const checkExistingRequest = async () => {
        if (!requestPhone) {
            alert("Please enter your phone number to check for existing requests.");
            return;
        }

        try {
            const response = await axios.get(`${BaseUrl}/checkEmergencyBloodRequest`, {
                params: { phoneNumber: requestPhone }
            });
            if (response.data.requests && response.data.requests.length > 0) {
                setExistingRequests(response.data.requests);
                toast.success("Existing emergency requests found!");
            } else {
                setExistingRequests([]);
                toast.info("No existing emergency requests found.");
            }
        } catch (error) {
            console.error('Error fetching existing requests:', error);
            toast.error('Failed to fetch existing blood requests.');
        }
    };

    return (
        <>
            <div className="blood-request-form">
                {!isOtpSent ? (
                    <>
                        <label htmlFor="bloodGroup" className="form-label">
                            Enter the Blood Group in small case letters e.g., a+, b+, o-
                        </label>
                        <br />
                        <select
                            className='h-10 border-2 border-black'
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
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
                        <br />
                        <label htmlFor="name" className="form-label">
                            Enter Your Name
                        </label>
                        <br />
                        <input
                            type="text"
                            id="name"
                            placeholder="Name Of Requestor"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />
                        <label htmlFor="phoneNumber" className="form-label">
                            Enter Details
                        </label>
                        <br />
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder="Phone Number"
                            className="form-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <br />
                        <input
                            type="text"
                            id="city"
                            placeholder="City Name"
                            className="form-input"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <br />
                        <input
                            type="text"
                            id="hospitalName"
                            placeholder="Hospital Name"
                            className="form-input"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                        />
                        <br />
                        <button className="form-button !bg-red-400 hover:!bg-red-500" onClick={bloodRequest}>
                            Request Blood
                        </button>
                    </>
                ) : (
                    <>
                        <label htmlFor="otp" className="form-label">
                            Enter OTP
                        </label>
                        <br />
                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter OTP received"
                            className="form-input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <br />
                        <button className="form-button !bg-green-400 hover:!bg-green-500" onClick={verifyOtp}>
                            Verify OTP
                        </button>
                    </>
                )}

                <br /><br /><br /><br />
                <input
                    type="text"
                    id="requestPhoneNumber"
                    placeholder="Phone Number"
                    className="form-input"
                    value={requestPhone}
                    onChange={(e) => setRequestPhone(e.target.value)}
                />
                <br />
                <button
                    className="form-button !bg-blue-400 hover:!bg-blue-500"
                    onClick={checkExistingRequest}
                >
                    Check Existing Requests
                </button>


            </div>
            <div className=" ml-10 mr-10 ">
                {/* Display existing requests */}
                {existingRequests.length > 0 && (
                    <div className="existing-requests col-span-full">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Existing Emergency Blood Requests</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {existingRequests.map((request, index) => (
                                <li
                                    key={index}
                                    className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6"> 
                                        <div className="flex flex-col mb-4 sm:mb-0">
                                            <strong className="text-2xl font-semibold text-blue-600">{request.bloodGroup}</strong>
                                            <span className="text-gray-700 text-lg">{request.name}</span>
                                            <span className="text-sm text-gray-500">{request.phoneNumber}</span>
                                        </div>
                                        <div className="ml-auto text-right mt-4 sm:mt-0">
                                            <span className="text-xs text-gray-500">Status:</span>
                                            <span
                                                className={`font-semibold ${request.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {/* Google Maps Link with Latitude and Longitude */}
                                        <p className="text-sm text-gray-600">
                                            <strong>Location:</strong>{' '}
                                            <a
                                                href={`https://www.google.com/maps?q=${request.location.latitude},${request.location.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 underline"
                                            >
                                                Latitude: {request.location.latitude}, Longitude: {request.location.longitude}
                                            </a>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Request Time:</strong> {new Date(request.dateOfQuery).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Expiry:</strong> {new Date(request.expireAt).toLocaleString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                )}
            </div>
        </>
    );
};

export default EmergencyRequest;

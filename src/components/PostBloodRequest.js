import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from './Util/util';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const PostBloodRequest = ({ sendLocation }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const [requests, setRequests] = useState([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });

    useEffect(() => {
        getLocation();
    }, []);

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



    const bloodRequest = async () => {
        if (!bloodGroup || !location) {
            window.alert("Blood Group and location is required for sending request");
        } else {
            const userData = { bloodGroup, location, name };
            const token = localStorage.getItem("token")

            try {
                setIsLoading(true); // Start loading
                const response = await axios.post(`${BaseUrl}/sendBloodRequest`, userData, {
                    headers: { Authorization: token }
                });
                toast.success("Successfully Submitted a Blood request")
                sendLocation();
                console.log("response is this from =>", response.data);
                navigate('/bloodRequirement');
            } catch (error) {
                console.error('Request failed:', error);
                toast.error('Failed to send blood request. Please try again.')
            } finally {
                setIsLoading(false);
            }
        }
    };


    return (
        <div>
            <div className="blood-request-form-container p-6 max-w-md mx-auto shadow-lg rounded-lg border border-gray-300 bg-white">
                <h2 className="text-2xl font-semibold text-red-500 mb-4 text-center">
                    Donate Blood, Save Lives
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Every drop counts! Join us in making a difference.
                </p>

                <label htmlFor="bloodGroup" className="form-label font-medium text-gray-700">
                    Select Blood Group
                </label>
                <select
                    className="w-full h-12 border border-gray-300 rounded-md mt-1 mb-4 px-3 text-gray-700 focus:outline-none focus:border-red-400"
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

                <label htmlFor="Name" className="form-label font-medium text-gray-700">
                    Requestor's Name
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className="w-full h-12 border border-gray-300 rounded-md mt-1 mb-4 px-3 text-gray-700 focus:outline-none focus:border-red-400"
                    onChange={(e) => setName(e.target.value)}
                />

                <button
                    className={`w-full h-12 rounded-md font-semibold text-white ${isLoading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                        } transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
                    onClick={bloodRequest}
                    disabled={isLoading} // Disable button during loading
                >
                    {isLoading ? "Requesting..." : "Request Blood"}
                </button>

                <div className="text-center mt-6">
                    <Link
                        to={'/bloodRequirement'}
                        className="text-red-400 hover:underline text-sm font-medium"
                    >
                        My Requests
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default PostBloodRequest

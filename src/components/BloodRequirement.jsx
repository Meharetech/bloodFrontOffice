import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './styles/BloodRequirement.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { BaseUrl } from './Util/util';
import { toast } from 'react-toastify';

const BloodRequirement = ({ setToken }) => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [bloodGroup, setBloodGroup] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState({
        longitude: null,
        latitude: null
    });
    const [successMessage, setSuccessMessage] = useState('');

    const [campName, setCampName] = useState('');
    const [campAddress, setCampAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [campRequests, setCampRequests] = useState([]);
    const [maxEndDate, setMaxEndDate] = useState('');
    const [campDisplay, setcampDisplay] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State to track which form section to display
    const [selectedField, setSelectedField] = useState("bloodRequest");

    // Function to handle label click
    const handleLabelClick = (field) => {
        setSelectedField(field);
    };

    // Get today's date in 'YYYY-MM-DD' format
    const currentDate = new Date().toISOString().split('T')[0];

    // Calculate the max end date based on startDate and set it
    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate);
            const maxDate = new Date(start);
            maxDate.setDate(start.getDate() + 10); // Add 10 days
            setMaxEndDate(maxDate.toISOString().split('T')[0]); // Set the max end date in 'YYYY-MM-DD' format
        } else {
            setMaxEndDate(''); // Reset max end date if no start date is selected
        }
    }, [startDate]); // Only recalculate when startDate changes


    const pageLocation = useLocation();
    const queryParams = new URLSearchParams(pageLocation.search); // Use `pageLocation` here
    const queryValue = queryParams.get('query');

    useEffect(() => {
        if (queryValue) {
            setSelectedField(queryValue);
        } else {
            setSelectedField("bloodRequest");
        }
    }, [queryValue]); // Dependency array to run effect only when `queryValue` changes

    setToken(localStorage.getItem('token'))
    const handleSubmit = async () => {
        const formData = {
            location,
            campName,
            campAddress,
            startDate,
            endDate
        };
        const token = localStorage.getItem('token')

        try {
            const response = await axios.post(`${BaseUrl}/addCamp`, formData, {
                headers: {
                    Authorization: token
                }
            });
            console.log('Camp Data submitted successfully:', response.data);
            getSentCampRequests();
            toast.success("Camp Added Successfull")
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    useEffect(() => {
        getLocation();
        getSentRequests();
        getSentCampRequests();
    }, []);

    useEffect(() => {
        getSentRequests();
    }, [])



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
        // Check if bloodGroup and location are provided
        if (!bloodGroup || !location) {
            window.alert("Blood Group and location are required for sending request");
        } else {
            const userData = { bloodGroup, location, name };
            const token = localStorage.getItem("token");
    
            // Disable the button
            setIsSubmitting(true);
    
            try {
                const response = await axios.post(`${BaseUrl}/sendBloodRequest`, userData, {
                    headers: { Authorization: token },
                });
    
                // Show success message
                toast.success("Successfully Submitted a Blood request");
                console.log("response is this from =>", response.data);
            navigate("/bloodRequirement?query=UserBloodRequests")
    
                // After 5 seconds, enable the button
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 5000);
            } catch (error) {
                console.error("Request failed:", error);
                toast.error("Failed to send blood request. Please try again.");
    
                // In case of an error, enable the button immediately
                setIsSubmitting(false);
            }
        }
    
        // Fetch sent requests
        getSentRequests();
    };


    const getSentRequests = async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await axios.get(`${BaseUrl}/getUploadedRequest`,

                {
                    headers: { Authorization: token }
                });
            setRequests(response.data.requests);
            console.log("response is this for sent requests =>", requests);
        } catch (error) {
            console.error('Request failed:', error);
            setSuccessMessage('Failed to send blood request. Please try again.');
        }
    };

    const getSentCampRequests = async (req, res) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BaseUrl}/getUserCamps`, {

                headers: { Authorization: token },
            })
            setCampRequests(response.data.camps);
        } catch (error) {
            console.log(error)
        }
    }

    const deleteCamp = async (campId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${BaseUrl}/deleteCamp`, {
                params: {
                    campId: campId
                },
                headers: {
                    Authorization: token
                }
            })
            getSentCampRequests();
            console.log(response.data.message)
            toast.success('Camp Deleted ')
            window.scroll(0, 0)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            {/* <div className="flex space-x-4 mb-4 justify-center w-full overflow-scroll">
                <button
                    onClick={() => handleLabelClick("bloodRequest")}
                    className="px-6 ml-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 shadow-lg">
                    Blood Request Form
                </button>

                <button
                    onClick={() => handleLabelClick("campRequest")}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 shadow-lg">
                    Camp Request Form
                </button>

                <button
                    onClick={() => handleLabelClick("UserBloodRequests")}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300 shadow-lg">
                    Your Blood Requests
                </button>

                <button
                    onClick={() => handleLabelClick("UserCampRequests")}
                    className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition duration-300 shadow-lg">
                    Your Camp Requests
                </button>
            </div> */}

            <div className='flex flex-wrap'>
                {/* // camp post  */}
                {selectedField === "campRequest" && (
                    <div class="w-full flex flex-col items-center justify-center p-4 blood-request-form">
                        <h1 class="text-xl font-semibold mb-4">Post Camp Details</h1>
                        <input
                            type="text"
                            name="campName"
                            id="campName"
                            placeholder="Enter Camp Name"
                            value={campName}
                            onChange={(e) => setCampName(e.target.value)}
                            class="w-full max-w-md mb-2 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="campAddress"
                            id="campAddress"
                            placeholder="Enter the address of the camp"
                            value={campAddress}
                            onChange={(e) => setCampAddress(e.target.value)}
                            class="w-full max-w-md mb-2 p-2 border border-gray-300 rounded"
                        />
                        <label htmlFor="startDate" style={{ marginBottom: '5px' }}>From</label>
                        <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={startDate}
                            min={currentDate} // Only allow current and future dates
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{ width: "120px", marginBottom: '10px' }}
                        />
                        <label htmlFor="endDate" style={{ marginBottom: '5px' }}>To</label>
                        <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={endDate}
                            min={startDate || currentDate} // End date cannot be before the start date
                            max={maxEndDate} // Set the max date 10 days after the start date
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{ width: "120px", marginBottom: '10px' }}
                            disabled={!startDate} // Disable the end date until a start date is selected
                        />
                        <button
                            onClick={handleSubmit}
                            class="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                )}

                {/* // blood request  */}
                {selectedField === "bloodRequest" && (
                    <div className="blood-request-form">
                        <label htmlFor="bloodGroup" className="form-label">
                            Enter the Blood Group in small case letters e.g., a+, b+, o-
                        </label>
                        <br />
                        <select className="h-10 border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"

                            value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                            <option value="">🩸 Select Your Blood Group</option>
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
                        <label htmlFor="Name" className="form-label">
                            Enter The Name
                        </label>
                        <br />
                        <div className="relative">
                            <span className="absolute left-2 top-2/4 transform -translate-y-1/2 text-xl">📝</span>
                            <input
                                type="text"
                                id="name"
                                placeholder="Name Of Requestor"
                                className="pl-10 py-2 border-2 border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-300 focus:outline-none transition-all duration-200 w-full rounded-full"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <br />
                        <button
                            className="form-button !bg-red-400 hover:!bg-red-500"
                            onClick={bloodRequest}
                            disabled={isSubmitting} // Disable the button if isSubmitting is true
                        >
                            {isSubmitting ? "Submitting..." : "Request Blood"}
                        </button>
                        <br />
                        <br />
                        {/* <button onClick={getSentRequests}>My Requests</button> */}
                    </div>
                )}
            </div>

            {selectedField === "UserCampRequests" && (
                <div className="flex flex-wrap ml-1 mt-16 mb-20 mr-1 justify-center gap-4">
                    {campRequests.length > 0 ? (
                        campRequests.map((camp) => (
                            <div
                                key={camp._id}
                                className="border border-red-500 w-full sm:w-72 md:w-80 lg:w-96 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-2">{camp.campName}</h3>
                                    <p className="text-gray-700">Address: {camp.campAddress}</p>
                                    <p className="text-gray-700">Start Date: {camp.startDate}</p>
                                    <p className="text-gray-700">End Date: {camp.endDate}</p>
                                    <button
                                        onClick={() => deleteCamp(camp._id)}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No camps posted yet.</p>
                    )}
                </div>
            )}


            {/* <h2 className='mt-2 mb-2 text-red-700 text-2xl p-2 border'>Your Requests</h2> */}
            {selectedField === "UserBloodRequests" && (
                <div className='user-Requests flex flex-wrap lg:text-2xl sm:text-2xl xl:text-2xl md:text-xl  text-xl ml-2 mr-2 mb-10 mt-20  items-center justify-evenly'>
                    {requests.map((donater, index) => (
                        <div className='request border-4 bg-body-tertiary  py-2  px-3  rounded-xl hover:shadow-2xl'>
                            <Link to={`/donorsResponse?requestNumber=${donater._id}`} className='links-decorations'>
                                <div key={donater._id}>
                                    <div className='flex ml-2 justify-between mr-4  '>
                                        <p>Required Blood Group :</p> <p className='bg-red-500 px-4 py-1 flex items-center justify-center rounded-2xl text-white'> {donater.bloodGroup.toUpperCase()}</p>
                                    </div>
                                    <div className='flex ml-2 justify-between mr-2 items-start'>
                                        <p>Requestd by : </p> <p> {donater.name}</p>
                                    </div>
                                    <div className='flex ml-2 justify-between mr-2 items-start'>

                                        <p>Phone Number :</p> <p> {donater.phoneNumber}</p>
                                    </div>
                                    <div className='flex ml-2 justify-between mr-2 items-start'>

                                        <p>Requested at : </p><p> {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>
                                    </div>
                                    <div className='flex ml-2 justify-between mr-2 items-start'>

                                        <p>Donors Responded : </p><p> {donater.donorsResponse.length}</p>
                                    </div>
                                    <br /><br />
                                </div>
                            </Link>
                            <p>
                                <a
                                    href={`https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Request Location on Google Maps
                                </a>
                            </p>
                        </div>
                    ))}
                </div>
            )}

        </>
    );
}

export default BloodRequirement;

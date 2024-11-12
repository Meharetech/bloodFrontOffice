
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Hero.css';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { BaseUrl } from './Util/util';

const AllRequests = () => {
    const [donaters, setDonaters] = useState([]);
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [hospitalRequest, setHospitalRequest] = useState([]);
    const [campRequests, setCampRequests] = useState([]);
    const [location, setLocation] = useState({ longitude: null, latitude: null });
    const [showCamps, setShowCamps] = useState(false);

    const sendLocation = async () => {
        const token = localStorage.getItem('token');
        if (location.latitude && location.longitude) {
            try {
                const response = await axios.get(`${BaseUrl}/getLocation`, {
                    params: { location },
                    headers: { Authorization: token },
                });
                setDonaters(response.data.donaters || []);
                setCampRequests(response.data.camps || []);
                setHospitalRequest(response.data.hospitalRequests || []);
                setEmergencyRequests(response.data.emergencyRequest || [])
            } catch (error) {
                console.error(error);
            }
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => console.error('Error getting location:', error)
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    useEffect(() => {
        if (location.latitude && location.longitude) {
            sendLocation();
        }
    }, [location]);

    useEffect(() => {
        Aos.init({ duration: 1000, once: true });
    }, []);

    return (
        <>
            <button
                onClick={() => setShowCamps(!showCamps)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {showCamps ? 'Hide Camps' : 'Show Camps'}
            </button>

            {showCamps && (
                campRequests.length > 0 ? (
                    <div className="flex flex-col p-4 md:p-6 lg:p-8">
                        <h2>Camps</h2>
                        <div className="grid gap-4 justify-center items-center md:grid-cols-2 lg:grid-cols-3">
                            {campRequests.map((camp, index) => (
                                <div
                                    key={index}
                                    className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8 flex flex-col"
                                >
                                    <h1 className="text-xl font-semibold text-gray-800">{camp.campName}</h1>
                                    <h2 className="text-lg text-gray-600">{camp.campAddress}</h2>
                                    <h3 className="text-sm text-gray-500 mb-4">
                                        from - {new Date(camp.startDate).toLocaleDateString('en-IN')} - to -{' '}
                                        {new Date(camp.endDate).toLocaleDateString('en-GB')}
                                    </h3>
                                    <button
                                        onClick={() => window.open(`https://www.google.com/maps?q=${camp.location?.latitude},${camp.location?.longitude}`, '_blank')}
                                        className="mt-auto bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 focus:outline-none"
                                    >
                                        Location
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 p-4">No camp requests available.</p>
                )
            )}

            <div data-aos="fade-zoom">
                <div className="flex items-center justify-center mt-28 mb-28">
                    <h2 className="text-2xl w-96 text-white rounded-full font-bold bg-red-600">Emergency Request Near You</h2>
                </div>
                <ul className="donater-grid ml-2 mr-2 mt-2 flex items-center lg:text-2xl justify-evenly">
                    {emergencyRequests.map((donater, index) => (
                        <Link to={`/donationDetails?donationId=${donater._id}`} key={index}>
                            <li className="border-4 bg-slate-50">
                                <div>
                                    <div className="flex justify-between">
                                        <p>Required Blood Group</p>
                                        <p className="text-white flex justify-center items-center rounded-2xl px-4 py-1 bg-red-500">
                                            {donater.bloodGroup.toUpperCase()}
                                        </p>
                                    </div>
                                    <p>
                                        <a
                                            href={`https://wa.me/${donater.phoneNumber}?text=${encodeURIComponent(`Blood request for group ${donater.bloodGroup}. Location: https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Send WhatsApp Message
                                        </a>
                                    </p>
                                    <p>Requested at - {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>
                                    <p>
                                        <a
                                            href={`https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Location on Google Maps
                                        </a>
                                    </p>
                                    <p className="text-white flex justify-center items-center rounded-2xl px-4 py-1 bg-red-500">
                                        {donater.city.toUpperCase()}
                                    </p>
                                    <p className="text-white flex justify-center items-center rounded-2xl px-4 py-1 bg-red-500">
                                        {donater.hospitalName.toUpperCase()}
                                    </p>
                                </div>
                                <p>Donors Responded - {donater.donorsResponse.length}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>

            <div data-aos="fade-zoom">
                <div className="flex items-center justify-center mt-28 mb-28">
                    <h2 className="text-2xl w-96 text-white rounded-full font-bold bg-red-600">Blood Request Near You</h2>
                </div>
                <ul className="donater-grid ml-2 mr-2 mt-2 flex items-center lg:text-2xl justify-evenly">
                    {donaters.map((donater, index) => (
                        <Link to={`/donationDetails?donationId=${donater._id}`} key={index}>
                            <li className="border-4 bg-slate-50">
                                <div>
                                    <div className="flex justify-between">
                                        <p>Required Blood Group</p>
                                        <p className="text-white flex justify-center items-center rounded-2xl px-4 py-1 bg-red-500">
                                            {donater.bloodGroup.toUpperCase()}
                                        </p>
                                    </div>
                                    <p>
                                        <a
                                            href={`https://wa.me/${donater.phoneNumber}?text=${encodeURIComponent(`Blood request for group ${donater.bloodGroup}. Location: https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Send WhatsApp Message
                                        </a>
                                    </p>
                                    <p>Requested at - {new Date(donater.dateOfQuery).toLocaleTimeString()}</p>
                                    <p>
                                        <a
                                            href={`https://www.google.com/maps?q=${donater.location.latitude},${donater.location.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Location on Google Maps
                                        </a>
                                    </p>
                                </div>
                                <p>Donors Responded - {donater.donorsResponse.length}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-2">
                <h2 className="text-2xl font-semibold mb-4">Hospital Blood Request</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {hospitalRequest.map((request, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-300 flex flex-col space-y-3"
                        >
                            <div className="text-lg font-medium">Hospital Name: <span className="font-normal">{request.name}</span></div>
                            <Link to={`/hospitaldonationDetails?donationId=${request._id}`}>Donate Now</Link>
                            <div className="text-lg font-medium">Needed Blood Group: <span className="font-normal">{request.bloodGroup}</span></div>
                            <div className="text-lg font-medium">
                                Hospital Location:
                                <a
                                    href={`https://www.google.com/maps?q=${request.location.latitude},${request.location.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-500 hover:underline"
                                >
                                    Open Google Map
                                </a>
                            </div>
                            <div className="text-lg font-medium">Phone Number: <span className="font-normal">{request.phoneNumber}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AllRequests;

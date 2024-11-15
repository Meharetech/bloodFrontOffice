// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { BaseUrl } from '../Util/util';

// const AllDonations = () => {
//     const [allBloodRequests, setAllBloodRequests] = useState([]);
//     const [emergencyRequests, setEmergencyRequests] = useState([]);
//     const [filteredRequests, setFilteredRequests] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filterOption, setFilterOption] = useState('all');

//     const getAllDonation = async () => {
//         try {
//             const response = await axios.get(`${BaseUrl}/getAllBloodRequests`);
//             setAllBloodRequests(response.data.allBloodRequests);
//             setEmergencyRequests(response.data.getAllEmergencyRequests);
//             setFilteredRequests([...response.data.getAllEmergencyRequests, ...response.data.allBloodRequests]);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         getAllDonation();
//     }, []);

//     useEffect(() => {
//         // Combine both emergency and all blood requests for filtering
//         let combinedRequests = [...emergencyRequests, ...allBloodRequests];

//         // Search functionality: match name, phone number, or blood group
//         if (searchQuery) {
//             combinedRequests = combinedRequests.filter(request =>
//                 request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 request.phoneNumber.includes(searchQuery) ||
//                 request.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }

//         // Date filter functionality
//         if (filterOption === 'today') {
//             const today = new Date().toISOString().slice(0, 10);
//             combinedRequests = combinedRequests.filter(request => request.dateOfQuery.startsWith(today));
//         } else if (filterOption === 'thisWeek') {
//             const today = new Date();
//             const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
//             combinedRequests = combinedRequests.filter(request => new Date(request.dateOfQuery) >= startOfWeek);
//         } else if (filterOption === 'thisMonth') {
//             const thisMonth = new Date().getMonth();
//             combinedRequests = combinedRequests.filter(request => new Date(request.dateOfQuery).getMonth() === thisMonth);
//         }

//         setFilteredRequests(combinedRequests);
//     }, [searchQuery, filterOption, allBloodRequests, emergencyRequests]);

//     return (
//         <div className="container mx-auto p-6">
//             <h2 className="text-2xl font-semibold text-red-500 mb-4">Emergency and All Blood Requests ({filteredRequests.length})</h2>

//             <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
//                 <input
//                     type="text"
//                     placeholder="Search by name, phone, or blood group"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full sm:w-1/2 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <select
//                     value={filterOption}
//                     onChange={(e) => setFilterOption(e.target.value)}
//                     className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                     <option value="all">All</option>
//                     <option value="today">Today</option>
//                     <option value="thisWeek">This Week</option>
//                     <option value="thisMonth">This Month</option>
//                 </select>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {filteredRequests.map(request => (
//                     <div
//                         key={request._id}
//                         className={`p-4 rounded shadow-md 
//                                 ${emergencyRequests.some(e => e._id === request._id)
//                                 ? 'bg-red-100 border-l-4 border-red-500'
//                                 : 'bg-blue-100 border-l-4 border-blue-500'
//                             }`}
//                     >
//                         <p className="font-semibold"><strong>Name:</strong> {request.name}</p>
//                         <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
//                         <p><strong>Phone:</strong> {request.phoneNumber}</p>
//                         {request.city && <p><strong>City:</strong> {request.city}</p>}
//                         {request.hospitalName && <p><strong>Hospital:</strong> {request.hospitalName}</p>}
//                         <p><strong>Date of Request:</strong> {new Date(request.dateOfQuery).toLocaleString()}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AllDonations;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../Util/util';
import { Link } from 'react-router-dom';

const AllDonations = () => {
    const [allBloodRequests, setAllBloodRequests] = useState([]);
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [previousRequests, setPreviousRequest] = useState([])
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('all');
    const [viewType, setViewType] = useState('all'); // New state to toggle view

    const getAllDonation = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/getAllBloodRequests`);
            setAllBloodRequests(response.data.allBloodRequests);
            setEmergencyRequests(response.data.getAllEmergencyRequests);
            setPreviousRequest(response.data.previousRequests)
            setFilteredRequests([
                ...response.data.getAllEmergencyRequests,
                ...response.data.allBloodRequests,
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllDonation();
    }, []);

    useEffect(() => {
        let combinedRequests =
            viewType === 'emergency'
                ? emergencyRequests
                : viewType === 'normal'
                    ? allBloodRequests
                    : [...emergencyRequests, ...allBloodRequests];

        if (searchQuery) {
            combinedRequests = combinedRequests.filter(request =>
                request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.phoneNumber.includes(searchQuery) ||
                request.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterOption === 'today') {
            const today = new Date().toISOString().slice(0, 10);
            combinedRequests = combinedRequests.filter(request => request.dateOfQuery.startsWith(today));
        } else if (filterOption === 'thisWeek') {
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            combinedRequests = combinedRequests.filter(request => new Date(request.dateOfQuery) >= startOfWeek);
        } else if (filterOption === 'thisMonth') {
            const thisMonth = new Date().getMonth();
            combinedRequests = combinedRequests.filter(request => new Date(request.dateOfQuery).getMonth() === thisMonth);
        }

        setFilteredRequests(combinedRequests);
    }, [searchQuery, filterOption, viewType, allBloodRequests, emergencyRequests]);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold text-red-500 mb-4">
                Emergency and All Blood Requests ({filteredRequests.length})
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name, phone, or blood group"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-1/2 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                </select>
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded shadow ${viewType === 'emergency'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => setViewType('emergency')}
                >
                    Emergency Requests
                </button>
                <button
                    className={`px-4 py-2 rounded shadow ${viewType === 'normal'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => setViewType('normal')}
                >
                    Normal Requests
                </button>
                <button
                    className={`px-4 py-2 rounded shadow ${viewType === 'all'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => setViewType('all')}
                >
                    All Requests
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRequests.map(request => (
                    <div
                        key={request._id}
                        className={`p-4 rounded shadow-md 
                                ${emergencyRequests.some(e => e._id === request._id)
                                ? 'bg-red-100 border-l-4 border-red-500'
                                : 'bg-blue-100 border-l-4 border-blue-500'
                            }`}
                    >
                        <p className="font-semibold">
                            <strong>Name:</strong> {request.name}
                        </p>
                        <p>
                            <strong>Blood Group:</strong> {request.bloodGroup}
                        </p>
                        <p>
                            <strong>Phone:</strong> {request.phoneNumber}
                        </p>
                        {request.city && <p><strong>City:</strong> {request.city}</p>}
                        {request.hospitalName && <p><strong>Hospital:</strong> {request.hospitalName}</p>}
                        <Link
                            to={`/donorsResponseAdmin?requestId=${request._id}`}
                            className="text-red-600 hover:text-red-500 transition-colors col-span-2"
                        >
                            Donor's Response
                        </Link>
                        <p>
                            <strong>Date of Request:</strong>{' '}
                            {new Date(request.dateOfQuery).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-40">
                <h1 className='text-3xl font-semibold mb-16'>Old Requests</h1>
                {previousRequests.map(request => (
                    <div
                        key={request._id}
                        className={`p-4 rounded shadow-md 
                                ${emergencyRequests.some(e => e._id === request._id)
                                ? 'bg-red-100 border-l-4 border-red-500'
                                : 'bg-blue-100 border-l-4 border-blue-500'
                            }`}
                    >
                        <p className="font-semibold">
                            <strong>Name:</strong> {request.name}
                        </p>
                        <p>
                            <strong>Blood Group:</strong> {request.bloodGroup}
                        </p>
                        <p>
                            <strong>Phone:</strong> {request.phoneNumber}
                        </p>
                        {request.city && <p><strong>City:</strong> {request.city}</p>}
                        {request.hospitalName && <p><strong>Hospital:</strong> {request.hospitalName}</p>}
                        <Link
                            to={`/donorsResponseAdmin?requestId=${request._id}`}
                            className="text-red-600 hover:text-red-500 transition-colors col-span-2"
                        >
                            Donor's Response
                        </Link>
                        <p>
                            <strong>Date of Request:</strong>{' '}
                            {new Date(request.dateOfQuery).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllDonations;

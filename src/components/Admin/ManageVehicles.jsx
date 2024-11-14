import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../Util/util';
import axios from 'axios';

const ManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);

    const getAllVehicles = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/getAllVehicles`);
            setVehicles(response.data); // Assuming response.data contains the array of vehicles
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (vehicleId) => {
        try {
            await axios.delete(`${BaseUrl}/deleteVehicle`, {
                headers: {
                    Authorization: localStorage.getItem('adminToken')
                },
                params: {
                    vehicleId: vehicleId
                }
            });
            setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleId));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleEdit = (vehicle) => {
        window.scrollTo(0, 290);
        setCurrentVehicle(vehicle);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const updatedVehicle = await axios.put(`${BaseUrl}/updateVehicleDetails`, currentVehicle, {
                headers: {
                    Authorization: localStorage.getItem('adminToken')
                },
                params: {
                    id: currentVehicle._id
                }
            });
            setVehicles(vehicles.map(vehicle => vehicle._id === currentVehicle._id ? updatedVehicle.data : vehicle));
            setIsEditing(false);
            setCurrentVehicle(null);
        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };

    useEffect(() => {
        getAllVehicles();
    }, []);

    // Filtered vehicles based on searchTerm (by pincode, licensePlate, or contactNumber)
    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.pincode.includes(searchTerm) ||
        vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.contactNumber.includes(searchTerm)
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Manage Vehicles</h1>

            {/* Search bar for pincode, license plate, or contact number */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search by pincode, license plate, or contact number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Edit form */}
            {isEditing && currentVehicle && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={currentVehicle.ownerName}
                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, ownerName: e.target.value })}
                            className="w-full p-3 border rounded-md"
                            placeholder="Owner Name"
                        />
                        <input
                            type="text"
                            value={currentVehicle.licensePlate}
                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, licensePlate: e.target.value })}
                            className="w-full p-3 border rounded-md"
                            placeholder="License Plate"
                        />
                        <input
                            type="text"
                            value={currentVehicle.pincode}
                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, pincode: e.target.value })}
                            className="w-full p-3 border rounded-md"
                            placeholder="Pincode"
                        />
                        <input
                            type="number"
                            value={currentVehicle.capacity}
                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, capacity: e.target.value })}
                            className="w-full p-3 border rounded-md"
                            placeholder="Capacity"
                        />
                        <input
                            type="text"
                            value={currentVehicle.contactNumber}
                            onChange={(e) => setCurrentVehicle({ ...currentVehicle, contactNumber: e.target.value })}
                            className="w-full p-3 border rounded-md"
                            placeholder="Contact Number"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-full bg-gray-500 text-white p-3 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Vehicle List */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {filteredVehicles.length > 0 ? (
                    filteredVehicles.map(vehicle => (
                        // <div
                        //     key={vehicle._id}
                        //     className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                        // >
                        //     <p className="font-semibold text-gray-800 mb-2"><span className="font-bold">Owner Name:</span> {vehicle.ownerName}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Vehicle Type:</span> {vehicle.vehicleType}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">License Plate:</span> {vehicle.licensePlate}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Pincode:</span> {vehicle.pincode}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Capacity:</span> {vehicle.capacity}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Contact Number:</span> {vehicle.contactNumber}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Availability:</span> {vehicle.availability ? 'Available' : 'Not Available'}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Date of Availability:</span> {new Date(vehicle.dateOfAvailability).toLocaleDateString()}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Available Days:</span> {vehicle.availableDays}</p>
                        //     <p className="text-gray-600"><span className="font-semibold">Expiration Date:</span> {new Date(vehicle.expirationDate).toLocaleDateString()}</p>
                        //     <div className="flex space-x-4 mt-4">
                        //         <button
                        //             onClick={() => handleEdit(vehicle)}
                        //             className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
                        //         >
                        //             Edit
                        //         </button>
                        //         <button
                        //             onClick={() => handleDelete(vehicle._id)}
                        //             className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                        //         >
                        //             Delete
                        //         </button>
                        //     </div>
                        // </div>
                        <div
                            key={vehicle._id}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                        >
                            {/* Owner Name */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 overflow-hidden font-semibold text-gray-800 mb-2 block">Owner Name:</label>
                                <input
                                    type="text"
                                    value={vehicle.ownerName}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Vehicle Type */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className=" w-2/6 font-semibold text-gray-800 mb-2 block">Vehicle Type:</label>
                                <input
                                    type="text"
                                    value={vehicle.vehicleType}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* License Plate */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">License Plate:</label>
                                <input
                                    type="text"
                                    value={vehicle.licensePlate}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Pincode */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Pincode:</label>
                                <input
                                    type="text"
                                    value={vehicle.pincode}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Capacity */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Capacity:</label>
                                <input
                                    type="number"
                                    value={vehicle.capacity}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Contact Number */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Contact Number:</label>
                                <input
                                    type="text"
                                    value={vehicle.contactNumber}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Availability */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Availability:</label>
                                <input
                                    type="text"
                                    value={vehicle.availability ? 'Available' : 'Not Available'}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Date of Availability */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Date of Availability:</label>
                                <input
                                    type="text"
                                    value={new Date(vehicle.dateOfAvailability).toLocaleDateString()}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Available Days */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Available Days:</label>
                                <input
                                    type="text"
                                    value={vehicle.availableDays}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Expiration Date */}
                            <div className="mb-4 flex justify-between text-nowrap">
                                <label className="w-2/6 font-semibold text-gray-800 mb-2 block">Expiration Date:</label>
                                <input
                                    type="text"
                                    value={new Date(vehicle.expirationDate).toLocaleDateString()}
                                    readOnly
                                    className="w-3/5 overflow-hidden p-2 border border-gray-300 rounded-md bg-gray-100"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => handleEdit(vehicle)}
                                    className="bg-yellow-500 text-white py-2 px-5 rounded-md hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(vehicle._id)}
                                    className="bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No vehicles found for this search term.</p>
                )}
            </div>
        </div>
    );
};

export default ManageVehicles;

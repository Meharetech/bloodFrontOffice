import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../Util/util';

const BloodBankDetails = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        bloodTypes: [{ bloodGroup: '', amount: 0 }],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHospitalDetails();
    }, []);

    // Fetch hospital details
    const fetchHospitalDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BaseUrl}/getBloodBankDetails`, {
                headers: { Authorization: localStorage.getItem('htoken') },
            });
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching hospital details:', error);
        }
        setLoading(false);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle blood type changes
    const handleBloodTypeChange = (index, field, value) => {
        const updatedBloodTypes = [...formData.bloodTypes];
        updatedBloodTypes[index][field] = value;
        setFormData({ ...formData, bloodTypes: updatedBloodTypes });
    };

    // Add a new blood group
    const addBloodGroup = () => {
        setFormData({
            ...formData,
            bloodTypes: [...formData.bloodTypes, { bloodGroup: '', amount: 0 }],
        });
    };

    // Remove a blood group
    const removeBloodGroup = (index) => {
        const updatedBloodTypes = formData.bloodTypes.filter((_, i) => i !== index);
        setFormData({ ...formData, bloodTypes: updatedBloodTypes });
    };

    // Add or Update hospital details
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${BaseUrl}/updateBloodBank`, formData, {
                headers: { Authorization: localStorage.getItem('htoken') },
            });
            setMessage('Hospital details updated successfully!');
            fetchHospitalDetails(); // Refresh details after update
        } catch (error) {
            console.error('Error updating hospital details:', error);
            setMessage('Failed to update details.');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Hospital Blood Bank Details</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700">Hospital Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Blood Types</label>
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="px-4 py-2 text-left">Blood Group</th>
                                    <th className="px-4 py-2 text-left">Amount</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.bloodTypes.map((bloodType, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={bloodType.bloodGroup}
                                                onChange={(e) =>
                                                    handleBloodTypeChange(
                                                        index,
                                                        'bloodGroup',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Blood Group"
                                                className="w-full p-2 border border-gray-300 rounded"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={bloodType.amount}
                                                onChange={(e) =>
                                                    handleBloodTypeChange(index, 'amount', e.target.value)
                                                }
                                                placeholder="Amount"
                                                className="w-full p-2 border border-gray-300 rounded"
                                                min="0"
                                                required
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeBloodGroup(index)}
                                                className="px-2 py-1 text-red-500 border border-red-500 rounded hover:bg-red-100"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            type="button"
                            onClick={addBloodGroup}
                            className="mt-4 py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Add Blood Group
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {loading ? 'Updating...' : 'Update Details'}
                    </button>
                    {message && <p className="text-center text-green-600 mt-4">{message}</p>}
                </form>
            )}
        </div>
    );
};

export default BloodBankDetails;

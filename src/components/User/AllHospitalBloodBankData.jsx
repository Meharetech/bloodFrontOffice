import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../Util/util'

const AllHospitalBloodBankData = () => {
    const [bloodBankData, setBloodBankData] = useState([])
    const [searchQuery, setSearchQuery] = useState('') // State to track the search input
    const [filteredData, setFilteredData] = useState([]) // State to store filtered data

    const getAllBankData = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/getAllBloodBankDetails`)
            setBloodBankData(response.data)
            setFilteredData(response.data) // Initially, filtered data is the same as fetched data
        } catch (error) {
            console.error(error)
        }
    }

    // Update filtered data whenever searchQuery or bloodBankData changes
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase()
        const filtered = bloodBankData.filter((bank) =>
            bank.name.toLowerCase().includes(lowerCaseQuery)
        )
        setFilteredData(filtered)
    }, [searchQuery, bloodBankData])

    useEffect(() => {
        getAllBankData()
    }, [])

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
                All Hospital Blood Bank Data
            </h1>
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {filteredData.length > 0 ? (
                filteredData.map((bank) => (
                    <div
                        key={bank._id}
                        className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            {bank.name}
                        </h2>
                        <p className="text-gray-600">
                            <strong>Address:</strong> {bank.address}
                        </p>
                        <p className="text-gray-600">
                            <strong>Hospital Name:</strong> {bank.hospitalId.name}
                        </p>
                        <p className="text-gray-600">
                            <strong>Contact:</strong> {bank.hospitalId.contact.phone} /{' '}
                            {bank.hospitalId.contact.email}
                        </p>
                        <div className="overflow-x-auto mt-4">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-blue-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Blood Group
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bank.bloodTypes.map((bloodType) => (
                                        <tr
                                            key={bloodType._id}
                                            className="hover:bg-gray-100 transition-colors"
                                        >
                                            <td className="border border-gray-300 px-4 py-2">
                                                {bloodType.bloodGroup}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {bloodType.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex justify-center items-center h-full">
                    <p className="text-lg text-gray-600">No data found...</p>
                </div>
            )}
        </div>
    )
}

export default AllHospitalBloodBankData

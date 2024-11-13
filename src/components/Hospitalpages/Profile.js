import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../Util/util';

const HProfile = () => {
  const [profile, setProfile] = useState({});

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem('htoken');
      const response = await axios.get(`${BaseUrl}/hospitalProfileDetails`, {
        headers: { Authorization: token }
      });
      console.log('Response data:', response.data);
      setProfile(response.data.user);  // Set the response data directly to profile state
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    const keys = name.split('.');
    if (keys.length === 2) {
      setProfile(prevProfile => ({
        ...prevProfile,
        [keys[0]]: {
          ...prevProfile[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('htoken');
      const response = await axios.put(
        `${BaseUrl}/updateHospitalProfileDetails`,
        profile,
        { headers: { Authorization: token } }
      );
      console.log('Profile updated successfully:', response.data);
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Hospital Profile</h2>

        <div className="space-y-6">
          {/* Organization Info Section */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700">Organization Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Website</label>
                <input
                  type="text"
                  name="website"
                  value={profile.website || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Special Instructions</label>
                <input
                  type="text"
                  name="specialInstructions"
                  value={profile.specialInstructions || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="contact.email"
                  value={profile.contact?.email || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="tel"
                  name="contact.phone"
                  value={profile.contact?.phone || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Street</label>
                <input
                  type="text"
                  name="address.street"
                  value={profile.address?.street || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={profile.address?.city || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">State</label>
                <input
                  type="text"
                  name="address.state"
                  value={profile.address?.state || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={profile.address?.postalCode || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HProfile;
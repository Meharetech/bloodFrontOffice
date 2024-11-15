// import React, { useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { BaseUrl } from '../Util/util';

// const VolunteerVehicle = () => {
//   const [formData, setFormData] = useState({
//     ownerName: '',
//     vehicleType: 'Car',
//     licensePlate: '',
//     pincode: '',
//     capacity: 1,
//     contactNumber: '',
//     availability: true,
//     dateOfAvailability: '',
//     availableDays: 1, // New field for number of days until expiration, set default to 1
//   });

//   const [errors, setErrors] = useState({});

//   // Simple validation function
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.ownerName.trim()) {
//       newErrors.ownerName = 'Owner name is required';
//     }
//     if (!formData.licensePlate.trim()) {
//       newErrors.licensePlate = 'License plate is required';
//     }
//     if (!formData.contactNumber.trim()) {
//       newErrors.contactNumber = 'Contact number is required';
//     } else if (!/^\d{10}$/.test(formData.contactNumber)) {
//       newErrors.contactNumber = 'Contact number must be 10 digits';
//     }
//     if (formData.capacity < 1) {
//       newErrors.capacity = 'Capacity must be at least 1';
//     }
//     if (!formData.dateOfAvailability) {
//       newErrors.dateOfAvailability = 'Date of availability is required';
//     }
//     // Validate expiration days between 1 and 7
//     if (formData.availableDays < 1 || formData.availableDays > 7) {
//       newErrors.availableDays = 'Expiration days must be between 1 and 7';
//     }

//     if (formData.pincode.length !== 6) {
//       newErrors.pincode = 'Pincode must be 6 digits';
//     }

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form data
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       toast.error('Please fix the errors in the form.');
//       return;
//     }
//     setErrors({}); // Clear errors if validation passed

//     // Calculate the expiration date
//     const expirationDate = new Date();
//     expirationDate.setDate(expirationDate.getDate() + parseInt(formData.availableDays));

//     try {
//       // Send a POST request using axios, with calculated expiration date
//       const response = await axios.post(`${BaseUrl}/registerVehicle`, {
//         ...formData,
//         expirationDate: expirationDate.toISOString(), // Send the expiration date
//       });

//       if (response.status === 201) {
//         toast.success('Vehicle registered successfully');
//         setFormData({
//           ownerName: '',
//           vehicleType: 'Car',
//           licensePlate: '',
//           pincode:'',
//           capacity: 1,
//           contactNumber: '',
//           availability: true,
//           dateOfAvailability: '',
//           availableDays: 1, // Reset the days field to 1
//         });
//       } else {
//         toast.error('Error: Failed to register vehicle');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error: Could not reach the server');
//     }
//   };

//   return (
//     <div className='min-h-screen flex items-center justify-center'>
//       <form
//         className='bg-white p-8 shadow-lg rounded-lg w-full max-w-md'
//         onSubmit={handleSubmit}
//       >
//         <h2 className='text-2xl font-bold mb-6 text-center'>Volunteer Vehicle Registration</h2>

//         {/* Owner Name */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='ownerName'>
//             Owner Name
//           </label>
//           <input
//             type='text'
//             id='ownerName'
//             name='ownerName'
//             value={formData.ownerName}
//             onChange={handleChange}
//             required
//             className={`w-full px-3 py-2 border rounded ${errors.ownerName ? 'border-red-500' : ''}`}
//           />
//           {errors.ownerName && (
//             <p className='text-red-500 text-sm mt-1'>{errors.ownerName}</p>
//           )}
//         </div>

//         {/* Vehicle Type */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='vehicleType'>
//             Vehicle Type
//           </label>
//           <select
//             id='vehicleType'
//             name='vehicleType'
//             value={formData.vehicleType}
//             onChange={handleChange}
//             className='w-full px-3 py-2 border rounded'
//           >
//             <option value='Car'>Car</option>
//             <option value='Truck'>Truck</option>
//             <option value='Van'>Van</option>
//             <option value='Motorcycle'>Motorcycle</option>
//             <option value='Other'>Other</option>
//           </select>
//         </div>

//         {/* License Plate */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='licensePlate'>
//             License Plate
//           </label>
//           <input
//             type='text'
//             id='licensePlate'
//             name='licensePlate'
//             value={formData.licensePlate}
//             onChange={handleChange}
//             required
//             className={`w-full px-3 py-2 border rounded ${errors.licensePlate ? 'border-red-500' : ''}`}
//           />
//           {errors.licensePlate && (
//             <p className='text-red-500 text-sm mt-1'>{errors.licensePlate}</p>
//           )}
//         </div>

//         {/* Pincode */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='pincode'>
//             Pincode
//           </label>
//           <input
//             type='text'
//             id='pincode'
//             name='pincode'
//             value={formData.pincode}
//             onChange={handleChange}
//             required
//             className={`w-full px-3 py-2 border rounded ${errors.pincode ? 'border-red-500' : ''}`}
//           />
//           {errors.pincode && (
//             <p className='text-red-500 text-sm mt-1'>{errors.pincode}</p>
//           )}
//         </div>

//         {/* Capacity */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='capacity'>
//             Capacity (Number of passengers)
//           </label>
//           <input
//             type='number'
//             id='capacity'
//             name='capacity'
//             value={formData.capacity}
//             onChange={handleChange}
//             required
//             min='1'
//             className={`w-full px-3 py-2 border rounded ${errors.capacity ? 'border-red-500' : ''}`}
//           />
//           {errors.capacity && (
//             <p className='text-red-500 text-sm mt-1'>{errors.capacity}</p>
//           )}
//         </div>

//         {/* Contact Number */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='contactNumber'>
//             Contact Number
//           </label>
//           <input
//             type='tel'
//             id='contactNumber'
//             name='contactNumber'
//             value={formData.contactNumber}
//             onChange={handleChange}
//             required
//             className={`w-full px-3 py-2 border rounded ${errors.contactNumber ? 'border-red-500' : ''}`}
//           />
//           {errors.contactNumber && (
//             <p className='text-red-500 text-sm mt-1'>{errors.contactNumber}</p>
//           )}
//         </div>

//         {/* Date of Availability */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='dateOfAvailability'>
//             Date of Availability
//           </label>
//           <input
//             type='date'
//             id='dateOfAvailability'
//             name='dateOfAvailability'
//             value={formData.dateOfAvailability}
//             onChange={handleChange}
//             required
//             className={`w-full px-3 py-2 border rounded ${errors.dateOfAvailability ? 'border-red-500' : ''}`}
//           />
//           {errors.dateOfAvailability && (
//             <p className='text-red-500 text-sm mt-1'>{errors.dateOfAvailability}</p>
//           )}
//         </div>

//         {/* Expiration Days */}
//         <div className='mb-4'>
//           <label className='block text-gray-700 mb-2' htmlFor='availableDays'>
//             Number of Days Available
//           </label>
//           <input
//             type='number'
//             id='availableDays'
//             name='availableDays'
//             value={formData.availableDays}
//             onChange={handleChange}
//             required
//             min='1'
//             max='7' // Add the limit here
//             className={`w-full px-3 py-2 border rounded ${errors.availableDays ? 'border-red-500' : ''}`}
//           />
//           {errors.availableDays && (
//             <p className='text-red-500 text-sm mt-1'>{errors.availableDays}</p>
//           )}
//         </div>

//         {/* Availability */}
//         <div className='mb-4'>
//           <label className='inline-flex items-center'>
//             <input
//               type='checkbox'
//               name='availability'
//               checked={formData.availability}
//               onChange={handleChange}
//               className='form-checkbox'
//             />
//             <span className='ml-2 text-gray-700'>Currently Available</span>
//           </label>
//         </div>

//         <button
//           type='submit'
//           className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'
//         >
//           Submit
//         </button>
//         <ToastContainer />
//       </form>
//     </div>
//   );
// };

// export default VolunteerVehicle;



import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BaseUrl } from '../Util/util';

const VolunteerVehicle = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    vehicleType: 'Car',
    licensePlate: '',
    pincode: '',
    capacity: 1,
    contactNumber: '',
    availability: true,
    dateOfAvailability: '',
    availableDays: 1, // New field for number of days until expiration, set default to 1
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  // Simple validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    if (!formData.dateOfAvailability) {
      newErrors.dateOfAvailability = 'Date of availability is required';
    }
    // Validate expiration days between 1 and 7
    if (formData.availableDays < 1 || formData.availableDays > 7) {
      newErrors.availableDays = 'Expiration days must be between 1 and 7';
    }

    if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please fix the errors in the form.');
      return;
    }
    setErrors({}); // Clear errors if validation passed

    // Calculate the expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(formData.availableDays));

    try {
      // Send a POST request using axios, with calculated expiration date
      const response = await axios.post(`${BaseUrl}/registerVehicle`, {
        ...formData,
        expirationDate: expirationDate.toISOString(), // Send the expiration date
      });

      if (response.status === 201) {
        toast.success('Vehicle registered successfully. OTP sent to your phone!');

        // Trigger OTP sending
        sendOtp(formData.contactNumber);

        // Set OTP sent state
        setOtpSent(true);

        // Start the countdown timer for OTP expiration
        startOtpTimer();
      } else {
        toast.error('Error: Failed to register vehicle');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: Could not reach the server');
    }
  };

  const sendOtp = async (contactNumber) => {
    try {
      const response = await axios.post(`${BaseUrl}/sendOtp`, { contactNumber });

      if (response.status === 200) {
        toast.success('OTP sent successfully!');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${BaseUrl}/verifyVehicleOtp`, { otp, contactNumber: formData.contactNumber });

      if (response.status === 200) {
        setOtpVerified(true);
        toast.success('OTP verified successfully!');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Error verifying OTP');
    }
  };

  const startOtpTimer = () => {
    let countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setOtpSent(false);
          toast.error('OTP expired!');
          return 600; // Reset timer to 10 minutes
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form
        className='bg-white p-8 shadow-lg rounded-lg w-full max-w-md'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>Volunteer Vehicle Registration</h2>

        {/* Owner Name */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='ownerName'>
            Owner Name
          </label>
          <input
            type='text'
            id='ownerName'
            name='ownerName'
            value={formData.ownerName}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded ${errors.ownerName ? 'border-red-500' : ''}`}
          />
          {errors.ownerName && (
            <p className='text-red-500 text-sm mt-1'>{errors.ownerName}</p>
          )}
        </div>

        {/* Vehicle Type */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='vehicleType'>
            Vehicle Type
          </label>
          <select
            id='vehicleType'
            name='vehicleType'
            value={formData.vehicleType}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded'
          >
            <option value='Car'>Car</option>
            <option value='Truck'>Truck</option>
            <option value='Van'>Van</option>
            <option value='Motorcycle'>Motorcycle</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        {/* License Plate */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='licensePlate'>
            License Plate
          </label>
          <input
            type='text'
            id='licensePlate'
            name='licensePlate'
            value={formData.licensePlate}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded ${errors.licensePlate ? 'border-red-500' : ''}`}
          />
          {errors.licensePlate && (
            <p className='text-red-500 text-sm mt-1'>{errors.licensePlate}</p>
          )}
        </div>

        {/* Pincode */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='pincode'>
            Pincode
          </label>
          <input
            type='text'
            id='pincode'
            name='pincode'
            value={formData.pincode}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded ${errors.pincode ? 'border-red-500' : ''}`}
          />
          {errors.pincode && (
            <p className='text-red-500 text-sm mt-1'>{errors.pincode}</p>
          )}
        </div>

        {/* Capacity */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='capacity'>
            Capacity (Number of passengers)
          </label>
          <input
            type='number'
            id='capacity'
            name='capacity'
            value={formData.capacity}
            onChange={handleChange}
            required
            min='1'
            className={`w-full px-3 py-2 border rounded ${errors.capacity ? 'border-red-500' : ''}`}
          />
          {errors.capacity && (
            <p className='text-red-500 text-sm mt-1'>{errors.capacity}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='contactNumber'>
            Contact Number
          </label>
          <input
            type='tel'
            id='contactNumber'
            name='contactNumber'
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded ${errors.contactNumber ? 'border-red-500' : ''}`}
          />
          {errors.contactNumber && (
            <p className='text-red-500 text-sm mt-1'>{errors.contactNumber}</p>
          )}
        </div>

        {/* Date of Availability */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='dateOfAvailability'>
            Date of Availability
          </label>
          <input
            type='date'
            id='dateOfAvailability'
            name='dateOfAvailability'
            value={formData.dateOfAvailability}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded ${errors.dateOfAvailability ? 'border-red-500' : ''}`}
          />
          {errors.dateOfAvailability && (
            <p className='text-red-500 text-sm mt-1'>{errors.dateOfAvailability}</p>
          )}
        </div>

        {/* Expiration Days */}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2' htmlFor='availableDays'>
            Number of Days Available
          </label>
          <input
            type='number'
            id='availableDays'
            name='availableDays'
            value={formData.availableDays}
            onChange={handleChange}
            required
            min='1'
            max='7' // Add the limit here
            className={`w-full px-3 py-2 border rounded ${errors.availableDays ? 'border-red-500' : ''}`}
          />
          {errors.availableDays && (
            <p className='text-red-500 text-sm mt-1'>{errors.availableDays}</p>
          )}
        </div>

        {/* Availability */}
        <div className='mb-4'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              name='availability'
              checked={formData.availability}
              onChange={handleChange}
              className='form-checkbox'
            />
            <span className='ml-2 text-gray-700'>Currently Available</span>
          </label>
        </div>

        {/* OTP Input if OTP is sent */}
        {otpSent && (
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2' htmlFor='otp'>
              Enter OTP
            </label>
            <input
              type='text'
              id='otp'
              name='otp'
              value={otp}
              onChange={handleOtpChange}
              required
              className={`w-full px-3 py-2 border rounded ${otpVerified ? '' : 'border-red-500'}`}
            />
            <button
              type='button'
              onClick={verifyOtp}
              className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 mt-2'
            >
              Verify OTP
            </button>
            {timer > 0 && <p className='text-gray-500 mt-2'>OTP expires in {Math.floor(timer / 60)}:{timer % 60}</p>}
          </div>
        )}

        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200'
        >
          Submit
        </button>

        <ToastContainer />
      </form>
    </div>
  );
};

export default VolunteerVehicle;
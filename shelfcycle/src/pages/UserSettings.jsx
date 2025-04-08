import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { toast } from 'react-toastify';
import SummaryAPI from '../common';
import imgToBase64 from '../helpers/imgToBase64';

const UserSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.user);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    image: user?.uploadPic || '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageBase64 = await imgToBase64(file);
      setFormData(prev => ({
        ...prev,
        file,
        image: imageBase64,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: user._id,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      uploadPic: formData.image,
    };

    try {
      const res = await fetch(SummaryAPI.updateUser.url, {
        method: SummaryAPI.updateUser.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(setUserDetails(data.data));
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center">
          <img
            src={formData.image}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover mb-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-600"
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FiSave /> Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserSettings;

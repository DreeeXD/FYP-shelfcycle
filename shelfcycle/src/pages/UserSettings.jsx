import React, { useEffect, useState } from 'react';
import { FiSave, FiKey } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { toast } from 'react-toastify';
import SummaryAPI from '../common';
import imgToBase64 from '../helpers/imgToBase64';

const UserSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    image: '',
    file: null,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(SummaryAPI.currentUser.url, {
          method: SummaryAPI.currentUser.method,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setUserDetails(data.data));
          setFormData((prev) => ({
            ...prev,
            username: data.data.username || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            image: data.data.uploadPic || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user on mount:', err);
      }
    };

    if (!user?._id) {
      fetchUserDetails();
    } else {
      setFormData((prev) => ({
        ...prev,
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        image: user?.uploadPic || '',
      }));
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageBase64 = await imgToBase64(file);
      setFormData((prev) => ({
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

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      const res = await fetch(SummaryAPI.changePassword.url, {
        method: SummaryAPI.changePassword.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) toast.success("Password changed successfully!");
      else toast.error(data.message || "Failed to change password");
    } catch (err) {
      toast.error("Server error during password change");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-6">
      <h2 className="text-2xl font-bold text-center mb-8">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={formData.image}
            alt="Profile Preview"
            className="w-28 h-28 rounded-full object-cover shadow mb-4 border-2 border-blue-500"
          />
          <label className="cursor-pointer bg-blue-50 px-4 py-1 rounded text-sm font-medium text-blue-600 hover:bg-blue-100 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow transition"
          >
            <FiSave size={18} />
            Save Changes
          </button>
        </div>
      </form>

      {/* Password Change Section */}
      <hr className="my-8" />
      <h3 className="text-lg font-semibold mb-4 text-center">Change Password</h3>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="password"
          name="oldPassword"
          placeholder="Current Password"
          value={formData.oldPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePasswordChange}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full shadow transition"
        >
          <FiKey size={18} />
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
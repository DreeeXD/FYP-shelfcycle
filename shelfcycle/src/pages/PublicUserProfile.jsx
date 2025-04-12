import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryAPI from "../common";
import moment from "moment";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${SummaryAPI.getUserById(id)}`);
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
        }
      } catch (err) {
        console.error("Error fetching public profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-6">
          <img
            src={userData.uploadPic}
            alt={userData.username}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{userData.username}</h2>
            <p className="text-sm text-gray-600">{userData.email}</p>
            <p className="text-sm text-gray-600">
              Joined on {moment(userData.createdAt).format("LL")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-blue-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">Books Listed</p>
            <p className="text-xl font-bold text-blue-800">{userData.totalBooks || 0}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">Books Sold</p>
            <p className="text-xl font-bold text-green-800">{userData.booksSold || 0}</p>
          </div>
        </div>

        {/* TODO: Add review section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">User Reviews</h3>
          <p className="text-gray-500 italic">No reviews yet.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;

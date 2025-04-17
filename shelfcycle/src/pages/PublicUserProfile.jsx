import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryAPI from "../common";
import moment from "moment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.user?.user);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${SummaryAPI.getUserReviews(userId)}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${SummaryAPI.getUserById(userId)}`);
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
    fetchReviews();
  }, [userId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(SummaryAPI.submitReview(userId), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setRating(5);
        setComment("");
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Review submission error:", err);
      toast.error("Server error submitting review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 dark:text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 dark:text-red-400">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {/* Profile Info */}
        <div className="flex items-center gap-6">
          <img
            src={userData.uploadPic}
            alt={userData.username}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{userData.username}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Joined on {moment(userData.createdAt).format("LL")}
            </p>
            <p className="text-sm text-yellow-600 font-medium">
              ⭐ {userData.averageRating || "No rating yet"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-blue-100 dark:bg-blue-200/20 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Books Listed</p>
            <p className="text-xl font-bold text-blue-800 dark:text-blue-400">{userData.totalBooks || 0}</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-200/20 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">Books Sold</p>
            <p className="text-xl font-bold text-green-800 dark:text-green-400">{userData.booksSold || 0}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">User Reviews</h3>

          {currentUser && currentUser._id !== userId && (
            <div className="mb-4 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded p-4">
              <h4 className="text-md font-semibold text-gray-700 dark:text-white mb-2">Write a Review</h4>
              <div className="flex items-center gap-3 mb-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border dark:border-gray-600 dark:bg-gray-800 text-sm rounded px-2 py-1 text-gray-800 dark:text-gray-200"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} ★</option>
                  ))}
                </select>
              </div>
              <textarea
                className="w-full border dark:border-gray-600 dark:bg-gray-800 text-sm rounded px-3 py-2 text-gray-800 dark:text-gray-200"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Your review..."
              ></textarea>
              <button
                onClick={handleSubmitReview}
                className="mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Submit Review
              </button>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {r.reviewer?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{moment(r.createdAt).fromNow()}</p>
                  </div>
                  <p className="text-yellow-600 text-sm mb-1">{"★".repeat(r.rating)}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;

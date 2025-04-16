import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SummaryAPI from '../common';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const user = useSelector((state) => state?.user?.user);
  const [userData, setUserData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(SummaryAPI.getUserById(user?._id));
      const data = await res.json();
      if (data.success) setUserData(data.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(SummaryAPI.getUserReviews(user?._id));
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchRecentUploads = async () => {
    try {
      const res = await fetch(SummaryAPI.myUploads.url, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        const sorted = data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setRecentBooks(sorted);
      }
    } catch (err) {
      console.error('Error fetching recent uploads:', err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserProfile();
      fetchReviews();
      fetchRecentUploads();
    }
  }, [user]);

  const animatedRating =
    userData?.averageRating && !isNaN(Number(userData.averageRating))
      ? Number(userData.averageRating).toFixed(1)
      : null;

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-8">

        {/* Profile Info */}
        <div className="flex items-center gap-6">
          <img
            src={userData.uploadPic || '/default-profile.png'}
            alt={userData.username}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{userData.username}</h2>
            <p className="text-sm text-gray-600">{userData.email}</p>
            <p className="text-sm text-gray-600">
              Joined on {moment(userData.createdAt).format('LL')}
            </p>
            <p className="text-sm text-yellow-600 font-medium flex items-center mt-1">
              ⭐{' '}
              <AnimatePresence>
                {animatedRating ? (
                  <motion.span
                    key={animatedRating}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.4 }}
                    className="ml-1"
                  >
                    {animatedRating}
                  </motion.span>
                ) : (
                  <span className="ml-1">No rating yet</span>
                )}
              </AnimatePresence>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">Books Uploaded</p>
            <p className="text-2xl font-bold text-blue-700">{userData.totalBooks || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">Books Sold</p>
            <p className="text-2xl font-bold text-green-700">{userData.booksSold || 0}</p>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">User Reviews</h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="bg-gray-50 border rounded p-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {r.reviewer?.username || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{moment(r.createdAt).fromNow()}</p>
                  </div>
                  <p className="text-yellow-600 text-sm mb-1">{'★'.repeat(r.rating)}</p>
                  <p className="text-sm text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No reviews yet.</p>
          )}
        </div>

        {/* Recent Uploads */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Recent Uploads</h3>
            <Link
              to="/user-profile/user-uploads"
              className="text-sm text-blue-600 hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {recentBooks.length > 0 ? (
              recentBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border rounded-lg shadow-sm overflow-hidden"
                >
                  <img
                    src={book.bookImage?.[0] || '/default-book.png'}
                    alt={book.bookTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="text-gray-800 font-semibold text-md truncate">{book.bookTitle}</h4>
                    <p className="text-sm text-gray-500">{moment(book.createdAt).format('ll')}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 italic col-span-full">No uploads yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

import React from 'react';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import moment from 'moment';

const UserProfile = () => {
  const user = useSelector((state) => state?.user?.user);

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-100 dark:bg-gray-900 md:flex hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="bg-white dark:bg-gray-800 min-h-full w-full max-w-72 sidebarShadow p-8 flex flex-col items-center pt-16 transition-colors duration-300">
        <div className="h-auto flex flex-col items-center justify-center w-full space-y-5">
          <div className="relative flex justify-center mb-6">
            {user?.uploadPic ? (
              <img
                src={user.uploadPic}
                className="w-32 h-32 rounded-full shadow-md object-cover border-2 border-blue-500"
                alt={user?.name}
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
                <FiUser className="text-gray-500 dark:text-gray-300 text-6xl" />
              </div>
            )}
          </div>
          <h2 className="text-lg capitalize font-semibold text-gray-800 dark:text-white">
            Username: {user?.username || 'Guest User'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Email: {user?.email || 'No Email Provided'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Phone: {user?.phone || 'No Phone Number'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Date Joined: {moment(user?.createdAt).format('ll') || 'Please Login'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-10 w-full text-center">
          <ul className="space-y-5 text-gray-700 dark:text-gray-300">
            <li className="font-medium cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition">
              <Link to={'user-uploads'}>My Uploads</Link>
            </li>

            <li className="font-medium cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition">
              <Link to={'user-settings'}>Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="w-full h-full p-5 text-gray-800 dark:text-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default UserProfile;

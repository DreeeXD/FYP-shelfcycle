import { useState } from 'react';
import Logo from '../assets/Logo.jpg';
import { FcSearch } from "react-icons/fc";
import { FiUser } from "react-icons/fi";
import { CiBoxList } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryAPI from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';

const Header = () => {
  const [profileMenu, setProfileMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state?.user?.user);
  const wishlistItems = useSelector((state) => state?.wishlist?.items || []);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryAPI.logoutUser.url, {
        method: SummaryAPI.logoutUser.method,
        credentials: 'include',
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        setProfileMenu(false);
        navigate('/login');
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      toast.error("Logout error");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center border rounded-full shadow-sm px-3 py-1 focus-within:ring-2 ring-blue-300 w-[300px]">
          <input
            type="text"
            placeholder="Search for books"
            className="flex-1 outline-none bg-transparent text-sm text-gray-700"
          />
          <FcSearch size={20} />
        </div>

        {/* Navigation + User Actions */}
        <div className="flex items-center gap-6 text-gray-700 relative">

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
            <Link to="/exchanges" className="hover:text-blue-600 transition">Exchanges</Link>
            <Link to="/chat" className="hover:text-blue-600 transition">Chat</Link>
          </div>

          {/* User Profile Icon */}
          <div className="relative">
            <div onClick={() => setProfileMenu((prev) => !prev)} className="cursor-pointer">
              {user?.uploadPic ? (
                <img
                  src={user.uploadPic}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition"
                />
              ) : (
                <FiUser size={25} className="hover:text-blue-500 transition" />
              )}
            </div>

            {profileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md border z-50">
                <Link
                  to="/user-profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setProfileMenu(false)}
                >
                  User Profile
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist Icon with Count */}
          <Link to="/wishlist" className="relative cursor-pointer hover:text-blue-500 transition">
            <CiBoxList size={22} />
            {wishlistItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistItems.length}
              </div>
            )}
          </Link>

          {/* Notifications */}
          <div className="relative cursor-pointer hover:text-blue-500 transition">
            <IoIosNotificationsOutline size={26} />
            <div className="absolute -top-2 -right-1 bg-blue-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
              0
            </div>
          </div>

          {/* Login/Logout */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

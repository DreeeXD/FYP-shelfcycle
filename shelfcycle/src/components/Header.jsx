import { useState, useEffect, useRef } from 'react';
import Logo from '../assets/Logo.jpg';
import { CiSearch } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { CiBoxList } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryAPI from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import HeaderNotifications from './HeaderNotifications';
import PropTypes from 'prop-types';

const Header = ({ socket }) => {
  const [profileMenu, setProfileMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);
  const wishlistItems = useSelector((state) => state?.wishlist?.items || []);

  // Handle Dark Mode Toggle
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Book suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()) {
        try {
          const res = await fetch(`${SummaryAPI.getBooks.url}?search=${query}`);
          const data = await res.json();
          setSuggestions(data.data.slice(0, 5));
          setShowDropdown(true);
        } catch (err) {
          console.error('Search fetch error', err);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!inputRef.current?.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(SummaryAPI.getNotifications.url, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
          const unread = data.data.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => socket.off("new_notification");
    }
  }, [socket]);

  const handleLogout = async () => {
    try {
      const res = await fetch(SummaryAPI.logoutUser.url, {
        method: SummaryAPI.logoutUser.method,
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        setProfileMenu(false);
        navigate('/');
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      toast.error("Logout error");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setShowDropdown(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} ref={inputRef}
          className="relative hidden lg:flex items-center max-w-md w-full mx-4">
          <div className="flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full shadow-sm px-4 py-2 w-full transition focus-within:ring-2 ring-blue-300">
            <input
              type="text"
              placeholder="Search for books"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />
            <CiSearch size={20} className="text-gray-600 dark:text-gray-300" />
          </div>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-600 rounded-md z-50 overflow-hidden">
              {suggestions.map((book) => (
                <div
                  key={book._id}
                  onClick={() => {
                    navigate(`/search?q=${book.bookTitle}`);
                    setQuery('');
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer truncate transition"
                >
                  {book.bookTitle}
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 text-gray-700 dark:text-gray-100 relative text-[15px]">

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-xl hover:text-blue-600 dark:hover:text-blue-400 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-5 font-medium">
            <Link to="/exchanges" className="hover:text-blue-600 dark:hover:text-blue-300 transition">Exchanges</Link>
            <Link to="/chat" className="hover:text-blue-600 dark:hover:text-blue-300 transition">Chat</Link>
          </div>

          {/* Profile */}
          <div className="relative">
            <div onClick={() => setProfileMenu(prev => !prev)} className="cursor-pointer">
              {user?.uploadPic ? (
                <img
                  src={user.uploadPic}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300 hover:ring-2 ring-blue-400 transition"
                />
              ) : (
                <FiUser size={24} className="hover:text-blue-500 transition" />
              )}
            </div>
            {profileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700 z-50">
                <Link to="/user-profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => setProfileMenu(false)}>
                  User Profile
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative cursor-pointer hover:text-blue-500 transition">
            <CiBoxList size={22} />
            {wishlistItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistItems.length}
              </div>
            )}
          </Link>

          {/* Notifications */}
          <div className="relative cursor-pointer hover:text-blue-500 transition">
            <button onClick={() => setNotificationDropdown(prev => !prev)} className="relative">
              <IoIosNotificationsOutline size={26} />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-1 bg-blue-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </button>
            {notificationDropdown && (
              <HeaderNotifications
                notifications={notifications}
                setNotifications={setNotifications}
                onClose={() => setNotificationDropdown(false)}
                onRead={() => setUnreadCount(0)}
              />
            )}
          </div>

          {/* Login / Logout */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition"
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

Header.propTypes = {
  socket: PropTypes.object,
};

export default Header;

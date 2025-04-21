import { useState, useEffect, useRef } from 'react';
import Logo from '../assets/Logo.jpg';
import { CiSearch } from "react-icons/ci";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { CiBoxList } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaMoon, FaSun, FaBookOpen, FaExchangeAlt, FaComments } from "react-icons/fa";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryAPI from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import HeaderNotifications from './HeaderNotifications';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const inputRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state?.user?.user);
  const wishlistItems = useSelector((state) => state?.wishlist?.items || []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          setSuggestions(data.data?.slice(0, 5) || []);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeDropdowns = (e) => {
      // Close search dropdown
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      
      // Close profile menu
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
      
      // Close notification dropdown
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', closeDropdowns);
    return () => document.removeEventListener('mousedown', closeDropdowns);
  }, []);

  // Fetch notifications
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

    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  // Socket for real-time notifications
  useEffect(() => {
    if (socket && user?._id) {
      socket.on("new_notification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Show toast for new notification
        toast.info(newNotification.message || "You have a new notification", {
          position: "bottom-right",
          autoClose: 4000
        });
      });

      return () => socket.off("new_notification");
    }
  }, [socket, user]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
      setQuery('');
      setShowDropdown(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 
      "text-blue-600 dark:text-blue-400 font-semibold" : 
      "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400";
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md" 
          : "bg-white dark:bg-gray-900 shadow-sm"
      } border-b border-gray-200 dark:border-gray-700`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <img 
            src={Logo || "/placeholder.svg"} 
            alt="ShelfCycle" 
            className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105" 
          />
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400 hidden sm:block">
            ShelfCycle
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-white dark:bg-gray-900 z-40 lg:hidden pt-16 px-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-6 mt-8">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                    <input
                      type="text"
                      placeholder="Search for books"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white"
                    />
                    <button type="submit">
                      <CiSearch size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </form>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-4 text-lg">
                  <Link 
                    to="/" 
                    className={`flex items-center gap-2 py-2 ${isActive('/')}`}
                  >
                    <FaBookOpen /> Home
                  </Link>
                  <Link 
                    to="/exchanges" 
                    className={`flex items-center gap-2 py-2 ${isActive('/exchanges')}`}
                  >
                    <FaExchangeAlt /> Exchanges
                  </Link>
                  <Link 
                    to="/chat" 
                    className={`flex items-center gap-2 py-2 ${isActive('/chat')}`}
                  >
                    <FaComments /> Chat
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className={`flex items-center gap-2 py-2 ${isActive('/wishlist')}`}
                  >
                    <CiBoxList size={22} /> Wishlist
                    {wishlistItems.length > 0 && (
                      <span className="bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                  {user?._id && (
                    <Link 
                      to="/user-profile" 
                      className={`flex items-center gap-2 py-2 ${isActive('/user-profile')}`}
                    >
                      <FiUser /> Profile
                    </Link>
                  )}
                </nav>

                {/* Mobile Dark Mode Toggle */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="text-xl p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-600" />}
                  </button>
                </div>

                {/* Mobile Login/Logout */}
                <div className="mt-4">
                  {user?._id ? (
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 text-center font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full py-2.5 text-center font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          ref={inputRef}
          className="relative hidden lg:flex items-center max-w-md w-full mx-4"
        >
          <div className="flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm px-4 py-2 w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-blue-500">
            <input
              type="text"
              placeholder="Search for books, authors, or genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />
            <button type="submit" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <CiSearch size={20} />
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showDropdown && suggestions.length > 0 && (
              <motion.div 
                className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-md z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((book) => (
                  <div
                    key={book._id}
                    onClick={() => {
                      navigate(`/book-details/${book._id}`);
                      setQuery('');
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    {book.bookImage?.[0] && (
                      <img 
                        src={book.bookImage[0] || "/placeholder.svg"} 
                        alt={book.bookTitle} 
                        className="w-8 h-10 object-cover rounded"
                      />
                    )}
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{book.bookTitle}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {book.bookAuthor}
                      </div>
                    </div>
                  </div>
                ))}
                <div 
                  onClick={() => {
                    navigate(`/search?q=${query}`);
                    setQuery('');
                    setShowDropdown(false);
                  }}
                  className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  See all results for "{query}"
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-gray-700 dark:text-gray-100">
          <Link 
            to="/exchanges" 
            className={`font-medium transition-colors ${isActive('/exchanges')}`}
          >
            Exchanges
          </Link>
          <Link 
            to="/chat" 
            className={`font-medium transition-colors ${isActive('/chat')}`}
          >
            Chat
          </Link>
        </div>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center gap-5 lg:gap-6 text-gray-700 dark:text-gray-100 relative text-[15px]">
          {/* Dark Mode Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-500" size={18} />
            ) : (
              <FaMoon className="text-blue-600" size={18} />
            )}
          </motion.button>

          {/* Wishlist */}
          <Link 
            to="/wishlist" 
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Wishlist"
          >
            <CiBoxList size={22} />
            {wishlistItems.length > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {wishlistItems.length}
              </motion.div>
            )}
          </Link>

          {/* Notifications */}
          {user?._id && (
            <div className="relative" ref={notificationRef}>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setNotificationDropdown(prev => !prev)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Notifications"
              >
                <IoIosNotificationsOutline size={24} />
                {unreadCount > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </motion.button>
              
              <AnimatePresence>
                {notificationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HeaderNotifications
                      notifications={notifications}
                      setNotifications={setNotifications}
                      onClose={() => setNotificationDropdown(false)}
                      onRead={() => setUnreadCount(0)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile */}
          {user?._id && (
            <div className="relative" ref={profileRef}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileMenu(prev => !prev)} 
                className="cursor-pointer"
              >
                {user?.uploadPic ? (
                  <img
                    src={user.uploadPic || "/placeholder.svg"}
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                    <FiUser size={18} />
                  </div>
                )}
              </motion.div>
              
              <AnimatePresence>
                {profileMenu && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700 z-50 overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="font-medium text-gray-800 dark:text-white truncate">
                        {user.username || "User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </div>
                    </div>
                    
                    <Link to="/user-profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileMenu(false)}>
                      <FiUser size={16} />
                      User Profile
                    </Link>
                    
                    <Link to="/user-profile/user-uploads"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setProfileMenu(false)}>
                      <FaBookOpen size={16} />
                      My Books
                    </Link>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Login Button */}
          {!user?._id && (
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  socket: PropTypes.object,
};

export default Header;
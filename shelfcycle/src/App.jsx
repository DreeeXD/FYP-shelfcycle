import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import SummaryAPI from './common';
import { useEffect, useState } from 'react';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import socket from './helpers/socket';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [socketReady, setSocketReady] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchUserDetails = async () => {
    try {
      const dataResponse = await fetch(SummaryAPI.currentUser.url, {
        method: SummaryAPI.currentUser.method,
        credentials: 'include',
      });

      if (dataResponse.status === 401) {
        console.warn("User not authenticated.");
        return;
      }

      const contentType = dataResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format. Expected JSON.");
      }

      const dataAPI = await dataResponse.json();

      if (dataAPI.success) {
        dispatch(setUserDetails(dataAPI.data));

        if (!socket.connected) socket.connect();
        socket.emit("setup", dataAPI.data._id);
        setSocketReady(true);
      }
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const hideFooterRoutes = ['/chat'];

  return (
    <Context.Provider value={{ fetchUserDetails, darkMode, toggleDarkMode }}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <ToastContainer />
        <Header socket={socketReady ? socket : null} />

        <main>
          <Outlet />
        </main>

        {!hideFooterRoutes.includes(location.pathname) && <Footer />}
      </div>
    </Context.Provider>
  );
}

export default App;
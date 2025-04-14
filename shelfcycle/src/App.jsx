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

        // ✅ Connect and set up socket
        if (!socket.connected) socket.connect();
        socket.emit("setup", dataAPI.data._id);
        setSocketReady(true); // ✅ Only after socket is ready
      }

      console.log("User data", dataAPI);
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const hideFooterRoutes = ['/chat'];

  return (
    <Context.Provider value={{ fetchUserDetails }}>
      <ToastContainer />
      <Header socket={socketReady ? socket : null} />
      <main>
        <Outlet />
      </main>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </Context.Provider>
  );
}

export default App;

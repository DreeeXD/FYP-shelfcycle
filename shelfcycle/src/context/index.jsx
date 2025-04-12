// src/context/index.js
import { createContext, useState } from 'react';
import SummaryAPI from '../common';
import PropTypes from 'prop-types';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(SummaryAPI.currentUser.url, {
        method: SummaryAPI.currentUser.method,
        credentials: 'include', // important for cookies
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data); // store user in context
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  };

  return (
    <Context.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </Context.Provider>
  );
};
ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
export default Context;

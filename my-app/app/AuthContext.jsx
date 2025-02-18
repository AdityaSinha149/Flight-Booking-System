// AuthContext.jsx
"use client";

import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [isSigninVisible, setSigninVisible] = useState(false);

  const toggleSignupVisibility = () => {
    setSignupVisible(!isSignupVisible);
  };

  const toggleSigninVisibility = () => {
    setSigninVisible(!isSigninVisible);
  };

  const value = {
    isSignupVisible,
    isSigninVisible,
    toggleSignupVisibility,
    toggleSigninVisibility,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";

import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [isSigninVisible, setSigninVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [authError, setAuthError] = useState(''); // Add error state

  const toggleLoggedIn = () => {
    if(loggedIn) setName('');
    setLoggedIn(!loggedIn);
  };

  const toggleSignupVisibility = (errorMsg = '') => {
    // Only set error message if it's a string
    if (typeof errorMsg === 'string') {
      setAuthError(errorMsg);
    } else {
      setAuthError('');
    }
    setSignupVisible(!isSignupVisible);
  };

  const toggleSigninVisibility = (errorMsg = '') => {
    // Only set error message if it's a string
    if (typeof errorMsg === 'string') {
      setAuthError(errorMsg);
    } else {
      setAuthError('');
    }
    setSigninVisible(!isSigninVisible);
  };

  const setError = (message) => {
    setAuthError(message);
  };

  const clearError = () => {
    setAuthError('');
  };

  const value = {
    isSignupVisible,
    isSigninVisible,
    loggedIn,
    name,
    id,
    authError, // Expose error state
    setId,
    toggleSignupVisibility,
    toggleSigninVisibility,
    toggleLoggedIn,
    setName,
    setError, // Expose error setting function
    clearError // Expose error clearing function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

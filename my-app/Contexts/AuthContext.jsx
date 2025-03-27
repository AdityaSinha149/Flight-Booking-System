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

  const toggleLoggedIn = () => {
    if(loggedIn) setName('');
    setLoggedIn(!loggedIn);
  };

  const toggleSignupVisibility = () => {
    setSignupVisible(!isSignupVisible);
  };

  const toggleSigninVisibility = () => {
    setSigninVisible(!isSigninVisible);
  };

  const value = {
    isSignupVisible,
    isSigninVisible,
    loggedIn,
    name,
    id,
    setId,
    toggleSignupVisibility,
    toggleSigninVisibility,
    toggleLoggedIn,
    setName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

"use client";
import { createContext, useState, useContext } from "react";

const SuperAdminContext = createContext();

export function SuperAdminProvider({ children }) {
  const [superAdminLoggedIn, setSuperAdminLoggedIn] = useState(false);

  return (
    <SuperAdminContext.Provider value={{
      superAdminLoggedIn,
      setSuperAdminLoggedIn
    }}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  return useContext(SuperAdminContext);
}

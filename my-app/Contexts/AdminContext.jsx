"use client";
import { createContext, useState, useContext } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminAirline, setAdminAirline] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminId, setAdminId] = useState("");
  return (
    <AdminContext.Provider value={{
      adminAirline,
      setAdminAirline,
      adminName,
      setAdminName,
      adminId,
      setAdminId
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

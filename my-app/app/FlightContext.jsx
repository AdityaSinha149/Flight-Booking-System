"use client";
import { createContext, useContext, useState } from "react";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <FlightContext.Provider value={{ flights, setFlights, loading, setLoading, error, setError }}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlights = () => useContext(FlightContext);

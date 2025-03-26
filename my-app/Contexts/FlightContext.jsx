"use client";
import { createContext, useContext, useState } from "react";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const selectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  return (
    <FlightContext.Provider value={{ 
      flights, 
      setFlights, 
      loading, 
      setLoading, 
      selectedFlight, 
      selectFlight 
    }}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlights = () => useContext(FlightContext);

"use client";
import { createContext, useContext, useState} from "react";

const PassengerContext = createContext();

export const PassengerProvider = ({ children }) => {
  const [finalPassengerCount, setFinalPassengerCount] = useState(1); // Start with 1 passenger
  const [passengers, setPassengers] = useState([{}]); // Initialize with one empty passenger

  const updatePassenger = (index, updatedPassenger) => {
    const newPassengers = [...passengers];
    newPassengers[index] = updatedPassenger;
    setPassengers(newPassengers);
  };

  return (
    <PassengerContext.Provider
      value={{
        finalPassengerCount,
        setFinalPassengerCount,
        passengers,
        setPassengers,
        updatePassenger
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};

export const usePassenger = () => useContext(PassengerContext);

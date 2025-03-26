"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PassengerContext = createContext();

export const PassengerProvider = ({ children }) => {
  const [finalPassengerCount, setFinalPassengerCount] = useState(0);
  const [passengers, setPassengers] = useState([]);
  
  // Add a new passenger
  const addPassenger = (passengerType = 'adult') => {
    const newPassenger = {
      id: Date.now(),
      type: passengerType,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: ''
    };
    setPassengers([...passengers, newPassenger]);
  };

  // Remove a passenger by ID
  const removePassenger = (passengerId) => {
    setPassengers(passengers.filter(p => p.id !== passengerId));
  };

  // Update a passenger's details
  const updatePassenger = (passengerId, details) => {
    setPassengers(passengers.map(p => 
      p.id === passengerId ? { ...p, ...details } : p
    ));
  };

  // Update passenger count when passengers array changes
  useEffect(() => {
    setFinalPassengerCount(passengers.length);
  }, [passengers]);

  return (
    <PassengerContext.Provider 
      value={{ 
        finalPassengerCount, 
        setFinalPassengerCount,
        passengers,
        addPassenger,
        removePassenger,
        updatePassenger
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};

export const usePassenger = () => useContext(PassengerContext);

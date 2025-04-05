"use client";
import { createContext, useContext, useState, useEffect } from "react";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [maxSeats, setMaxSeats] = useState(0);
    const [bookedSeats, setBookedSeats] = useState([]);

  return (
    <SeatContext.Provider
      value={{
        selectedSeats,
        setSelectedSeats,
        maxSeats,
        setMaxSeats,
        bookedSeats,
        setBookedSeats,
      }}
    >
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => useContext(SeatContext);

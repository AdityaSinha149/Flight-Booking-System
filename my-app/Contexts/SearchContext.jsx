"use client";

import { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [fromInput, setFromInput] = useState("");
    const [toInput, setToInput] = useState("");
    const [date, setDate] = useState("");
    const [passengerCount, setPassengerCount] = useState("");
    const [error, setError] = useState(""); // added search error state

    const value = {
        fromInput,
        setFromInput,
        toInput,
        setToInput,
        date,
        setDate,
        passengerCount,
        setPassengerCount,
        error,
        setError,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

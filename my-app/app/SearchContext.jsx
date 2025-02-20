"use client";

import { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [fromInput, setFromInput] = useState("");
    const [toInput, setToInput] = useState("");
    const [date, setDate] = useState("");
    const [passengerCount, setPassengerCount] = useState(1);



    const value = {
        fromInput,
        setFromInput,
        toInput,
        setToInput,
        date,
        setDate,
        passengerCount,
        setPassengerCount,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

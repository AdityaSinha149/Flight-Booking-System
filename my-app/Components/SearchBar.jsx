"use client";
import { useState, useEffect, useRef } from "react";

export default function SearchBar() {
  const [locations, setLocations] = useState([]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [filteredFrom, setFilteredFrom] = useState([]);
  const [filteredTo, setFilteredTo] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  useEffect(() => {
    setFilteredFrom(
      fromInput
        ? locations.filter((loc) =>
            loc.toLowerCase().startsWith(fromInput.toLowerCase())
          )
        : locations
    );
  }, [fromInput, locations]);

  useEffect(() => {
    setFilteredTo(
      toInput
        ? locations.filter((loc) =>
            loc.toLowerCase().startsWith(toInput.toLowerCase())
          )
        : locations
    );
  }, [toInput, locations]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromRef.current && !fromRef.current.contains(event.target) &&
        toRef.current && !toRef.current.contains(event.target)
      ) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <div className="flex items-center bg-gray-800 shadow-md rounded-md overflow-hidden w-full max-w-5xl mx-auto border border-gray-300">
        
        {/* From Input */}
        <div ref={fromRef} className="relative flex-1 border-r border-gray-300 flex items-center px-4 py-3">
          <span className="text-gray-400 mr-2">✈️</span>
          <input
            type="text"
            placeholder="From where?"
            className="w-full bg-transparent outline-none text-white"
            value={fromInput}
            onChange={(e) => {
              setFromInput(e.target.value);
              setShowFromDropdown(true);
            }}
            onFocus={() => setShowFromDropdown(true)}
          />
          {showFromDropdown && (
            <ul className="absolute top-full left-0 w-full bg-black text-white shadow-md border border-gray-700 mt-1 max-h-40 overflow-auto rounded-md z-50">
              {filteredFrom.length > 0 ? (
                filteredFrom.map((loc, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setFromInput(loc);
                      setShowFromDropdown(false);
                    }}
                  >
                    {loc}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">No results found</li>
              )}
            </ul>
          )}
        </div>

        {/* To Input */}
        <div ref={toRef} className="relative flex-1 border-r border-gray-300 flex items-center px-4 py-3">
          <span className="text-gray-400 mr-2">✈️</span>
          <input
            type="text"
            placeholder="Where to?"
            className="w-full bg-transparent outline-none text-white"
            value={toInput}
            onChange={(e) => {
              setToInput(e.target.value);
              setShowToDropdown(true);
            }}
            onFocus={() => setShowToDropdown(true)}
          />
          {showToDropdown && (
            <ul className="absolute top-full left-0 w-full bg-black text-white shadow-md border border-gray-600 mt-1 max-h-40 overflow-auto rounded-md z-50">
              {filteredTo.length > 0 ? (
                filteredTo.map((loc, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setToInput(loc);
                      setShowToDropdown(false);
                    }}
                  >
                    {loc}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">No results found</li>
              )}
            </ul>
          )}
        </div>

        {/* Date Picker */}
        <div className="relative flex-1 border-r border-gray-300 flex items-center px-4 py-3">
          <span className="text-gray-400 mr-2">📅</span>
          <input type="date" className="w-full bg-transparent outline-none text-white" />
        </div>

        {/* Passenger Count */}
        <div className="relative flex-1 flex items-center px-4 py-3">
          <span className="text-gray-400 mr-2">👤</span>
          <input type="text" placeholder="1 adult" className="w-full bg-transparent outline-none text-white" />
        </div>

        {/* Search Button */}
        <button className="bg-[#605DEC] text-white px-6 py-3 rounded-md -ml-2">
          Search
        </button>
      </div>
    </div>
  );
}

"use client"
import React, { useEffect, useState, useRef } from 'react';
import Navbar from "@/Components/Navbar";
import SearchBar from '@/Components/SearchBar';
import SignupCard from '@/Components/SignupCard';
import SigninCard from '@/Components/SigninCard';
import FlightCard from '@/Components/FlightCard';
import { useAuth } from '@/Contexts/AuthContext';
import { useFlights } from '@/Contexts/FlightContext';
import { useSearch } from '@/Contexts/SearchContext';
import { useTheme } from '@/Contexts/ThemeContext';

const Flights = () => {
  const { isSignupVisible, isSigninVisible } = useAuth();
  const { dark } = useTheme();
  const { flights, loading, setFlights } = useFlights();
  const { error: searchError, fromInput, toInput, date, passengerCount } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sortBy, setSortBy] = useState('departure_datetime');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);
  const flightRefs = useRef([]);
  const isAnimatingRef = useRef(false);
  const isPressingKeysRef = useRef(false);
  const hoverTimeoutRef = useRef(null);
  const isMouseHoveredRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Sorting options configuration
  const sortOptions = [
    { value: 'departure_datetime', label: 'Departure Time' },
    { value: 'price', label: 'Price' },
    { value: 'duration', label: 'Duration' },
    { value: 'airline', label: 'Airline' }
  ];

  const formatAirport = (loc) => {
    if (!loc) return "";
    const i = loc.indexOf("(");
    const j = loc.indexOf(")");
    return (i !== -1 && j !== -1) ? loc.substring(i + 1, j) : loc;
  };

  // Function to fetch flights with sorting options
  const fetchSortedFlights = async (sortingParams) => {
    console.log("Calling /api/flights with:", {
      fromInput,
      toInput,
      date,
      passengerCount,
      ...sortingParams
    });

    setIsLoading(true);
    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_airport: formatAirport(fromInput),
          end_airport: formatAirport(toInput),
          travel_date: date,
          seats_needed: passengerCount,
          sortBy: sortingParams.sortBy,
          sortOrder: sortingParams.sortOrder
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setFlights(data);
      setSelectedIndex(0); // Reset selection when new data arrives
    } catch (error) {
      console.error("Failed to fetch sorted flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort change
  const handleSortChange = (field) => {
    let newOrder = sortOrder;

    if (sortBy === field) {
      // Toggle order if same field is selected
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      newOrder = 'asc';
      setSortOrder(newOrder);
    }
    
    // Fetch sorted flights immediately
    fetchSortedFlights({ 
      sortBy: field, 
      sortOrder: newOrder 
    });
  };

  // Existing keyboard navigation effect
  useEffect(() => {
    function handleKeyDown(e) {
      // If a card is hovered, ignore arrow keys
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && isMouseHoveredRef.current) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); // prevent default page scroll
      }
      isPressingKeysRef.current = true;
      if (e.key === "ArrowDown") {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        setSelectedIndex((prev) => Math.min(prev + 1, flights.length - 1));
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 300); // delay to match transition
      } else if (e.key === "ArrowUp") {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 300);
      }
    }
    function handleKeyUp() {
      isPressingKeysRef.current = false;
    }

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [flights]);

  useEffect(() => {
    if (isPressingKeysRef.current && flightRefs.current[selectedIndex]) {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      // Delay scrollIntoView so that even during long press, the selected card centers smoothly
      scrollTimeoutRef.current = setTimeout(() => {
        flightRefs.current[selectedIndex].scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 150); // delay added
    }
  }, [selectedIndex]);

  return (
    <div className={`min-h-screen ${dark ? "bg-[#090909] opacity-95" : ""}`}>
      <Navbar />

      <div className="pt-14">
        <SearchBar />
      </div>

      {/* Sorting Controls */}
      <div className="flex flex-wrap justify-center gap-2 my-4 px-4">
        <div className="font-medium text-gray-700 dark:text-gray-300 self-center mr-2">Sort by:</div>
        {sortOptions.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition
              ${sortBy === option.value 
                ? 'bg-[#605DEC] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            onClick={() => handleSortChange(option.value)}
            disabled={isLoading}
          >
            {option.label} 
            {sortBy === option.value && (
              <span className="ml-1">
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Flight Cards Section */}
      <div className="my-6 sm:px-40 px- py-10 max-h-[500px] overflow-y-auto scroll-smooth scrollbar-hide">
        {loading || isLoading ? (
          <p className="text-center text-gray-500">Loading flights...</p>
        ) : flights.length > 0 ? (
          flights.map((flight, index) => (
            <div
              key={index}
              ref={(el) => (flightRefs.current[index] = el)}
              className={`${index === selectedIndex ? "transform scale-110" : ""} transition`}
              onMouseEnter={() => {
                isMouseHoveredRef.current = true;
                if (!isPressingKeysRef.current) {
                  setSelectedIndex(index);
                }
              }}
              onMouseLeave={() => {
                isMouseHoveredRef.current = false;
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              }}
            >
              <FlightCard
                flight={flight}
                isSelected={index === selectedIndex}
              />
            </div>
          ))
        ) : (
          !searchError && <p className="text-center text-gray-500">No flights available</p>
        )}
      </div>

      {isSignupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <SignupCard />
        </div>
      )}

      {isSigninVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <SigninCard />
        </div>
      )}

    </div>
  );
};

export default Flights;
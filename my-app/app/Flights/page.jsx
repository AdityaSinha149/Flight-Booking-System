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
  const { flights, loading } = useFlights();
  const { error: searchError } = useSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flightRefs = useRef([]);
  const isAnimatingRef = useRef(false);
  const isPressingKeysRef = useRef(false);
  const hoverTimeoutRef = useRef(null);
  const isMouseHoveredRef = useRef(false);  // NEW: track if mouse is over a card
  const scrollTimeoutRef = useRef(null);      // NEW: delay scrollIntoView for arrow key selection

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

      {/* Flight Cards Section */}
      <div className="my-6 sm:px-40 px- py-10 max-h-[500px] overflow-y-auto scroll-smooth">
        {loading ? (
          <p className="text-center text-gray-500">Loading flights...</p>
        ) : flights.length > 0 ? (
          flights.map((flight, index) => (
            <div
              key={index}
              ref={(el) => (flightRefs.current[index] = el)}
              className={`${index === selectedIndex ? "transform scale-110" : ""} transition`}
              onMouseEnter={() => {
                isMouseHoveredRef.current = true; // mark mouse as hovered
                if (!isPressingKeysRef.current) {
                  setSelectedIndex(index); // update immediately with no delay
                }
              }}
              onMouseLeave={() => {
                isMouseHoveredRef.current = false; // clear mouse hover
                if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              }}
            >
              <FlightCard
                flight={flight}
                hover={`${dark ? "hover:bg-gray-700" : "hover:bg-gray-300"}`}
                isSelected={index === selectedIndex}
              />
            </div>
          ))
        ) : (
          // If there's a search error, display nothing here (error is shown in SearchBar)
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
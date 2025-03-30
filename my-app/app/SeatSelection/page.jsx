"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/Components/Navbar";
import Seat from "@/Components/Seat";
import SigninCard from "@/Components/SigninCard";
import SignupCard from "@/Components/SignupCard";

import { useTheme } from "@/Contexts/ThemeContext";
import { useFlights } from "@/Contexts/FlightContext";
import { usePassenger } from "@/Contexts/PassengerContext";
import { useSeat } from "@/Contexts/SeatContext";
import { useAuth } from "@/Contexts/AuthContext";

import { useRouter } from "next/navigation";

const SeatSelection = () => {
  const { dark } = useTheme();
  const { selectedFlight } = useFlights();
  const { passengers } = usePassenger();
  const { selectedSeats, maxSeats, bookedSeats, setSelectedSeats } = useSeat();
  const [errorMessage, setErrorMessage] = useState("");
  const { isSignupVisible, isSigninVisible, loggedIn, id, toggleSigninVisibility, setError } = useAuth();

  const router = useRouter();

  const handleSeatSelect = (seatId, isBooked) => {
    if (isBooked) return;
    
    // Check if the seat is already selected (deselection case)
    if (selectedSeats.includes(seatId)) {
      setErrorMessage(""); // Clear error message first
      setSelectedSeats(prev => prev.filter((id) => id !== seatId)); // Then update seats
      return;
    }
    
    // Check if max seats are already selected
    if (selectedSeats.length >= passengers.length) {
      setErrorMessage("All seats have been selected!");
      return;
    }
    
    // Normal seat selection case
    setErrorMessage(""); // Clear error message
    setSelectedSeats(prev => [...prev, seatId]); // Add the seat
  };

  // Modify your booking handler function
  const handleBookFlight = async (e) => {
    e.preventDefault();
    if (!loggedIn) {
      toggleSigninVisibility();
      setError("Please sign in to book your flight.");
      return;
    }

    // Simple validation - check if number of seats equals number of passengers
    if (selectedSeats.length < passengers.length) {
      setErrorMessage(`Please select seats for all passengers. Selected: ${selectedSeats.length}/${passengers.length}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Clear any previous errors
    setErrorMessage('');

    // API call to book tickets
    fetch('/api/book', {
      method: 'POST',
      body: JSON.stringify({
        instance_id: selectedFlight.instance_id,
        airline: selectedFlight.airline,
        flight_no: selectedFlight.flight_no,
        passengers: passengers,
        user_id: id,
        seats: selectedSeats,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setErrorMessage("");
          router.push('/thankyou');
        }
      })
      .catch((error) => {
        console.error("Error booking flight:", error);
        setErrorMessage("Failed to book flight. Please try again.");
      });
  };

  // Calculate columns ensuring it's always even and capping at 8 for better visibility
  const calculateGrid = () => {
    // Get base number from sqrt of seats, but make sure it's even
    let columns = Math.ceil(Math.sqrt(maxSeats));
    if (columns % 2 !== 0) columns++; // Make it even
    return Math.min(columns, 8); // Cap at 8 for better visibility
  };

  // Get half of columns for each side of the aisle
  const halfColumns = calculateGrid() / 2;

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className={`flex flex-1 ${dark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
        {/* Left Section - Seat Map Panel */}
        <div className="w-1/2 border-r border-gray-300 p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-center">Select Your Seat</h2>
          <div className="flex-1 flex flex-col">
            {/* Add custom CSS for hiding scrollbar */}
            <style jsx>{`
              .seat-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
              }
              .seat-group {
                display: grid;
                grid-template-columns: repeat(${halfColumns}, 1fr);
                gap: 5px;
              }
              .aisle {
                width: 40px;
              }
            `}</style>
            
            <div 
              className={`${dark ? "bg-gray-800" : "bg-blue-100"} p-4 rounded-lg shadow-lg overflow-auto scrollbar-hide`}
              style={{ maxHeight: "calc(100vh - 140px)" }}
            >
              <div className="seat-container">
                {/* Seat layout with aisle */}
                {Array.from({ length: Math.ceil(maxSeats / calculateGrid()) }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex w-full justify-center mb-2">
                    {/* Left seat group */}
                    <div className="seat-group">
                      {Array.from({ length: halfColumns }).map((_, colIndex) => {
                        const seatIndex = rowIndex * calculateGrid() + colIndex;
                        if (seatIndex >= maxSeats) return null;
                        
                        const seatId = (seatIndex + 1).toString();
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <Seat
                            key={seatId}
                            num={seatId}
                            available={!isBooked}
                            selected={isSelected}
                            onClick={() => handleSeatSelect(seatId, isBooked)}
                            className="w-10 h-10"
                          />
                        );
                      })}
                    </div>
                    
                    {/* Aisle */}
                    <div className="aisle"></div>
                    
                    {/* Right seat group */}
                    <div className="seat-group">
                      {Array.from({ length: halfColumns }).map((_, colIndex) => {
                        const seatIndex = rowIndex * calculateGrid() + halfColumns + colIndex;
                        if (seatIndex >= maxSeats) return null;
                        
                        const seatId = (seatIndex + 1).toString();
                        const isBooked = bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <Seat
                            key={seatId}
                            num={seatId}
                            available={!isBooked}
                            selected={isSelected}
                            onClick={() => handleSeatSelect(seatId, isBooked)}
                            className="w-10 h-10"
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Flight & Passenger Details Panel */}
        <div className="w-1/2 p-4 flex items-center justify-center">
          <div className={`${dark ? "bg-gray-800 text-white" : "bg-white text-black"} w-full max-w-xl p-8 rounded-lg shadow-lg`}>
            <h2 className="text-4xl font-semibold mb-3">
              {selectedFlight?.departure_airport} ➝ {selectedFlight?.arrival_airport}
            </h2>
            <p className={`${dark ? "text-gray-300" : "text-gray-600"} mb-4 text-lg`}>
              {selectedFlight?.departure} | {selectedFlight?.arrival}
            </p>


            <div className="mt-6">
              <h3 className="text-3xl font-semibold mb-3">Passengers</h3>
              {passengers.map((passenger, index) => (
                <p key={index} className={`${dark ? "text-gray-300" : "text-gray-600"} text-xl mb-2 font-medium `}>
                  {passenger?.name}: <span className="text-[#605DEC] text-2xl font-bold">{selectedSeats[index] || '--'}</span>
                </p>
              ))}
            </div>

            {errorMessage && (
              <p className="mt-4 text-red-500">{errorMessage}</p>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBookFlight}
                className="bg-[#605DEC] text-white px-6 py-3 rounded text-base font-medium hover:bg-[#4B48A6] transition-colors"
              >
                Book Flight
              </button>
            </div>
          </div>
        </div>
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

export default SeatSelection;

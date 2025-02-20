"use client"
import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import SearchBar from '@/components/SearchBar';
import SignupCard from "@/components/SignupCard";
import SigninCard from "@/components/SigninCard";
import FlightCard from "@/components/FlightCard";
import { useAuth } from "@/app/AuthContext";
import { useTheme } from "@/app/ThemeContext";
import { useFlights } from "@/app/FlightContext";

const Flights = () => {
  const { isSignupVisible, isSigninVisible } = useAuth();
  const { dark } = useTheme();
  const { flights, loading, error } = useFlights();

  return (
    <div className={`min-h-screen ${dark ? "bg-[#090909] opacity-95" : ""}`}>
      <Navbar />

      <div className="pt-14">
        <SearchBar />
      </div>

      {/* Flight Cards Section */}
      <div className="my-6 px-40 py-10 max-h-[500px] overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading flights...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : flights.length > 0 ? (
          flights.map((flight, index) => (
            <FlightCard key={index} flight={flight} />
          ))
        ) : (
          <p className="text-center text-gray-500">No flights available</p>
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
"use client";

import React, { useEffect } from 'react';
import PassengerCard from '@/Components/PassengerCard';
import Navbar from '@/Components/Navbar';
import SigninCard from '@/Components/SigninCard';
import SignupCard from '@/Components/SignupCard';

import { useFlights } from '@/Contexts/FlightContext';
import { usePassenger } from '@/Contexts/PassengerContext';
import { useAuth } from "@/Contexts/AuthContext";
import { useTheme } from '@/Contexts/ThemeContext';
import { useRouter } from 'next/navigation';

const PassengersPage = () => {
  const { selectedFlight } = useFlights();
  const {
    passengers,
    finalPassengerCount,
    updatePassenger,
  } = usePassenger();
  const { dark } = useTheme();
  const { isSignupVisible, isSigninVisible, loggedIn, id } = useAuth();
  const router = useRouter();

  // If no flight is selected, redirect to flights page
  useEffect(() => {
    if (!selectedFlight) {
      router.push('/Flights');
    }
  }, [selectedFlight, router]);

  const handleInputChange = (index, field, value) => {
    const updatedPassenger = { ...passengers[index], [field]: value };
    updatePassenger(index, updatedPassenger);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loggedIn) {
      isSignupVisible ? null : isSigninVisible ? null : router.push('/Signin');
      return;
    }

    // API call to book tickets
    fetch('/api/book', {
      method: 'POST',
      body: JSON.stringify({
        airline: selectedFlight.airline,
        flight_no: selectedFlight.flight_no,
        passengers: passengers,
        user_id: id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push('/thankyou');
        }
      })
      .catch((error) => {
        console.error('Error:', error

        );
      }
      );
  };

  if (!selectedFlight) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Generate passenger cards based on finalPassengerCount
  const passengerCards = [];
  for (let i = 0; i < finalPassengerCount; i++) {
    passengerCards.push(
      <div
        key={i}
        className={`mb-6 p-6 rounded-lg shadow ${dark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <PassengerCard
          i={i}
          passengers={passengers}
          handleInputChange={handleInputChange}
          dark={dark}
        />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen p-6 ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Passenger Information</h1>

          <div className={`mb-8 p-4 rounded-lg ${dark ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <h2 className="text-xl font-semibold mb-4">Selected Flight</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Airline:</span> {selectedFlight.airline}</p>
                <p><span className="font-medium">From:</span> {selectedFlight.departure_airport}</p>
                <p><span className="font-medium">To:</span> {selectedFlight.arrival_airport}</p>
              </div>
              <div>
                <p><span className="font-medium">Departure:</span> {selectedFlight.departure}</p>
                <p><span className="font-medium">Arrival:</span> {selectedFlight.arrival}</p>
                <p><span className="font-medium">Price:</span> ₹{selectedFlight.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {passengerCards}

            <div className="flex justify-between mt-4">

              <button
                type="submit"
                className="px-6 py-2 bg-[#605DEC] text-white font-bold rounded hover:bg-[#4d4aa8]"
              >
                Continue to Payment
              </button>
            </div>
          </form>
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
    </>
  );
};

export default PassengersPage;

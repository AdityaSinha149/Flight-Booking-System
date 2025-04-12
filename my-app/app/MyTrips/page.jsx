"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/Components/Navbar';
import TripCard from '@/Components/TripCard';
import { useAuth } from '@/Contexts/AuthContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import SigninCard from '@/Components/SigninCard';
import SignupCard from '@/Components/SignupCard';

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loggedIn, id, isSigninVisible, isSignupVisible, toggleSigninVisibility } = useAuth();
  const { dark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/myTrips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: id }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Status: ${response.status}`);
        }

        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(`Failed to load your trips: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [loggedIn, id]);

  const getStatusDisplay = (trip) => {
    const departure = new Date(trip.departure_datetime);
    const arrival = new Date(trip.arrival_datetime);
    const now = new Date();

    if (trip.status === 'CANCELED') {
      return {
        text: "Flight Canceled - Refund Issued",
        color: "text-orange-600"
      };
    } else if (now > arrival) {
      return {
        text: "Completed",
        color: "text-gray-500"
      };
    } else if (now > departure) {
      return {
        text: "In Progress",
        color: "text-blue-500"
      };
    } else {
      return {
        text: "Upcoming",
        color: "text-green-500"
      };
    }
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#605DEC] text-white rounded-md hover:bg-[#4d4aa8] transition"
          >
            Home
          </button>
        </div>
        
        {!loggedIn && !loading && (
          <div className={`p-8 rounded-lg shadow-md text-center ${dark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl mb-4">You need to sign in to view your trips</h2>
            <button 
              onClick={toggleSigninVisibility}
              className="px-6 py-2 bg-[#605DEC] text-white rounded-md hover:bg-[#4d4aa8] transition"
            >
              Sign In
            </button>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#605DEC]"></div>
          </div>
        )}
        
        {error && (
          <div className={`p-4 mb-6 rounded-md ${dark ? 'bg-red-900' : 'bg-red-100 text-red-800'}`}>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 px-4 py-1 bg-[#605DEC] text-white rounded-md hover:bg-[#4d4aa8] transition"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {loggedIn && !loading && !error && trips.length === 0 && (
          <div className={`p-8 rounded-lg shadow-md text-center ${dark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl mb-4">You haven't booked any trips yet</h2>
            <p className="mb-6">When you book flights, they will appear here.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-[#605DEC] text-white rounded-md hover:bg-[#4d4aa8] transition"
            >
              Find Flights
            </button>
          </div>
        )}
        
        {loggedIn && trips.length > 0 && (
          <div className="space-y-6">
            {trips.map((trip) => (
              <TripCard key={`${trip.instance_id}-${trip.booking_date}`} trip={trip} />
            ))}
          </div>
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

export default MyTripsPage;

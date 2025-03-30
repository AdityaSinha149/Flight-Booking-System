import React, { useState } from "react";
import { useTheme } from "@/Contexts/ThemeContext";

const TripCard = ({ trip }) => {
  const { dark } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  // Format the date for better display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract just the time from datetime
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`rounded-lg shadow-md mb-6 overflow-hidden
        ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
        border ${dark ? "border-gray-700" : "border-gray-200"}`}
    >
      {/* Trip summary section */}
      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-[#605DEC]">{trip.airline}</h3>
          <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
            Booked on {formatDate(trip.booking_date)}
          </span>
        </div>

        {/* Flight info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center my-4">
          {/* Departure */}
          <div className="text-center">
            <p className="text-lg font-semibold">{formatTime(trip.departure_datetime)}</p>
            <p className="text-xl">{trip.departure_airport}</p>
            <p className="text-sm">{formatDate(trip.departure_datetime)}</p>
          </div>

          {/* Flight path */}
          <div className="transform scale-110 flex flex-row items-center gap-[1px] justify-center">
            <div className="flex flex-col items-center -translate-y-[2px]">
              <p className="text-sm">{trip.duration}</p>
              <div className="flex items-center">
                <img src="/flights/line.png" alt="line" className="w-8 h-[2px]" />
                <img src="/flights/line.png" alt="line" className="w-8 h-[2px]" />
                <img src="/flights/line.png" alt="line" className="w-8 h-[2px]" />
              </div>
              <p className="text-xs mt-1">Flight #{trip.flight_no}</p>
            </div>
            <img
              src="/flights/flight-icon.png"
              alt="Flight icon"
              className="w-8 h-auto"
            />
          </div>

          {/* Arrival */}
          <div className="text-center">
            <p className="text-lg font-semibold">{formatTime(trip.arrival_datetime)}</p>
            <p className="text-xl">{trip.arrival_airport}</p>
            <p className="text-sm">{formatDate(trip.arrival_datetime)}</p>
          </div>
        </div>

        {/* Passenger count and price */}
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">{trip.passengers.length} {trip.passengers.length === 1 ? 'Passenger' : 'Passengers'}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">₹{(trip.price * trip.passengers.length).toLocaleString()}</span>
          </div>
        </div>
        
        {/* Toggle button */}
        <button 
          className="mt-3 text-[#605DEC] font-medium hover:underline"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide details" : "View details"}
        </button>
      </div>

      {/* Expanded details section */}
      {showDetails && (
        <div className={`p-4 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}>
          <h4 className="font-medium mb-3">Passenger Details</h4>
          <div className="space-y-4">
            {trip.passengers.map((passenger, index) => (
              <div key={passenger.ticket_id} className={`p-3 rounded ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex justify-between">
                  <span className="font-medium">{passenger.name}</span>
                </div>
                <div className="text-sm mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className={dark ? "text-gray-300" : "text-gray-600"}>{passenger.email}</span>
                  </div>
                  <div>
                    <span className={dark ? "text-gray-300" : "text-gray-600"}>Phone: {passenger.phone}</span>
                  </div>
                  <div>
                    <span className={dark ? "text-gray-300" : "text-gray-600"}>Seat: {passenger.seat_number}</span>
                  </div>
                  <div>
                    <span className={dark ? "text-gray-300" : "text-gray-600"}>Ticket ID: {passenger.ticket_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;

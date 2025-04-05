import React, { useState } from "react";
import { useTheme } from "@/Contexts/ThemeContext";

const TripCard = ({ trip }) => {
  const { dark } = useTheme();
  const [showDetails, setShowDetails] = useState(false);

  // Ensure trip is defined before accessing its properties
  if (!trip) {
    return <div>No trip data available.</div>;
  }

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

  const getStatusInfo = (trip) => {
    const departure = new Date(trip.departure_datetime);
    const arrival = new Date(trip.arrival_datetime);
    const now = new Date();
    
    if (trip.status === 'CANCELED') {
      return {
        text: "Flight Canceled - Refund Issued",
        color: "text-orange-600",
        bgColor: dark ? "bg-orange-900/30" : "bg-orange-100"
      };
    } else if (now > arrival) {
      return {
        text: "Completed",
        color: "text-gray-500",
        bgColor: dark ? "bg-gray-800" : "bg-gray-100"
      };
    } else if (now > departure) {
      return {
        text: "In Progress",
        color: "text-blue-500",
        bgColor: dark ? "bg-blue-900/30" : "bg-blue-100"
      };
    } else {
      return {
        text: "Upcoming",
        color: "text-green-500",
        bgColor: dark ? "bg-green-900/30" : "bg-green-100"
      };
    }
  };
  
  const statusInfo = getStatusInfo(trip);
  
  return (
    <div 
      className={`rounded-lg shadow-md mb-6 overflow-hidden
        ${dark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
        border ${dark ? "border-gray-700" : "border-gray-200"}`}
    >
      {/* Status Banner */}
      <div className={`${statusInfo.bgColor} ${statusInfo.color} py-2 px-4 flex justify-between items-center`}>
        <span className="font-medium">{statusInfo.text}</span>
        
        {trip.status === 'CANCELED' && trip.deleted_at && (
          <div className="text-sm">
            Canceled on {new Date(trip.deleted_at).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Trip summary section */}
      <div className="p-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#605DEC]">
              {trip.airline} #{trip.flight_no}
            </h3>
            <p className="text-sm mt-1">
              Booked on {formatDate(trip.booking_date)}
            </p>
          </div>
          <div className="text-lg font-bold">
            ₹{(trip.price * trip.passengers.length).toLocaleString()}
          </div>
        </div>

        {/* Flight Details - styled like FlightCard */}
        <div className="flex flex-col sm:flex-row items-center justify-between my-4 px-2">
          {/* Departure Info */}
          <div className="text-center">
            <p className={`text-base font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
              {formatTime(trip.departure_datetime)}
            </p>
            <p className={`text-xl ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {trip.departure_airport}
            </p>
            <p className="text-sm">{formatDate(trip.departure_datetime)}</p>
          </div>

          {/* Flight Path - Text only version */}
          <div className="flex flex-col items-center mx-4 my-6">
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
              {trip.duration}
            </p>
            <div className="w-full border-t border-dashed my-2 border-gray-400"></div>
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {trip.status === 'CANCELED' ? 'Canceled' : 'Direct Flight'}
            </p>
          </div>

          {/* Arrival Info */}
          <div className="text-center">
            <p className={`text-base font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
              {formatTime(trip.arrival_datetime)}
            </p>
            <p className={`text-xl ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {trip.arrival_airport}
            </p>
            <p className="text-sm">{formatDate(trip.arrival_datetime)}</p>
          </div>
        </div>

        {/* Passenger count */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span>
              <span className="font-medium">{trip.passengers.length}</span> 
              {trip.passengers.length === 1 ? ' Passenger' : ' Passengers'}
            </span>
            <button 
              className="text-[#605DEC] font-medium hover:underline"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide details" : "View details"}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details section */}
      {showDetails && (
        <div className={`p-4 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}>
          <h4 className="font-medium mb-3">Passenger Details</h4>
          <div className="space-y-4">
            {trip.passengers.map((passenger) => (
              <div key={passenger.ticket_id} className={`p-3 rounded ${dark ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex justify-between">
                  <span className="font-medium">{passenger.name}</span>
                  <span className="font-medium">Seat: {passenger.seat_number || 'Not assigned'}</span>
                </div>
                <div className="text-sm mt-2">
                  <div>{passenger.email}</div>
                  <div>Phone: {passenger.phone}</div>
                  <div>Ticket ID: {passenger.ticket_id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trip.status === 'CANCELED' && (
        <div className={`p-4 ${statusInfo.bgColor}`}>
          <div>
            <p className="font-medium">Flight was canceled by the airline.</p>
            <p className="text-sm">A refund has been processed for this booking.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;

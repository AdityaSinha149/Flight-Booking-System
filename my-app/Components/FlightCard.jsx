import React from "react";

const FlightCard = ({ flight }) => {
  return (
    <div className="grid grid-cols-4 items-center bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      {/* Airline Logo & Name */}
      <div className="flex items-center gap-3">
        <img
          src={`/flights/${flight.airline.split(" ")[0]}.png`}
          alt="Airline Logo"
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="text-gray-700 font-medium">{flight.duration}</p>
          <p className="text-blue-600 text-sm">{flight.airline}</p>
        </div>
      </div>

      {/* Flight Time */}
      <div className="flex flex-col items-center">
        <p className="text-gray-700">{flight.departure} - {flight.arrival}</p>
      </div>

      {/* Stops Info */}
      <div className="flex flex-col items-center">
        <p className="text-gray-700">{flight.stops}</p>
        {flight.layover && <p className="text-blue-600 text-sm">{flight.layover}</p>}
      </div>

      {/* Price */}
      <div className="flex flex-col items-end">
        <p className="text-gray-800 font-semibold">₹{flight.price}</p>
        <p className="text-blue-600 text-sm">round trip</p>
      </div>
    </div>
  );
};

export default FlightCard;

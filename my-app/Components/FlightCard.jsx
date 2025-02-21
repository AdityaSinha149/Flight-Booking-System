import React from "react";
import { useTheme } from "@/app/ThemeContext";

const FlightCard = ({ flight, hover }) => {
  const { dark } = useTheme();

  return (
    <div
      className={`grid grid-cols-3 items-center shadow-lg rounded-lg p-4 mb-4 border ${hover} ${dark ? "bg-[#1f1f1f] border-gray-700" : "bg-white border-gray-200"
        }`}
    >
      {/* Airline Logo & Name */}
      <div className="flex items-center gap-4">
        <img
          src={`/flights/${flight.airline.split(" ")[0]}.png`}
          alt="Airline Logo"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-bold text-[#605DEC]">{flight.airline}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex items-center gap-5 justify-center">
        {/* Departure Info */}
        <div className="text-center">
          <p
            className={`text-base font-medium ${dark ? "text-gray-300" : "text-gray-700"
              }`}
          >
            {flight.departure}
          </p>
          <p
            className={`text-xl ${dark ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {flight.departure_airport}
          </p>
        </div>

        {/* Flight Path */}
        <div className="transform scale-110 flex felx-row items-center gap-[1px]">
          <div className="flex flex-col items-center -translate-y-[2px]">
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
              {flight.duration}
            </p>
            <div className="flex items-center ">
              {/* Dashed Line */}
              <img
                src="./flights/line.png"
                alt="Flight Path"
                className="w-8 h-[2px]"
              />
              <img
                src="./flights/line.png"
                alt="Flight Path"
                className="w-8 h-[2px]"
              />
              <img
                src="./flights/line.png"
                alt="Flight Path"
                className="w-8 h-[2px]"
              />
            </div>
            {/* Layover or Direct Info */}
            <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
              {flight.layover_text}
            </p>
          </div>
          <img
            src="./flights/flight-icon.png"
            alt="Flight icon"
            className="w-8 h-auto"
          />
        </div>

        {/* Arrival Info */}
        <div className="text-center">
          <p className={`text-base font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
            {flight.arrival}
          </p>
          <p
            className={`text-xl ${dark ? "text-gray-400" : "text-gray-500"
              }`}
          >
            {flight.arrival_airport}
          </p>
        </div>
      </div>

      {/* Price and Select Button */}
      <div className="flex flex-col items-end">
        <div className="flex flex-col items-center">
          <p
            className={`text-lg font-bold ${dark ? "text-gray-200" : "text-gray-800"
              }`}
          >
            ₹{flight.price.toLocaleString()}
          </p>
          <button
            className={`px-4 py-2 mt-2 text-md rounded bg-[#605DEC] font-bold hover:bg-[#4d4aa8] hover:transform hover:scale-125 transition`}
          >
            <p className="text-white">Select →</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

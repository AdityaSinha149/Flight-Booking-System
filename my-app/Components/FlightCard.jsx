import React from 'react';

const FlightCard = ({ flight }) => {
    return (
        <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
            {/* Airline Logo */}
            <div className="flex items-center">
                <img src={flight.logo} alt="Airline Logo" className="w-10 h-10 rounded-full mr-3" />
                <div>
                    <p className="text-gray-700 font-medium">{flight.duration}</p>
                    <p className="text-blue-600 text-sm">{flight.airline}</p>
                </div>
            </div>

            {/* Flight Time */}
            <div className="text-center">
                <p className="text-gray-700">{flight.departure} - {flight.arrival}</p>
            </div>

            {/* Stops Info */}
            <div className="text-center">
                <p className="text-gray-700">{flight.stops}</p>
                {flight.layover && <p className="text-blue-600 text-sm">{flight.layover}</p>}
            </div>

            {/* Price */}
            <div className="text-right">
                <p className="text-gray-800 font-semibold">${flight.price}</p>
                <p className="text-blue-600 text-sm">round trip</p>
            </div>
        </div>
    );
};

export default FlightCard;

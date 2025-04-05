"use client";
import React from 'react';

const PassengerCard = ({ i, passengers, handleInputChange, dark }) => {
  return (
    <div 
        className={`mb-6 p-6 rounded-lg shadow ${dark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <h2 className="text-xl font-semibold mb-4">Passenger {i + 1}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              value={passengers[i]?.firstName || ''}
              onChange={(e) => handleInputChange(i, 'firstName', e.target.value)}
              className={`w-full p-2 rounded border ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              value={passengers[i]?.lastName || ''}
              onChange={(e) => handleInputChange(i, 'lastName', e.target.value)}
              className={`w-full p-2 rounded border ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              value={passengers[i]?.email || ''}
              onChange={(e) => handleInputChange(i, 'email', e.target.value)}
              className={`w-full p-2 rounded border ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              value={passengers[i]?.phone || ''}
              onChange={(e) => handleInputChange(i, 'phone', e.target.value)}
              className={`w-full p-2 rounded border ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
          </div>
        </div>
      </div>
  );
};

export default PassengerCard;
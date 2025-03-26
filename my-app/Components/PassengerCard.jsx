import React from 'react';

export const PassengerCard = ({ passengerNumber }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md w-full max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Passenger {passengerNumber}</h2>
      <div className="grid grid-cols-3 gap-4">
        <input type="text" placeholder="First Name" className="border p-2 rounded" />
        <input type="text" placeholder="Last Name" className="border p-2 rounded" />
        <input type="date" placeholder="Date of Birth" className="border p-2 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <input type="text" placeholder="Phone Number" className="border p-2 rounded" />
        <input type="email" placeholder="Email Address" className="border p-2 rounded" />
      </div>
      <div className="mt-4">
        <input type="text" placeholder="Address" className="border p-2 rounded w-full" />
      </div>
    </div>
  );
};
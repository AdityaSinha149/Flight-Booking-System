import React from 'react';
import { useAuth } from "@/Contexts/AuthContext"; // Import useAuth

const Ticket = ({ trip }) => {
  const { name } = useAuth(); // Get user details from AuthContext

  // Use context user details if available, otherwise fallback
  const bookedByName = name ? name : 'N/A';

  const formatDate = (dateStr) => { 
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { // Use DD/MM/YYYY format
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Debug information
  if (!trip) {
    return <div>No trip data provided to Ticket component</div>;
  }

  return (
    <div className="invoice-container" style={{
      fontFamily: 'Arial, sans-serif',
      border: '1px solid #eee',
      padding: '15px', // Further reduced padding
      width: '580px', // Further reduced container width
      margin: '20px auto',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
      color: 'black',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #605DEC', paddingBottom: '8px', marginBottom: '12px' }}> {/* Adjusted padding/margin */}
        {/* Replace with your actual logo path */}
        <img src="/logo.png" alt="Tripma Logo" style={{ height: '30px' }} /> {/* Slightly smaller logo */}
        <h1 style={{ margin: 0, fontSize: '22px', color: '#605DEC', fontWeight: 'bold' }}>TAX INVOICE</h1> {/* Slightly smaller heading */}
      </div>

      {/* Booked By Section - Use context data */}
      <div style={{ marginBottom: '20px', fontSize: '13px' }}> {/* Reduced margin/font */}
        <p style={{ margin: '3px 0' }}><strong>Booked By:</strong> {bookedByName}</p>
        <p style={{ margin: '3px 0' }}><strong>Booking Date:</strong> {formatDate(trip.booking_date)}</p>
      </div>

      {/* Passenger Boxes Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}> {/* Kept gap */}
        {trip.passengers && trip.passengers.length > 0 ? (
          trip.passengers.map((passenger, index) => (
            <div key={passenger.ticket_id || index} className="passenger-box" style={{
              border: '1px solid #ccc',
              borderRadius: '6px', // Slightly smaller radius
              padding: '10px', // Further reduced padding
              width: 'calc(50% - 5px)', // Keep width adjusted for gap
              boxSizing: 'border-box',
              marginBottom: '10px', // Reduced margin
              // Center the last item if it's odd
              marginLeft: trip.passengers.length % 2 !== 0 && index === trip.passengers.length - 1 ? 'calc(25% + 2.5px)' : '0',
            }}>
              {/* Top line in the box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed #ccc', paddingBottom: '6px', marginBottom: '6px', fontSize: '11px' }}> {/* Reduced font/padding */}
                <span style={{ fontWeight: 'bold', flexShrink: 1, marginRight: '5px', wordBreak: 'break-word' }}>{trip.departure_airport} → {trip.arrival_airport} ({formatDate(trip.departure_datetime)})</span>
                <span style={{ fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>{trip.airline} {trip.flight_no}</span>
              </div>
              {/* Passenger Info */}
              <div style={{ fontSize: '12px' }}> {/* Reduced font */}
                <p style={{ margin: '4px 0' }}><strong>Name:</strong> {passenger.name || 'N/A'}</p>
                <p style={{ margin: '4px 0' }}><strong>Seat:</strong> {passenger.seat_number || 'Not Assigned'}</p>
                <p style={{ margin: '4px 0' }}><strong>Ticket ID:</strong> {passenger.ticket_id || 'N/A'}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No passenger information available</p>
        )}
      </div>

      {/* Payment Breakup Section */}
      <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px', color: '#555' }}> {/* Reduced margin/font */}
        ................................ Payment Breakup ................................
      </div>
      <div className="payment-box" style={{
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '10px',
        width: 'calc(50% - 5px)', // Match passenger box width
        margin: '0 auto', // Center the payment box
        fontSize: '12px', // Reduced font
      }}>
        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}>
          <span>Price per Ticket:</span>
          <span style={{ fontWeight: 'bold' }}>₹{trip.price ? trip.price.toLocaleString() : 'N/A'}</span>
        </p>
        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between' }}>
          <span>Number of Passengers:</span>
          <span style={{ fontWeight: 'bold' }}>{trip.passengers ? trip.passengers.length : 0}</span>
        </p>
        <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '8px 0' }} />
        <p style={{ margin: '6px 0', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}> {/* Adjusted font */}
          <strong>Total Amount:</strong>
          <strong style={{ color: '#605DEC' }}>₹{trip.price && trip.passengers ? (trip.price * trip.passengers.length).toLocaleString() : 'N/A'}</strong>
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '11px', color: '#777' }}> {/* Reduced margin/font */}
        Thank you for choosing Tripma!
      </div>
    </div>
  );
};

export default Ticket;

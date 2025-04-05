"use client";
import React, { useState, useEffect } from "react";
import { useAdmin } from "@/Contexts/AdminContext";
import { useTheme } from "@/Contexts/ThemeContext";
import { useAuth } from "@/Contexts/AuthContext";
import Navbar from "@/Components/Navbar";
import { useRouter } from "next/navigation";

export default function OurFlightsPage() {
  const { adminAirline, adminName } = useAdmin();
  const { dark } = useTheme();
  const { signinVisible, signupVisible } = useAuth();
  const router = useRouter();
  const [instances, setInstances] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [expandedInstances, setExpandedInstances] = useState({});
  const [passengerInfo, setPassengerInfo] = useState({});

  useEffect(() => {
    if (!adminName) {
      router.push("/");
      return;
    }

    // Fetch flights for this airline
    setLoadingFlights(true);
    fetch(`/api/getFlights?airline=${adminAirline}`)
      .then((res) => res.json())
      .then((data) => {
        // Check if data is an array before setting it to state
        setFlights(Array.isArray(data) ? data : []);
        console.log("Flights data:", data); // For debugging
        setLoadingFlights(false);
      })
      .catch((error) => {
        console.error("Error fetching flights:", error);
        setFlights([]); // Set empty array on error
        setLoadingFlights(false);
      });

    // Fetch all instances for this airline
    setLoading(true);
    fetch(`/api/getInstances?airline=${adminAirline}`)
      .then((res) => res.json())
      .then((data) => {
        setInstances(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching instances:", error);
        setInstances([]); // Set empty array on error
        setLoading(false);
      });
  }, [adminAirline, adminName, router]);

  async function handleDelete(instanceId) {
    try {
      await fetch(`/api/deleteInstance?instanceId=${instanceId}`, {
        method: "DELETE",
      });
      
      // Re-fetch after deleting
      const res = await fetch(`/api/getInstances?airline=${adminAirline}`);
      const data = await res.json();
      setInstances(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error deleting instance:", error);
      setInstances([]); // Set empty array on error
    }
  }

  async function handleDeleteFlight(flightNo) {
    if (confirm(`Are you sure you want to delete flight ${flightNo}? This will also delete all instances of this flight.`)) {
      try {
        const res = await fetch(`/api/deleteFlight?flightNo=${flightNo}&airline=${adminAirline}`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.success) {
          // Re-fetch flights and instances after deletion
          const flightsRes = await fetch(`/api/getFlights?airline=${adminAirline}`);
          const flightsData = await flightsRes.json();
          setFlights(Array.isArray(flightsData) ? flightsData : []);
          
          const instancesRes = await fetch(`/api/getInstances?airline=${adminAirline}`);
          const instancesData = await instancesRes.json();
          setInstances(Array.isArray(instancesData) ? instancesData : []);
        }
      } catch (error) {
        console.error("Error deleting flight:", error);
        setFlights([]); // Set empty array on error
        setInstances([]); // Set empty array on error
      }
    }
  }

  const handleDeleteAllUnusedFlights = async () => {
    if (confirm("Are you sure you want to delete all unused flights? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/deleteAllUnusedFlights?airline=${adminAirline}`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.success) {
          // Re-fetch flights and instances after deletion
          fetchFlights();
          setSuccess(`Successfully deleted ${data.deletedCount} unused flights!`);
        } else {
          setError(data.error || "Failed to delete unused flights");
        }
      } catch (error) {
        console.error("Error deleting flights:", error);
        setError("An error occurred while deleting the flights.");
      }
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteAllExpiredInstances = async () => {
    if (confirm("Are you sure you want to delete all expired flight instances? This action cannot be undone.")) {
      try {
        const res = await fetch(`/api/deleteExpiredInstances`, {
          method: "DELETE",
        });
        const data = await res.json();
        
        if (data.success) {
          // Re-fetch instances after deletion
          const instancesRes = await fetch(`/api/getInstances?airline=${adminAirline}`);
          const instancesData = await instancesRes.json();
          setInstances(Array.isArray(instancesData) ? instancesData : []);
          setSuccess(`Successfully deleted ${data.deletedCount} expired flight instances!`);
        } else {
          setError(data.error || "Failed to delete expired instances");
        }
      } catch (error) {
        console.error("Error deleting expired instances:", error);
        setError("An error occurred while deleting the expired instances.");
      }
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const fetchFlights = () => {
    setLoadingFlights(true);
    fetch(`/api/getFlights?airline=${adminAirline}`)
      .then((res) => res.json())
      .then((data) => {
        setFlights(Array.isArray(data) ? data : []);
        setLoadingFlights(false);
      })
      .catch((error) => {
        console.error("Error fetching flights:", error);
        setFlights([]);
        setLoadingFlights(false);
      });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Format date using native JavaScript
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      return date.toLocaleString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  const fetchPassengerInformation = async (instanceId) => {
    try {
      const response = await fetch(`/api/getAllBookings?airline=${adminAirline}`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Filter bookings for the specific instance
      const filteredBookings = data.filter(booking => booking.instance_id === instanceId);
      setPassengerInfo(prev => ({ ...prev, [instanceId]: filteredBookings }));
    } catch (err) {
      setError(err.message || "Failed to load passenger information");
      setPassengerInfo(prev => ({ ...prev, [instanceId]: [] }));
    }
  };

  const toggleInstanceExpansion = (instanceId) => {
    setExpandedInstances(prev => {
      const isExpanded = !prev[instanceId];
      if (isExpanded && !passengerInfo[instanceId]) {
        fetchPassengerInformation(instanceId);
      }
      return {
        ...prev,
        [instanceId]: isExpanded
      };
    });
  };

  return (
    <div className={dark ? "min-h-screen bg-gray-900 text-white" : "min-h-screen bg-white text-black"}>
      <Navbar isAdmin={true} adminName={adminName} />
      
      <div className="p-2 sm:p-2 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{adminAirline} Management</h1>
          <button 
            onClick={() => router.push("/Admin")}
            className="bg-[#605DEC] hover:bg-[#4d4aa8] text-white px-4 py-2 rounded-md transition"
          >
            Admin Home
          </button>
        </div>
        
        {/* Flights Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Flights</h2>
            <button
              onClick={handleDeleteAllUnusedFlights}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              Delete All Unused Flights
            </button>
          </div>
          {loadingFlights ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#605DEC] mx-auto"></div>
              <p className="mt-3">Loading flights...</p>
            </div>
          ) : flights.length === 0 ? (
            <div className="bg-blue-100 text-blue-800 p-4 rounded-md">
              No flights found. Create some on the Admin page.
            </div>
          ) : (
            <div className={dark ? "bg-gray-800 rounded-lg shadow" : "bg-white rounded-lg shadow"}>
              <table className="min-w-full">
                <thead>
                  <tr className={dark ? "bg-gray-700" : "bg-gray-200"}>
                    <th className="px-6 py-3 text-left font-medium">Flight No.</th>
                    <th className="px-6 py-3 text-left font-medium">Airline</th>
                    <th className="px-6 py-3 text-left font-medium">Capacity</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {Array.isArray(flights) && flights.map((flight) => {
                    const isUsed = instances.some(instance => instance.flight_no === flight.flight_no);
                    return (
                      <tr key={flight.flight_no} className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${!isUsed ? 'text-red-500' : ''}`}>
                        <td className="px-6 py-4">{flight.flight_no}</td>
                        <td className="px-6 py-4">{flight.airline_name}</td>
                        <td className="px-6 py-4">{flight.max_seat} seats</td>
                        <td className="px-6 py-4">{isUsed ? "Used" : "Unused"}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteFlight(flight.flight_no)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Flight Instances Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Flight Instances</h2>
            <button
              onClick={handleDeleteAllExpiredInstances}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              Delete All Expired Instances
            </button>
          </div>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#605DEC] mx-auto"></div>
              <p className="mt-3">Loading flight instances...</p>
            </div>
          ) : instances.length === 0 ? (
            <div className="bg-blue-100 text-blue-800 p-4 rounded-md">
              No flight instances found. Create some on the Admin page.
            </div>
          ) : (
            <div className={dark ? "bg-gray-800 rounded-lg shadow" : "bg-white rounded-lg shadow"}>
              <table className="min-w-full">
                <thead>
                  <tr className={dark ? "bg-gray-700" : "bg-gray-200"}>
                    <th className="px-6 py-3 text-left font-medium">Flight No.</th>
                    <th className="px-6 py-3 text-left font-medium">Route</th>
                    <th className="px-6 py-3 text-left font-medium">Departure</th>
                    <th className="px-6 py-3 text-left font-medium">Arrival</th>
                    <th className="px-6 py-3 text-left font-medium">Price</th>
                    <th className="px-6 py-3 text-left font-medium">Occupancy</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {Array.isArray(instances) && instances.map((inst) => (
                    <React.Fragment key={inst.instance_id}>
                      <tr className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${inst.status === 'Expired' ? 'text-red-500' : ''}`}>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleInstanceExpansion(inst.instance_id)} className="transition-transform">
                            <span className={`mr-2 text-xl transition-transform duration-300 ${expandedInstances[inst.instance_id] ? 'rotate-90' : ''}`}>
                            {expandedInstances[inst.instance_id] ? '▼' : '▶'}
                            </span>
                            {inst.flight_no}
                          </button>
                        </td>
                        <td className="px-6 py-4">{inst.departure_airport_id} → {inst.arrival_airport_id}</td>
                        <td className="px-6 py-4">{formatDate(inst.departure_time)}</td>
                        <td className="px-6 py-4">{formatDate(inst.arrival_time)}</td>
                        <td className="px-6 py-4">${inst.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="mr-2">{inst.booked_seats}/{inst.max_seat}</span>
                            <div className="w-24 bg-gray-300 rounded-full h-2.5 dark:bg-gray-600">
                              <div 
                                className="bg-[#605DEC] h-2.5 rounded-full" 
                                style={{ width: `${(inst.booked_seats / inst.max_seat) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{inst.status}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(inst.instance_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {expandedInstances[inst.instance_id] && (
                        <tr>
                          <td colSpan="8" className="p-4">
                            {/* Passenger Information */}
                            <div className={dark ? "bg-gray-700 rounded-lg shadow p-4" : "bg-gray-100 rounded-lg shadow p-4"}>
                              <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
                              {passengerInfo[inst.instance_id] && passengerInfo[inst.instance_id].length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full">
                                    <thead>
                                      <tr className={dark ? "bg-gray-600" : "bg-gray-50"}>
                                        <th className="py-2 px-4 border-b text-left">Booking ID</th>
                                        <th className="py-2 px-4 border-b text-left">Passenger</th>
                                        <th className="py-2 px-4 border-b text-left">Seat</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {passengerInfo[inst.instance_id].map(booking => (
                                        <tr key={booking.ticket_id} className="hover:bg-gray-200 dark:hover:bg-gray-600">
                                          <td className="py-2 px-4">{booking.ticket_id}</td>
                                          <td className="py-2 px-4">{booking.passenger_name}</td>
                                          <td className="py-2 px-4">{booking.seat_number || 'N/A'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p>No passenger information available for this flight instance.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Add SigninCard and SignupCard */}
      {signinVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <SigninCard />
        </div>
      )}
      
      {signupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <SignupCard />
        </div>
      )}
    </div>
  );
}

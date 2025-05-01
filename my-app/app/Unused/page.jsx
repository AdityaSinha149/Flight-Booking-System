"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from '@/contexts/ThemeContext';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UnusedResourcesPage() {
  const { dark } = useTheme();
  const { superAdminLoggedIn } = useSuperAdmin();
  const router = useRouter();
  const [unusedAirlines, setUnusedAirlines] = useState([]);
  const [unusedAirports, setUnusedAirports] = useState([]);
  const [unusedRoutes, setUnusedRoutes] = useState([]);
  const [allInstances, setAllInstances] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInstances, setLoadingInstances] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!superAdminLoggedIn) {
      router.push("/");
      return;
    }

    fetchUnusedResources();
    fetchAllInstances();
    fetchAllBookings();
  }, [superAdminLoggedIn, router]);

  const fetchUnusedResources = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getUnused");
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setUnusedAirlines(data.airlines || []);
      setUnusedAirports(data.airports || []);
      setUnusedRoutes(data.routes || []);
    } catch (err) {
      setError(err.message || "Failed to load unused resources");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInstances = async () => {
    setLoadingInstances(true);
    try {
      const response = await fetch("/api/getAllInstances");
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAllInstances(data || []);
    } catch (err) {
      setError(err.message || "Failed to load flight instances");
    } finally {
      setLoadingInstances(false);
    }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const response = await fetch("/api/getAllBookings");
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAllBookings(data || []);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDeleteAirline = async (airlineName) => {
    if (window.confirm(`Are you sure you want to delete airline ${airlineName}? This action cannot be undone.`)) {
      try {
        const response = await fetch("/api/deleteAirline", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ airlineName }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess(`Airline ${airlineName} deleted successfully!`);
          // Refresh list
          fetchUnusedResources();
        } else {
          setError(data.error || "Failed to delete airline");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      }
      
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteAirport = async (airportId) => {
    if (window.confirm(`Are you sure you want to delete airport ${airportId}? This action cannot be undone.`)) {
      try {
        const response = await fetch("/api/deleteAirport", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ airportId }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess(`Airport ${airportId} deleted successfully!`);
          // Refresh list
          fetchUnusedResources();
        } else {
          setError(data.error || "Failed to delete airport");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      }
      
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm(`Are you sure you want to delete this route? This action cannot be undone.`)) {
      try {
        const response = await fetch("/api/deleteRoute", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ routeId }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess("Route deleted successfully!");
          // Refresh list
          fetchUnusedResources();
        } else {
          setError(data.error || "Failed to delete route");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      }
      
      setTimeout(() => setSuccess(""), 3000);
    }
  };
  
  const handleDeleteExpiredInstances = async () => {
    if (window.confirm("Are you sure you want to delete all expired flight instances? This action cannot be undone.")) {
      try {
        const response = await fetch("/api/deleteExpiredInstances", {
          method: "DELETE",
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess(`Successfully deleted ${data.deletedCount} expired flight instances!`);
          // Refresh instances list
          fetchAllInstances();
        } else {
          setError(data.error || "Failed to delete expired instances");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      }
      
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteExpiredBookings = async () => {
    if (window.confirm("Are you sure you want to delete all expired bookings? This action cannot be undone.")) {
      try {
        const response = await fetch("/api/deleteExpiredBookings", {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          setSuccess(`Successfully deleted ${data.deletedCount} expired bookings!`);
          fetchAllBookings();
        } else {
          setError(data.error || "Failed to delete expired bookings");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      }
      setTimeout(() => setSuccess(""), 3000);
    }
  };
  
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  const isExpired = (departureTime, arrivalTime) => {
    const now = new Date();
    return new Date(departureTime) < now && new Date(arrivalTime) < now;
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <Navbar />
      
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${dark ? 'text-blue-300' : 'text-blue-600'}`}>Unused Resources</h1>
          <button 
            onClick={() => router.push("/SuperAdmin")}
            className="bg-[#605DEC] hover:bg-[#4d4aa8] text-white px-4 py-2 rounded-md transition"
          >
            Back to Dashboard
          </button>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">{success}</div>}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#605DEC]"></div>
          </div>
        ) : (
          <>
            {/* Unused Airlines Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Unused Airlines</h2>
              {unusedAirlines.length === 0 ? (
                <p className="text-center py-4 italic">No unused airlines found.</p>
              ) : (
                <div className={`overflow-x-auto ${dark ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
                  <table className="min-w-full">
                    <thead className={dark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th className="py-3 px-6 text-left font-medium">Airline Name</th>
                        <th className="py-3 px-6 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {unusedAirlines.map((airline) => (
                        <tr key={airline.airline_name} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td className="py-4 px-6">{airline.airline_name}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteAirline(airline.airline_name)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Unused Airports Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Unused Airports</h2>
              {unusedAirports.length === 0 ? (
                <p className="text-center py-4 italic">No unused airports found.</p>
              ) : (
                <div className={`overflow-x-auto ${dark ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
                  <table className="min-w-full">
                    <thead className={dark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th className="py-3 px-6 text-left font-medium">Airport Code</th>
                        <th className="py-3 px-6 text-left font-medium">Location</th>
                        <th className="py-3 px-6 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {unusedAirports.map((airport) => (
                        <tr key={airport.airport_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td className="py-4 px-6">{airport.airport_id}</td>
                          <td className="py-4 px-6">{airport.location}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteAirport(airport.airport_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Unused Routes Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Unused Routes</h2>
              {unusedRoutes.length === 0 ? (
                <p className="text-center py-4 italic">No unused routes found.</p>
              ) : (
                <div className={`overflow-x-auto ${dark ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
                  <table className="min-w-full">
                    <thead className={dark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th className="py-3 px-6 text-left font-medium">Route ID</th>
                        <th className="py-3 px-6 text-left font-medium">From</th>
                        <th className="py-3 px-6 text-left font-medium">To</th>
                        <th className="py-3 px-6 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {unusedRoutes.map((route) => (
                        <tr key={route.route_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td className="py-4 px-6">{route.route_id}</td>
                          <td className="py-4 px-6">{route.departure_airport_id} ({route.departure_location})</td>
                          <td className="py-4 px-6">{route.arrival_airport_id} ({route.arrival_location})</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleDeleteRoute(route.route_id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* All Flight Instances Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">All Flight Instances</h2>
                <button
                  onClick={handleDeleteExpiredInstances}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Delete All Expired Instances
                </button>
              </div>
              
              {loadingInstances ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#605DEC]"></div>
                </div>
              ) : allInstances.length === 0 ? (
                <p className="text-center py-4 italic">No flight instances found.</p>
              ) : (
                <div className={`overflow-x-auto ${dark ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
                  <table className="min-w-full">
                    <thead className={dark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th className="py-3 px-6 text-left font-medium">ID</th>
                        <th className="py-3 px-6 text-left font-medium">Flight</th>
                        <th className="py-3 px-6 text-left font-medium">Route</th>
                        <th className="py-3 px-6 text-left font-medium">Departure</th>
                        <th className="py-3 px-6 text-left font-medium">Arrival</th>
                        <th className="py-3 px-6 text-left font-medium">Price</th>
                        <th className="py-3 px-6 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {allInstances.map((instance) => {
                        const expired = isExpired(instance.departure_time, instance.arrival_time);
                        return (
                          <tr key={instance.instance_id} className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${expired ? 'text-red-500' : ''}`}>
                            <td className="py-4 px-6">{instance.instance_id}</td>
                            <td className="py-4 px-6">{instance.airline_name} {instance.flight_no}</td>
                            <td className="py-4 px-6">
                              {instance.departure_airport_id} → {instance.arrival_airport_id}
                            </td>
                            <td className="py-4 px-6">{formatDateTime(instance.departure_time)}</td>
                            <td className="py-4 px-6">{formatDateTime(instance.arrival_time)}</td>
                            <td className="py-4 px-6">${instance.price}</td>
                            <td className="py-4 px-6">
                              {expired ? 'Expired' : 'Active'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* All Bookings Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">All Bookings</h2>
                <button
                  onClick={handleDeleteExpiredBookings}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  Delete All Expired Bookings
                </button>
              </div>
              
              {loadingBookings ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#605DEC]"></div>
                </div>
              ) : allBookings.length === 0 ? (
                <p className="text-center py-4 italic">No bookings found.</p>
              ) : (
                <div className={`overflow-x-auto ${dark ? 'bg-gray-800' : 'bg-white'} rounded shadow`}>
                  <table className="min-w-full">
                    <thead className={dark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th className="py-3 px-6 text-left font-medium">Booking ID</th>
                        <th className="py-3 px-6 text-left font-medium">Passenger</th>
                        <th className="py-3 px-6 text-left font-medium">Flight</th>
                        <th className="py-3 px-6 text-left font-medium">Route</th>
                        <th className="py-3 px-6 text-left font-medium">Departure</th>
                        <th className="py-3 px-6 text-left font-medium">Arrival</th>
                        <th className="py-3 px-6 text-left font-medium">Seat</th>
                        <th className="py-3 px-6 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {allBookings.map((booking) => {
                        const expired = isExpired(booking.departure_time, booking.arrival_time);
                        return (
                          <tr key={booking.ticket_id} className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${expired ? 'text-red-500' : ''}`}>
                            <td className="py-4 px-6">{booking.ticket_id}</td>
                            <td className="py-4 px-6">{booking.passenger_name}</td>
                            <td className="py-4 px-6">
                              {booking.airline_name} {booking.flight_no}
                            </td>
                            <td className="py-4 px-6">
                              {booking.departure_airport_id} → {booking.arrival_airport_id}
                            </td>
                            <td className="py-4 px-6">{formatDateTime(booking.departure_time)}</td>
                            <td className="py-4 px-6">{formatDateTime(booking.arrival_time)}</td>
                            <td className="py-4 px-6">{booking.seat_number || 'Not assigned'}</td>
                            <td className="py-4 px-6">
                              {expired ? 'Completed' : 'Active'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

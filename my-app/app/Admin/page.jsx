"use client";
import React, { useState, useEffect } from "react";
import { useAdmin } from "@/Contexts/AdminContext";
import Navbar from "@/Components/Navbar";
import SigninCard from "@/Components/SigninCard";
import SignupCard from "@/Components/SignupCard";
import { useAuth } from "@/Contexts/AuthContext";
import { useTheme } from "@/Contexts/ThemeContext";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [flightNo, setFlightNo] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [showFlightDropdown, setShowFlightDropdown] = useState(false);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [price, setPrice] = useState("");
  const [flights, setFlights] = useState([]);
  const [creatingNewFlight, setCreatingNewFlight] = useState(false);
  const [newFlightNo, setNewFlightNo] = useState("");
  const [newFlightCapacity, setNewFlightCapacity] = useState("");
  const [airports, setAirports] = useState([]);
  const [addingNewLocation, setAddingNewLocation] = useState(false);
  const [newAirportId, setNewAirportId] = useState("");
  const [newAirportLocation, setNewAirportLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");

  const { adminAirline, adminName } = useAdmin();
  const { signinVisible, signupVisible } = useAuth();
  const { dark } = useTheme();
  const router = useRouter();
  
  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!adminName) {
      router.push("/");
    }
  }, [adminName, router]);
  
  // Function to fetch flights
  const fetchFlights = () => {
    fetch(`/api/getFlights?airline=${adminAirline}`)
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);
        setFilteredFlights(data.filter(f => f.airline_name === adminAirline));
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFlights();

    fetch("/api/getAirports")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch(() => {});
  }, [adminAirline]);

  useEffect(() => {
    if (flights.length > 0) {
      const flightNoStr = String(flightNo).toLowerCase();
      const filtered = flights.filter(
        f => f.airline_name === adminAirline &&
        String(f.flight_no).toLowerCase().includes(flightNoStr)
      );
      setFilteredFlights(filtered);
    }
  }, [flightNo, flights, adminAirline]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const flightInput = document.getElementById("flight-input");
      if (flightInput && !flightInput.contains(event.target)) {
        setShowFlightDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateFlight = async () => {
    if (!newFlightNo.trim()) {
      setError("Flight number is required.");
      return;
    }
    if (!newFlightCapacity || newFlightCapacity <= 0) {
      setError("Valid flight capacity is required.");
      return;
    }
    setError("");
    const res = await fetch("/api/createFlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        flightNo: newFlightNo, 
        airlineName: adminAirline,
        capacity: newFlightCapacity 
      }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error || "Flight creation failed.");
      return;
    }
    setSuccess(`Flight ${newFlightNo} created successfully!`);
    setCreatingNewFlight(false);
    setNewFlightNo("");
    setNewFlightCapacity("");
    fetchFlights();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAddAirport = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      if (!newAirportId || !newAirportLocation) {
        setError("Please fill in all required fields");
        return;
      }
      
      if (!/^[A-Z]{3}$/.test(newAirportId)) {
        setError("Airport code must be 3 uppercase letters (e.g. DEL)");
        return;
      }
      
      const response = await fetch("/api/createAirport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airportId: newAirportId,
          location: newAirportLocation,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to add airport. It might already exist.");
      }
      
      setSuccess(`Airport ${newAirportId} - ${newAirportLocation} added successfully!`);
      setAddingNewLocation(false);
      setNewAirportId("");
      setNewAirportLocation("");
      // Re-fetch airports
      const airportsRes = await fetch("/api/getAirports");
      const airportsData = await airportsRes.json();
      setAirports(airportsData);
    } catch (error) {
      console.error("Airport creation error:", error);
      setError(error.message || "Error adding airport");
    }
    
    setTimeout(() => setSuccess(""), 3000);
  };

  // Restore and improve handleCreateInstance function
  const handleCreateInstance = async () => {
    if (!departureAirport || !arrivalAirport || !flightNo || !departureTime || !arrivalTime || !price) {
      setError("All fields are required for creating an instance.");
      return;
    }

    if (new Date(departureTime) >= new Date(arrivalTime)) {
      setError("Departure time must be before arrival time.");
      return;
    }
    
    try {
      setError("");
      
      // Create or get existing route through POST endpoint
      const routeResponse = await fetch("/api/getRoutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departureAirport, arrivalAirport }),
      });
      
      const routeData = await routeResponse.json();
      
      if (!routeData.success) {
        throw new Error(routeData.error || "Failed to create or find route");
      }
      
      const routeId = routeData.routeId;
      
      // Create flight instance
      const flight = filteredFlights.find(f => f.flight_no == flightNo);
      const res = await fetch("/api/createInstance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeId,
          flightNo,
          airlineName: flight?.airline_name || "",
          departureTime,
          arrivalTime,
          price,
        }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Error creating flight instance.");
      
      setSuccess("Flight instance created successfully!");
      // Reset form fields
      setFlightNo(""); setDepartureTime(""); setArrivalTime("");
      setPrice(""); setDepartureAirport(""); setArrivalAirport("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "An error occurred.");
    }
  };

  return (
    <div className={dark ? "min-h-screen bg-gray-900 text-white" : "min-h-screen bg-white text-black"}>
      <Navbar isAdmin={true} adminName={adminName} />
      
      <div className="p-8 sm:p-12 container mx-auto">
        <h1 className="text-3xl font-bold mb-6">{adminAirline} Admin</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <div className={dark ? "bg-gray-800 shadow-md rounded p-4 mb-8" : "bg-gray-300 shadow-md rounded p-4 mb-8"}>
          <label className="block mb-1">Route</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              className="border p-2 rounded text-gray-900"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
            >
              <option value="">Departure airport</option>
              {airports
                .filter((airport) => airport.airport_id !== arrivalAirport)
                .map((a) => (
                  <option key={a.airport_id} value={a.airport_id}>
                    {a.airport_id} - {a.location}
                  </option>
                ))}
            </select>
            <select
              className="border p-2 rounded text-gray-900"
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
            >
              <option value="">Arrival airport</option>
              {airports
                .filter((airport) => airport.airport_id !== departureAirport)
                .map((a) => (
                  <option key={a.airport_id} value={a.airport_id}>
                    {a.airport_id} - {a.location}
                  </option>
                ))}
            </select>
          </div>
          {!addingNewLocation && (
            <div className="flex justify-center">
              <button
                onClick={() => setAddingNewLocation(true)}
                className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
              >
                Add new airport
              </button>
            </div>
          )}
          {addingNewLocation && (
            <div className="grid grid-cols-2 gap-2 mb-2 mt-2">
              <input
                type="text"
                placeholder="Code (e.g. DEL)"
                value={newAirportId}
                onChange={(e) => setNewAirportId(e.target.value)}
                className="border p-2 rounded text-black"
              />
              <input
                type="text"
                placeholder="Location"
                value={newAirportLocation}
                onChange={(e) => setNewAirportLocation(e.target.value)}
                className="border p-2 rounded text-black"
              />
              <div className="col-span-2 flex justify-center space-x-2 mt-2">
                <button
                  onClick={handleAddAirport}
                  className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
                >
                  Submit Airport
                </button>
                <button
                  onClick={() => {
                    setAddingNewLocation(false);
                    setNewAirportId("");
                    setNewAirportLocation("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={dark ? "bg-gray-800 shadow-md rounded p-4 mb-8" : "bg-gray-300 shadow-md rounded p-4 mb-8"}>
          <label className="block mb-1">Flight</label>
          {!creatingNewFlight && (
            <div className="relative" id="flight-input">
              <input
                type="text"
                placeholder="Search for a flight number"
                value={flightNo}
                onChange={(e) => setFlightNo(e.target.value)}
                onFocus={() => setShowFlightDropdown(true)}
                onBlur={() => {
                  if (!filteredFlights.some((f) => f.flight_no === String(flightNo).trim())) {
                    setFlightNo("");
                  }
                }}
                className="bg-white border p-2 rounded w-full text-black"
              />
              {showFlightDropdown && filteredFlights.length > 0 && (
                <ul className="absolute bg-white text-black border rounded w-full mt-1 max-h-60 overflow-y-auto z-10">
                  {filteredFlights.map((flight) => (
                    <li
                      key={flight.flight_no}
                      className="cursor-pointer p-2 hover:bg-gray-200"
                      onClick={() => {
                        setFlightNo(flight.flight_no);
                        setShowFlightDropdown(false);
                      }}
                    >
                      {flight.flight_no}
                    </li>
                  ))}
                </ul>
              )}
              {showFlightDropdown && filteredFlights.length === 0 && (
                <div className="absolute bg-white text-black border rounded w-full mt-1 p-2 z-10">
                  No flights found
                </div>
              )}
            </div>
          )}
          {creatingNewFlight && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Flight No."
                value={newFlightNo}
                onChange={(e) => setNewFlightNo(e.target.value)}
                className="border p-2 rounded text-black"
              />
              <input
                type="number"
                placeholder="Seat Capacity"
                value={newFlightCapacity}
                onChange={(e) => setNewFlightCapacity(e.target.value)}
                min="1"
                className="border p-2 rounded text-black"
              />
              <div className="col-span-2 flex justify-center space-x-2 mt-2">
                <button
                  onClick={handleCreateFlight}
                  className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
                >
                  Submit Flight
                </button>
                <button
                  onClick={() => {
                    setCreatingNewFlight(false);
                    setNewFlightNo("");
                    setNewFlightCapacity("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {!creatingNewFlight && (
            <div className="flex justify-center">
              <button
                onClick={() => setCreatingNewFlight(true)}
                className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
              >
                Create new flight
              </button>
            </div>
          )}
        </div>

        <div className={dark ? "bg-gray-800 shadow-md rounded p-4 mb-8" : "bg-gray-300 shadow-md rounded p-4 mb-8"}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label className="block mb-1">Departure Time</label>
              <input
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="border p-2 rounded w-full text-gray-900"
              />
            </div>
            <div>
              <label className="block mb-1">Arrival Time</label>
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="border p-2 rounded w-full text-gray-900"
              />
            </div>
            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 rounded w-full text-gray-900"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleCreateInstance}
              className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
            >
              Create Flight Instance
            </button>
          </div>
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

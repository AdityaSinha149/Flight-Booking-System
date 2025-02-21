"use client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/ThemeContext";
import { useRouter } from "next/navigation";
import { useFlights } from "@/app/FlightContext";
import { useSearch } from "@/app/SearchContext";


export default function SearchBar() {
  const { dark } = useTheme();
  const [locations, setLocations] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedFromIndex, setSelectedFromIndex] = useState(-1);
  const [selectedToIndex, setSelectedToIndex] = useState(-1);
  const { fromInput, setFromInput, toInput, setToInput, date, setDate, passengerCount, setPassengerCount } = useSearch();
  const { setFlights, setLoading, setError } = useFlights();

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const router = useRouter();

  const formatAirport = (loc) => {
    const i = loc.indexOf("(");
    const j = loc.indexOf(")");
    return loc.substring(i + 1, j);
  };


  const fetchFlights = async () => {
    try {
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          start_airport: formatAirport(fromInput),
          end_airport: formatAirport(toInput),
          travel_date: date
        })
      });

      if (!response.ok) {
        alert("Error fetching flights");
        return;
      }

      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = () => {
    fetchFlights();
    router.push("/Flights");
  };

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const formatLocation = (loc) => `${loc.location} (${loc.airport_id})`;

  const filterLocations = (input) =>
    locations.filter(
      ({ location, airport_id }) =>
        location.toLowerCase().startsWith(input.toLowerCase()) ||
        airport_id.toLowerCase().startsWith(input.toLowerCase())
    );

  const filteredFrom = filterLocations(fromInput);
  const filteredTo = filterLocations(toInput);

  const handleKeyDown = (e) => {
    if (showToDropdown) {
      if (e.key === "ArrowDown") {
        setSelectedToIndex((prev) => Math.min(prev + 1, filteredTo.length - 1));
      } else if (e.key === "ArrowUp") {
        setSelectedToIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedToIndex !== -1) {
        setToInput(formatLocation(filteredTo[selectedToIndex]));
        setShowToDropdown(false);
      }
    }
    else {
      if (e.key === "ArrowDown") {
        setSelectedFromIndex((prev) => Math.min(prev + 1, filteredFrom.length - 1));
      } else if (e.key === "ArrowUp") {
        setSelectedFromIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedFromIndex !== -1) {
        setFromInput(formatLocation(filteredFrom[selectedFromIndex]));
        setShowFromDropdown(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromRef.current && !fromRef.current.contains(event.target) &&
        toRef.current && !toRef.current.contains(event.target)
      ) {
        setShowFromDropdown(false);
        setShowToDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <div
        className={`flex items-center shadow-md rounded-md w-full max-w-5xl mx-auto border border-gray-300 ${dark ? "bg-[#202020]" : "bg-gray-100"
          }`}
      >
        {/* From Input */}
        <div ref={fromRef} className="relative flex-1 border-r border-gray-300 flex items-center px-4 py-3">
          <span className="mr-2">
            <img className={!dark ? "invert" : ""} src="./icons/takeoff.svg" alt="takeoff" />
          </span>
          <input
            type="text"
            placeholder="From where?"
            className={`w-full bg-transparent outline-none ${dark ? "text-white" : "text-gray-600"
              }`}
            value={fromInput}
            onChange={(e) => {
              setFromInput(e.target.value);
              setShowFromDropdown(true);
              setShowToDropdown(false);
            }}
            onFocus={() => {
              setFromInput("");
              setShowFromDropdown(true);
              setShowToDropdown(false);
              setSelectedFromIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
          {showFromDropdown && (
            <ul
              className={`absolute top-full left-0 w-full shadow-md border border-gray-700 mt-1 max-h-40 overflow-auto rounded-md z-50 ${dark ? "bg-black text-white" : "bg-white text-gray-600"
                }`}
            >
              {filteredFrom.length > 0 ? (
                filteredFrom.map((loc) => (
                  <li
                    key={loc.airport_id}
                    className={`px-4 py-2 cursor-pointer ${dark ? "hover:bg-gray-800" : "hover:bg-gray-300"}`}
                    onClick={() => {
                      setFromInput(formatLocation(loc));
                      setShowFromDropdown(false);
                    }}
                  >
                    {formatLocation(loc)}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">No results found</li>
              )}
            </ul>
          )}
        </div>

        {/* To Input */}
        <div ref={toRef} className="relative flex-1 border-r border-gray-300 flex items-center px-4 py-3">
          <span className="mr-2">
            <img className={!dark ? "invert" : ""} src="./icons/landing.svg" alt="landing" />
          </span>
          <input
            type="text"
            placeholder="Where to?"
            className={`w-full bg-transparent outline-none ${dark ? "text-white" : "text-gray-600"
              }`}
            value={toInput}
            onChange={(e) => {
              setToInput(e.target.value);
              setShowToDropdown(true);
              setShowFromDropdown(false);
            }}
            onFocus={() => {
              setToInput("");
              setShowToDropdown(true);
              setShowFromDropdown(false);
              setSelectedToIndex(-1);
            }}
            onKeyDown={handleKeyDown}

          />
          {showToDropdown && (
            <ul
              className={`absolute top-full left-0 w-full shadow-md border border-gray-700 mt-1 max-h-40 overflow-auto rounded-md z-50 ${dark ? "bg-black text-white" : "bg-white text-gray-600"
                }`}
            >
              {filteredTo.length > 0 ? (
                filteredTo.map((loc) => (
                  <li
                    key={loc.airport_id}
                    className={`px-4 py-2 cursor-pointer ${dark ? "hover:bg-gray-800" : "hover:bg-gray-300"}`}
                    onClick={() => {
                      setToInput(formatLocation(loc));
                      setShowToDropdown(false);
                    }}
                  >
                    {formatLocation(loc)}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">No results found</li>
              )}
            </ul>
          )}
        </div>

        {/* Date Picker */}
        <div className="relative flex-1 border-r border-gray-300 flex items-center px-4 py-3">
          <span className="mr-2">
            <img className={!dark ? "invert" : ""} src="./icons/calendar.svg" alt="date" />
          </span>
          <input
            type="date"
            className={`w-full bg-transparent outline-none ${date ? (dark ? "text-white" : "text-gray-600") : "text-gray-400"
              }`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Passenger Count */}
        <div className="relative flex-1 flex items-center px-4 py-3">
          <span className="text-gray-400 mr-2">
            <img className={!dark ? "invert" : ""} src="./icons/person.svg" alt="" />
          </span>
          <input
            type="text"
            placeholder="1 adult"
            className={`w-full bg-transparent outline-none ${dark ? "text-white" : "text-gray-600"}`}
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <button className="bg-[#605DEC] text-white px-6 py-3 rounded-md hover:bg-[#4d4aa8] hover:transform hover:scale-110 transition"
          onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

import { useAuth } from '@/Contexts/AuthContext';
import { useTheme } from '@/Contexts/ThemeContext';
import { useAdmin } from '@/Contexts/AdminContext';
import { useSuperAdmin } from '@/Contexts/SuperAdminContext';

function Navbar({ isAdmin = false, adminName = "" }) {
  const { toggleSignupVisibility, toggleSigninVisibility, loggedIn, toggleLoggedIn, name } = useAuth();
  const { dark, toggleDarkMode } = useTheme();
  const { setAdminName, setAdminAirline } = useAdmin();
  const { superAdminLoggedIn, setSuperAdminLoggedIn } = useSuperAdmin();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = () => {
    if (isAdmin) {
      setAdminName("");
      setAdminAirline("");
      router.push("/");
    } else if (superAdminLoggedIn) {
      setSuperAdminLoggedIn(false);
      router.push("/");
    } else {
      toggleLoggedIn();
    }
  };

  const displayName = isAdmin ? adminName : (superAdminLoggedIn ? "Super Admin" : name);

  return (
    <>
      <nav className={"relative border-[#605DEC] border-b-4 " + (dark ? "bg-gray-900" : "bg-gray-300") + " h-[4rem] flex items-center px-10"}>
        <div className="flex justify-between items-center w-full">
          <button onClick={handleLogoClick}>
            {/* Logo with 3 horizontal lines style */}
            <img src="/logo.png" alt="Logo" className="w-[7rem] h-auto" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn || isAdmin || superAdminLoggedIn ? (
              <>
                {/* Navigation buttons */}
                {isAdmin ? (
                  <button 
                    onClick={() => router.push("/OurFlights")}
                    className={(dark ? "text-gray-300" : "text-gray-700") + " hover:underline hover:transform hover:scale-110 transition"}
                  >
                    Our Flights
                  </button>
                ) : superAdminLoggedIn ? (
                  <button 
                    onClick={() => router.push("/Unused")}
                    className={(dark ? "text-gray-300" : "text-gray-700") + " hover:underline hover:transform hover:scale-110 transition"}
                  >
                    Unused
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push("/MyTrips")}
                    className={(dark ? "text-gray-300" : "text-gray-700") + " hover:underline hover:transform hover:scale-110 transition"}
                  >
                    My Trips
                  </button>
                )}
                {/* Sign out button */}
                <button
                  className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md hover:bg-[#4d4aa8] hover:transform hover:scale-110 transition"
                  onClick={handleSignOut}
                >
                  {superAdminLoggedIn ? "Home" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleSigninVisibility}
                  className={(dark ? "text-gray-300" : "text-gray-700") + " hover:underline hover:transform hover:scale-110 transition"}
                >
                  Sign in
                </button>
                <button
                  className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md hover:bg-[#4d4aa8] hover:transform hover:scale-110 transition"
                  onClick={toggleSignupVisibility}
                >
                  Sign up
                </button>
              </>
            )}
            {/* Dark toggle button */}
            <button
              onClick={toggleDarkMode}
              className={"p-2 rounded-full transition " + (dark ? "bg-gray-700" : "bg-gray-200")}
            >
              {dark ? (
                <MoonIcon className="h-6 w-6 text-gray-900" />
              ) : (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              )}
            </button>
          </div>

          {/* Mobile Menu (Hamburger + Theme Toggle) */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke={dark ? "white" : "black"} 
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Mobile dark toggle */}
            <button
              onClick={toggleDarkMode}
              className={"p-2 rounded-full transition " + (dark ? "bg-gray-700" : "bg-gray-200")}
            >
              {dark ? (
                <MoonIcon className="h-6 w-6 text-gray-900" />
              ) : (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              )}
            </button>
          </div>
        </div>

        {/* New centered welcome message for desktop */}
        {(loggedIn || isAdmin || superAdminLoggedIn) && (
          <h1 className={"hidden md:block absolute left-1/2 transform -translate-x-1/2 text-4xl font-newsreader font-bold " + (dark ? "text-gray-400" : "text-gray-700")}>
            Welcome {displayName}
          </h1>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={"absolute top-full left-0 right-0 z-50 bg-inherit px-10 py-2 flex flex-col space-y-2"}>
            {loggedIn || isAdmin || superAdminLoggedIn ? (
              <>
                {isAdmin ? (
                  <button 
                    onClick={() => { router.push("/Admin"); setMobileMenuOpen(false); }}
                    className={(dark ? "text-gray-300" : "text-gray-700") + " text-left hover:underline hover:transform hover:scale-110 transition"}
                  >
                    Our Flights
                  </button>
                ) : superAdminLoggedIn ? (
                  <button 
                    onClick={() => { router.push("/Unused"); setMobileMenuOpen(false); }}
                    className={(dark ? "text-gray-300" : "text-gray-700") + " text-left hover:underline hover:transform hover:scale-110 transition"}
                  >
                    Unused
                  </button>
                ) : (
                  <button 
                    onClick={() => { router.push("/MyTrips"); setMobileMenuOpen(false); }}
                    className={(dark ? "text-gray-300" : "text-gray-700") + " text-left hover:underline hover:transform hover:scale-110 transition"}
                  >
                    My Trips
                  </button>
                )}
                <button
                  className="w-full h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md hover:bg-[#4d4aa8] hover:transform hover:scale-110 transition"
                  onClick={handleSignOut}
                >
                  {superAdminLoggedIn ? "Home" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleSigninVisibility}
                  className={(dark ? "text-gray-300" : "text-gray-700") + " text-left hover:underline hover:transform hover:scale-110 transition"}
                >
                  Sign in
                </button>
                <button
                  className="w-full h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md hover:bg-[#4d4aa8] hover:transform hover:scale-110 transition"
                  onClick={toggleSignupVisibility}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Welcome Message */}
      {(loggedIn || isAdmin || superAdminLoggedIn) && (
        <div className={"mt-2 px-10 md:hidden text-center " + (dark ? "bg-gray-900" : "bg-gray-300")}>
          <h1 className={"text-4xl font-newsreader font-bold " + (dark ? "text-gray-400" : "text-gray-700")}>
            Welcome {displayName}
          </h1>
        </div>
      )}
    </>
  );
}

export default Navbar;

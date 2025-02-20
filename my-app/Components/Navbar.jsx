"use client";
import React from "react";
import { useAuth } from "@/app/AuthContext";
import { useTheme } from "@/app/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

function Navbar() {
  const { toggleSignupVisibility, toggleSigninVisibility, loggedIn, toggleLoggedIn, name } = useAuth();
  const { dark, toggleDarkMode } = useTheme();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  }

  return (
    <nav className={`border-[#605DEC] border-b-4 ${dark ? "bg-gray-900" : "bg-gray-300"} h-[4rem] flex justify-between items-center px-10`}>
      <button onClick={handleLogoClick}><img src="/logo.png" alt="Logo" className="w-[7rem] h-auto" /></button>

      {loggedIn ? (
        <>
          {/* Welcome Message */}
          <h1 className={`text-5xl font-italianno font-bold ${dark ? "text-gray-400" : "text-gray-700"}`}>Welcome {name}</h1>

          <div className="flex space-x-4 items-center">
            {/* My Trips */}
            <button className={`${dark ? "text-gray-300" : "text-gray-700"} hover:underline`}>My Trips</button>

            {/* Sign Out Button */}
            <button
              className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md"
              onClick={toggleLoggedIn}
            >
              Sign out
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition ${dark ? "bg-gray-700" : "bg-gray-200"}`}
            >
              {dark ? (
                <MoonIcon className="h-6 w-6 text-gray-900" />
              ) : (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="flex space-x-4 items-center">
          {/* Sign In Button */}
          <button onClick={toggleSigninVisibility} className={`${dark ? "text-gray-300" : "text-gray-700"} hover:underline`}>
            Sign in
          </button>

          {/* Sign Up Button */}
          <button
            className="w-20 h-10 bg-[#605DEC] text-white flex justify-center items-center rounded-md"
            onClick={toggleSignupVisibility}
          >
            Sign up
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition ${dark ? "bg-gray-700" : "bg-gray-200"}`}
          >
            {dark ? (
              <MoonIcon className="h-6 w-6 text-gray-900" />
            ) : (
              <SunIcon className="h-6 w-6 text-yellow-500" />
            )}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

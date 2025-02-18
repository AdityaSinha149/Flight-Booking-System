"use client";
import React, { useState } from "react";
import styles from "./Homepage.module.css";
import Navbar from "@/Components/Navbar";
import SearchBar from "@/Components/SearchBar";
import SignupCard from "@/Components/SignupCard";
import SigninCard from "@/Components/SigninCard"; // Import Sign-in Card

function Homepage() {
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [isSigninVisible, setSigninVisible] = useState(false);

  return (
    <div className="h-screen flex flex-col relative">
      <div className="bg-[#605DEC] h-12 text-white flex justify-center items-center">
        Join Tripma today and save up to 20% on your flight using code TRAVEL at checkout. Promotion valid for new users only.
      </div>
      <Navbar 
        onSignupClick={() => setSignupVisible(true)} 
        onSigninClick={() => setSigninVisible(true)} 
      />
      <div
        className="w-full bg-cover bg-center flex-1"
        style={{ backgroundImage: "url('/world.png')" }} 
      >
        <div className="flex flex-col items-center">
          <div className={`${styles.gradientText} pt-30 text-9xl font-bold`}>
            It's more than
          </div>
          <div className={`${styles.gradientText} pb-20 text-9xl font-bold`}>
            just a trip
          </div>
          <SearchBar />
        </div>
      </div>

      {/* Signup Modal */}
      {isSignupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <SignupCard onClose={() => setSignupVisible(false)} />
        </div>
      )}

      {/* Signin Modal */}
      {isSigninVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <SigninCard onClose={() => setSigninVisible(false)} />
        </div>
      )}
    </div>
  );
}

export default Homepage;

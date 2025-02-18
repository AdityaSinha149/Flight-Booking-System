"use client";
import React, { useState } from "react";
import styles from "./Homepage.module.css";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SignupCard from "../components/SignupCard";
import SigninCard from "../components/SigninCard";
import { useAuth } from "./AuthContext";


function Homepage() {
  const { isSignupVisible, isSigninVisible } = useAuth();

  return (
    <div className="h-screen flex flex-col relative">
      <div className="bg-[#605DEC] h-12 text-white flex justify-center items-center">
        Join Tripma today and save up to 20% on your flight using code TRAVEL at checkout. Promotion valid for new users only.
      </div>
      <Navbar 
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

      {isSignupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <SignupCard />
        </div>
      )}

      {isSigninVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <SigninCard />
        </div>
      )}
    </div>
  );
}

export default Homepage;

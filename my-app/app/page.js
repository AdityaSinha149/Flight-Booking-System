"use client";
import React from "react";
import styles from "./Homepage.module.css";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import SignupCard from "../components/SignupCard";
import SigninCard from "../components/SigninCard";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

function Homepage() {
  const { dark } = useTheme();
  const { isSignupVisible, isSigninVisible, loggedIn } = useAuth();

  return (
    <div className="h-screen flex flex-col relative">
      {!loggedIn &&
        <div className="bg-[#605DEC] h-12 text-white flex justify-center items-center">
          Join Tripma today and save up to 20% on your flight using code TRAVEL at checkout. Promotion valid for new users only.
        </div>
      }

      <Navbar />

      <div
        className={`w-full bg-cover bg-center flex-1 ${dark ? "bg-black opacity-95" : ""}`}
        style={{ backgroundImage: "url('/world.png')" }}
      >
        <div className="flex flex-col items-center">
          <div className={`${dark ? styles.gradientText : styles.gradientTextLight} pt-30 text-9xl font-niconne italic font-bold`}>
            It's more than
          </div>
          <div className={`${dark ? styles.gradientText : styles.gradientTextLight} px-4 pb-20 text-9xl font-niconne italic font-bold`}>
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

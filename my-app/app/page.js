"use client";
import styles from "./Homepage.module.css";

import Navbar from "@/Components/Navbar";
import SearchBar from "@/Components/SearchBar";
import SignupCard from "@/Components/SignupCard";
import SigninCard from "@/Components/SigninCard";

import { useAuth } from "@/Contexts/AuthContext";
import { useTheme } from "@/Contexts/ThemeContext";


function Homepage() {
  const { dark } = useTheme();
  const { isSignupVisible, isSigninVisible, loggedIn } = useAuth();

  return (
    <div className="h-screen flex flex-col relative">
      {!loggedIn && (
        <div className="bg-[#605DEC] h-12 text-white flex justify-center items-center">
          Join Tripma today and save up to 20% on your flight using code TRAVEL at checkout. Promotion valid for new users only.
        </div>
      )}

      <Navbar />

      <div
        className={`w-full bg-cover bg-center flex-1 ${dark ? "bg-black opacity-90" : ""}`}
        style={{ backgroundImage: "url('/world.png')" }}
      >
      <div className={`h-[38px] bg-transparent`}>
      </div>
        <div className="flex flex-col items-center">
          <div className={`${dark ? styles.gradientText : styles.gradientTextLight} pt-30  text-6xl sm:text-8xl md:text-9xl font-merriweather font-extrabold px-4`}>
            It's more than
          </div>
          <div className={`${dark ? styles.gradientText : styles.gradientTextLight} px-20 pb-20  text-6xl sm:text-8xl md:text-9xl font-merriweather font-extrabold`}>
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

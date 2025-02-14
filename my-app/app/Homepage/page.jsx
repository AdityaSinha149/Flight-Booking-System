import React from "react";
import styles from "./Homepage.module.css"; // Use CSS Modules
import Navbar from "@/components/Navbar"; // Ensure lowercase folder name
import SearchBar from "@/components/SearchBar";

function Homepage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-[#605DEC] h-12 text-white flex justify-center items-center">
        Join Tripma today and save up to 20% on your flight using code TRAVEL at checkout. Promotion valid for new users only.
      </div>
      <Navbar />
      <div
        className="w-full  bg-cover bg-center flex-1"
        style={{ backgroundImage: "url('/world.png')" }} // Use public folder for images
      >
        <div>
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
      </div>
    </div>
  );
}

export default Homepage;

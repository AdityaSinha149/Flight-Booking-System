"use client";
import { useState } from "react";

function SignupCard({ onClose }) {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !phoneNo || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone_no: phoneNo, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        onClose();
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[400px] relative text-black dark:text-white">
      <button 
        className="absolute top-2 right-2 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300" 
        onClick={onClose}
      >
        ✖
      </button>
      <h2 className="text-xl font-bold mb-4">Sign up</h2>
      <input 
        type="text" 
        placeholder="Email" 
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Phone Number" 
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password" 
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button 
        className="w-full bg-[#605DEC] text-white py-2 rounded mb-3"
        onClick={handleSignup}
      >
        Create Account
      </button>
    </div>
  );
}

export default SignupCard;

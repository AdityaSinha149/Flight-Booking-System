"use client";
import { useState } from "react";

function SigninCard({ onClose }) {
  const [username, setUsername] = useState(""); // Can be email or phone number
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    if (!username || !password) {
      alert("Please enter your email/phone and password.");
      return;
    }

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signin successful!");
        onClose();
      } else {
        alert(data.error || "Signin failed.");
      }
    } catch (error) {
      console.error("Signin error:", error);
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
      <h2 className="text-xl font-bold mb-4">Sign In</h2>

      <input 
        type="text" 
        placeholder="Email or Phone Number" 
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        onClick={handleSignin}
      >
        Sign In
      </button>
    </div>
  );
}

export default SigninCard;

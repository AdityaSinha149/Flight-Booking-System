"use client";
import { useState } from "react";
import { useAuth } from "@/app/AuthContext";

function SignupCard() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toggleSignupVisibility, setName, toggleLoggedIn } = useAuth();

  const handleSignup = async () => {
    if (!userName || !email || !phoneNo || !password) {
      setError("Please fill in all fields.");
      return;
    }

    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name:userName, email, phone_no: phoneNo, password }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setName(userName);
        toggleLoggedIn();
        toggleSignupVisibility();
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[400px] relative text-black dark:text-white">
      <button
        className="absolute top-2 right-2 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
        onClick={toggleSignupVisibility}
        disabled={loading}
      >
        ✖
      </button>
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Email"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Phone Number"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-3 bg-white dark:bg-gray-800 text-black dark:text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <button
        className="w-full bg-[#605DEC] text-white py-2 rounded mb-3 flex justify-center items-center"
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        ) : (
          "Create Account"
        )}
      </button>
    </div>
  );
}

export default SignupCard;

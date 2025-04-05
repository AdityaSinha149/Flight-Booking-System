"use client";
import { useState, useEffect } from "react";

import { useAuth } from "@/Contexts/AuthContext";
import { useTheme } from "@/Contexts/ThemeContext";

function SignupCard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toggleSignupVisibility, setName, toggleLoggedIn, setId, authError, setError, clearError } = useAuth();
  const { dark } = useTheme();

  useEffect(() => {
    setUserName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !phoneNo || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    clearError();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone_no: phoneNo, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setId(data.userId);
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
    <div className={`p-6 rounded-lg shadow-lg w-[400px] relative ${dark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <button
        className={`absolute top-2 right-2 hover:${dark ? "text-gray-300" : "text-gray-700"}`}
        onClick={() => toggleSignupVisibility()}
        disabled={loading}
      >
        ✖
      </button>
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      {authError && <div className="text-red-500 mb-3">{authError}</div>}

      <input
        type="text"
        placeholder="First Name"
        className={`w-full p-2 border rounded mb-3 ${dark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Last Name"
        className={`w-full p-2 border rounded mb-3 ${dark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Email"
        className={`w-full p-2 border rounded mb-3 ${dark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="text"
        placeholder="Phone Number"
        className={`w-full p-2 border rounded mb-3 ${dark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
        value={phoneNo}
        onChange={(e) => setPhoneNo(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        className={`w-full p-2 border rounded mb-3 ${dark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <button
        className="w-full bg-[#605DEC] text-white py-2 rounded mb-3 flex justify-center items-center"
        onClick={handleSignup}
        disabled={loading}
      ></button>
      <button>
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

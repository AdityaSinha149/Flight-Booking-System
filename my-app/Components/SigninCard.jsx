"use client";
import { useState } from "react";

import { useAuth } from "@/Contexts/AuthContext";
import { useTheme } from "@/Contexts/ThemeContext";

function SigninCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toggleSigninVisibility, setName, toggleLoggedIn, setId } = useAuth();
  const { dark } = useTheme();

  const handleSignin = async () => {
    if (!username || !password) {
      setError("Please enter your email/phone and password.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error state before starting the request
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setId(data.userId);
        setName(data.name);
        toggleLoggedIn();
        toggleSigninVisibility();
      } else {
        setError(data.error || "Signin failed.");
      }
    } catch (error) {
      console.error("Signin error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg w-[400px] relative ${dark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <button
        className={`absolute top-2 right-2 hover:${dark ? "text-gray-300" : "text-gray-700"}`}
        onClick={toggleSigninVisibility}
        disabled={loading}
      >
        ✖
      </button>
      <h2 className="text-xl font-bold mb-4">Sign In</h2>

      {error && <div className="text-red-500 mb-3">{error}</div>}

      <input
        type="text"
        placeholder="Email or Phone Number"
        className={`w-full p-2 border rounded mb-3 ${dark ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white text-black"}`}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        className="w-full bg-[#605DEC] text-white py-2 rounded mb-3 flex items-center justify-center"
        onClick={handleSignin}
        disabled={loading}
      >
        {loading ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        ) : (
          "Sign In"
        )}
      </button>
    </div>
  );
}

export default SigninCard;

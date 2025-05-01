"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import TickAnimation from "@/components/TickAnimation";

export default function ThankyouPage() {
    const router = useRouter();
    const [secondsRemaining, setSecondsRemaining] = useState(10);
    const secondsRef = useRef(10);
    const { dark } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Wait for component to mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSecondsRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                secondsRef.current = prev - 1;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (secondsRemaining === 0) {
            router.push("/");
        }
    }, [secondsRemaining, router]); // Redirect when `secondsRemaining` reaches 0

    // Apply theme-specific classes
    const containerClass = `flex flex-col items-center justify-center h-screen p-6 ${dark ? "bg-gray-900 text-white" : "bg-white text-black"
        }`;

    if (!mounted) return null;

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center justify-center scale-150">
                <h1 className="text-4xl font-bold py-20 -translate-y-7">Payment Successful</h1>
                <TickAnimation />
                <div className=" scale-75 flex flex-col items-center justify-center">
                    <p className="text-xl translate-y-1">Your flight is booked. Redirecting in <span className="text-[#605DEC] font-bold text-4xl">{secondsRemaining}</span> seconds...</p>
                    <button
                        className="px-6 py-3 bg-[#605DEC] text-white rounded-lg hover:bg-[#4b48c7] transition-colors text-xl translate-y-1"
                        onClick={() => router.push("/")}
                    >
                        Go Home Now
                    </button>
                </div>
            </div>
        </div>
    );
}

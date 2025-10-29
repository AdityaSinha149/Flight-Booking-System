"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/Contexts/ThemeContext";

export default function PaymentFailedPage() {
    const router = useRouter();
    const { dark } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Clear any pending booking data
        sessionStorage.removeItem('pendingBooking');
    }, []);

    const containerClass = `flex flex-col items-center justify-center h-screen p-6 ${
        dark ? "bg-gray-900 text-white" : "bg-white text-black"
    }`;

    if (!mounted) return null;

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center justify-center max-w-md text-center">
                <div className="text-6xl mb-6">❌</div>
                <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
                <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
                    Your payment could not be processed. No charges have been made to your account.
                </p>
                <div className="flex gap-4">
                    <button
                        className="px-6 py-3 bg-[#605DEC] text-white rounded-lg hover:bg-[#4b48c7] transition-colors text-lg"
                        onClick={() => router.back()}
                    >
                        Try Again
                    </button>
                    <button
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg"
                        onClick={() => router.push("/")}
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}

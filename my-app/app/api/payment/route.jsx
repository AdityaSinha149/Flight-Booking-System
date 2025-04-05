import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
    const { amount :am} = await req.json();
    try {
        // Log keys to debug (remove in production)
        console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
        console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
        
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET, // Changed from RAZORPAY_SECRET
        });
        
        const order = await razorpay.orders.create({
            amount: am, // Amount in paise (50000 paise = 500 INR)
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });
        
        return NextResponse.json(order, { status: 200 });
    }
    catch (error) { 
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json({ error: "Failed to create order", details: error }, { status: 500 });
    }
}
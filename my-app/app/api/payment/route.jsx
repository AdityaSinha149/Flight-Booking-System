import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
    try {
        // Fully parse and log the incoming request
        const body = await req.json();
        console.log("Payment API: Request body received:", body);

        // Extract amount with explicit validation
        const { amount } = body;
        
        // Validate amount with detailed logging
        if (amount === undefined || amount === null) {
            console.error("Payment API: Amount is undefined or null");
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }

        // Convert to number if it's a string
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        
        if (isNaN(numericAmount) || numericAmount <= 0) {
            console.error(`Payment API: Invalid amount value: ${amount}, parsed as ${numericAmount}`);
            return NextResponse.json(
                { error: `Amount must be a positive number (received: ${amount}, type: ${typeof amount})` },
                { status: 400 }
            );
        }

        // Check Razorpay credentials
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Payment API: Missing Razorpay credentials");
            return NextResponse.json(
                { error: "Payment gateway configuration error" },
                { status: 500 }
            );
        }

        // Proceed with Razorpay integration
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        
        // Create order with proper error handling
        try {
            // Make sure we have an integer amount (Razorpay requirement)
            const finalAmount = Math.round(numericAmount);
            console.log(`Payment API: Creating order with amount: ${finalAmount}`);
            
            const order = await razorpay.orders.create({
                amount: finalAmount,
                currency: "INR",
                receipt: "receipt_" + Date.now(),
            });
            
            console.log("Payment API: Order created successfully", { orderId: order.id });
            return NextResponse.json(order);
            
        } catch (razorpayError) {
            console.error("Payment API: Razorpay order creation failed", razorpayError);
            return NextResponse.json(
                { error: "Failed to create payment order: " + razorpayError.message },
                { status: 500 }
            );
        }
    }
    catch (error) { 
        console.error("Payment API: Request parsing error", error);
        return NextResponse.json(
            { error: "Failed to parse request: " + error.message },
            { status: 400 }
        );
    }
}
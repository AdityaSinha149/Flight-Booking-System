import { NextResponse } from "next/server";
import crypto from "crypto";
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from "pg-sdk-node";

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
        // Check PhonePe credentials
        if (!process.env.PHONEPE_CLIENT_ID || !process.env.PHONEPE_CLIENT_SECRET || !process.env.PHONEPE_CLIENT_VERSION) {
            console.error("Payment API: Missing PhonePe credentials");
            return NextResponse.json(
                { error: "Payment gateway configuration error. Set PHONEPE_MOCK_MODE=true for local testing." },
                { status: 500 }
            );
        }

        // Initialize PhonePe StandardCheckoutClient
        const env = process.env.PHONEPE_ENV === "PRODUCTION" ? Env.PRODUCTION : Env.SANDBOX;
        
        try {
            const client = StandardCheckoutClient.getInstance(
                process.env.PHONEPE_CLIENT_ID,
                process.env.PHONEPE_CLIENT_SECRET,
                parseInt(process.env.PHONEPE_CLIENT_VERSION),
                env
            );
            
            // Create payment order with proper error handling
            // Make sure we have an integer amount (PhonePe requirement - amount in paise)
            const finalAmount = Math.round(numericAmount);
            const merchantOrderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            
            console.log(`Payment API: Creating PhonePe payment with amount: ${finalAmount}`);
            
            // Build payment request using PhonePe SDK
            const payRequest = StandardCheckoutPayRequest.builder()
                .merchantOrderId(merchantOrderId)
                .amount(finalAmount)
                .redirectUrl(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/thankyou`)
                .build();

            // Initiate payment using PhonePe SDK
            const response = await client.pay(payRequest);
            
            console.log("Payment API: PhonePe payment initiated successfully", { 
                merchantOrderId,
                redirectUrl: response.redirectUrl
            });
            
            // Return payment details to client
            return NextResponse.json({
                success: true,
                merchantOrderId: merchantOrderId,
                redirectUrl: response.redirectUrl,
                amount: finalAmount,
                currency: "INR"
            });
            
        } catch (phonePeError) {
            console.error("Payment API: PhonePe payment creation failed", phonePeError);
            return NextResponse.json(
                { error: "Failed to create payment order: " + (phonePeError.message || "Unknown error") },
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
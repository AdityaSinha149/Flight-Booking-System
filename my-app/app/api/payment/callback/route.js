import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("PhonePe Callback: Received payment status", body);

        // Extract transaction details from callback
        const { response } = body;
        
        if (!response) {
            console.error("PhonePe Callback: Missing response in callback");
            return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
        }

        // Decode base64 response
        const decodedResponse = Buffer.from(response, 'base64').toString('utf-8');
        const paymentData = JSON.parse(decodedResponse);
        
        console.log("PhonePe Callback: Decoded payment data", paymentData);

        // Verify checksum if saltKey is available
        if (process.env.PHONEPE_SALT_KEY && body['x-verify']) {
            const calculatedChecksum = crypto
                .createHash('sha256')
                .update(response + '/pg/v1/status' + process.env.PHONEPE_SALT_KEY)
                .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;
            
            if (calculatedChecksum !== body['x-verify']) {
                console.error("PhonePe Callback: Checksum verification failed");
                return NextResponse.json({ error: "Invalid checksum" }, { status: 400 });
            }
        }

        // Check payment status
        const paymentSuccess = paymentData.code === 'PAYMENT_SUCCESS';
        
        if (paymentSuccess) {
            console.log("PhonePe Callback: Payment successful", {
                transactionId: paymentData.data?.merchantTransactionId,
                amount: paymentData.data?.amount
            });
            
            // Get booking details from sessionStorage on client side
            // The actual booking will be done on the thankyou page or through a separate API call
            return NextResponse.redirect(new URL('/thankyou', req.url));
        } else {
            console.log("PhonePe Callback: Payment failed or pending", paymentData);
            return NextResponse.redirect(new URL('/payment-failed', req.url));
        }
        
    } catch (error) {
        console.error("PhonePe Callback: Error processing callback", error);
        return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
    }
}

export async function GET(req) {
    // Handle redirect-based callbacks
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    console.log("PhonePe Callback (GET): Payment status", status);
    
    if (status === 'success') {
        return NextResponse.redirect(new URL('/thankyou', req.url));
    } else {
        return NextResponse.redirect(new URL('/payment-failed', req.url));
    }
}

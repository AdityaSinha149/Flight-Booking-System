import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    
    // Create a mock checkout page HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock PhonePe Checkout</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .checkout-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 90%;
        }
        h1 {
            color: #5f259f;
            text-align: center;
            margin-bottom: 10px;
        }
        .mock-badge {
            background: #ff9800;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            text-align: center;
            font-size: 12px;
            margin-bottom: 20px;
        }
        .order-info {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .order-info p {
            margin: 10px 0;
            color: #333;
        }
        .order-info strong {
            color: #5f259f;
        }
        .amount {
            font-size: 32px;
            color: #5f259f;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .buttons {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }
        button {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .success-btn {
            background: #4caf50;
            color: white;
        }
        .fail-btn {
            background: #f44336;
            color: white;
        }
        .note {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="checkout-container">
        <h1>🅿️ PhonePe</h1>
        <div class="mock-badge">MOCK CHECKOUT - TESTING ONLY</div>
        
        <div class="order-info">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Amount:</strong></p>
            <div class="amount">₹${(parseInt(amount) / 100).toFixed(2)}</div>
        </div>
        
        <p style="text-align: center; color: #666;">
            This is a mock payment page for testing.<br>
            Choose an option to simulate the payment result:
        </p>
        
        <div class="buttons">
            <button class="success-btn" onclick="handlePayment('success')">
                ✓ Pay Now
            </button>
            <button class="fail-btn" onclick="handlePayment('failed')">
                ✗ Cancel
            </button>
        </div>
        
        <p class="note">
            To use real PhonePe, add valid credentials and set PHONEPE_MOCK_MODE=false
        </p>
    </div>
    
    <script>
        function handlePayment(status) {
            const baseUrl = window.location.origin;
            if (status === 'success') {
                // Store order info for booking completion
                sessionStorage.setItem('mockPaymentSuccess', 'true');
                window.location.href = baseUrl + '/thankyou';
            } else {
                window.location.href = baseUrl + '/payment-failed';
            }
        }
    </script>
</body>
</html>
    `;
    
    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}

# PhonePe Integration - Setup Guide

## ✅ Migration Complete

Your application has been successfully migrated from **Razorpay** to **PhonePe** payment gateway.

## 📋 What Was Changed

### 1. Server-Side (`/app/api/payment/route.jsx`)
- ✅ Replaced Razorpay SDK with PhonePe SDK (`pg-sdk-node`)
- ✅ Updated to use PhonePe credentials (Merchant ID, Salt Key, Salt Index)
- ✅ Returns redirect URL for PhonePe checkout page

### 2. Client-Side (`/app/SeatSelection/page.jsx`)
- ✅ Removed Razorpay modal/popup integration
- ✅ Removed Razorpay checkout script
- ✅ Added redirect flow to PhonePe checkout
- ✅ Stores booking data in sessionStorage

### 3. Callback Handler (`/app/api/payment/callback/route.js`)
- ✅ NEW: Handles PhonePe payment callback
- ✅ Verifies payment checksum for security
- ✅ Redirects to success or failure page

### 4. Thank You Page (`/app/thankyou/page.jsx`)
- ✅ Processes booking after successful payment
- ✅ Retrieves booking data from sessionStorage
- ✅ Calls `/api/book` to complete the booking

### 5. Payment Failed Page (`/app/payment-failed/page.jsx`)
- ✅ NEW: Shows payment failure message
- ✅ Allows user to retry or go home

## 🔧 Setup Instructions

### Step 1: Get PhonePe Credentials

1. Sign up at [PhonePe Business](https://business.phonepe.com/)
2. Complete KYC verification
3. Go to Developer Settings in merchant dashboard
4. Get your credentials:
   - Merchant ID
   - Salt Key
   - Salt Index

### Step 2: Update Environment Variables

Edit your `.env` file and add:

```env
PHONEPE_MERCHANT_ID=your_actual_merchant_id
PHONEPE_SALT_KEY=your_actual_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=UAT
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For Production:**
- Change `PHONEPE_ENV=PROD`
- Update `NEXT_PUBLIC_BASE_URL` to your production domain

### Step 3: Restart Your Development Server

```bash
npm run dev
```

## 🔄 Payment Flow

1. **User selects seats** → Clicks "Book Flight"
2. **Frontend validates** → Calculates total amount
3. **Calls `/api/payment`** → Server creates PhonePe order
4. **Gets redirect URL** → Stores booking data in sessionStorage
5. **Redirects to PhonePe** → User completes payment on PhonePe site
6. **PhonePe callback** → Redirects back to `/thankyou` or `/payment-failed`
7. **Thank you page** → Retrieves booking data and calls `/api/book`
8. **Booking complete** → User sees success message

## 🧪 Testing

### UAT Environment (Recommended for Testing)
1. Use `PHONEPE_ENV=UAT` in `.env`
2. Use UAT credentials from PhonePe dashboard
3. Test with PhonePe test cards/wallets

### Production
1. Use `PHONEPE_ENV=PROD` in `.env`
2. Use production credentials
3. Update `NEXT_PUBLIC_BASE_URL` to your live domain
4. Ensure callback URL is whitelisted in PhonePe dashboard

## 🚨 Important Notes

- **Razorpay credentials** are now commented out in `.env` (not used)
- **Razorpay package** can be removed from `package.json` if needed:
  ```bash
  npm uninstall razorpay
  ```
- **Amount format**: Both PhonePe and Razorpay use paise (1 rupee = 100 paise)
- **Callback URL**: Must be accessible from PhonePe servers (use ngrok for local testing)

## 🐛 Troubleshooting

### "Missing PhonePe credentials" error
- Check all three credentials are in `.env`: `PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY`, `PHONEPE_SALT_INDEX`
- Restart dev server after updating `.env`

### Payment redirect not working
- Verify `NEXT_PUBLIC_BASE_URL` matches your current domain
- Check callback URL is whitelisted in PhonePe merchant dashboard

### Booking not completing after payment
- Check browser console for errors
- Verify sessionStorage has `pendingBooking` data
- Check `/api/book` endpoint is working

### Checksum verification failed
- Ensure `PHONEPE_SALT_KEY` and `PHONEPE_SALT_INDEX` match PhonePe dashboard
- Verify the callback is actually from PhonePe

## 📱 For Local Testing with PhonePe

Since PhonePe needs to send callbacks to your server, use **ngrok** for local testing:

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Copy the https URL and update .env:
NEXT_PUBLIC_BASE_URL=https://your-ngrok-url.ngrok.io
```

Then restart your dev server.

## ✨ All Set!

Your PhonePe integration is complete. Update your credentials and start testing! 🎉

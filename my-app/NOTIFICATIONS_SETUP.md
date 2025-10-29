# Notification System Setup Guide

This guide will help you set up Email, SMS, and WhatsApp notifications for booking confirmations and cancellations.

## 📧 Email Setup (Using Gmail)

### 1. Enable 2-Step Verification
1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable it if not already enabled

### 2. Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Name it "Flight Booking System"
4. Copy the generated 16-character password

### 3. Add to .env.local
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # The 16-character app password (without spaces)
AIRLINE_NAME=Your Airline Name
```

### Alternative Email Providers

**Outlook/Hotmail:**
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

**Yahoo:**
```bash
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

**Custom SMTP:**
```bash
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587  # or 465 for SSL
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
```

## 📱 SMS Setup (Using Twilio - Optional)

### 1. Create Twilio Account
1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Verify your phone number
3. Get $15 free credit for testing

### 2. Get Credentials
1. Go to [Twilio Console](https://www.twilio.com/console)
2. Copy **Account SID** and **Auth Token**
3. Get a phone number from **Phone Numbers** → **Manage** → **Buy a number**

### 3. Integrate in Code
Uncomment the Twilio code in `/lib/notifications.js`:

```javascript
// Install Twilio
npm install twilio --legacy-peer-deps

// In notifications.js, uncomment:
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

await client.messages.create({
  body: message,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phoneNumber
});
```

### 4. Add to .env.local
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 💬 WhatsApp Setup (Using Twilio - Optional)

### 1. Enable WhatsApp Sandbox
1. Go to [Twilio Console](https://www.twilio.com/console/sms/whatsapp/sandbox)
2. Send the code shown to the WhatsApp number provided
3. Your WhatsApp is now connected to the sandbox

### 2. For Production (WhatsApp Business API)
1. Request WhatsApp Business API access from Twilio
2. Complete Meta Business verification
3. Get approved WhatsApp Business number

### 3. Integrate in Code
Uncomment the WhatsApp code in `/lib/notifications.js`:

```javascript
// Use the same Twilio client
await client.messages.create({
  body: message,
  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
  to: `whatsapp:${phoneNumber}`
});
```

### 4. Add to .env.local
```bash
TWILIO_WHATSAPP_NUMBER=+14155238886  # Sandbox number
# For production, use your approved WhatsApp Business number
```

## 🧪 Testing

### Test Email Notifications
1. Make sure EMAIL_* variables are set in `.env.local`
2. Book a flight
3. Check your email inbox (and spam folder)

### Test SMS/WhatsApp
1. Currently in **simulation mode** (logs to console)
2. Install and configure Twilio as above
3. Uncomment the API integration code
4. Book a flight or cancel an instance

### Check Console Logs
All notification attempts are logged:
```
✅ Booking confirmation email sent to passenger@email.com
📱 SMS would be sent to +91xxxxxxxxxx: [message]
📱 WhatsApp would be sent to +91xxxxxxxxxx: [message]
```

## 🎯 What Gets Sent

### Booking Confirmation
- **Email**: HTML email with flight details, booking ID, and e-ticket
- **SMS**: Short text with booking ID, flight number, and time
- **WhatsApp**: Formatted message with complete booking details

### Cancellation Notice
- **Email**: HTML email with cancellation reason and refund details
- **SMS**: Short text about cancellation and refund
- **WhatsApp**: Formatted message with cancellation details

## 🔐 Security Best Practices

1. **Never commit** `.env.local` to git
2. Use **App Passwords** for Gmail (not your main password)
3. Store credentials in **environment variables** only
4. For production, use **secrets management** (AWS Secrets Manager, etc.)
5. Enable **rate limiting** on your APIs to prevent abuse

## 💰 Costs

### Email (Gmail)
- **Free** up to 500 emails per day

### Twilio SMS
- ~$0.0075 per SMS in India
- ~$0.01 per SMS in US
- $15 free trial credit

### Twilio WhatsApp
- ~$0.005 per message
- First 1,000 messages free per month

## 🚀 Production Deployment

For production, consider:

1. **Email**: Use a dedicated email service (SendGrid, Amazon SES, Mailgun)
2. **SMS**: Bulk SMS providers for your country
3. **WhatsApp**: Official WhatsApp Business API
4. **Queue System**: Use Redis/RabbitMQ for async notification processing
5. **Monitoring**: Track delivery rates and failures

## 📝 Notes

- Notifications are sent **asynchronously** and won't block the booking process
- If a notification fails, the booking still succeeds
- All notification attempts are logged for debugging
- You can enable/disable each channel independently

## 🆘 Troubleshooting

**Email not sending?**
- Check if EMAIL_USER and EMAIL_PASSWORD are correct
- Make sure 2-Step Verification and App Password are set up
- Check spam folder
- Check console logs for error messages

**SMS/WhatsApp not working?**
- Make sure you've uncommented the integration code
- Verify Twilio credentials are correct
- Check phone number format (+countrycode + number)
- Ensure you have Twilio credits

**Still having issues?**
- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Test email settings using a simple test script

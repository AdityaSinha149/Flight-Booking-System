// Notification service for sending booking confirmations and cancellation notices
// Supports Email, SMS, and WhatsApp

import nodemailer from 'nodemailer';

// Email configuration using environment variables
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send booking confirmation email
export async function sendBookingEmail(bookingDetails) {
  const {
    passengerEmail,
    passengerName,
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    seatNumber,
    bookingId,
    amount,
  } = bookingDetails;

  const mailOptions = {
    from: `"${process.env.AIRLINE_NAME || 'Flight Booking System'}" <${process.env.EMAIL_USER}>`,
    to: passengerEmail,
    subject: `Booking Confirmed - ${flightNumber} | ${departureAirport} → ${arrivalAirport}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #605DEC; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .booking-info { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #605DEC; }
          .flight-details { display: flex; justify-content: space-between; margin: 20px 0; }
          .location { text-align: center; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .btn { background: #605DEC; color: white; padding: 12px 30px; text-decoration: none; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✈️ Booking Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${passengerName},</h2>
            <p>Your flight booking has been confirmed. Here are your booking details:</p>
            
            <div class="booking-info">
              <strong>Booking ID:</strong> ${bookingId}<br>
              <strong>Flight:</strong> ${airline} ${flightNumber}<br>
              <strong>Seat:</strong> ${seatNumber}<br>
              <strong>Amount Paid:</strong> ₹${amount.toLocaleString()}
            </div>

            <h3>Flight Details</h3>
            <div class="flight-details">
              <div class="location">
                <h4>${departureAirport}</h4>
                <p>${new Date(departureTime).toLocaleString('en-IN', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}</p>
              </div>
              <div style="text-align: center; padding: 20px;">
                ✈️<br>
                <small>Direct Flight</small>
              </div>
              <div class="location">
                <h4>${arrivalAirport}</h4>
                <p>${new Date(arrivalTime).toLocaleString('en-IN', { 
                  dateStyle: 'medium', 
                  timeStyle: 'short' 
                })}</p>
              </div>
            </div>

            <p><strong>Important:</strong> Please arrive at the airport at least 2 hours before departure.</p>
            <p>Your e-ticket has been attached to this email.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing ${process.env.AIRLINE_NAME || 'our service'}!</p>
            <p><small>This is an automated message. Please do not reply.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${passengerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending booking email:', error);
    return { success: false, error: error.message };
  }
}

// Send cancellation/refund email
export async function sendCancellationEmail(cancellationDetails) {
  const {
    passengerEmail,
    passengerName,
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    bookingId,
    refundAmount,
    reason = 'Flight canceled by airline',
  } = cancellationDetails;

  const mailOptions = {
    from: `"${process.env.AIRLINE_NAME || 'Flight Booking System'}" <${process.env.EMAIL_USER}>`,
    to: passengerEmail,
    subject: `Flight Canceled - Refund Issued | ${flightNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B6B; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .refund-info { background: #D4EDDA; padding: 15px; margin: 10px 0; border-left: 4px solid #28A745; }
          .booking-info { background: white; padding: 15px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Flight Canceled</h1>
          </div>
          <div class="content">
            <h2>Hello ${passengerName},</h2>
            <p>We regret to inform you that your flight has been canceled.</p>
            
            <div class="booking-info">
              <strong>Booking ID:</strong> ${bookingId}<br>
              <strong>Flight:</strong> ${airline} ${flightNumber}<br>
              <strong>Route:</strong> ${departureAirport} → ${arrivalAirport}<br>
              <strong>Reason:</strong> ${reason}
            </div>

            <div class="refund-info">
              <h3>💰 Refund Processed</h3>
              <p>A full refund of <strong>₹${refundAmount.toLocaleString()}</strong> has been initiated to your original payment method.</p>
              <p><small>The refund will be credited within 5-7 business days.</small></p>
            </div>

            <p>We sincerely apologize for any inconvenience caused. If you need to book an alternative flight, please visit our website.</p>
          </div>
          <div class="footer">
            <p>For any queries, please contact our customer support.</p>
            <p><small>This is an automated message. Please do not reply.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${passengerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
    return { success: false, error: error.message };
  }
}

// Send SMS using Twilio or any SMS provider
export async function sendBookingSMS(phoneNumber, bookingDetails) {
  const { flightNumber, departureAirport, arrivalAirport, departureTime, seatNumber, bookingId } = bookingDetails;
  
  const message = `✈️ Booking Confirmed!
Booking ID: ${bookingId}
Flight: ${flightNumber}
${departureAirport} → ${arrivalAirport}
Date: ${new Date(departureTime).toLocaleDateString('en-IN')}
Seat: ${seatNumber}
Check your email for details.`;

  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`📱 SMS would be sent to ${phoneNumber}:`, message);
    return { success: true, message: 'SMS sending not configured (simulation mode)' };
  }

  // Integrate with Twilio
  try {
    const twilio = (await import('twilio')).default;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Format phone number (ensure it has country code)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ SMS sent successfully to ${phoneNumber}. SID: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${phoneNumber}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function sendCancellationSMS(phoneNumber, cancellationDetails) {
  const { flightNumber, bookingId, refundAmount } = cancellationDetails;
  
  const message = `Flight Canceled
Booking ID: ${bookingId}
Flight: ${flightNumber}
Refund: ₹${refundAmount.toLocaleString()}
Amount will be credited in 5-7 days.`;

  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`📱 SMS would be sent to ${phoneNumber}:`, message);
    return { success: true, message: 'SMS sending not configured (simulation mode)' };
  }

  // Integrate with Twilio
  try {
    const twilio = (await import('twilio')).default;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ Cancellation SMS sent to ${phoneNumber}. SID: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error(`❌ Error sending cancellation SMS:`, error.message);
    return { success: false, error: error.message };
  }
}

// Send WhatsApp message using WhatsApp Business API
export async function sendBookingWhatsApp(phoneNumber, bookingDetails) {
  const { 
    passengerName,
    flightNumber, 
    airline,
    departureAirport, 
    arrivalAirport, 
    departureTime,
    arrivalTime, 
    seatNumber, 
    bookingId,
    amount 
  } = bookingDetails;
  
  const message = `✈️ *Booking Confirmed!*

Hello ${passengerName},

Your flight booking has been confirmed.

*Booking Details:*
Booking ID: ${bookingId}
Flight: ${airline} ${flightNumber}
Seat: ${seatNumber}
Amount: ₹${amount.toLocaleString()}

*Flight Schedule:*
🛫 Departure: ${departureAirport}
   ${new Date(departureTime).toLocaleString('en-IN')}

🛬 Arrival: ${arrivalAirport}
   ${new Date(arrivalTime).toLocaleString('en-IN')}

Please arrive at the airport 2 hours before departure.

Check your email for the e-ticket.

Thank you for choosing ${process.env.AIRLINE_NAME || 'our service'}!`;

  // TODO: Integrate with WhatsApp Business API (Twilio, Meta, etc.)
  // Example with Twilio WhatsApp:
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body: message,
  //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
  //   to: `whatsapp:${phoneNumber}`
  // });

  console.log(`📱 WhatsApp would be sent to ${phoneNumber}:`, message);
  return { success: true, message: 'WhatsApp sending not yet configured' };
}

export async function sendCancellationWhatsApp(phoneNumber, cancellationDetails) {
  const { 
    passengerName,
    flightNumber, 
    airline,
    departureAirport,
    arrivalAirport,
    bookingId, 
    refundAmount,
    reason 
  } = cancellationDetails;
  
  const message = `❌ *Flight Canceled*

Hello ${passengerName},

We regret to inform you that your flight has been canceled.

*Booking Details:*
Booking ID: ${bookingId}
Flight: ${airline} ${flightNumber}
Route: ${departureAirport} → ${arrivalAirport}
Reason: ${reason}

💰 *Refund Processed*
Amount: ₹${refundAmount.toLocaleString()}
The refund will be credited within 5-7 business days.

We apologize for the inconvenience.`;

  // TODO: Integrate with WhatsApp Business API
  console.log(`📱 WhatsApp would be sent to ${phoneNumber}:`, message);
  return { success: true, message: 'WhatsApp sending not yet configured' };
}

// Send all notifications (Email + SMS + WhatsApp)
export async function sendAllBookingNotifications(bookingDetails) {
  const { passengerEmail, phoneNumber } = bookingDetails;
  
  const results = await Promise.allSettled([
    sendBookingEmail(bookingDetails),
    sendBookingSMS(phoneNumber, bookingDetails),
    sendBookingWhatsApp(phoneNumber, bookingDetails),
  ]);

  return {
    email: results[0],
    sms: results[1],
    whatsapp: results[2],
  };
}

export async function sendAllCancellationNotifications(cancellationDetails) {
  const { passengerEmail, phoneNumber } = cancellationDetails;
  
  const results = await Promise.allSettled([
    sendCancellationEmail(cancellationDetails),
    sendCancellationSMS(phoneNumber, cancellationDetails),
    sendCancellationWhatsApp(phoneNumber, cancellationDetails),
  ]);

  return {
    email: results[0],
    sms: results[1],
    whatsapp: results[2],
  };
}

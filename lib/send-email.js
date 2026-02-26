const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmationEmail(orderDetails) {
  try {
    const { customer, itemSnapshot, notes, _id } = orderDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '✓ Order Confirmation - Imagine Creation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmed!</h2>
          <p>A new order has been placed from: ${customer.fullName}</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #6c5ce7;">Order ID:</h3>
            <p style="font-weight: bold; font-size: 16px;">${_id}</p>
            
            <h3 style="color: #6c5ce7; margin-top: 15px;">Item Ordered:</h3>
            <p><strong>${itemSnapshot.title}</strong></p>
            <p style="color: #666;">Price: £${itemSnapshot.price}</p>
            
            <h3 style="color: #6c5ce7; margin-top: 15px;">Delivery Address:</h3>
            <p>
              ${customer.fullName}<br>
              ${customer.addressLine1}<br>
              ${customer.addressLine2 ? customer.addressLine2 + '<br>' : ''}
              ${customer.city}<br>
              ${customer.postcode}
            </p>
            
            ${notes ? `<h3 style="color: #6c5ce7; margin-top: 15px;">Notes:</h3><p>${notes}</p>` : ''}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendOrderConfirmationEmail };

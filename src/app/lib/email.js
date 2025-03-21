import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app-specific password
  },
});

export const sendInquiryNotification = async (ownerEmail, inquiryData, propertyData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ownerEmail,
    subject: `New Inquiry for ${propertyData.title}`,
    html: `
      <h1>New Property Inquiry</h1>
      <p>You have received a new inquiry for your property: ${propertyData.title}</p>
      
      <h2>Inquiry Details:</h2>
      <ul>
        <li><strong>Name:</strong> ${inquiryData.name}</li>
        <li><strong>Email:</strong> ${inquiryData.email}</li>
        <li><strong>Phone:</strong> ${inquiryData.phone}</li>
        <li><strong>Message:</strong> ${inquiryData.message}</li>
      </ul>
      
      <h2>Property Details:</h2>
      <ul>
        <li><strong>Title:</strong> ${propertyData.title}</li>
        <li><strong>Location:</strong> ${propertyData.location}</li>
        <li><strong>Price:</strong> ₹${propertyData.price}/month</li>
      </ul>
      
      <p>You can respond to this inquiry by contacting the interested party directly.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};
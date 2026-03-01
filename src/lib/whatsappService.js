
export const generateWhatsAppLink = (data) => {
  const phoneNumber = "256752001269";
  
  const message = `*Hello JB Dental Clinic, I would like to book an appointment.*

Here are my details:
1. *Name:* ${data.name}
2. *Email:* ${data.email}
3. *Phone:* ${data.phone}
4. *Service:* ${data.service || 'Not specified'}
5. *Preferred Date:* ${data.date || 'Not specified'}
6. *Preferred Time:* ${data.time || 'Not specified'}

*Additional Notes:*
${data.message || 'None'}

Please confirm if this slot is available. Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

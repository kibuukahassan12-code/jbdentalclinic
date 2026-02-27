const META_GRAPH_URL = 'https://graph.facebook.com/v18.0';

/**
 * Send a WhatsApp template message for appointment reminders
 */
export function sendReminderTemplate(phone, date, time, templateName = 'appointment_reminder') {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }
  const to = normalizePhone(phone);
  const body = {
    messaging_product: 'whatsapp',
    to: to.replace(/^\+/, ''),
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: date },
            { type: 'text', text: time },
          ],
        },
      ],
    },
  };
  const url = `${META_GRAPH_URL}/${phoneNumberId}/messages`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error?.message || res.statusText || 'WhatsApp API error');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  });
}

/**
 * Send a text message (non-template) - useful for thank you messages
 */
export function sendTextMessage(phone, message) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }
  const to = normalizePhone(phone);
  const body = {
    messaging_product: 'whatsapp',
    to: to.replace(/^\+/, ''),
    type: 'text',
    text: {
      body: message,
    },
  };
  const url = `${META_GRAPH_URL}/${phoneNumberId}/messages`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error?.message || res.statusText || 'WhatsApp API error');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  });
}

/**
 * Send thank you message after booking
 */
export function sendThankYouMessage(phone, patientName, date, time) {
  const message = `🦷 *Thank you for choosing JB Dental Clinic!* 🦷

Dear ${patientName},

We are proud to serve you and grateful that you've chosen JB Dental Clinic for your dental care needs.

*Your Appointment Details:*
📅 Date: ${date}
⏰ Time: ${time}

We look forward to seeing you and providing you with excellent dental care. You will receive reminder messages before your appointment.

If you need to reschedule or have any questions, please don't hesitate to contact us.

*JB Dental Clinic*
📍 Makindye, Kampala
📞 0752001269
✨ Your smile is our priority!`;

  return sendTextMessage(phone, message);
}

/**
 * Send 1-day before reminder
 */
export function send1DayReminder(phone, patientName, date, time) {
  const message = `🔔 *Appointment Reminder - JB Dental Clinic* 🔔

Dear ${patientName},

This is a reminder that you have an appointment with us *tomorrow*.

*Appointment Details:*
📅 Date: ${date}
⏰ Time: ${time}

Please arrive 10 minutes early. If you need to reschedule, kindly contact us.

*JB Dental Clinic*
📍 Makindye, Kampala
📞 0752001269`;

  return sendTextMessage(phone, message);
}

/**
 * Send 6-hour before reminder
 */
export function send6HourReminder(phone, patientName, date, time) {
  const message = `⏰ *Appointment in 6 Hours - JB Dental Clinic* ⏰

Dear ${patientName},

Your appointment is coming up in approximately *6 hours*.

*Appointment Details:*
📅 Date: ${date}
⏰ Time: ${time}

We look forward to seeing you soon!

*JB Dental Clinic*
📍 Makindye, Kampala
📞 0752001269`;

  return sendTextMessage(phone, message);
}

/**
 * Send 1-hour before reminder
 */
export function send1HourReminder(phone, patientName, date, time) {
  const message = `🚨 *Final Reminder - JB Dental Clinic* 🚨

Dear ${patientName},

Your appointment is in *1 hour*!

*Appointment Details:*
📅 Date: ${date}
⏰ Time: ${time}

Please start making your way to our clinic. See you soon!

*JB Dental Clinic*
📍 Makindye, Kampala
📞 0752001269`;

  return sendTextMessage(phone, message);
}

/**
 * Normalize a Ugandan phone number to 256XXXXXXXXX format.
 * Returns null if the input cannot be normalized.
 */
export function normalizeE164(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('256') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return '256' + digits.slice(1);
  if (digits.length === 9) return '256' + digits;
  return null;
}

function normalizePhone(phone) {
  return normalizeE164(phone) || String(phone).replace(/\D/g, '');
}

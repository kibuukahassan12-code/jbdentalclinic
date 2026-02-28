const META_GRAPH_URL = 'https://graph.facebook.com/v18.0';

/**
 * Send a WhatsApp template message for appointment reminders
 */
export function sendTemplateMessage(phone, templateName, parameters = []) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }
  const to = normalizePhone(phone);
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en';
  const body = {
    messaging_product: 'whatsapp',
    to: to.replace(/^\+/, ''),
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: 'body',
          parameters: parameters.map((p) => ({ type: 'text', text: String(p ?? '') })),
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

export function sendReminderTemplate(phone, date, time, templateName = 'appointment_reminder') {
  return sendTemplateMessage(phone, templateName, [date, time]);
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
  const templateName = process.env.WHATSAPP_TEMPLATE_THANK_YOU || 'jb_thank_you';
  return sendTemplateMessage(phone, templateName, [patientName, date, time]);
}

/**
 * Send 1-day before reminder
 */
export function send1DayReminder(phone, patientName, date, time) {
  const templateName = process.env.WHATSAPP_TEMPLATE_1DAY || 'jb_reminder_1day';
  return sendTemplateMessage(phone, templateName, [patientName, date, time]);
}

/**
 * Send 6-hour before reminder
 */
export function send6HourReminder(phone, patientName, date, time) {
  const templateName = process.env.WHATSAPP_TEMPLATE_6H || 'jb_reminder_6h';
  return sendTemplateMessage(phone, templateName, [patientName, date, time]);
}

/**
 * Send 1-hour before reminder
 */
export function send1HourReminder(phone, patientName, date, time) {
  const templateName = process.env.WHATSAPP_TEMPLATE_1H || 'jb_reminder_1h';
  return sendTemplateMessage(phone, templateName, [patientName, date, time]);
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

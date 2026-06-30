export default async function(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  const anonKey = Deno.env.get('ANON_KEY');
  const authHeader = req.headers.get('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : anonKey;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const getRecords = async (table, params = '') => {
    const res = await fetch(`${baseUrl}/api/database/records/${table}?${params}`, { headers });
    return res.ok ? res.json() : [];
  };

  const createRecord = async (table, body) => {
    return fetch(`${baseUrl}/api/database/records/${table}`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify([body])
    });
  };

  let type = 'all';
  try {
    const body = await req.json();
    type = body.type || 'all';
  } catch (e) {}

  const results = {
    thank_you: { sent: 0, failed: [], skipped: 0 },
    thank_you_email: { sent: 0, failed: [], skipped: 0 },
    reminder_1day: { sent: 0, failed: [], skipped: 0 },
    reminder_1day_email: { sent: 0, failed: [], skipped: 0 },
    reminder_6h: { sent: 0, failed: [], skipped: 0 },
    reminder_6h_email: { sent: 0, failed: [], skipped: 0 },
    reminder_1h: { sent: 0, failed: [], skipped: 0 },
    reminder_1h_email: { sent: 0, failed: [], skipped: 0 },
    total_sent: 0,
    total_email_sent: 0,
    total_failed: 0,
    total_email_failed: 0
  };

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toISOString();

  const patients = await getRecords('patients', 'limit=100000');
  const patientEmailMap = {};
  patients.forEach(p => {
    if (p.email) patientEmailMap[p.id] = p.email;
  });

  if (type === 'all' || type === 'thank-you') {
    const appointments = await getRecords('appointments', `status=neq.Cancelled&limit=100`);
    const pendingThankYou = appointments.filter(a => !a.thank_you_sent_at && new Date(a.created_at) >= yesterday);
    for (const apt of pendingThankYou) {
      const errorMsg = 'WhatsApp credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: 'thank_you',
        channel: 'whatsapp',
        status: 'Failed',
        message: `Thank you message for ${apt.patient_name}`,
        error: errorMsg
      });
      results.thank_you.failed.push({ id: apt.id, error: errorMsg, patient: apt.patient_name });
      results.total_failed++;
    }

    const pendingThankYouEmail = appointments.filter(a => !a.thank_you_email_sent_at && new Date(a.created_at) >= yesterday);
    for (const apt of pendingThankYouEmail) {
      const email = patientEmailMap[apt.patient_id];
      if (!email) {
        results.thank_you_email.skipped++;
        continue;
      }
      const errorMsg = 'Email (SMTP) credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: 'thank_you',
        channel: 'email',
        status: 'Failed',
        message: `Thank you email for ${apt.patient_name}`,
        error: errorMsg
      });
      results.thank_you_email.failed.push({ id: apt.id, error: errorMsg, email });
      results.total_email_failed++;
    }
  }

  if (type === 'all' || type === '1day') {
    const appointments = await getRecords('appointments', `appointment_date=eq.${tomorrowStr}&status=neq.Cancelled&limit=100`);
    const pending1Day = appointments.filter(a => !a.reminder_1day_sent_at);
    for (const apt of pending1Day) {
      const errorMsg = 'WhatsApp credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: '1day',
        channel: 'whatsapp',
        status: 'Failed',
        message: `1-day reminder for ${apt.patient_name}`,
        error: errorMsg
      });
      results.reminder_1day.failed.push({ id: apt.id, error: errorMsg, patient: apt.patient_name });
      results.total_failed++;
    }

    const pending1DayEmail = appointments.filter(a => !a.reminder_1day_email_sent_at);
    for (const apt of pending1DayEmail) {
      const email = patientEmailMap[apt.patient_id];
      if (!email) {
        results.reminder_1day_email.skipped++;
        continue;
      }
      const errorMsg = 'Email (SMTP) credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: '1day',
        channel: 'email',
        status: 'Failed',
        message: `1-day reminder email for ${apt.patient_name}`,
        error: errorMsg
      });
      results.reminder_1day_email.failed.push({ id: apt.id, error: errorMsg, email });
      results.total_email_failed++;
    }
  }

  if (type === 'all' || type === '6h') {
    const appointments = await getRecords('appointments', `appointment_date=eq.${todayStr}&status=neq.Cancelled&limit=100`);
    const in6HoursTime = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const windowStart = new Date(in6HoursTime.getTime() - 30 * 60 * 1000);
    const windowEnd = new Date(in6HoursTime.getTime() + 30 * 60 * 1000);

    const pending6h = appointments.filter(a => {
      if (a.reminder_6h_sent_at) return false;
      const [hours, minutes] = a.appointment_time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      return aptTime >= windowStart && aptTime <= windowEnd;
    });

    for (const apt of pending6h) {
      const errorMsg = 'WhatsApp credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: '6h',
        channel: 'whatsapp',
        status: 'Failed',
        message: `6-hour reminder for ${apt.patient_name}`,
        error: errorMsg
      });
      results.reminder_6h.failed.push({ id: apt.id, error: errorMsg, patient: apt.patient_name });
      results.total_failed++;
    }

    const pending6hEmail = appointments.filter(a => {
      if (a.reminder_6h_email_sent_at) return false;
      const [hours, minutes] = a.appointment_time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      return aptTime >= windowStart && aptTime <= windowEnd;
    });

    for (const apt of pending6hEmail) {
      const email = patientEmailMap[apt.patient_id];
      if (!email) {
        results.reminder_6h_email.skipped++;
        continue;
      }
      const errorMsg = 'Email (SMTP) credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: '6h',
        channel: 'email',
        status: 'Failed',
        message: `6-hour reminder email for ${apt.patient_name}`,
        error: errorMsg
      });
      results.reminder_6h_email.failed.push({ id: apt.id, error: errorMsg, email });
      results.total_email_failed++;
    }
  }

  if (type === 'all' || type === '1h') {
    const appointments = await getRecords('appointments', `appointment_date=eq.${todayStr}&status=neq.Cancelled&limit=100`);
    const in1HourTime = new Date(now.getTime() + 60 * 60 * 1000);
    const windowStart = new Date(in1HourTime.getTime() - 15 * 60 * 1000);
    const windowEnd = new Date(in1HourTime.getTime() + 15 * 60 * 1000);

    const pending1h = appointments.filter(a => {
      if (a.reminder_1h_sent_at) return false;
      const [hours, minutes] = a.appointment_time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      return aptTime >= windowStart && aptTime <= windowEnd;
    });

    for (const apt of pending1h) {
      const errorMsg = 'WhatsApp credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: '1h',
        channel: 'whatsapp',
        status: 'Failed',
        message: `1-hour reminder for ${apt.patient_name}`,
        error: errorMsg
      });
      results.reminder_1h.failed.push({ id: apt.id, error: errorMsg, patient: apt.patient_name });
      results.total_failed++;
    }

    const pending1hEmail = appointments.filter(a => {
      if (a.reminder_1h_email_sent_at) return false;
      const [hours, minutes] = a.appointment_time.split(':').map(Number);
      const aptTime = new Date(now);
      aptTime.setHours(hours, minutes, 0, 0);
      return aptTime >= windowStart && aptTime <= windowEnd;
    });

    for (const apt of pending1hEmail) {
      const email = patientEmailMap[apt.patient_id];
      if (!email) {
        results.reminder_1h_email.skipped++;
        continue;
      }
      const errorMsg = 'Email (SMTP) credentials not configured';
      await createRecord('communication_logs', {
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name,
        patient_phone: apt.patient_phone,
        type: '1h',
        channel: 'email',
        status: 'Failed',
        message: `1-hour reminder email for ${apt.patient_name}`,
        error: errorMsg
      });
      results.reminder_1h_email.failed.push({ id: apt.id, error: errorMsg, email });
      results.total_email_failed++;
    }
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

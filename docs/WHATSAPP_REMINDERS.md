# WhatsApp Reminder System

## Overview
The JB Dental System features a comprehensive multi-stage WhatsApp reminder system that automatically sends messages to patients at different stages of their appointment journey.

## Reminder Stages

### 1. Thank You Message (Immediate)
- **When**: Sent immediately after appointment is created
- **Purpose**: Welcome the patient and confirm their booking
- **Message includes**:
  - Gratitude for choosing JB Dental Clinic
  - Appointment date and time
  - Contact information
  - Mention of upcoming reminders

### 2. One Day Before Reminder
- **When**: Sent 24 hours before the appointment
- **Purpose**: First reminder to prepare for the appointment
- **Message includes**:
  - Appointment tomorrow notification
  - Date and time details
  - Request to arrive 10 minutes early
  - Rescheduling instructions

### 3. Six Hour Before Reminder
- **When**: Sent 6 hours before the appointment (±30 min window)
- **Purpose**: Midday reminder for same-day appointments
- **Message includes**:
  - "Appointment in 6 hours" notification
  - Date and time confirmation
  - Looking forward message

### 4. One Hour Before Reminder
- **When**: Sent 1 hour before the appointment (±15 min window)
- **Purpose**: Final reminder to start heading to the clinic
- **Message includes**:
  - Urgent "1 hour left" notification
  - Date and time
  - Direction to start traveling

## How It Works

### Automatic Scheduling
The system uses a cron job that runs **every 30 minutes** to check for:
- New appointments that need thank you messages
- Appointments tomorrow that need 1-day reminders
- Appointments in ~6 hours that need 6-hour reminders
- Appointments in ~1 hour that need 1-hour reminders

### Database Tracking
Each reminder type is tracked separately in the database:
- `thank_you_sent_at` - Timestamp of thank you message
- `reminder_1day_sent_at` - Timestamp of 1-day reminder
- `reminder_6h_sent_at` - Timestamp of 6-hour reminder
- `reminder_1h_sent_at` - Timestamp of 1-hour reminder

This prevents duplicate messages and allows precise tracking.

### Admin Dashboard
The admin appointments page shows status badges for each reminder type:
- ✓ Green badge: Reminder sent
- ○ Gray badge: Reminder pending

## Configuration

### Environment Variables
```env
# WhatsApp API credentials (required)
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Optional: Custom cron schedule (default: every 30 minutes)
REMINDER_CRON=*/30 * * * *

# Optional: Timezone (default: Africa/Kampala)
TZ=Africa/Kampala
```

### WhatsApp API Setup
1. Create a Meta Business account
2. Set up WhatsApp Business API
3. Get your Access Token and Phone Number ID
4. Add them to your `.env` file

## Manual Triggers

### Send All Reminders
```bash
POST /api/send-reminders
Headers: { "X-API-Key": "your-api-key" }
```

### Send Specific Reminder Type
```bash
# Thank you messages only
POST /api/send-reminders/thank-you

# 1-day reminders only
POST /api/send-reminders/1day

# 6-hour reminders only
POST /api/send-reminders/6h

# 1-hour reminders only
POST /api/send-reminders/1h
```

## Response Format
```json
{
  "thank_you": {
    "sent": 2,
    "failed": []
  },
  "reminder_1day": {
    "sent": 5,
    "failed": []
  },
  "reminder_6h": {
    "sent": 3,
    "failed": []
  },
  "reminder_1h": {
    "sent": 1,
    "failed": [
      {
        "id": 123,
        "type": "1h",
        "error": "Invalid phone number"
      }
    ]
  },
  "total_sent": 11,
  "total_failed": 1
}
```

## Phone Number Format
The system accepts multiple phone formats and normalizes them:
- International: `256752001269`
- Local: `0752001269`
- With plus: `+256752001269`

All are converted to E.164 format (256XXXXXXXXX) for WhatsApp API.

## Troubleshooting

### Reminders Not Sending
1. Check WhatsApp API credentials in `.env`
2. Verify phone numbers are valid Uganda numbers
3. Check server logs for cron job execution
4. Manually trigger reminders via API to test

### Duplicate Messages
- Check database timestamps - each reminder type should only be sent once
- Verify cron schedule isn't running too frequently
- Each appointment tracks 4 separate reminder timestamps

### Time Zone Issues
- Ensure `TZ` environment variable is set to `Africa/Kampala`
- Check server's system timezone
- Verify appointment times are stored correctly

## Testing

### Test Thank You Message
1. Create a new appointment with your phone number
2. Wait for cron job (max 30 minutes) or manually trigger
3. Check your WhatsApp for thank you message

### Test Time-Based Reminders
1. Create appointment for tomorrow at 9:00 AM
2. Wait for 1-day reminder (should send today)
3. Create appointment for 6 hours from now
4. Create appointment for 1 hour from now
5. Manually trigger or wait for cron

## Technical Details

### Cron Schedule Format
```
*/30 * * * *
│   │ │ │ │
│   │ │ │ └─── day of week (0-7)
│   │ │ └───── month (1-12)
│   │ └─────── day of month (1-31)
│   └───────── hour (0-23)
└───────────── minute (0-59)
```

`*/30 * * * *` = Every 30 minutes

### Files Modified
- `server/db.js` - Database schema with reminder timestamps
- `server/lib/whatsapp.js` - WhatsApp messaging functions
- `server/routes/reminders.js` - Reminder scheduling logic
- `server/index.js` - Cron job configuration
- `src/pages/admin/AdminAppointments.jsx` - Admin UI with status badges

## Future Enhancements
- SMS fallback for failed WhatsApp messages
- Custom message templates per service type
- Patient preferences for reminder times
- Multi-language support
- Appointment confirmation via WhatsApp buttons

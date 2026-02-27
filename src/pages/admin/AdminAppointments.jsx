import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Plus, Trash2, Edit2, Send, FileText, Download, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SectionHeader from '@/components/SectionHeader';
import ReceiptPrint from '@/components/admin/ReceiptPrint';
import AppointmentInvoice from '@/components/admin/AppointmentInvoice';
import html2pdf from 'html2pdf.js';

const today = () => new Date().toISOString().slice(0, 10);
const in30Days = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

// CSV Export helper function
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${today()}.csv`;
  link.click();
};

export default function AdminAppointments({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reminderResult, setReminderResult] = useState(null);
  const [patients, setPatients] = useState([]);
  const { toast } = useToast();
  const [form, setForm] = useState({
    patient_name: '',
    patient_phone: '',
    patient_id: '',
    appointment_date: today(),
    appointment_time: '09:00',
    duration_minutes: '30',
    service: '',
    notes: '',
    payment_on_booking: 'none',
    amount_ugx: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [appointmentInvoiceData, setAppointmentInvoiceData] = useState(null);
  const printRef = useRef(null);

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      const res = await api(
        `/api/appointments?from_date=${today()}&to_date=${in30Days()}&limit=200`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError('Invalid API key. Please log in again.');
        } else {
          setError(data.error || res.statusText);
        }
        setList([]);
        return;
      }
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load appointments');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey]);

  const loadPatients = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const res = await api('/api/patients?limit=500');
      if (res.ok) setPatients(await res.json());
    } catch (_) { }
  }, [api, getStoredKey]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // PDF Download helper functions
  const downloadReceiptPDF = async (payment, invoice, patient) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7FD856; padding-bottom: 20px;">
          <img src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f51b96d62e1c9d03d4878cf068f6e99e.png" alt="JB Dental Clinic" style="height: 60px; margin-bottom: 10px;">
          <h1 style="color: #0F0F0F; margin: 0; font-size: 24px;">JB Dental Clinic</h1>
          <p style="margin: 5px 0; color: #666;">For All Your Dental Solutions</p>
          <p style="margin: 10px 0 5px; color: #666; font-size: 12px;">Makindye, opposite Climax Bar, Kampala, Uganda</p>
          <p style="margin: 0; color: #666; font-size: 12px;">Tel: +256 752 001269 • Email: info@jbdental.ug</p>
        </div>
        <h2 style="text-align: center; color: #0F0F0F; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px;">Payment Receipt</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9f9f9;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Receipt No:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">RCP-${payment.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Patient Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${patient ? (patient.full_name || patient.name) : 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Invoice No:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">INV-${invoice ? (invoice.invoice_number || invoice.id) : payment.invoice_id}</td>
          </tr>
        </table>
        <div style="background: #7FD856; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Amount Received</p>
          <p style="margin: 10px 0 0; color: #0F0F0F; font-size: 32px; font-weight: bold;">UGX ${Number(payment.amount).toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Method:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payment.payment_method || 'N/A'}</td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #7FD856;">
          <p style="color: #0F0F0F; font-weight: bold;">Thank you for your payment!</p>
          <p style="color: #666; font-size: 12px;">Makindye, opposite Climax Bar, Kampala, Uganda • Tel: +256 752 001269</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Receipt-${payment.id}-${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(container).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      document.body.removeChild(container);
    }
  };

  const downloadInvoicePDF = async (appointment, patient, payment, invoice) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7FD856; padding-bottom: 20px;">
          <img src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f51b96d62e1c9d03d4878cf068f6e99e.png" alt="JB Dental Clinic" style="height: 60px; margin-bottom: 10px;">
          <h1 style="color: #0F0F0F; margin: 0; font-size: 24px;">JB Dental Clinic</h1>
          <p style="margin: 5px 0; color: #666;">For All Your Dental Solutions</p>
          <p style="margin: 10px 0 5px; color: #666; font-size: 12px;">Makindye, opposite Climax Bar, Kampala, Uganda</p>
          <p style="margin: 0; color: #666; font-size: 12px;">Tel: +256 752 001269 • Email: info@jbdental.ug</p>
        </div>
        <h2 style="text-align: center; color: #0F0F0F; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px;">Appointment Confirmation</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9f9f9;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Appointment No:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointment.appointment_date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointment.appointment_time}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Patient Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${patient ? (patient.full_name || patient.name) : 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${patient ? patient.phone : 'N/A'}</td>
          </tr>
        </table>
        ${payment ? `
        <div style="background: #7FD856; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0F0F0F; margin: 0 0 10px 0;">Payment Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px;"><strong>Amount Paid:</strong></td>
              <td style="padding: 8px; text-align: right; font-size: 18px; font-weight: bold;">UGX ${Number(payment.amount).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px;"><strong>Payment Method:</strong></td>
              <td style="padding: 8px; text-align: right;">${payment.payment_method || 'N/A'}</td>
            </tr>
          </table>
        </div>
        ` : ''}
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #7FD856;">
          <p style="color: #0F0F0F; font-weight: bold;">Thank you for choosing JB Dental Clinic!</p>
          <p style="color: #666; font-size: 12px;">Makindye, opposite Climax Bar, Kampala, Uganda • Tel: +256 752 001269</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Appointment-${appointment.id}-${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(container).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      document.body.removeChild(container);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const key = getStoredKey();
    if (!key) return;
    setError('');
    setReceiptData(null);
    setAppointmentInvoiceData(null);
    const paymentType = form.payment_on_booking;
    const amount = form.amount_ugx === '' ? 0 : Number(form.amount_ugx);
    const patientId = form.patient_id ? Number(form.patient_id) : null;
    if ((paymentType === 'half' || paymentType === 'full') && (!patientId || amount <= 0)) {
      setError('For payment on booking, select a patient and enter amount (UGX).');
      return;
    }
    const appointmentBody = editingId
      ? { ...form, duration_minutes: Number(form.duration_minutes) }
      : {
        patient_name: form.patient_name,
        patient_phone: form.patient_phone,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        duration_minutes: Number(form.duration_minutes),
        service: form.service || null,
        notes: form.notes || null,
        patient_id: patientId || undefined,
      };
    const url = editingId ? `/api/appointments/${editingId}` : '/api/appointments';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(appointmentBody) }, key);
    const aptData = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(aptData.error || aptData.details?.join?.() || res.statusText);
      return;
    }
    let createdPayment = null;
    let createdInvoice = null;
    const selectedPatient = patientId ? patients.find((p) => p.id === patientId) : null;
    if (patientId && amount > 0) {
      const invRes = await api(
        '/api/invoices',
        {
          method: 'POST',
          body: JSON.stringify({
            patient_id: patientId,
            total_amount: amount,
            discount: 0,
            tax: 0,
            status: 'Pending',
          }),
        },
        key
      );
      const invJson = await invRes.json().catch(() => ({}));
      if (invRes.ok && invJson.id) {
        createdInvoice = invJson;
        if (paymentType === 'half' || paymentType === 'full') {
          const payAmount = paymentType === 'full' ? amount : Math.round(amount * 0.5);
          const payRes = await api(
            '/api/payments',
            {
              method: 'POST',
              body: JSON.stringify({
                invoice_id: createdInvoice.id,
                amount: payAmount,
                payment_method: 'Cash',
                paid_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }),
            },
            key
          );
          const payJson = await payRes.json().catch(() => ({}));
          if (payRes.ok && payJson.id) createdPayment = payJson;
        }
      }
    }
    setForm({
      patient_name: '',
      patient_phone: '',
      patient_id: '',
      appointment_date: today(),
      appointment_time: '09:00',
      duration_minutes: '30',
      service: '',
      notes: '',
      payment_on_booking: 'none',
      amount_ugx: '',
    });
    setEditingId(null);
    loadList();

    // Show toast notification
    toast({
      title: editingId ? 'Appointment updated' : 'Appointment created',
      description: editingId
        ? 'The appointment has been updated successfully.'
        : `Appointment for ${form.patient_name} has been created.`,
      variant: 'default',
      className: 'bg-[#7FD856] text-black',
    });

    // Download appropriate document based on payment status
    if (createdPayment && createdInvoice && selectedPatient) {
      // If payment was made, download payment receipt
      await downloadReceiptPDF(createdPayment, createdInvoice, selectedPatient);
    } else if (!editingId) {
      // For new appointments (not editing), download appointment invoice/confirmation
      await downloadInvoicePDF(
        aptData,
        selectedPatient || {
          full_name: aptData.patient_name,
          phone: aptData.patient_phone,
        },
        createdPayment,
        createdInvoice
      );
    }
  };

  const handleEdit = (apt) => {
    setForm({
      patient_name: apt.patient_name,
      patient_phone: apt.patient_phone,
      patient_id: apt.patient_id ? String(apt.patient_id) : '',
      appointment_date: apt.appointment_date,
      appointment_time: (apt.appointment_time || '').slice(0, 5),
      duration_minutes: String(apt.duration_minutes || 30),
      service: apt.service || '',
      notes: apt.notes || '',
      payment_on_booking: 'none',
      amount_ugx: '',
    });
    setEditingId(apt.id);
  };

  const onSelectPatient = (patientId) => {
    const id = patientId ? String(patientId) : '';
    setForm((f) => ({ ...f, patient_id: id }));
    if (patientId) {
      const p = patients.find((x) => x.id === Number(patientId));
      if (p) setForm((f) => ({ ...f, patient_id: id, patient_name: p.full_name || f.patient_name, patient_phone: p.phone || f.patient_phone }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    const key = getStoredKey();
    const res = await api(`/api/appointments/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) {
        setEditingId(null);
        setForm({
          patient_name: '',
          patient_phone: '',
          patient_id: '',
          appointment_date: today(),
          appointment_time: '09:00',
          service: '',
          notes: '',
          payment_on_booking: 'none',
          amount_ugx: '',
        });
      }
      loadList();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  // Handle appointment status change
  const handleStatusChange = async (id, newStatus) => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const res = await api(
        `/api/appointments/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        },
        key
      );
      if (res.ok) {
        toast({
          title: 'Status updated',
          description: `Appointment marked as ${newStatus}`,
          variant: 'default',
          className: 'bg-[#7FD856] text-black',
        });
        loadList();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to update status');
      }
    } catch (e) {
      setError(e.message || 'Failed to update status');
    }
  };

  // Handle manual reminder send
  const handleSendReminder = async (id, reminderType = 'thank_you') => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const res = await api(
        `/api/appointments/${id}/send-reminder`,
        {
          method: 'POST',
          body: JSON.stringify({ reminderType }),
        },
        key
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast({
          title: 'Reminder sent',
          description: data.message || 'Reminder sent successfully',
          variant: 'default',
          className: 'bg-[#7FD856] text-black',
        });
        loadList();
      } else {
        setError(data.error || 'Failed to send reminder');
      }
    } catch (e) {
      setError(e.message || 'Failed to send reminder');
    }
  };

  const handleSendReminders = async () => {
    const key = getStoredKey();
    if (!key) return;
    setError('');
    setReminderResult(null);
    try {
      const res = await api('/api/send-reminders', { method: 'POST' }, key);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || res.statusText);
        return;
      }
      setReminderResult(data);
      loadList();
    } catch (e) {
      setError(e.message || 'Failed to send reminders');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <SectionHeader
          title="Appointments"
          subtitle="Manage appointments with automated WhatsApp reminders: Thank you message on booking, then 1-day, 6-hour, and 1-hour before appointment."
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(list, 'appointments')}
            className="border-white/20 text-white"
          >
            <Download className="mr-2" size={18} />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendReminders}
            className="border-white/20 text-white"
          >
            <Send className="mr-2" size={18} />
            Send reminders now
          </Button>
        </div>
      </div>

      {reminderResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-[#7FD856]/10 border border-[#7FD856]/30 text-sm"
        >
          Reminders sent: {reminderResult.sent}.{' '}
          {reminderResult.failed?.length > 0 &&
            `Failed: ${reminderResult.failed.length}.`}
        </motion.div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Plus size={20} />
          {editingId ? 'Edit appointment' : 'Add appointment'}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Patient name *</label>
            <input
              required
              value={form.patient_name}
              onChange={(e) => setForm((f) => ({ ...f, patient_name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. John Kintu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone (E.164) *</label>
            <input
              required
              value={form.patient_phone}
              onChange={(e) => setForm((f) => ({ ...f, patient_phone: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="256752001269 or 0752001269"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
            <input
              type="date"
              required
              value={form.appointment_date}
              onChange={(e) => setForm((f) => ({ ...f, appointment_date: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Time *</label>
            <input
              type="time"
              required
              value={form.appointment_time}
              onChange={(e) => setForm((f) => ({ ...f, appointment_time: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Duration (minutes)</label>
            <select
              value={form.duration_minutes}
              onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Service (optional)</label>
            <input
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. General checkup"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Any notes"
            />
          </div>
          {!editingId && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Link to patient (for invoice)</label>
                <select
                  value={form.patient_id}
                  onChange={(e) => onSelectPatient(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">— None —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Payment on booking</label>
                <select
                  value={form.payment_on_booking}
                  onChange={(e) => setForm((f) => ({ ...f, payment_on_booking: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="none">None</option>
                  <option value="half">Half</option>
                  <option value="full">Full</option>
                </select>
              </div>
              {(form.payment_on_booking === 'half' || form.payment_on_booking === 'full') && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Amount (UGX) *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.amount_ugx}
                    onChange={(e) => setForm((f) => ({ ...f, amount_ugx: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    placeholder="e.g. 150000"
                  />
                </div>
              )}
            </>
          )}
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} appointment
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                className="border-white/20"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    patient_name: '',
                    patient_phone: '',
                    patient_id: '',
                    appointment_date: today(),
                    appointment_time: '09:00',
                    service: '',
                    notes: '',
                    payment_on_booking: 'none',
                    amount_ugx: '',
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Upcoming appointments</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No upcoming appointments.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((apt) => (
              <li
                key={apt.id}
                className="p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm mb-3">
                      <span className="flex items-center gap-2 text-white font-medium">
                        <User size={16} className="text-[#7FD856]" />
                        {apt.patient_name}
                      </span>
                      <span className="flex items-center gap-2 text-gray-400">
                        <Phone size={16} className="text-[#7FD856]" />
                        {apt.patient_phone}
                      </span>
                      <span className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} className="text-[#7FD856]" />
                        {apt.appointment_date}
                      </span>
                      <span className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} className="text-[#7FD856]" />
                        {apt.appointment_time}
                      </span>
                    </div>

                    {/* Reminder Status Section */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${apt.thank_you_sent_at ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {apt.thank_you_sent_at ? '✓ Thank You Sent' : '○ Thank You Pending'}
                      </span>
                      <span className={`px-2 py-1 rounded ${apt.reminder_1day_sent_at ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {apt.reminder_1day_sent_at ? '✓ 1-Day Reminder' : '○ 1-Day Reminder'}
                      </span>
                      <span className={`px-2 py-1 rounded ${apt.reminder_6h_sent_at ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {apt.reminder_6h_sent_at ? '✓ 6-Hour Reminder' : '○ 6-Hour Reminder'}
                      </span>
                      <span className={`px-2 py-1 rounded ${apt.reminder_1h_sent_at ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {apt.reminder_1h_sent_at ? '✓ 1-Hour Reminder' : '○ 1-Hour Reminder'}
                      </span>
                      {apt.status && (
                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 capitalize">
                          {apt.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={apt.status || 'Scheduled'}
                      onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border bg-white/10 text-white cursor-pointer capitalize ${apt.status === 'Completed' ? 'border-green-500 text-green-400' :
                        apt.status === 'Confirmed' ? 'border-blue-500 text-blue-400' :
                          apt.status === 'Cancelled' ? 'border-red-500 text-red-400' :
                            apt.status === 'No Show' ? 'border-orange-500 text-orange-400' :
                              'border-gray-500 text-gray-400'
                        }`}
                    >
                      <option value="Scheduled" className="bg-gray-800">Scheduled</option>
                      <option value="Confirmed" className="bg-gray-800">Confirmed</option>
                      <option value="Completed" className="bg-gray-800">Completed</option>
                      <option value="Cancelled" className="bg-gray-800">Cancelled</option>
                      <option value="No Show" className="bg-gray-800">No Show</option>
                    </select>

                    {/* Manual Reminder Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white"
                      onClick={() => handleSendReminder(apt.id, 'thank_you')}
                      title="Send manual reminder"
                    >
                      <Bell size={16} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white"
                      onClick={() => handleEdit(apt)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDelete(apt.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Edit2, Download, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';
import PatientReportPrint from '@/components/admin/PatientReportPrint';
import html2pdf from 'html2pdf.js';

export default function AdminPatientReports({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    report_date: new Date().toISOString().slice(0, 10),
    chief_complaint: '',
    clinical_findings: '',
    diagnosis: '',
    treatment_plan: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [patientFilter, setPatientFilter] = useState('');
  const [printData, setPrintData] = useState(null);
  const printRef = useRef(null);

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/patient-reports?limit=200';
      if (patientFilter) url += `&patient_id=${encodeURIComponent(patientFilter)}`;
      const res = await api(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) setError('Invalid API key.');
        else setError(data.error || `Failed to load: ${res.status} ${res.statusText}`);
        setList([]);
        return;
      }
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load patient reports');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey, patientFilter]);

  const loadPatients = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const res = await api('/api/patients?limit=500');
      if (res.ok) {
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
      }
    } catch (_) { }
  }, [api, getStoredKey]);

  const loadStaff = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const res = await api('/api/staff?limit=500');
      if (res.ok) {
        const data = await res.json();
        setStaff(Array.isArray(data) ? data : []);
      }
    } catch (_) { }
  }, [api, getStoredKey]);

  useEffect(() => {
    loadPatients();
    loadStaff();
  }, [loadPatients, loadStaff]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const key = getStoredKey();
    if (!key) return;
    setError('');
    const patient_id = form.patient_id ? Number(form.patient_id) : null;
    if (!patient_id) {
      setError('Please select a patient.');
      return;
    }
    if (!form.report_date) {
      setError('Report date is required.');
      return;
    }
    const body = {
      patient_id,
      doctor_id: form.doctor_id ? Number(form.doctor_id) : null,
      report_date: form.report_date,
      chief_complaint: form.chief_complaint || null,
      clinical_findings: form.clinical_findings || null,
      diagnosis: form.diagnosis || null,
      treatment_plan: form.treatment_plan || null,
      notes: form.notes || null,
    };
    const url = editingId ? `/api/patient-reports/${editingId}` : '/api/patient-reports';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    setForm({
      patient_id: '',
      doctor_id: '',
      report_date: new Date().toISOString().slice(0, 10),
      chief_complaint: '',
      clinical_findings: '',
      diagnosis: '',
      treatment_plan: '',
      notes: '',
    });
    setEditingId(null);
    loadList();
  };

  const handleEdit = (r) => {
    setForm({
      patient_id: r.patient_id,
      doctor_id: r.doctor_id ? String(r.doctor_id) : '',
      report_date: (r.report_date || '').slice(0, 10),
      chief_complaint: r.chief_complaint || '',
      clinical_findings: r.clinical_findings || '',
      diagnosis: r.diagnosis || '',
      treatment_plan: r.treatment_plan || '',
      notes: r.notes || '',
    });
    setEditingId(r.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient report?')) return;
    const key = getStoredKey();
    const res = await api(`/api/patient-reports/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) setEditingId(null);
      loadList();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  const getPatientName = (id) => patients.find((p) => p.id === id)?.full_name || `Patient #${id}`;
  const getDoctorName = (id) => staff.find((s) => s.id === id)?.full_name || (id ? `Staff #${id}` : '—');

  const handlePrintReport = async (r) => {
    const patient = patients.find((p) => p.id === r.patient_id) || null;
    const doctor = r.doctor_id ? staff.find((s) => s.id === r.doctor_id) || null : null;

    // Create a temporary container for rendering
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render the report to the container
    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7FD856; padding-bottom: 20px;">
          <img src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f51b96d62e1c9d03d4878cf068f6e99e.png" alt="JB Dental Clinic" style="height: 60px; margin-bottom: 10px;">
          <h1 style="color: #0F0F0F; margin: 0; font-size: 24px;">JB Dental Clinic</h1>
          <p style="margin: 5px 0; color: #666;">For All Your Dental Solutions</p>
          <p style="margin: 10px 0 5px; color: #666; font-size: 12px;">Makindye, opposite Climax Bar, Kampala, Uganda</p>
          <p style="margin: 0; color: #666; font-size: 12px;">Tel: +256 752 001269 • Email: info@jbdental.ug</p>
        </div>
        <h2 style="text-align: center; color: #0F0F0F; margin: 20px 0; text-transform: uppercase; letter-spacing: 2px;">Patient Report</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9f9f9;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Report Date:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${r.report_date ? new Date(r.report_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Patient Name:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${patient ? (patient.full_name || patient.name) : 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Doctor:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${doctor ? (doctor.full_name || doctor.name) : 'N/A'}</td>
          </tr>
        </table>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #7FD856;">
          <tr style="background: #7FD856;">
            <th style="padding: 10px; border: 1px solid #5ab844; text-align: left; width: 30%; color: #0F0F0F;">Chief Complaint</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${r.chief_complaint || '—'}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Clinical Findings</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${r.clinical_findings || '—'}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Diagnosis</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${r.diagnosis || '—'}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Treatment Plan</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${r.treatment_plan || '—'}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Notes</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${r.notes || '—'}</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #7FD856;">
          <p style="color: #0F0F0F; font-weight: bold;">Thank you for choosing JB Dental Clinic!</p>
          <p style="color: #666; font-size: 12px;">Makindye, opposite Climax Bar, Kampala, Uganda • Tel: +256 752 001269</p>
        </div>
      </div>
    `;

    // Generate PDF
    const opt = {
      margin: 10,
      filename: `Patient-Report-${r.id}-${new Date().toISOString().slice(0, 10)}.pdf`,
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

  return (
    <>
      <div className="mb-8">
        <SectionHeader
          title="Patient Reports"
          subtitle="Clinical reports: chief complaint, findings, diagnosis, and treatment plan. Download as PDF."
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Filter by patient</label>
        <select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          <option value="">All patients</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name}</option>
          ))}
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Plus size={20} />
          {editingId ? 'Edit report' : 'Add patient report'}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Patient *</label>
            <select
              required
              value={form.patient_id}
              onChange={(e) => setForm((f) => ({ ...f, patient_id: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Doctor / Attending</label>
            <select
              value={form.doctor_id}
              onChange={(e) => setForm((f) => ({ ...f, doctor_id: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">— Select —</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Report date *</label>
            <input
              type="date"
              required
              value={form.report_date}
              onChange={(e) => setForm((f) => ({ ...f, report_date: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Chief complaint</label>
            <textarea
              value={form.chief_complaint}
              onChange={(e) => setForm((f) => ({ ...f, chief_complaint: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Patient's main concern"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Clinical findings</label>
            <textarea
              value={form.clinical_findings}
              onChange={(e) => setForm((f) => ({ ...f, clinical_findings: e.target.value }))}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Examination findings, observations"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Diagnosis</label>
            <textarea
              value={form.diagnosis}
              onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Diagnosis"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Treatment plan</label>
            <textarea
              value={form.treatment_plan}
              onChange={(e) => setForm((f) => ({ ...f, treatment_plan: e.target.value }))}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Recommended treatment steps"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Any additional notes"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Save'} report
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="border-white/20" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
        <FileText size={20} className="text-[#7FD856]" />
        Reports list
      </h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No patient reports yet.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <FileText size={16} className="text-[#7FD856]" />
                    Report #{r.id}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <User size={16} className="text-[#7FD856]" />
                    {getPatientName(r.patient_id)}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <Stethoscope size={16} className="text-[#7FD856]" />
                    {getDoctorName(r.doctor_id)}
                  </span>
                  <span className="text-gray-400">{(r.report_date || '').slice(0, 10)}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={() => handlePrintReport(r)} title="Download report as PDF">
                    <Download size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={() => handleEdit(r)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/30 text-red-400" onClick={() => handleDelete(r.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

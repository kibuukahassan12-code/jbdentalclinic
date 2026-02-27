import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Plus, Trash2, Edit2, User, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminTreatments({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    dentist_id: '',
    treatment_plan_id: '',
    service_name: '',
    description: '',
    cost: '',
    treatment_date: '',
    status: 'Pending',
  });
  const [editingId, setEditingId] = useState(null);
  const [patientFilter, setPatientFilter] = useState('');

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/treatments?limit=200';
      if (patientFilter) url += `&patient_id=${patientFilter}`;
      const res = await api(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) setError('Invalid API key.');
        else setError(data.error || res.statusText);
        setList([]);
        return;
      }
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load treatments');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey, patientFilter]);

  const loadOptions = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const [pRes, sRes, plRes] = await Promise.all([
        api('/api/patients?limit=500'),
        api('/api/staff?limit=500'),
        api('/api/treatment-plans?limit=500'),
      ]);
      if (pRes.ok) setPatients(await pRes.json());
      if (sRes.ok) setStaff(await sRes.json());
      if (plRes.ok) setPlans(await plRes.json());
    } catch (_) {}
  }, [api, getStoredKey]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const loadListFresh = async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/treatments?limit=200';
      if (patientFilter) url += `&patient_id=${patientFilter}`;
      const res = await api(url);
      if (res.ok) setList(Array.isArray(await res.json()) ? await res.json() : []);
      else setList([]);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

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
    const body = {
      patient_id,
      dentist_id: form.dentist_id ? Number(form.dentist_id) : null,
      treatment_plan_id: form.treatment_plan_id ? Number(form.treatment_plan_id) : null,
      service_name: form.service_name.trim(),
      description: form.description.trim() || null,
      cost: form.cost === '' ? null : Number(form.cost),
      treatment_date: form.treatment_date || null,
      status: form.status,
    };
    const url = editingId ? `/api/treatments/${editingId}` : '/api/treatments';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    setForm({
      patient_id: '',
      dentist_id: '',
      treatment_plan_id: '',
      service_name: '',
      description: '',
      cost: '',
      treatment_date: '',
      status: 'Pending',
    });
    setEditingId(null);
    loadListFresh();
  };

  const handleEdit = (t) => {
    setForm({
      patient_id: t.patient_id,
      dentist_id: t.dentist_id ?? '',
      treatment_plan_id: t.treatment_plan_id ?? '',
      service_name: t.service_name || '',
      description: t.description || '',
      cost: t.cost != null ? String(t.cost) : '',
      treatment_date: t.treatment_date || '',
      status: t.status || 'Pending',
    });
    setEditingId(t.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this treatment record?')) return;
    const key = getStoredKey();
    const res = await api(`/api/treatments/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) setEditingId(null);
      loadListFresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  const getPatientName = (id) => patients.find((p) => p.id === id)?.full_name || `Patient #${id}`;
  const getStaffName = (id) => staff.find((s) => s.id === id)?.full_name || `Staff #${id}`;

  return (
    <>
      <div className="mb-8">
        <SectionHeader
          title="Treatments"
          subtitle="Record treatments by patient and link to treatment plans."
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
          {editingId ? 'Edit treatment' : 'Add treatment'}
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Dentist</label>
            <select
              value={form.dentist_id}
              onChange={(e) => setForm((f) => ({ ...f, dentist_id: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">—</option>
              {staff.filter((s) => s.role === 'Dentist').map((s) => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Treatment plan</label>
            <select
              value={form.treatment_plan_id}
              onChange={(e) => setForm((f) => ({ ...f, treatment_plan_id: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">—</option>
              {plans.map((pl) => (
                <option key={pl.id} value={pl.id}>Plan #{pl.id} (Patient {getPatientName(pl.patient_id)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Service name *</label>
            <input
              required
              value={form.service_name}
              onChange={(e) => setForm((f) => ({ ...f, service_name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. Root canal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Cost</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.cost}
              onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Treatment date</label>
            <input
              type="date"
              value={form.treatment_date}
              onChange={(e) => setForm((f) => ({ ...f, treatment_date: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} treatment
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="border-white/20" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Treatments list</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No treatments found.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <Stethoscope size={16} className="text-[#7FD856]" />
                    {t.service_name}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <User size={16} className="text-[#7FD856]" />
                    {getPatientName(t.patient_id)}
                  </span>
                  {t.dentist_id && (
                    <span className="text-gray-400">{getStaffName(t.dentist_id)}</span>
                  )}
                  {t.treatment_date && (
                    <span className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} className="text-[#7FD856]" />
                      {t.treatment_date}
                    </span>
                  )}
                  {t.cost != null && (
                    <span className="flex items-center gap-2 text-gray-400">
                      <DollarSign size={16} className="text-[#7FD856]" />
                      {Number(t.cost).toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 capitalize">{t.status}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={() => handleEdit(t)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/30 text-red-400" onClick={() => handleDelete(t.id)}>
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

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Trash2, Edit2, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

const STATUS_OPTIONS = ['Active', 'Completed', 'Cancelled'];

export default function AdminTreatmentPlans({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    total_estimated_cost: '',
    status: 'Active',
  });
  const [editingId, setEditingId] = useState(null);
  const [patientFilter, setPatientFilter] = useState('');

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/treatment-plans?limit=200';
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
      setError(e.message || 'Failed to load treatment plans');
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
      if (res.ok) setPatients(await res.json());
    } catch (_) {}
  }, [api, getStoredKey]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

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
    const body = {
      patient_id,
      total_estimated_cost: form.total_estimated_cost === '' ? null : Number(form.total_estimated_cost),
      status: form.status,
    };
    const url = editingId ? `/api/treatment-plans/${editingId}` : '/api/treatment-plans';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    setForm({ patient_id: '', total_estimated_cost: '', status: 'Active' });
    setEditingId(null);
    loadList();
  };

  const handleEdit = (pl) => {
    setForm({
      patient_id: pl.patient_id,
      total_estimated_cost: pl.total_estimated_cost != null ? String(pl.total_estimated_cost) : '',
      status: pl.status || 'Active',
    });
    setEditingId(pl.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this treatment plan?')) return;
    const key = getStoredKey();
    const res = await api(`/api/treatment-plans/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) setEditingId(null);
      loadList();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  const getPatientName = (id) => patients.find((p) => p.id === id)?.full_name || `Patient #${id}`;

  return (
    <>
      <div className="mb-8">
        <SectionHeader
          title="Treatment plans"
          subtitle="Create and manage treatment plans per patient; attach treatments from the Treatments tab."
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
          {editingId ? 'Edit plan' : 'Add treatment plan'}
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Total estimated cost</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.total_estimated_cost}
              onChange={(e) => setForm((f) => ({ ...f, total_estimated_cost: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="optional"
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
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} plan
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="border-white/20" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Plans list</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No treatment plans found.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((pl) => (
              <li
                key={pl.id}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <ClipboardList size={16} className="text-[#7FD856]" />
                    Plan #{pl.id}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <User size={16} className="text-[#7FD856]" />
                    {getPatientName(pl.patient_id)}
                  </span>
                  {pl.total_estimated_cost != null && (
                    <span className="flex items-center gap-2 text-gray-400">
                      <DollarSign size={16} className="text-[#7FD856]" />
                      {Number(pl.total_estimated_cost).toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 capitalize">{pl.status}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={() => handleEdit(pl)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/30 text-red-400" onClick={() => handleDelete(pl.id)}>
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

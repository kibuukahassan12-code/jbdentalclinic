import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus, Trash2, Edit2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

export default function AdminDentalChart({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    tooth_number: '',
    condition: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [patientFilter, setPatientFilter] = useState('');

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/dental-chart?limit=200';
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
      setError(e.message || 'Failed to load dental chart');
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
    if (!form.tooth_number.trim()) {
      setError('Tooth number is required.');
      return;
    }
    const body = {
      patient_id,
      tooth_number: form.tooth_number.trim(),
      condition: form.condition.trim() || null,
      notes: form.notes.trim() || null,
    };
    const url = editingId ? `/api/dental-chart/${editingId}` : '/api/dental-chart';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    setForm({ patient_id: '', tooth_number: '', condition: '', notes: '' });
    setEditingId(null);
    loadList();
  };

  const handleEdit = (row) => {
    setForm({
      patient_id: row.patient_id,
      tooth_number: row.tooth_number || '',
      condition: row.condition || '',
      notes: row.notes || '',
    });
    setEditingId(row.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dental chart entry?')) return;
    const key = getStoredKey();
    const res = await api(`/api/dental-chart/${id}`, { method: 'DELETE' }, key);
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
          title="Dental chart"
          subtitle="Record tooth number, condition, and notes per patient (simple form)."
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
          {editingId ? 'Edit entry' : 'Add dental chart entry'}
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Tooth number *</label>
            <input
              required
              value={form.tooth_number}
              onChange={(e) => setForm((f) => ({ ...f, tooth_number: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. 12, 21, upper left molar"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Condition</label>
            <input
              value={form.condition}
              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. Cavity, Filled, Missing"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} entry
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="border-white/20" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Chart entries</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No dental chart entries.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <Activity size={16} className="text-[#7FD856]" />
                    Tooth {row.tooth_number}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <User size={16} className="text-[#7FD856]" />
                    {getPatientName(row.patient_id)}
                  </span>
                  {row.condition && (
                    <span className="text-gray-400">Condition: {row.condition}</span>
                  )}
                  {row.notes && (
                    <span className="text-gray-400 truncate">Notes: {row.notes}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={() => handleEdit(row)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/30 text-red-400" onClick={() => handleDelete(row.id)}>
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

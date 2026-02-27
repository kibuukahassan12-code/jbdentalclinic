import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, FileText, AlertCircle, Plus, Trash2, Edit2, ArrowLeft, Stethoscope, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SectionHeader from '@/components/SectionHeader';

export default function AdminPatients({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    medical_history: '',
    allergies: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileTreatments, setProfileTreatments] = useState([]);

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
    const today = new Date().toISOString().slice(0, 10);
    link.download = `${filename}_${today}.csv`;
    link.click();
  };

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      const url = searchQ.trim()
        ? `/api/patients?q=${encodeURIComponent(searchQ.trim())}`
        : '/api/patients?limit=200';
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
      setError(e.message || 'Failed to load patients');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey, searchQ]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const loadProfile = useCallback(async (id) => {
    const key = getStoredKey();
    if (!key || !id) return;
    setProfileLoading(true);
    setProfile(null);
    try {
      const res = await api(`/api/patients/${id}`, {}, key);
      if (res.ok) setProfile(await res.json());
      else setProfile(null);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, [api, getStoredKey]);

  useEffect(() => {
    if (profileId) loadProfile(profileId);
  }, [profileId, loadProfile]);

  const loadProfileTreatments = useCallback(async (patientId) => {
    const key = getStoredKey();
    if (!key || !patientId) return;
    try {
      const res = await api(`/api/treatments?patient_id=${patientId}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setProfileTreatments(Array.isArray(data) ? data : []);
      } else setProfileTreatments([]);
    } catch {
      setProfileTreatments([]);
    }
  }, [api, getStoredKey]);

  useEffect(() => {
    if (profileId) loadProfileTreatments(profileId);
  }, [profileId, loadProfileTreatments]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const key = getStoredKey();
    if (!key) return;
    setError('');
    const body = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      medical_history: form.medical_history || null,
      allergies: form.allergies || null,
    };
    const url = editingId ? `/api/patients/${editingId}` : '/api/patients';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    resetForm();
    loadList();
    if (profileId === editingId) loadProfile(editingId);

    // Show toast notification
    toast({
      title: editingId ? 'Patient updated' : 'Patient added',
      description: editingId
        ? 'Patient record has been updated successfully.'
        : `${form.full_name} has been added to the system.`,
      variant: 'default',
      className: 'bg-[#7FD856] text-black',
    });
  };

  function resetForm() {
    setForm({
      full_name: '',
      phone: '',
      email: '',
      date_of_birth: '',
      gender: '',
      medical_history: '',
      allergies: '',
    });
    setEditingId(null);
  }

  const handleEdit = (p) => {
    setForm({
      full_name: p.full_name || '',
      phone: p.phone || '',
      email: p.email || '',
      date_of_birth: p.date_of_birth || '',
      gender: p.gender || '',
      medical_history: p.medical_history || '',
      allergies: p.allergies || '',
    });
    setEditingId(p.id);
    setProfileId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return;
    const key = getStoredKey();
    const res = await api(`/api/patients/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) resetForm();
      if (profileId === id) setProfileId(null);
      loadList();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  const openProfile = (id) => {
    setProfileId(id);
    setEditingId(null);
  };

  if (profileId != null && (profile || profileLoading)) {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white"
            onClick={() => { setProfileId(null); setProfile(null); }}
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to list
          </Button>
        </div>
        {profileLoading ? (
          <p className="text-gray-400">Loading profile…</p>
        ) : profile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User size={24} className="text-[#7FD856]" />
              Patient profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 text-white">
                <User size={18} className="text-[#7FD856]" />
                <span>{profile.full_name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-[#7FD856]" />
                <span>{profile.phone}</span>
              </div>
              {profile.email && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={18} className="text-[#7FD856]" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.date_of_birth && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar size={18} className="text-[#7FD856]" />
                  <span>{profile.date_of_birth}</span>
                </div>
              )}
              {profile.gender && (
                <div className="text-gray-300">Gender: {profile.gender}</div>
              )}
            </div>
            {(profile.medical_history || profile.allergies) && (
              <div className="mt-6 space-y-4">
                {profile.medical_history && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <FileText size={16} />
                      Medical history
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap bg-white/5 rounded-lg p-3">
                      {profile.medical_history}
                    </p>
                  </div>
                )}
                {profile.allergies && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <AlertCircle size={16} className="text-amber-400" />
                      Allergies
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                      {profile.allergies}
                    </p>
                  </div>
                )}
              </div>
            )}
            {profileTreatments.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Stethoscope size={16} />
                  Treatments ({profileTreatments.length})
                </div>
                <ul className="space-y-2 text-sm">
                  {profileTreatments.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-white/5 text-gray-300">
                      <span className="font-medium text-white">{t.service_name}</span>
                      {t.treatment_date && <span>{t.treatment_date}</span>}
                      {t.cost != null && <span>{Number(t.cost).toLocaleString()} UGX</span>}
                      <span className="text-xs capitalize text-gray-400">{t.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white"
                onClick={() => handleEdit(profile)}
              >
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400"
                onClick={() => handleDelete(profile.id)}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        ) : (
          <p className="text-gray-400">Patient not found.</p>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <SectionHeader
          title="Patients"
          subtitle="Manage patient records, search by name or phone, and view profiles."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(list, 'patients')}
          className="border-white/20 text-white"
        >
          <Download className="mr-2" size={16} />
          Export CSV
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="search"
          placeholder="Search by name or phone…"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Plus size={20} />
          {editingId ? 'Edit patient' : 'Add patient'}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full name *</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. Jane Nakato"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone *</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. 256752001269"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date of birth</label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              <option value="">—</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Medical history</label>
            <textarea
              value={form.medical_history}
              onChange={(e) => setForm((f) => ({ ...f, medical_history: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Allergies</label>
            <textarea
              value={form.allergies}
              onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none"
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} patient
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="border-white/20" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Patient list</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No patients found.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <User size={16} className="text-[#7FD856]" />
                    {p.full_name}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <Phone size={16} className="text-[#7FD856]" />
                    {p.phone}
                  </span>
                  {p.email && (
                    <span className="flex items-center gap-2 text-gray-400 truncate">
                      <Mail size={16} className="text-[#7FD856] shrink-0" />
                      {p.email}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white"
                    onClick={() => openProfile(p.id)}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white"
                    onClick={() => handleEdit(p)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(p.id)}
                  >
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

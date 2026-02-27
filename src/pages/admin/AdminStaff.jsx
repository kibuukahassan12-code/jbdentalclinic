import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

const ROLES = ['Dentist', 'Nurse', 'Receptionist', 'Admin'];

export default function AdminStaff({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    role: 'Dentist',
    phone: '',
    email: '',
    salary: '',
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/staff?limit=200';
      if (roleFilter) url += `&role=${encodeURIComponent(roleFilter)}`;
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
      setError(e.message || 'Failed to load staff');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey, roleFilter]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const key = getStoredKey();
    if (!key) return;
    setError('');
    const body = {
      full_name: form.full_name.trim(),
      role: form.role,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      salary: form.salary === '' ? null : Number(form.salary),
      is_active: form.is_active,
    };
    const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    setForm({
      full_name: '',
      role: 'Dentist',
      phone: '',
      email: '',
      salary: '',
      is_active: true,
    });
    setEditingId(null);
    loadList();
  };

  const handleEdit = (s) => {
    setForm({
      full_name: s.full_name || '',
      role: s.role || 'Dentist',
      phone: s.phone || '',
      email: s.email || '',
      salary: s.salary != null ? String(s.salary) : '',
      is_active: s.is_active !== 0,
    });
    setEditingId(s.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    const key = getStoredKey();
    const res = await api(`/api/staff/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) {
        setEditingId(null);
        setForm({
          full_name: '',
          role: 'Dentist',
          phone: '',
          email: '',
          salary: '',
          is_active: true,
        });
      }
      loadList();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <SectionHeader
          title="Staff"
          subtitle="Manage staff: dentists, nurses, receptionists, and admins."
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

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
          {editingId ? 'Edit staff member' : 'Add staff member'}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full name *</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. Dr. James Okello"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role *</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="optional"
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
            <label className="block text-sm font-medium text-gray-400 mb-1">Salary</label>
            <input
              type="number"
              step="any"
              min="0"
              value={form.salary}
              onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="optional"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="staff-active"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="rounded border-white/20 bg-white/5 text-[#7FD856] focus:ring-[#7FD856]"
            />
            <label htmlFor="staff-active" className="text-sm text-gray-400">Active</label>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} staff
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                className="border-white/20"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    full_name: '',
                    role: 'Dentist',
                    phone: '',
                    email: '',
                    salary: '',
                    is_active: true,
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Staff list</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">No staff found.</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center gap-4 p-4 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <User size={16} className="text-[#7FD856]" />
                    {s.full_name}
                  </span>
                  <span className="flex items-center gap-2 text-gray-400">
                    <Briefcase size={16} className="text-[#7FD856]" />
                    {s.role}
                  </span>
                  {s.phone && (
                    <span className="flex items-center gap-2 text-gray-400">
                      <Phone size={16} className="text-[#7FD856]" />
                      {s.phone}
                    </span>
                  )}
                  {s.email && (
                    <span className="flex items-center gap-2 text-gray-400 truncate">
                      <Mail size={16} className="text-[#7FD856] shrink-0" />
                      {s.email}
                    </span>
                  )}
                  {s.salary != null && s.salary !== '' && (
                    <span className="text-gray-400">Salary: {Number(s.salary).toLocaleString()}</span>
                  )}
                </div>
                {s.is_active === 0 && (
                  <span className="text-xs text-amber-400">Inactive</span>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white"
                    onClick={() => handleEdit(s)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(s.id)}
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

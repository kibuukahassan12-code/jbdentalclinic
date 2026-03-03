import React, { useEffect, useState } from 'react';
import { Trash2, Search, RefreshCw } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const STATUS_OPTIONS = ['scheduled', 'confirmed', 'completed', 'cancelled'];

const statusColor = {
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  confirmed: 'bg-[#7FD856]/20 text-[#7FD856] border-[#7FD856]/30',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.getAppointments()
      .then(setAppointments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await adminApi.updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      await adminApi.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    }
  };

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      a.patient_name?.toLowerCase().includes(q) ||
      a.notes?.toLowerCase().includes(q) ||
      a.appointment_date?.includes(q);
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-white">Appointments</h2>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, date, or notes…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7FD856] transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#7FD856] transition-colors"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading && <div className="text-gray-400 text-center py-12">Loading appointments…</div>}
      {error && <div className="text-red-400 text-center py-6">{error}</div>}

      {!loading && !error && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Service / Notes</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-10">
                      No appointments found
                    </td>
                  </tr>
                ) : filtered.map((a, i) => (
                  <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-5 py-3 text-white font-medium">{a.patient_name || '—'}</td>
                    <td className="px-5 py-3 text-gray-300">{a.appointment_date || '—'}</td>
                    <td className="px-5 py-3 text-gray-300">{a.appointment_time || '—'}</td>
                    <td className="px-5 py-3 text-gray-400 max-w-[220px] truncate">{a.notes || '—'}</td>
                    <td className="px-5 py-3">
                      <select
                        value={a.status}
                        disabled={updatingId === a.id}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs border capitalize cursor-pointer bg-transparent focus:outline-none ${statusColor[a.status] || statusColor.scheduled}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#1a1a1a] text-white capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/10 text-gray-500 text-xs">
            Showing {filtered.length} of {appointments.length} appointments
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;

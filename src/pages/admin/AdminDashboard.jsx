import React, { useEffect, useState } from 'react';
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const statusColor = {
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  confirmed: 'bg-[#7FD856]/20 text-[#7FD856] border-[#7FD856]/30',
  completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getAppointments()])
      .then(([s, appts]) => {
        setStats(s);
        setAppointments(appts.slice(0, 8));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading dashboard…</div>;
  if (error) return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 text-center">
      {error} — Make sure the API server is running.
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={stats?.total_patients} color="bg-blue-500/30" />
        <StatCard icon={Calendar} label="Total Appointments" value={stats?.total_appointments} color="bg-purple-500/30" />
        <StatCard icon={Clock} label="Upcoming" value={stats?.upcoming_appointments} color="bg-yellow-500/30" />
        <StatCard icon={CheckCircle} label="Completed" value={stats?.completed_appointments} color="bg-[#7FD856]/30" />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold">Recent Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-left">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Notes</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-10">No appointments yet</td></tr>
              ) : appointments.map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3 text-white font-medium">{a.patient_name || '—'}</td>
                  <td className="px-5 py-3 text-gray-300">{a.appointment_date || '—'}</td>
                  <td className="px-5 py-3 text-gray-300">{a.appointment_time || '—'}</td>
                  <td className="px-5 py-3 text-gray-400 max-w-[200px] truncate">{a.notes || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs border capitalize ${statusColor[a.status] || statusColor.scheduled}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

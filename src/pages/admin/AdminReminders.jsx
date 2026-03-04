import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageSquare, Mail, Smartphone, Play, RefreshCw, CheckCircle, XCircle, Clock, History, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const REMINDER_TYPES = [
  { id: 'thank_you', label: 'Thank You Messages', description: 'Sent after appointment booking', icon: MessageSquare },
  { id: '1day', label: '1-Day Reminders', description: 'Sent 24 hours before appointment', icon: Clock },
  { id: '6h', label: '6-Hour Reminders', description: 'Sent 6 hours before appointment', icon: Bell },
  { id: '1h', label: '1-Hour Reminders', description: 'Sent 1 hour before appointment', icon: AlertCircle },
];

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, color: 'text-green-400', bg: 'bg-green-500/10' },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

export default function AdminReminders({ api, getStoredKey }) {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runningReminder, setRunningReminder] = useState(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        api('/api/communication-logs/stats'),
        api('/api/communication-logs?limit=50'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (e) {
      console.error('Failed to load reminder data:', e);
    }
  }, [api]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const runReminder = async (type) => {
    setRunningReminder(type);
    try {
      const res = await api(`/api/send-reminders/${type}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Reminders Sent',
          description: `Sent: ${data.sent || 0}, Failed: ${data.failed?.length || 0}`,
          variant: 'default',
        });
        loadData();
      } else {
        throw new Error(data.error || 'Failed to send reminders');
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setRunningReminder(null);
    }
  };

  const runAllReminders = async () => {
    setRunningReminder('all');
    try {
      const res = await api('/api/send-reminders', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'All Reminders Processed',
          description: `Total WhatsApp: ${data.total_sent || 0}, Email: ${data.total_email_sent || 0}`,
          variant: 'default',
        });
        loadData();
      } else {
        throw new Error(data.error || 'Failed to process reminders');
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setRunningReminder(null);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'sent' || status === 'success') return <CheckCircle size={14} className="text-green-400" />;
    if (status === 'failed' || status === 'error') return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-yellow-400" />;
  };

  const getChannelIcon = (channel) => {
    if (channel === 'email') return <Mail size={14} className="text-blue-400" />;
    return <Smartphone size={14} className="text-green-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bell className="text-[#7FD856]" size={24} />
            Reminders & Notifications
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage automated patient reminders and view communication history</p>
        </div>
        <Button
          onClick={runAllReminders}
          disabled={runningReminder === 'all'}
          className="bg-[#7FD856] text-black hover:bg-[#6FC745]"
        >
          <Send size={16} className="mr-2" />
          {runningReminder === 'all' ? 'Processing...' : 'Run All Reminders'}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.today}</div>
            <div className="text-sm text-gray-400">Sent Today</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Sent</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">
              {stats.byStatus?.find(s => s.status === 'sent')?.count || 0}
            </div>
            <div className="text-sm text-gray-400">Successful</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400">
              {stats.byStatus?.find(s => s.status === 'failed')?.count || 0}
            </div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        </div>
      )}

      {/* Manual Trigger Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Manual Reminder Triggers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REMINDER_TYPES.map((type) => {
            const Icon = type.icon;
            const isRunning = runningReminder === type.id;
            return (
              <div key={type.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#7FD856]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[#7FD856]" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{type.label}</div>
                    <div className="text-xs text-gray-400">{type.description}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => runReminder(type.id)}
                  disabled={isRunning}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <Play size={14} className="mr-1" />
                  {isRunning ? '...' : 'Run'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Communication History */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <History size={20} className="text-[#7FD856]" />
            Communication History
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="bg-transparent border-white/20 text-gray-300 hover:bg-white/5"
          >
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Patient</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Channel</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No communication logs yet
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(log.sent_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white">{log.patient_name || '-'}</td>
                    <td className="py-3 px-4 text-gray-300 capitalize">{log.type?.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4">{getChannelIcon(log.channel)}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(log.status)}
                        <span className={log.status === 'sent' || log.status === 'success' ? 'text-green-400' : log.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}>
                          {log.status}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { History, Filter, RefreshCw, User, FileText, Plus, Edit2, Trash2, Eye, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ENTITY_ICONS = {
  patient: User,
  appointment: FileText,
  treatment: Activity,
  invoice: FileText,
  payment: FileText,
  user: User,
  staff: User,
};

const ACTION_COLORS = {
  CREATE: 'text-green-400 bg-green-500/10',
  UPDATE: 'text-blue-400 bg-blue-500/10',
  DELETE: 'text-red-400 bg-red-500/10',
  VIEW: 'text-gray-400 bg-gray-500/10',
  LOGIN: 'text-yellow-400 bg-yellow-500/10',
};

const ENTITY_TYPES = [
  { id: '', label: 'All Entities' },
  { id: 'patient', label: 'Patients' },
  { id: 'appointment', label: 'Appointments' },
  { id: 'treatment', label: 'Treatments' },
  { id: 'invoice', label: 'Invoices' },
  { id: 'payment', label: 'Payments' },
  { id: 'user', label: 'Users' },
  { id: 'staff', label: 'Staff' },
];

const ACTION_TYPES = [
  { id: '', label: 'All Actions' },
  { id: 'CREATE', label: 'Create' },
  { id: 'UPDATE', label: 'Update' },
  { id: 'DELETE', label: 'Delete' },
  { id: 'VIEW', label: 'View' },
  { id: 'LOGIN', label: 'Login' },
];

export default function AdminAuditLog({ api, getStoredKey }) {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ entity_type: '', action: '' });
  const [expandedLog, setExpandedLog] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.entity_type) queryParams.append('entity_type', filters.entity_type);
      if (filters.action) queryParams.append('action', filters.action);
      
      const [logsRes, statsRes] = await Promise.all([
        api(`/api/audit-logs?${queryParams.toString()}`),
        api('/api/audit-logs/stats'),
      ]);
      
      if (logsRes.ok) setLogs(await logsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getEntityIcon = (entityType) => {
    const Icon = ENTITY_ICONS[entityType] || FileText;
    return <Icon size={14} />;
  };

  const formatValue = (value) => {
    if (!value) return '-';
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(value);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FD856]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <History className="text-[#7FD856]" size={24} />
            Audit Log
          </h2>
          <p className="text-gray-400 text-sm mt-1">Track all system activities and changes</p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          className="bg-transparent border-white/20 text-gray-300 hover:bg-white/5"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.today}</div>
            <div className="text-sm text-gray-400">Today</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Events</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">
              {stats.byAction?.find(s => s.action === 'UPDATE')?.count || 0}
            </div>
            <div className="text-sm text-gray-400">Updates</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">
              {stats.byAction?.find(s => s.action === 'CREATE')?.count || 0}
            </div>
            <div className="text-sm text-gray-400">Creations</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Filters:</span>
        </div>
        <select
          value={filters.entity_type}
          onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })}
          className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50"
        >
          {ENTITY_TYPES.map((t) => (
            <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.label}</option>
          ))}
        </select>
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50"
        >
          {ACTION_TYPES.map((t) => (
            <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.label}</option>
          ))}
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Entity</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No audit logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedLog === log.id;
                const actionColor = ACTION_COLORS[log.action] || ACTION_COLORS.VIEW;
                
                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                      onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    >
                      <td className="py-3 px-4 text-gray-300 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-white">{log.user_email || 'System'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${actionColor}`}>
                          {log.action === 'CREATE' && <Plus size={12} />}
                          {log.action === 'UPDATE' && <Edit2 size={12} />}
                          {log.action === 'DELETE' && <Trash2 size={12} />}
                          {log.action === 'VIEW' && <Eye size={12} />}
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 text-gray-300">
                          {getEntityIcon(log.entity_type)}
                          <span className="capitalize">{log.entity_type}</span>
                          {log.entity_id && <span className="text-gray-500">#{log.entity_id}</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isExpanded ? <ChevronUp size={16} className="inline text-gray-400" /> : <ChevronDown size={16} className="inline text-gray-400" />}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-4 py-4 bg-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.old_values && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Old Values</div>
                                <pre className="text-xs text-gray-300 bg-black/20 rounded-lg p-3 overflow-auto max-h-40">
                                  {formatValue(log.old_values)}
                                </pre>
                              </div>
                            )}
                            {log.new_values && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">New Values</div>
                                <pre className="text-xs text-gray-300 bg-black/20 rounded-lg p-3 overflow-auto max-h-40">
                                  {formatValue(log.new_values)}
                                </pre>
                              </div>
                            )}
                            {!log.old_values && !log.new_values && (
                              <div className="text-gray-500 italic">No additional data</div>
                            )}
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            IP: {log.ip_address || 'N/A'} | User Agent: {log.user_agent ? log.user_agent.substring(0, 50) + '...' : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

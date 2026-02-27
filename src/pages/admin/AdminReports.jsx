import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertCircle, Database, Calendar, Scale, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';
import { generateReportPdf } from '@/lib/pdf-generator';

export default function AdminReports({ api, getStoredKey }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [expensesTotal, setExpensesTotal] = useState(0);

  const formatMoney = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const loadDashboard = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      const res = await api('/api/reports/dashboard');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) setError('Invalid API key.');
        else setError(err.error || res.statusText);
        setData(null);
        return;
      }
      const json = await res.json();
      setData(json);

      // Load expenses for simple total card
      const expRes = await api('/api/reports/expenses?limit=1000');
      if (expRes.ok) {
        const exps = await expRes.json();
        setExpensesTotal(exps.reduce((sum, e) => sum + e.amount, 0));
      }
    } catch (e) {
      setError(e.message || 'Failed to load reports');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLoadSampleData = async () => {
    const key = getStoredKey();
    if (!key) return;
    setSeedLoading(true);
    setSeedMessage('');
    try {
      const res = await api('/api/seed/sample', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setSeedMessage(json.skipped ? 'Sample data already loaded.' : 'Ugandan sample data loaded successfully.');
        loadDashboard();
      } else {
        setSeedMessage(json.error || 'Failed to load sample data.');
      }
    } catch (e) {
      setSeedMessage(e.message || 'Request failed.');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!data) return;
    const columns = [
      { key: 'invoice_id', label: 'Invoice #', render: (r) => `#${r.invoice_id}` },
      { key: 'patient_id', label: 'Patient ID' },
      { key: 'total', label: 'Total (UGX)', align: 'right', render: (r) => `UGX ${formatMoney(r.total)}` },
      { key: 'paid', label: 'Paid (UGX)', align: 'right', render: (r) => `UGX ${formatMoney(r.paid)}` },
      { key: 'balance', label: 'Balance (UGX)', align: 'right', render: (r) => `UGX ${formatMoney(r.balance)}` },
    ];
    const summary = [
      { label: 'Daily Revenue', value: `UGX ${formatMoney(data.daily_revenue)}`, color: '#0F0F0F', bg: '#f0fdf4', border: '#7FD856' },
      { label: 'Monthly Revenue', value: `UGX ${formatMoney(data.monthly_revenue)}`, color: '#0F0F0F', bg: '#f0fdf4', border: '#7FD856' },
      { label: 'Total Expenses', value: `UGX ${formatMoney(expensesTotal)}`, color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
      { label: 'Outstanding', value: `UGX ${formatMoney(data.total_outstanding)}`, color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
    ];
    await generateReportPdf({
      title: 'Revenue & Outstanding Report',
      period: `As of ${data.as_of} — Month: ${data.month}`,
      data: data.outstanding_balances || [],
      columns,
      summary,
    });
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-400">Loading dashboard report...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!data) return <p className="text-gray-400">No data available.</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeader
          title="Revenue Reports"
          subtitle="A high-level overview of clinic earnings and outstanding payments."
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-[#7FD856]/40 text-[#7FD856] hover:bg-[#7FD856]/10"
            onClick={handleDownloadReport}
            disabled={!data}
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-[#7FD856]/40 text-[#7FD856] hover:bg-[#7FD856]/10"
            onClick={handleLoadSampleData}
            disabled={seedLoading}
          >
            <Database size={16} className="mr-2" />
            {seedLoading ? 'Loading…' : 'Seed Sample Data'}
          </Button>
        </div>
      </div>

      {seedMessage && (
        <p className={`text-sm ${seedMessage.includes('Failed') ? 'text-red-400' : 'text-[#7FD856]'}`}>
          {seedMessage}
        </p>
      )}

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2">
            <Calendar size={14} className="text-[#7FD856]" />
            Daily Revenue
          </div>
          <p className="text-2xl font-bold text-white">{formatMoney(data.daily_revenue)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Today ({data.as_of})</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2">
            <TrendingUp size={14} className="text-[#7FD856]" />
            Monthly Revenue
          </div>
          <p className="text-2xl font-bold text-white">{formatMoney(data.monthly_revenue)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Month of {data.month}</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2">
            <Scale size={14} className="text-red-400" />
            Total Expenses
          </div>
          <p className="text-2xl font-bold text-white">{formatMoney(expensesTotal)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Historical total</p>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-2">
            <AlertCircle size={14} className="text-amber-400" />
            Outstanding
          </div>
          <p className="text-2xl font-bold text-white">{formatMoney(data.total_outstanding)}</p>
          <p className="text-[10px] text-gray-500 mt-1">Unpaid invoices total</p>
        </div>
      </motion.div>

      {/* Outstanding Table */}
      {data.outstanding_balances && data.outstanding_balances.length > 0 && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-[#7FD856]" />
            Outstanding Balances Detail
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="pb-3 pr-4 font-medium uppercase">Invoice #</th>
                  <th className="pb-3 pr-4 font-medium uppercase">Patient</th>
                  <th className="pb-3 pr-4 font-medium uppercase">Total</th>
                  <th className="pb-3 pr-4 font-medium uppercase">Paid</th>
                  <th className="pb-3 font-medium uppercase">Pending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.outstanding_balances.map((row) => (
                  <tr key={row.invoice_id} className="text-gray-300 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 font-medium text-white">#{row.invoice_id}</td>
                    <td className="py-3 pr-4">Patient ID: {row.patient_id}</td>
                    <td className="py-3 pr-4">{formatMoney(row.total)}</td>
                    <td className="py-3 pr-4 text-[#7FD856]">{formatMoney(row.paid)}</td>
                    <td className="py-3 font-bold text-amber-500">{formatMoney(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-[#7FD856]/5 border border-[#7FD856]/20">
        <p className="text-gray-300 text-sm">
          💡 For detailed expense management and comprehensive daily/weekly/monthly balance sheets, please visit the
          <span className="text-[#7FD856] font-bold mx-1">Finances</span> tab.
        </p>
      </div>
    </div>
  );
}

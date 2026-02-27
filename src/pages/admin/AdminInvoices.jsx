import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit2, Trash2, X, Search, CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateInvoicePdf } from '@/lib/pdf-generator';

const STATUS_COLORS = {
  Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  'Partially Paid': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
  Cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const STATUSES = ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled'];

const fmt = (n) => Number(n || 0).toLocaleString();

export default function AdminInvoices({ api, getStoredKey }) {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({ patient_id: '', total_amount: '', discount: '0', tax: '0', status: 'Pending' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, patRes] = await Promise.all([
        api('/api/invoices?limit=500'),
        api('/api/patients?limit=500'),
      ]);
      if (invRes.ok) setInvoices(await invRes.json());
      if (patRes.ok) setPatients(await patRes.json());
    } catch (_) {}
    setLoading(false);
  }, [api]);

  useEffect(() => { loadData(); }, [loadData]);

  const getPatientName = (pid) => patients.find(p => p.id === pid)?.full_name || `Patient #${pid}`;

  const getNetTotal = (inv) => (Number(inv.total_amount) || 0) - (Number(inv.discount) || 0) + (Number(inv.tax) || 0);

  const openCreate = () => {
    setEditing(null);
    setForm({ patient_id: '', total_amount: '', discount: '0', tax: '0', status: 'Pending' });
    setShowForm(true);
    setError('');
  };

  const openEdit = (inv) => {
    setEditing(inv);
    setForm({
      patient_id: inv.patient_id || '',
      total_amount: inv.total_amount || '',
      discount: inv.discount || '0',
      tax: inv.tax || '0',
      status: inv.status || 'Pending',
    });
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.patient_id || !form.total_amount) { setError('Patient and amount are required'); return; }
    setSaving(true);
    setError('');
    try {
      const body = {
        patient_id: Number(form.patient_id),
        total_amount: Number(form.total_amount),
        discount: Number(form.discount) || 0,
        tax: Number(form.tax) || 0,
        status: form.status,
      };
      const url = editing ? `/api/invoices/${editing.id}` : '/api/invoices';
      const method = editing ? 'PUT' : 'POST';
      const res = await api(url, { method, body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        await loadData();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to save');
      }
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      const res = await api(`/api/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) await loadData();
      else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Delete failed');
      }
    } catch (_) {}
  };

  const handleDownloadPdf = async (inv) => {
    const patient = patients.find(p => p.id === inv.patient_id);
    let payments = [];
    let treatments = [];
    try {
      const [payRes, treatRes] = await Promise.all([
        api(`/api/payments?invoice_id=${inv.id}`),
        api(`/api/treatments?patient_id=${inv.patient_id}`),
      ]);
      if (payRes.ok) payments = await payRes.json();
      if (treatRes.ok) treatments = await treatRes.json();
    } catch (_) {}
    await generateInvoicePdf({ invoice: inv, patient, payments, treatments });
  };

  const filtered = invoices.filter(inv => {
    const name = getPatientName(inv.patient_id).toLowerCase();
    const matchName = !filter || name.includes(filter.toLowerCase()) || String(inv.id).includes(filter);
    const matchStatus = !statusFilter || inv.status === statusFilter;
    return matchName && matchStatus;
  });

  const totals = {
    total: filtered.reduce((s, i) => s + getNetTotal(i), 0),
    paid: filtered.filter(i => i.status === 'Paid').reduce((s, i) => s + getNetTotal(i), 0),
    pending: filtered.filter(i => i.status === 'Pending' || i.status === 'Partially Paid' || i.status === 'Overdue').reduce((s, i) => s + getNetTotal(i), 0),
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#7FD856] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Invoiced</p>
          <p className="text-2xl font-bold text-white">UGX {fmt(totals.total)}</p>
        </div>
        <div className="rounded-xl bg-green-500/5 border border-green-500/20 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-400">UGX {fmt(totals.paid)}</p>
        </div>
        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-yellow-400">UGX {fmt(totals.pending)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by patient or INV #..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#7FD856]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#7FD856] [color-scheme:dark]"
          >
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Button onClick={openCreate} className="bg-[#7FD856] text-black hover:bg-[#6FC745] rounded-xl font-medium">
          <Plus size={16} className="mr-1" /> New Invoice
        </Button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/5 border border-[#7FD856]/20 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{editing ? `Edit Invoice #${editing.id}` : 'Create Invoice'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          {error && <p className="text-red-400 text-sm mb-3 p-2 bg-red-500/10 rounded-lg">{error}</p>}
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Patient *</label>
              <select required value={form.patient_id} onChange={e => setForm(f => ({ ...f, patient_id: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856] [color-scheme:dark]">
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Total Amount (UGX) *</label>
              <input required type="number" min="0" value={form.total_amount} onChange={e => setForm(f => ({ ...f, total_amount: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856]" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Discount (UGX)</label>
              <input type="number" min="0" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856]" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tax (UGX)</label>
              <input type="number" min="0" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856]" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856] [color-scheme:dark]">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={saving} className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] rounded-xl font-medium py-2.5">
                {saving ? 'Saving...' : editing ? 'Update Invoice' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Invoice list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No invoices found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inv => {
            const net = getNetTotal(inv);
            const paid = Number(inv.total_paid) || 0;
            const balance = net - paid;
            return (
              <motion.div key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="group rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/[0.07] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold">INV-{inv.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[inv.status] || STATUS_COLORS.Pending}`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{getPatientName(inv.patient_id)}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-GB') : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold">UGX {fmt(net)}</p>
                    {paid > 0 && <p className="text-xs text-green-400">Paid: UGX {fmt(paid)}</p>}
                    {balance > 0 && inv.status !== 'Cancelled' && <p className="text-xs text-yellow-400">Due: UGX {fmt(balance)}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDownloadPdf(inv)} className="p-2 rounded-lg hover:bg-[#7FD856]/10 text-gray-400 hover:text-[#7FD856]" title="Download PDF">
                      <Download size={15} />
                    </button>
                    <button onClick={() => openEdit(inv)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white" title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(inv.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

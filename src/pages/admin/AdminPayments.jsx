import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, X, Search, Banknote, Smartphone, Building2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateReceiptPdf } from '@/lib/pdf-generator';

const METHODS = ['Cash', 'Mobile Money', 'Bank'];
const METHOD_ICONS = { Cash: Banknote, 'Mobile Money': Smartphone, Bank: Building2 };

const fmt = (n) => Number(n || 0).toLocaleString();

export default function AdminPayments({ api, getStoredKey }) {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [form, setForm] = useState({ invoice_id: '', amount: '', payment_method: 'Cash', paid_at: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [payRes, invRes, patRes] = await Promise.all([
        api('/api/payments?limit=500'),
        api('/api/invoices?limit=500'),
        api('/api/patients?limit=500'),
      ]);
      if (payRes.ok) setPayments(await payRes.json());
      if (invRes.ok) setInvoices(await invRes.json());
      if (patRes.ok) setPatients(await patRes.json());
    } catch (_) {}
    setLoading(false);
  }, [api]);

  useEffect(() => { loadData(); }, [loadData]);

  const getInvoiceLabel = (iid) => {
    const inv = invoices.find(i => i.id === iid);
    if (!inv) return `INV-${iid}`;
    const pat = patients.find(p => p.id === inv.patient_id);
    return `INV-${inv.id} — ${pat?.full_name || 'Unknown'}`;
  };

  const getPatientForPayment = (pay) => {
    const inv = invoices.find(i => i.id === pay.invoice_id);
    if (!inv) return 'Unknown';
    return patients.find(p => p.id === inv.patient_id)?.full_name || `Patient #${inv.patient_id}`;
  };

  const openCreate = () => {
    setForm({ invoice_id: '', amount: '', payment_method: 'Cash', paid_at: new Date().toISOString().slice(0, 10) });
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.invoice_id || !form.amount) { setError('Invoice and amount are required'); return; }
    if (Number(form.amount) <= 0) { setError('Amount must be positive'); return; }
    setSaving(true);
    setError('');
    try {
      const body = {
        invoice_id: Number(form.invoice_id),
        amount: Number(form.amount),
        payment_method: form.payment_method,
        paid_at: form.paid_at || undefined,
      };
      const res = await api('/api/payments', { method: 'POST', body: JSON.stringify(body) });
      if (res.ok) {
        setShowForm(false);
        const newPayment = await res.json();
        await loadData();
        // Auto-generate receipt PDF
        try {
          const payId = newPayment.id || newPayment.lastInsertRowid;
          if (payId) {
            const payData = { id: payId, ...body };
            const inv = invoices.find(i => i.id === Number(body.invoice_id));
            const pat = inv ? patients.find(p => p.id === inv.patient_id) : null;
            let allPay = [];
            try {
              const apRes = await api(`/api/payments?invoice_id=${body.invoice_id}`);
              if (apRes.ok) allPay = await apRes.json();
            } catch (_) {}
            await generateReceiptPdf({ payment: payData, invoice: inv, patient: pat, allPayments: allPay });
          }
        } catch (_) {}
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to save');
      }
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    try {
      const res = await api(`/api/payments/${id}`, { method: 'DELETE' });
      if (res.ok) await loadData();
    } catch (_) {}
  };

  const handleDownloadReceipt = async (pay) => {
    const inv = invoices.find(i => i.id === pay.invoice_id);
    const pat = inv ? patients.find(p => p.id === inv.patient_id) : null;
    let allPay = [];
    try {
      const apRes = await api(`/api/payments?invoice_id=${pay.invoice_id}`);
      if (apRes.ok) allPay = await apRes.json();
    } catch (_) {}
    await generateReceiptPdf({ payment: pay, invoice: inv, patient: pat, allPayments: allPay });
  };

  const filtered = payments.filter(pay => {
    const patName = getPatientForPayment(pay).toLowerCase();
    const matchSearch = !filter || patName.includes(filter.toLowerCase()) || String(pay.invoice_id).includes(filter) || String(pay.id).includes(filter);
    const matchMethod = !methodFilter || pay.payment_method === methodFilter;
    return matchSearch && matchMethod;
  });

  const totalReceived = filtered.reduce((s, p) => s + Number(p.amount || 0), 0);
  const byMethod = METHODS.map(m => ({
    method: m,
    total: filtered.filter(p => p.payment_method === m).reduce((s, p) => s + Number(p.amount || 0), 0),
    count: filtered.filter(p => p.payment_method === m).length,
  }));

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#7FD856] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[#7FD856]/5 border border-[#7FD856]/20 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Received</p>
          <p className="text-2xl font-bold text-[#7FD856]">UGX {fmt(totalReceived)}</p>
          <p className="text-xs text-gray-500 mt-1">{filtered.length} payments</p>
        </div>
        {byMethod.map(({ method, total, count }) => {
          const Icon = METHOD_ICONS[method] || CreditCard;
          return (
            <div key={method} className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="text-gray-500" />
                <p className="text-xs text-gray-500 uppercase tracking-wider">{method}</p>
              </div>
              <p className="text-xl font-bold text-white">UGX {fmt(total)}</p>
              <p className="text-xs text-gray-500 mt-1">{count} payments</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search by patient or invoice..." value={filter} onChange={e => setFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#7FD856]" />
          </div>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#7FD856] [color-scheme:dark]">
            <option value="">All Methods</option>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <Button onClick={openCreate} className="bg-[#7FD856] text-black hover:bg-[#6FC745] rounded-xl font-medium">
          <Plus size={16} className="mr-1" /> Record Payment
        </Button>
      </div>

      {/* Payment Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/5 border border-[#7FD856]/20 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Record Payment</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          {error && <p className="text-red-400 text-sm mb-3 p-2 bg-red-500/10 rounded-lg">{error}</p>}
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Invoice *</label>
              <select required value={form.invoice_id} onChange={e => setForm(f => ({ ...f, invoice_id: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856] [color-scheme:dark]">
                <option value="">Select invoice</option>
                {invoices.filter(i => i.status !== 'Cancelled' && i.status !== 'Paid').map(inv => {
                  const pat = patients.find(p => p.id === inv.patient_id);
                  const net = (Number(inv.total_amount) || 0) - (Number(inv.discount) || 0) + (Number(inv.tax) || 0);
                  return <option key={inv.id} value={inv.id}>INV-{inv.id} — {pat?.full_name || 'Unknown'} — UGX {fmt(net)} ({inv.status})</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount (UGX) *</label>
              <input required type="number" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856]" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
              <select value={form.payment_method} onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856] [color-scheme:dark]">
                {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Payment Date</label>
              <input type="date" value={form.paid_at} onChange={e => setForm(f => ({ ...f, paid_at: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#7FD856] [color-scheme:dark]" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={saving} className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] rounded-xl font-medium py-2.5">
                {saving ? 'Saving...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Payment list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No payments found.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(pay => {
            const Icon = METHOD_ICONS[pay.payment_method] || CreditCard;
            return (
              <motion.div key={pay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="group rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/[0.07] transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#7FD856]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-[#7FD856]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{getPatientForPayment(pay)}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">INV-{pay.invoice_id}</span>
                        <span className="text-xs text-gray-600">|</span>
                        <span className="text-xs text-gray-500">{pay.payment_method}</span>
                        <span className="text-xs text-gray-600">|</span>
                        <span className="text-xs text-gray-500">{pay.paid_at ? new Date(pay.paid_at).toLocaleDateString('en-GB') : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#7FD856] font-bold text-sm whitespace-nowrap">+UGX {fmt(pay.amount)}</span>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleDownloadReceipt(pay)}
                        className="p-2 rounded-lg hover:bg-[#7FD856]/10 text-gray-600 hover:text-[#7FD856]" title="Download Receipt">
                        <Download size={15} />
                      </button>
                      <button onClick={() => handleDelete(pay.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
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

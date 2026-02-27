import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scale, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, BookOpen, ArrowUpRight, ArrowDownRight, Download, X, Banknote, Smartphone, Building2, CreditCard, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateReportPdf } from '@/lib/pdf-generator';

const fmt = (n) => Number(n || 0).toLocaleString();
const EXPENSE_CATEGORIES = ['General', 'Rent', 'Utilities', 'Salaries', 'Supplies', 'Equipment', 'Marketing', 'Maintenance', 'Transport', 'Other'];
const METHOD_ICONS = { Cash: Banknote, 'Mobile Money': Smartphone, Bank: Building2 };

export default function AdminFinances({ api, getStoredKey }) {
    const [cashbook, setCashbook] = useState({ entries: [], summary: { total_income: 0, total_expenses: 0, net_balance: 0 } });
    const [expenses, setExpenses] = useState([]);
    const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', category: 'General', date: new Date().toISOString().slice(0, 10) });
    const [expenseLoading, setExpenseLoading] = useState(false);
    const [cbLoading, setCbLoading] = useState(false);
    const [plData, setPlData] = useState(null);
    const [plLoading, setPlLoading] = useState(false);
    const [activeView, setActiveView] = useState('balance-sheet');
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date(); d.setDate(1);
        return d.toISOString().slice(0, 10);
    });
    const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
    const [showExpenseForm, setShowExpenseForm] = useState(false);

    const loadProfitLoss = useCallback(async () => {
        setPlLoading(true);
        try {
            const res = await api(`/api/reports/profit-loss?from_date=${dateFrom}&to_date=${dateTo}`);
            if (res.ok) setPlData(await res.json());
        } catch (_) {} finally { setPlLoading(false); }
    }, [api, dateFrom, dateTo]);

    const loadCashbook = useCallback(async () => {
        setCbLoading(true);
        try {
            const res = await api(`/api/reports/cashbook?from_date=${dateFrom}&to_date=${dateTo}&limit=500`);
            if (res.ok) setCashbook(await res.json());
        } catch (_) {} finally { setCbLoading(false); }
    }, [api, dateFrom, dateTo]);

    const loadExpenses = useCallback(async () => {
        try {
            const res = await api('/api/reports/expenses?limit=200');
            if (res.ok) setExpenses(await res.json());
        } catch (_) {}
    }, [api]);

    useEffect(() => { loadProfitLoss(); loadCashbook(); loadExpenses(); }, [loadProfitLoss, loadCashbook, loadExpenses]);

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        if (!expenseForm.amount || !expenseForm.description) return;
        setExpenseLoading(true);
        try {
            const res = await api('/api/reports/expenses', { method: 'POST', body: JSON.stringify(expenseForm) });
            if (res.ok) {
                setExpenseForm({ description: '', amount: '', category: 'General', date: new Date().toISOString().slice(0, 10) });
                setShowExpenseForm(false);
                await Promise.all([loadExpenses(), loadCashbook(), loadProfitLoss()]);
            }
        } catch (_) {} finally { setExpenseLoading(false); }
    };

    const handleDeleteExpense = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            const res = await api(`/api/reports/expenses/${id}`, { method: 'DELETE' });
            if (res.ok) await Promise.all([loadExpenses(), loadCashbook(), loadProfitLoss()]);
        } catch (_) {}
    };

    // Running balance for cashbook
    const cashbookWithBalance = (() => {
        const sorted = [...(cashbook.entries || [])].sort((a, b) => a.date?.localeCompare(b.date));
        let running = 0;
        const withBal = sorted.map(entry => {
            running += entry.type === 'income' ? Number(entry.amount) : -Number(entry.amount);
            return { ...entry, running_balance: running };
        });
        return withBal.reverse();
    })();

    const { summary } = cashbook;

    const handleDownloadCashbook = async () => {
        const columns = [
            { key: 'date', label: 'Date', render: (r) => r.date ? new Date(r.date).toLocaleDateString('en-GB') : '\u2014' },
            { key: 'description', label: 'Description' },
            { key: 'reference', label: 'Ref' },
            { key: 'method', label: 'Method' },
            { key: 'income', label: 'Income (UGX)', align: 'right', render: (r) => r.type === 'income' ? `UGX ${fmt(r.amount)}` : '' },
            { key: 'expense', label: 'Expense (UGX)', align: 'right', render: (r) => r.type === 'expense' ? `UGX ${fmt(r.amount)}` : '' },
        ];
        const summaryCards = [
            { label: 'Total Income', value: `UGX ${fmt(summary.total_income)}`, color: '#15803d', bg: '#f0fdf4', border: '#7FD856' },
            { label: 'Total Expenses', value: `UGX ${fmt(summary.total_expenses)}`, color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
            { label: 'Net Balance', value: `UGX ${fmt(summary.net_balance)}`, color: summary.net_balance >= 0 ? '#15803d' : '#dc2626', bg: summary.net_balance >= 0 ? '#f0fdf4' : '#fef2f2', border: summary.net_balance >= 0 ? '#7FD856' : '#fca5a5' },
        ];
        await generateReportPdf({ title: 'Cashbook Report', period: `${dateFrom} to ${dateTo}`, data: cashbook.entries || [], columns, summary: summaryCards });
    };

    const handleDownloadBalanceSheet = async () => {
        if (!plData) return;
        const incomeRows = (plData.income?.by_method || []).map(m => ({ label: `Payments (${m.label})`, amount: m.amount, count: m.count, type: 'income' }));
        const expenseRows = (plData.expenses?.by_category || []).map(c => ({ label: c.label, amount: c.amount, count: c.count, type: 'expense' }));
        const allRows = [...incomeRows, ...expenseRows];
        const columns = [
            { key: 'label', label: 'Category' },
            { key: 'type', label: 'Type', render: (r) => r.type === 'income' ? 'Income' : 'Expense' },
            { key: 'count', label: 'Transactions', align: 'center' },
            { key: 'amount', label: 'Amount (UGX)', align: 'right', render: (r) => `UGX ${fmt(r.amount)}` },
        ];
        const summaryCards = [
            { label: 'Gross Income', value: `UGX ${fmt(plData.gross_income)}`, color: '#15803d', bg: '#f0fdf4', border: '#7FD856' },
            { label: 'Total Expenses', value: `UGX ${fmt(plData.total_expenses)}`, color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
            { label: 'Net Profit', value: `UGX ${fmt(plData.net_profit)}`, color: plData.net_profit >= 0 ? '#15803d' : '#dc2626', bg: plData.net_profit >= 0 ? '#f0fdf4' : '#fef2f2', border: plData.net_profit >= 0 ? '#7FD856' : '#fca5a5' },
        ];
        await generateReportPdf({ title: 'Profit & Loss Statement', period: `${dateFrom} to ${dateTo}`, data: allRows, columns, summary: summaryCards });
    };

    return (
        <div className="space-y-6">
            {/* Date Range + Record Expense — always visible */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    <Calendar size={16} className="text-gray-500" />
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7FD856] [color-scheme:dark]" />
                    <span className="text-gray-500 text-sm">to</span>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7FD856] [color-scheme:dark]" />
                </div>
                <Button onClick={() => setShowExpenseForm(!showExpenseForm)} className="bg-red-500 text-white hover:bg-red-600 rounded-xl font-medium">
                    <Plus size={16} className="mr-1" /> Record Expense
                </Button>
            </div>

            {/* Expense form */}
            {showExpenseForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/5 border border-red-500/20 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ArrowDownRight size={18} className="text-red-400" /> Record New Expense
                        </h3>
                        <button onClick={() => setShowExpenseForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm text-gray-400 mb-1">Description *</label>
                            <input required type="text" value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-400" placeholder="e.g. Office Rent" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Amount (UGX) *</label>
                            <input required type="number" min="1" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value ? Number(e.target.value) : '' }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-400" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Category</label>
                            <select value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-400 [color-scheme:dark]">
                                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Date *</label>
                            <input required type="date" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-red-400 [color-scheme:dark]" />
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" disabled={expenseLoading} className="w-full bg-red-500 text-white hover:bg-red-600 font-bold py-2.5 rounded-xl">
                                {expenseLoading ? 'Saving...' : 'Add Expense'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* View Toggle: Balance Sheet / Cashbook / Expenses */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex gap-1 bg-black/40 p-1 rounded-xl w-fit">
                    <button onClick={() => setActiveView('balance-sheet')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeView === 'balance-sheet' ? 'bg-[#7FD856] text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <BarChart3 size={14} /> Balance Sheet
                    </button>
                    <button onClick={() => setActiveView('cashbook')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeView === 'cashbook' ? 'bg-[#7FD856] text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <BookOpen size={14} /> Cashbook
                    </button>
                    <button onClick={() => setActiveView('expenses')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${activeView === 'expenses' ? 'bg-[#7FD856] text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <TrendingDown size={14} /> Expenses
                    </button>
                </div>
                <div className="flex gap-2">
                    {activeView === 'cashbook' && (
                        <Button onClick={handleDownloadCashbook} variant="outline" className="border-[#7FD856]/40 text-[#7FD856] hover:bg-[#7FD856]/10 rounded-xl font-medium">
                            <Download size={16} className="mr-1" /> Download PDF
                        </Button>
                    )}
                    {activeView === 'balance-sheet' && plData && (
                        <Button onClick={handleDownloadBalanceSheet} variant="outline" className="border-[#7FD856]/40 text-[#7FD856] hover:bg-[#7FD856]/10 rounded-xl font-medium">
                            <Download size={16} className="mr-1" /> Download PDF
                        </Button>
                    )}
                </div>
            </div>

            {/* ════════════ BALANCE SHEET VIEW ════════════ */}
            {activeView === 'balance-sheet' && (
                <div className="space-y-6">
                    {plLoading ? (
                        <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7FD856]" /></div>
                    ) : plData ? (
                        <>
                            {/* Gross / Expenses / Net Profit cards */}
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="rounded-2xl bg-green-500/5 border border-green-500/20 p-6 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <ArrowUpRight size={18} className="text-green-400" />
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Gross Income</p>
                                    </div>
                                    <p className="text-3xl font-bold text-green-400">UGX {fmt(plData.gross_income)}</p>
                                    <p className="text-[10px] text-gray-500 mt-2">All payments received</p>
                                </div>
                                <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-6 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <ArrowDownRight size={18} className="text-red-400" />
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Expenses</p>
                                    </div>
                                    <p className="text-3xl font-bold text-red-400">UGX {fmt(plData.total_expenses)}</p>
                                    <p className="text-[10px] text-gray-500 mt-2">All expenditures</p>
                                </div>
                                <div className={`rounded-2xl border p-6 text-center ${plData.net_profit >= 0 ? 'bg-[#7FD856]/5 border-[#7FD856]/30' : 'bg-red-500/5 border-red-500/30'}`}>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <DollarSign size={18} className={plData.net_profit >= 0 ? 'text-[#7FD856]' : 'text-red-400'} />
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Net Profit</p>
                                    </div>
                                    <p className={`text-3xl font-bold ${plData.net_profit >= 0 ? 'text-[#7FD856]' : 'text-red-400'}`}>
                                        UGX {fmt(plData.net_profit)}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-2">Income minus Expenses</p>
                                </div>
                            </motion.div>

                            {/* Income & Expense Breakdown side-by-side */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* INCOME BREAKDOWN */}
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                        <TrendingUp size={18} className="text-green-400" /> Income Breakdown
                                        <span className="text-xs text-gray-500 font-normal ml-auto">Payments = Income</span>
                                    </h3>
                                    {(plData.income?.by_method || []).length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-6">No income recorded in this period.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {plData.income.by_method.map((m) => {
                                                const Icon = METHOD_ICONS[m.label] || CreditCard;
                                                const pct = plData.gross_income > 0 ? ((m.amount / plData.gross_income) * 100).toFixed(1) : 0;
                                                return (
                                                    <div key={m.label} className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                            <Icon size={16} className="text-green-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-baseline mb-1">
                                                                <span className="text-white text-sm font-medium">{m.label}</span>
                                                                <span className="text-green-400 font-bold text-sm">UGX {fmt(m.amount)}</span>
                                                            </div>
                                                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                                                <div className="bg-green-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <div className="flex justify-between mt-1">
                                                                <span className="text-[10px] text-gray-500">{m.count} payments</span>
                                                                <span className="text-[10px] text-gray-500">{pct}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-baseline">
                                                <span className="text-gray-400 text-sm font-semibold">Total Income</span>
                                                <span className="text-green-400 font-bold">UGX {fmt(plData.gross_income)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent income entries */}
                                    {(plData.income?.recent || []).length > 0 && (
                                        <div className="mt-5 pt-4 border-t border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Recent Payments (Income)</p>
                                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                                {plData.income.recent.slice(0, 10).map((p) => (
                                                    <div key={p.id} className="flex justify-between items-center text-xs py-1.5">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <ArrowUpRight size={11} className="text-green-400 flex-shrink-0" />
                                                            <span className="text-gray-300 truncate">{p.patient_name}</span>
                                                            <span className="text-gray-600">{p.reference}</span>
                                                        </div>
                                                        <span className="text-green-400 font-medium whitespace-nowrap ml-2">+UGX {fmt(p.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* EXPENSE BREAKDOWN */}
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                        <TrendingDown size={18} className="text-red-400" /> Expense Breakdown
                                        <span className="text-xs text-gray-500 font-normal ml-auto">By Category</span>
                                    </h3>
                                    {(plData.expenses?.by_category || []).length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-6">No expenses recorded in this period.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {plData.expenses.by_category.map((c) => {
                                                const pct = plData.total_expenses > 0 ? ((c.amount / plData.total_expenses) * 100).toFixed(1) : 0;
                                                return (
                                                    <div key={c.label} className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                                            <ArrowDownRight size={16} className="text-red-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-baseline mb-1">
                                                                <span className="text-white text-sm font-medium">{c.label}</span>
                                                                <span className="text-red-400 font-bold text-sm">UGX {fmt(c.amount)}</span>
                                                            </div>
                                                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                                                <div className="bg-red-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <div className="flex justify-between mt-1">
                                                                <span className="text-[10px] text-gray-500">{c.count} records</span>
                                                                <span className="text-[10px] text-gray-500">{pct}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-baseline">
                                                <span className="text-gray-400 text-sm font-semibold">Total Expenses</span>
                                                <span className="text-red-400 font-bold">UGX {fmt(plData.total_expenses)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent expense entries */}
                                    {(plData.expenses?.recent || []).length > 0 && (
                                        <div className="mt-5 pt-4 border-t border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Recent Expenses</p>
                                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                                {plData.expenses.recent.slice(0, 10).map((exp) => (
                                                    <div key={exp.id} className="flex justify-between items-center text-xs py-1.5">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <ArrowDownRight size={11} className="text-red-400 flex-shrink-0" />
                                                            <span className="text-gray-300 truncate">{exp.description}</span>
                                                            <span className="text-[10px] text-gray-600 bg-black/20 px-1 py-0.5 rounded uppercase">{exp.category}</span>
                                                        </div>
                                                        <span className="text-red-400 font-medium whitespace-nowrap ml-2">-UGX {fmt(exp.amount)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profit summary bar */}
                            <div className={`rounded-2xl border p-6 ${plData.net_profit >= 0 ? 'bg-[#7FD856]/5 border-[#7FD856]/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Profit & Loss Summary</p>
                                        <p className="text-sm text-gray-300">
                                            Gross Income <span className="text-green-400 font-bold">UGX {fmt(plData.gross_income)}</span>
                                            {' '}&minus;{' '}
                                            Total Expenses <span className="text-red-400 font-bold">UGX {fmt(plData.total_expenses)}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Net Profit</p>
                                        <p className={`text-2xl font-bold ${plData.net_profit >= 0 ? 'text-[#7FD856]' : 'text-red-400'}`}>
                                            UGX {fmt(plData.net_profit)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-center py-10 text-sm">No data available for this period.</p>
                    )}
                </div>
            )}

            {/* ════════════ CASHBOOK VIEW ════════════ */}
            {activeView === 'cashbook' && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <BookOpen size={20} className="text-[#7FD856]" /> Cashbook
                    </h2>

                    {/* Cashbook summary row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-3 text-center">
                            <p className="text-[10px] text-gray-500 uppercase mb-0.5">Total In</p>
                            <p className="text-lg font-bold text-green-400">UGX {fmt(summary.total_income)}</p>
                        </div>
                        <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 text-center">
                            <p className="text-[10px] text-gray-500 uppercase mb-0.5">Total Out</p>
                            <p className="text-lg font-bold text-red-400">UGX {fmt(summary.total_expenses)}</p>
                        </div>
                        <div className={`rounded-lg border p-3 text-center ${summary.net_balance >= 0 ? 'bg-[#7FD856]/5 border-[#7FD856]/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <p className="text-[10px] text-gray-500 uppercase mb-0.5">Net Balance</p>
                            <p className={`text-lg font-bold ${summary.net_balance >= 0 ? 'text-[#7FD856]' : 'text-red-400'}`}>UGX {fmt(summary.net_balance)}</p>
                        </div>
                    </div>

                    {cbLoading ? (
                        <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#7FD856]" /></div>
                    ) : cashbookWithBalance.length === 0 ? (
                        <p className="text-gray-500 text-center py-10 text-sm">No transactions in this date range.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider py-3 px-2">Date</th>
                                        <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider py-3 px-2">Description</th>
                                        <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider py-3 px-2">Ref</th>
                                        <th className="text-left text-[10px] text-gray-500 uppercase tracking-wider py-3 px-2">Method</th>
                                        <th className="text-right text-[10px] text-green-500 uppercase tracking-wider py-3 px-2">Income</th>
                                        <th className="text-right text-[10px] text-red-400 uppercase tracking-wider py-3 px-2">Expense</th>
                                        <th className="text-right text-[10px] text-gray-500 uppercase tracking-wider py-3 px-2">Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashbookWithBalance.map((entry, i) => (
                                        <tr key={`${entry.type}-${entry.id}-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-2.5 px-2 text-gray-400 whitespace-nowrap">
                                                {entry.date ? new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '\u2014'}
                                            </td>
                                            <td className="py-2.5 px-2 text-white font-medium max-w-[200px] truncate">
                                                <div className="flex items-center gap-1.5">
                                                    {entry.type === 'income'
                                                        ? <ArrowUpRight size={13} className="text-green-400 flex-shrink-0" />
                                                        : <ArrowDownRight size={13} className="text-red-400 flex-shrink-0" />
                                                    }
                                                    {entry.description}
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-2 text-gray-500 text-xs">{entry.reference}</td>
                                            <td className="py-2.5 px-2 text-gray-500 text-xs">{entry.method || '\u2014'}</td>
                                            <td className="py-2.5 px-2 text-right text-green-400 font-medium">
                                                {entry.type === 'income' ? fmt(entry.amount) : ''}
                                            </td>
                                            <td className="py-2.5 px-2 text-right text-red-400 font-medium">
                                                {entry.type === 'expense' ? fmt(entry.amount) : ''}
                                            </td>
                                            <td className={`py-2.5 px-2 text-right font-bold ${entry.running_balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                                                {fmt(entry.running_balance)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ════════════ EXPENSES VIEW ════════════ */}
            {activeView === 'expenses' && (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingDown size={20} className="text-red-400" /> Expense Records
                        </h2>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{expenses.length} records</span>
                    </div>

                    <div className="overflow-y-auto pr-1" style={{ maxHeight: '500px' }}>
                        {expenses.length === 0 ? (
                            <div className="h-40 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
                                <p className="text-gray-500 text-sm">No expenses recorded yet. Click "Record Expense" above to add one.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {expenses.map(exp => (
                                    <div key={exp.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                                <ArrowDownRight size={16} className="text-red-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-medium truncate">{exp.description}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-gray-500">{exp.date}</span>
                                                    <span className="text-[10px] text-gray-600 bg-black/20 px-1.5 py-0.5 rounded uppercase">{exp.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-red-400 font-bold text-sm whitespace-nowrap">-UGX {fmt(exp.amount)}</span>
                                            <button onClick={() => handleDeleteExpense(exp.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" title="Delete">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

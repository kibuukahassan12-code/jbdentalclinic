import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/SectionHeader';

export default function AdminInventory({ api, getStoredKey }) {
  const [list, setList] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    quantity: '0',
    minimum_stock: '0',
    supplier: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const loadList = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      let url = '/api/inventory?limit=200';
      if (showLowStockOnly) url += '&low_stock_only=true';
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
      setError(e.message || 'Failed to load inventory');
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [api, getStoredKey, showLowStockOnly]);

  const loadLowStock = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    try {
      const res = await api('/api/inventory/low-stock');
      if (res.ok) setLowStock(await res.json());
      else setLowStock([]);
    } catch {
      setLowStock([]);
    }
  }, [api, getStoredKey]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    loadLowStock();
  }, [loadLowStock, loadList]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const key = getStoredKey();
    if (!key) return;
    setError('');
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    const body = {
      name: form.name.trim(),
      quantity: form.quantity === '' ? 0 : Math.max(0, Number(form.quantity)),
      minimum_stock: form.minimum_stock === '' ? 0 : Math.max(0, Number(form.minimum_stock)),
      supplier: form.supplier.trim() || null,
    };
    const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
    const method = editingId ? 'PUT' : 'POST';
    const res = await api(url, { method, body: JSON.stringify(body) }, key);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || data.details?.join?.() || res.statusText);
      return;
    }
    setForm({ name: '', quantity: '0', minimum_stock: '0', supplier: '' });
    setEditingId(null);
    loadList();
    loadLowStock();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name || '',
      quantity: item.quantity != null ? String(item.quantity) : '0',
      minimum_stock: item.minimum_stock != null ? String(item.minimum_stock) : '0',
      supplier: item.supplier || '',
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this inventory item?')) return;
    const key = getStoredKey();
    const res = await api(`/api/inventory/${id}`, { method: 'DELETE' }, key);
    if (res.ok) {
      if (editingId === id) setEditingId(null);
      loadList();
      loadLowStock();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed');
    }
  };

  const isLowStock = (item) => {
    const min = Number(item.minimum_stock) || 0;
    if (min <= 0) return false;
    return Number(item.quantity) <= min;
  };

  return (
    <>
      <div className="mb-8">
        <SectionHeader
          title="Inventory"
          subtitle="Track stock levels. Items at or below minimum stock are flagged as low stock."
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {lowStock.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-200 text-sm"
        >
          <AlertTriangle size={20} className="shrink-0" />
          <span>
            <strong>{lowStock.length}</strong> item(s) at or below minimum stock.
          </span>
        </motion.div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            className="rounded border-white/20 bg-white/5 text-[#7FD856] focus:ring-[#7FD856]"
          />
          Show low stock only
        </label>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <Plus size={20} />
          {editingId ? 'Edit item' : 'Add inventory item'}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="e.g. Dental gloves (M)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Minimum stock</label>
            <input
              type="number"
              min="0"
              value={form.minimum_stock}
              onChange={(e) => setForm((f) => ({ ...f, minimum_stock: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="Alert when at or below"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Supplier</label>
            <input
              value={form.supplier}
              onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              placeholder="optional"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" className="bg-[#7FD856] text-black hover:bg-[#6FC745]">
              {editingId ? 'Update' : 'Add'} item
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="border-white/20" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </motion.div>

      <h2 className="text-lg font-semibold mb-4 text-white">Inventory list</h2>
      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-400">
          {showLowStockOnly ? 'No low-stock items.' : 'No inventory items.'}
        </p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {list.map((item) => (
              <li
                key={item.id}
                className={`flex flex-wrap items-center gap-4 p-4 transition-colors ${
                  isLowStock(item) ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'bg-white/5 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                  <span className="flex items-center gap-2 text-white font-medium">
                    <Package size={16} className="text-[#7FD856]" />
                    {item.name}
                  </span>
                  <span className="text-gray-400">
                    Qty: <strong className="text-white">{item.quantity}</strong>
                  </span>
                  <span className="text-gray-400">
                    Min: {item.minimum_stock ?? 0}
                  </span>
                  {item.supplier && (
                    <span className="text-gray-400 truncate">Supplier: {item.supplier}</span>
                  )}
                </div>
                {isLowStock(item) && (
                  <span className="flex items-center gap-1 text-amber-400 text-xs">
                    <AlertTriangle size={14} />
                    Low stock
                  </span>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-white/20 text-white" onClick={() => handleEdit(item)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500/30 text-red-400" onClick={() => handleDelete(item.id)}>
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

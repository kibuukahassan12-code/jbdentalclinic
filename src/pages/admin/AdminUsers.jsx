import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, Edit2, X, Shield, UserCog, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ROLES = [
  { id: 'admin', label: 'Admin', description: 'Full access to all features', icon: Shield },
  { id: 'dentist', label: 'Dentist', description: 'Access to patients, treatments, charts', icon: UserCog },
  { id: 'receptionist', label: 'Receptionist', description: 'Access to appointments and patients', icon: User },
  { id: 'staff', label: 'Staff', description: 'Basic access', icon: User },
];

export default function AdminUsers({ api, getStoredKey }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'staff' });
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      const res = await api('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const res = await api(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          toast({ title: 'User Updated', description: 'User details saved successfully.' });
        } else {
          const err = await res.json();
          throw new Error(err.error || 'Failed to update user');
        }
      } else {
        const res = await api('/api/users', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          toast({ title: 'User Created', description: 'New user account created successfully.' });
        } else {
          const err = await res.json();
          throw new Error(err.error || 'Failed to create user');
        }
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ email: '', password: '', role: 'staff' });
      loadUsers();
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    try {
      const res = await api(`/api/users/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'User Deleted', description: 'User has been removed.' });
        loadUsers();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete user');
      }
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const getRoleIcon = (roleId) => {
    const role = ROLES.find(r => r.id === roleId);
    const Icon = role?.icon || User;
    return <Icon size={16} />;
  };

  const getRoleColor = (roleId) => {
    switch (roleId) {
      case 'admin': return 'text-red-400 bg-red-500/10';
      case 'dentist': return 'text-blue-400 bg-blue-500/10';
      case 'receptionist': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
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
            <Users className="text-[#7FD856]" size={24} />
            User Management
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage staff accounts and access permissions</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setFormData({ email: '', password: '', role: 'staff' });
            setShowForm(true);
          }}
          className="bg-[#7FD856] text-black hover:bg-[#6FC745]"
        >
          <Plus size={16} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? 'Edit User' : 'New User'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50"
                  placeholder="user@jbdental.ug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password {editingUser && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
                <div className="space-y-2">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-[#7FD856] bg-[#7FD856]/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.id === 'admin' ? 'text-red-400' : role.id === 'dentist' ? 'text-blue-400' : role.id === 'receptionist' ? 'text-green-400' : 'text-gray-400'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium text-white">{role.label}</div>
                          <div className="text-xs text-gray-400">{role.description}</div>
                        </div>
                        {isSelected && <Check size={16} className="text-[#7FD856]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-transparent border-white/20 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#7FD856] text-black hover:bg-[#6FC745]"
                >
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Users List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No users found. Create your first user to get started.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {ROLES.find(r => r.id === user.role)?.label || user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <div key={role.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${getRoleColor(role.id)}`}>
                <Icon size={20} />
              </div>
              <div className="font-medium text-white">{role.label}</div>
              <div className="text-xs text-gray-400 mt-1">{role.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

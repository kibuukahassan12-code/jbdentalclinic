import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building2, Mail, Phone, MapPin, Clock, DollarSign, Percent, Globe, Bell, CreditCard, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SETTING_GROUPS = [
  {
    id: 'clinic',
    label: 'Clinic Information',
    icon: Building2,
    description: 'Basic clinic details displayed on invoices and communications',
    fields: [
      { key: 'clinic_name', label: 'Clinic Name', type: 'text', placeholder: 'JB Dental Clinic' },
      { key: 'clinic_address', label: 'Address', type: 'textarea', placeholder: 'Kampala, Uganda' },
      { key: 'clinic_phone', label: 'Phone Number', type: 'tel', placeholder: '+256 752 001 269' },
      { key: 'clinic_email', label: 'Email', type: 'email', placeholder: 'info@jbdental.ug' },
      { key: 'clinic_working_hours', label: 'Working Hours', type: 'text', placeholder: 'Mon-Fri: 8:00 AM - 6:00 PM' },
    ],
  },
  {
    id: 'financial',
    label: 'Financial Settings',
    icon: DollarSign,
    description: 'Currency, tax rates, and invoice numbering',
    fields: [
      { key: 'currency', label: 'Currency', type: 'select', options: ['UGX', 'USD', 'EUR', 'GBP'] },
      { key: 'tax_rate', label: 'Default Tax Rate (%)', type: 'number', placeholder: '0' },
      { key: 'invoice_prefix', label: 'Invoice Prefix', type: 'text', placeholder: 'INV' },
      { key: 'receipt_prefix', label: 'Receipt Prefix', type: 'text', placeholder: 'RCP' },
    ],
  },
  {
    id: 'regional',
    label: 'Regional Settings',
    icon: Globe,
    description: 'Timezone, date and time formats',
    fields: [
      { key: 'timezone', label: 'Timezone', type: 'select', options: ['Africa/Kampala', 'UTC', 'Africa/Nairobi', 'Europe/London', 'America/New_York'] },
      { key: 'date_format', label: 'Date Format', type: 'select', options: ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'] },
      { key: 'time_format', label: 'Time Format', type: 'select', options: ['24h', '12h'] },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Enable or disable automated notifications',
    fields: [
      { key: 'email_notifications', label: 'Email Notifications', type: 'toggle' },
      { key: 'whatsapp_notifications', label: 'WhatsApp Notifications', type: 'toggle' },
      { key: 'auto_reminders', label: 'Automatic Reminders', type: 'toggle', description: 'Send appointment reminders automatically' },
    ],
  },
];

const DEFAULT_SETTINGS = {
  clinic_name: 'JB Dental Clinic',
  clinic_address: 'Kampala, Uganda',
  clinic_phone: '',
  clinic_email: 'info@jbdental.ug',
  clinic_working_hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
  currency: 'UGX',
  tax_rate: '0',
  timezone: 'Africa/Kampala',
  date_format: 'YYYY-MM-DD',
  time_format: '24h',
  email_notifications: 'true',
  whatsapp_notifications: 'true',
  auto_reminders: 'true',
  invoice_prefix: 'INV',
  receipt_prefix: 'RCP',
};

export default function AdminSettings({ api, getStoredKey }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('clinic');
  const { toast } = useToast();

  const loadSettings = useCallback(async () => {
    try {
      const res = await api('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: String(value) }));
  };

  const handleToggle = (key) => {
    const current = settings[key] === 'true';
    handleChange(key, (!current).toString());
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast({
          title: 'Settings Saved',
          description: 'All settings have been updated successfully.',
          variant: 'default',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      setSettings(DEFAULT_SETTINGS);
      toast({
        title: 'Settings Reset',
        description: 'All settings have been reset to defaults. Click Save to apply.',
        variant: 'default',
      });
    }
  };

  const renderField = (field) => {
    const value = settings[field.key] || '';

    if (field.type === 'toggle') {
      const isOn = value === 'true';
      return (
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-white">{field.label}</label>
            {field.description && <p className="text-xs text-gray-400 mt-0.5">{field.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => handleToggle(field.key)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isOn ? 'bg-[#7FD856]' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">{field.label}</label>
          <select
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50 focus:border-[#7FD856]/50"
          >
            {field.options.map((opt) => (
              <option key={opt} value={opt} className="bg-[#1a1a1a]">
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">{field.label}</label>
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50 focus:border-[#7FD856]/50 resize-none"
          />
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">{field.label}</label>
        <input
          type={field.type}
          value={value}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50 focus:border-[#7FD856]/50"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FD856]"></div>
      </div>
    );
  }

  const currentGroup = SETTING_GROUPS.find((g) => g.id === activeGroup);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings className="text-[#7FD856]" size={24} />
            Settings
          </h2>
          <p className="text-gray-400 text-sm mt-1">Configure clinic preferences and system behavior</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-transparent border-white/20 text-gray-300 hover:bg-white/5 hover:text-white"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#7FD856] text-black hover:bg-[#6FC745]"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {SETTING_GROUPS.map((group) => {
            const Icon = group.icon;
            const isActive = activeGroup === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#7FD856] text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{group.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {React.createElement(currentGroup.icon, { size: 20, className: 'text-[#7FD856]' })}
                {currentGroup.label}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{currentGroup.description}</p>
            </div>

            <div className="space-y-5">
              {currentGroup.fields.map((field) => (
                <div key={field.key}>{renderField(field)}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

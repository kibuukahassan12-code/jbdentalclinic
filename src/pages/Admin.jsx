import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LayoutDashboard, Calendar, Users, UserCog, LogOut, Stethoscope, ClipboardList, Activity, FileText, Package, BarChart3, FileCheck, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminAppointments = lazy(() => import('@/pages/admin/AdminAppointments'));
const AdminPatients = lazy(() => import('@/pages/admin/AdminPatients'));
const AdminStaff = lazy(() => import('@/pages/admin/AdminStaff'));
const AdminTreatments = lazy(() => import('@/pages/admin/AdminTreatments'));
const AdminTreatmentPlans = lazy(() => import('@/pages/admin/AdminTreatmentPlans'));
const AdminDentalChart = lazy(() => import('@/pages/admin/AdminDentalChart'));
const AdminInvoices = lazy(() => import('@/pages/admin/AdminInvoices'));
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory'));
const AdminFinances = lazy(() => import('@/pages/admin/AdminFinances'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminPatientReports = lazy(() => import('@/pages/admin/AdminPatientReports'));

const AdminTabLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-4 border-[#7FD856] border-t-transparent rounded-full animate-spin" />
  </div>
);

const API_BASE = import.meta.env.VITE_API_URL || '';
const API_KEY_STORAGE = 'jb_admin_api_key';

function getStoredKey() {
  try {
    return sessionStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

function api(url, options = {}, apiKey) {
  const key = apiKey ?? getStoredKey();
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': key,
      ...options.headers,
    },
  });
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'staff', label: 'Staff', icon: UserCog },
  { id: 'treatments', label: 'Treatments', icon: Stethoscope },
  { id: 'treatment-plans', label: 'Plans', icon: ClipboardList },
  { id: 'dental-chart', label: 'Chart', icon: Activity },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'patient-reports', label: 'Patient Reports', icon: FileCheck },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'finances', label: 'Finances', icon: Scale },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const LoginForm = ({ error, loading, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await onLogin(email.trim(), password);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | JB Dental Clinic Kampala</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0F0F0F]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-[#0F0F0F] border border-[#7FD856]/20 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#7FD856]/10 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="text-[#7FD856]" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Admin Login</h1>
                <p className="text-gray-400 text-sm">JB Dental Clinic</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  autoComplete="email"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50 focus:border-[#7FD856]/50 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7FD856]/50 focus:border-[#7FD856]/50 transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] font-medium rounded-xl py-3 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-400 hover:text-[#7FD856] transition-colors">
                ← Back to site
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const Admin = () => {
  const [apiKey, setApiKey] = useState(getStoredKey());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
  };

  const handleLogin = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return false;
      }
      const token = data.token || data.apiKey;
      if (data.success && token) {
        sessionStorage.setItem(API_KEY_STORAGE, token);
        setApiKey(token);
        setError('');
        return true;
      } else {
        setError(data.error || 'Invalid response from server');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Connection error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setError('');
  };

  // Check if we already have a valid key in session
  useEffect(() => {
    const stored = getStoredKey();
    if (stored) setApiKey(stored);
  }, []);

  if (!apiKey) {
    return <LoginForm error={error} loading={loading} onLogin={handleLogin} />;
  }

  return (
    <>
      <Helmet>
        <title>Admin | JB Dental Clinic Kampala</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        {/* Header – same tone as site nav */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F0F0F] backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link to="/">
                <img
                  src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f51b96d62e1c9d03d4878cf068f6e99e.png"
                  alt="JB Dental Clinic Logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <Button
                onClick={handleLogout}
                className="flex-shrink-0 bg-red-600 text-white hover:bg-red-700 border border-red-500 rounded-xl px-5 py-2.5 font-semibold text-sm shadow-lg"
              >
                <LogOut className="mr-2" size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs – logo green, clean */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-[#7FD856] text-black'
                    : 'text-gray-400 hover:text-white border border-white/10 hover:border-[#7FD856]/30 hover:bg-white/5'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="pb-12">
          <Suspense fallback={<AdminTabLoader />}>
            {activeTab === 'dashboard' && (
              <AdminDashboard api={api} getStoredKey={getStoredKey} onNavigate={handleNavigate} />
            )}
            {activeTab === 'appointments' && (
              <AdminAppointments api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'patients' && (
              <AdminPatients api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'staff' && (
              <AdminStaff api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'treatments' && (
              <AdminTreatments api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'treatment-plans' && (
              <AdminTreatmentPlans api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'dental-chart' && (
              <AdminDentalChart api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'invoices' && (
              <AdminInvoices api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'patient-reports' && (
              <AdminPatientReports api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'inventory' && (
              <AdminInventory api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'finances' && (
              <AdminFinances api={api} getStoredKey={getStoredKey} />
            )}
            {activeTab === 'reports' && (
              <AdminReports api={api} getStoredKey={getStoredKey} />
            )}
          </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;

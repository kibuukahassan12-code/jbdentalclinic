import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Calendar, FileText, Activity, Users, ArrowRight, Clock, Phone, Loader2 } from 'lucide-react';

const TYPE_ICONS = {
  patient: User,
  appointment: Calendar,
  staff: Users,
  invoice: FileText,
  treatment: Activity,
};

const TYPE_COLORS = {
  patient: 'text-blue-400 bg-blue-500/10',
  appointment: 'text-green-400 bg-green-500/10',
  staff: 'text-purple-400 bg-purple-500/10',
  invoice: 'text-yellow-400 bg-yellow-500/10',
  treatment: 'text-pink-400 bg-pink-500/10',
};

export default function GlobalSearch({ api, getStoredKey, onResultSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Search debounce
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setSelectedIndex(0);
        }
      } catch (e) {
        console.error('Search failed:', e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, api]);

  const handleSelect = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setIsOpen(false);
    setQuery('');
    setResults(null);
  };

  const handleKeyDown = (e) => {
    if (!results) return;
    
    const allResults = [
      ...results.patients,
      ...results.appointments,
      ...results.staff,
      ...results.invoices,
      ...results.treatments,
    ];

    if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allResults[selectedIndex];
      if (selected) handleSelect(selected);
    }
  };

  const getAllResults = () => {
    if (!results) return [];
    return [
      ...results.patients,
      ...results.appointments,
      ...results.staff,
      ...results.invoices,
      ...results.treatments,
    ];
  };

  const allResults = getAllResults();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
      >
        <Search size={16} />
        <span>Search...</span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          ref={containerRef}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            {loading ? (
              <Loader2 size={20} className="text-gray-400 animate-spin" />
            ) : (
              <Search size={20} className="text-gray-400" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search patients, appointments, staff, invoices..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-lg"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!results && !loading && (
              <div className="p-8 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-3 opacity-30" />
                <p>Type at least 2 characters to search</p>
                <p className="text-sm mt-2 text-gray-600">Try: patient name, phone number, or email</p>
              </div>
            )}

            {results && allResults.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No results found for "{query}"</p>
              </div>
            )}

            {results && (
              <div className="py-2">
                {/* Patients */}
                {results.patients?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patients ({results.patients.length})
                    </div>
                    {results.patients.map((patient, idx) => {
                      const globalIdx = idx;
                      const Icon = TYPE_ICONS.patient;
                      return (
                        <button
                          key={patient.id}
                          onClick={() => handleSelect(patient)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex === globalIdx ? 'bg-[#7FD856]/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS.patient}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{patient.name}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              {patient.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={12} />
                                  {patient.phone}
                                </span>
                              )}
                              {patient.email && <span>{patient.email}</span>}
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-gray-500" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Appointments */}
                {results.appointments?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appointments ({results.appointments.length})
                    </div>
                    {results.appointments.map((apt, idx) => {
                      const globalIdx = results.patients.length + idx;
                      const Icon = TYPE_ICONS.appointment;
                      return (
                        <button
                          key={apt.id}
                          onClick={() => handleSelect(apt)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex === globalIdx ? 'bg-[#7FD856]/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS.appointment}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{apt.name}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {apt.date} at {apt.time?.slice(0, 5)}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                apt.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
                                apt.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-gray-500" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Staff */}
                {results.staff?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff ({results.staff.length})
                    </div>
                    {results.staff.map((staff, idx) => {
                      const globalIdx = results.patients.length + results.appointments.length + idx;
                      const Icon = TYPE_ICONS.staff;
                      return (
                        <button
                          key={staff.id}
                          onClick={() => handleSelect(staff)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex === globalIdx ? 'bg-[#7FD856]/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS.staff}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{staff.name}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                                {staff.role}
                              </span>
                              {staff.phone && <span>{staff.phone}</span>}
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-gray-500" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Invoices */}
                {results.invoices?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoices ({results.invoices.length})
                    </div>
                    {results.invoices.map((inv, idx) => {
                      const globalIdx = results.patients.length + results.appointments.length + results.staff.length + idx;
                      const Icon = TYPE_ICONS.invoice;
                      return (
                        <button
                          key={inv.id}
                          onClick={() => handleSelect(inv)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex === globalIdx ? 'bg-[#7FD856]/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS.invoice}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">INV-{inv.id} - {inv.name}</div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span>{Number(inv.total_amount).toLocaleString()} UGX</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                inv.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                                inv.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {inv.status}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-gray-500" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Treatments */}
                {results.treatments?.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatments ({results.treatments.length})
                    </div>
                    {results.treatments.map((treatment, idx) => {
                      const globalIdx = results.patients.length + results.appointments.length + results.staff.length + results.invoices.length + idx;
                      const Icon = TYPE_ICONS.treatment;
                      return (
                        <button
                          key={treatment.id}
                          onClick={() => handleSelect(treatment)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedIndex === globalIdx ? 'bg-[#7FD856]/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS.treatment}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{treatment.service}</div>
                            <div className="text-sm text-gray-400">
                              {treatment.name} • {treatment.date}
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-gray-500" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5 text-xs text-gray-500">
            <div />
            {results && (
              <span>{results.total} results found</span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

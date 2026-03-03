import React, { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, X, Search } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const EMPTY_FORM = {
  first_name: '', last_name: '', date_of_birth: '', gender: '',
  phone: '', email: '', address: '', medical_history: '',
};

const Field = ({ label, as, ...props }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    {as === 'textarea' ? (
      <textarea
        {...props}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#7FD856] resize-none transition-colors"
      />
    ) : as === 'select' ? (
      <select
        {...props}
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#7FD856] transition-colors"
      >
        {props.children}
      </select>
    ) : (
      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#7FD856] transition-colors"
      />
    )}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={onClose}>
    <div
      className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#1a1a1a]">
        <h3 className="text-white font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.getPatients()
      .then(setPatients)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setFormError(''); setModal('add'); };
  const openEdit = (p) => { setSelected(p); setForm({ ...p }); setFormError(''); setModal('edit'); };
  const openView = (p) => { setSelected(p); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); setFormError(''); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      setFormError('First name and last name are required.');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'add') await adminApi.createPatient(form);
      else await adminApi.updatePatient(selected.id, form);
      closeModal();
      load();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient and all their records?')) return;
    try {
      await adminApi.deletePatient(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(q) ||
      p.last_name?.toLowerCase().includes(q) ||
      p.phone?.includes(q) ||
      p.email?.toLowerCase().includes(q)
    );
  });

  const PatientForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name *" name="first_name" value={form.first_name} onChange={handleChange} placeholder="John" />
        <Field label="Last Name *" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Doe" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date of Birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
        <Field label="Gender" name="gender" as="select" value={form.gender} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Field>
      </div>
      <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+256 700 000000" />
      <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="patient@email.com" />
      <Field label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Kampala, Uganda" />
      <Field label="Medical History / Allergies" name="medical_history" as="textarea" value={form.medical_history} onChange={handleChange} placeholder="Any known conditions, allergies…" />
      {formError && <p className="text-red-400 text-sm">{formError}</p>}
      <div className="flex gap-3 pt-2">
        <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Cancel</button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-lg bg-[#7FD856] text-black font-semibold text-sm hover:bg-[#6FC745] transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : modal === 'add' ? 'Add Patient' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-white">Patients</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#7FD856] text-black text-sm font-semibold rounded-lg hover:bg-[#6FC745] transition-colors"
        >
          <UserPlus size={16} /> Add Patient
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or email…"
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#7FD856] transition-colors"
        />
      </div>

      {loading && <div className="text-gray-400 text-center py-12">Loading patients…</div>}
      {error && <div className="text-red-400 text-center py-6">{error}</div>}

      {!loading && !error && (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Gender</th>
                  <th className="px-5 py-3">Visits</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-gray-500 py-10">No patients found</td></tr>
                ) : filtered.map((p, i) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => openView(p)} className="text-white font-medium hover:text-[#7FD856] transition-colors text-left">
                        {p.first_name} {p.last_name}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-300">{p.phone || '—'}</td>
                    <td className="px-5 py-3 text-gray-300">{p.email || '—'}</td>
                    <td className="px-5 py-3 text-gray-300">{p.gender || '—'}</td>
                    <td className="px-5 py-3 text-gray-300">{p.appointment_count ?? 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#7FD856] hover:bg-[#7FD856]/10 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add New Patient' : 'Edit Patient'} onClose={closeModal}>
          <PatientForm />
        </Modal>
      )}

      {modal === 'view' && selected && (
        <Modal title="Patient Details" onClose={closeModal}>
          <div className="space-y-3 text-sm">
            {[
              ['Full Name', `${selected.first_name} ${selected.last_name}`],
              ['Date of Birth', selected.date_of_birth],
              ['Gender', selected.gender],
              ['Phone', selected.phone],
              ['Email', selected.email],
              ['Address', selected.address],
              ['Registered', selected.created_at?.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="text-gray-500 w-32 shrink-0">{k}</span>
                <span className="text-white">{v || '—'}</span>
              </div>
            ))}
            {selected.medical_history && (
              <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-gray-500 text-xs mb-1">Medical History</p>
                <p className="text-gray-300">{selected.medical_history}</p>
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <button onClick={() => { closeModal(); setTimeout(() => openEdit(selected), 0); }} className="flex-1 py-2.5 rounded-lg bg-[#7FD856] text-black font-semibold text-sm hover:bg-[#6FC745] transition-colors">
                Edit Patient
              </button>
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPatients;

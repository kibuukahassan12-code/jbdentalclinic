const BASE = '/api';

const headers = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': sessionStorage.getItem('admin_token') || '',
});

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
};

export const adminApi = {
  // Stats
  getStats: () => fetch(`${BASE}/admin/stats`, { headers: headers() }).then(handle),

  // Patients
  getPatients: () => fetch(`${BASE}/patients`, { headers: headers() }).then(handle),
  getPatient: (id) => fetch(`${BASE}/patients/${id}`, { headers: headers() }).then(handle),
  createPatient: (data) => fetch(`${BASE}/patients`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handle),
  updatePatient: (id, data) => fetch(`${BASE}/patients/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handle),
  deletePatient: (id) => fetch(`${BASE}/patients/${id}`, { method: 'DELETE', headers: headers() }).then(handle),

  // Appointments
  getAppointments: () => fetch(`${BASE}/appointments`, { headers: headers() }).then(handle),
  getAppointment: (id) => fetch(`${BASE}/appointments/${id}`, { headers: headers() }).then(handle),
  updateAppointmentStatus: (id, status) => fetch(`${BASE}/appointments/${id}/status`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status }) }).then(handle),
  deleteAppointment: (id) => fetch(`${BASE}/appointments/${id}`, { method: 'DELETE', headers: headers() }).then(handle),
};

export const isAdminLoggedIn = () => !!sessionStorage.getItem('admin_token');

export const adminLogin = (username, password) => {
  const ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').toString().trim();
  const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || 'JBDental2024!').toString().trim();
  const inputUsername = (username || '').toString().trim();
  const inputPassword = (password || '').toString().trim();
  
  console.log('Login attempt:', { inputUsername, expectedUsername: ADMIN_USERNAME, match: inputUsername === ADMIN_USERNAME });
  
  if (inputUsername === ADMIN_USERNAME && inputPassword === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_token', btoa(`${inputUsername}:${inputPassword}`));
    return true;
  }
  return false;
};

export const adminLogout = () => sessionStorage.removeItem('admin_token');

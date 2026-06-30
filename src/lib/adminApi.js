const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || '';
const ANON_KEY = import.meta.env.VITE_INSFORGE_ANON_KEY || '';

export const API_KEY_STORAGE = 'jb_admin_api_key';

export function getStoredAdminKey() {
  try {
    return sessionStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setStoredAdminKey(token) {
  try {
    if (token) {
      sessionStorage.setItem(API_KEY_STORAGE, token);
    } else {
      sessionStorage.removeItem(API_KEY_STORAGE);
    }
  } catch {
    // Ignore storage errors
  }
}

function mockResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => typeof data === 'string' ? data : JSON.stringify(data)
  };
}

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

export function createAdminApi(getApiKey, onUnauthorized) {
  return async function adminApi(url, options = {}) {
    const apiKey = getApiKey?.() ?? getStoredAdminKey();
    const token = apiKey || ANON_KEY;

    const baseHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Helper: convert PostgREST-style "field=eq.value&..." to simple "field=value&..." for local API
    function translateQuery(queryStr) {
      if (!queryStr) return '';
      return queryStr
        .split('&')
        .map(part => {
          // eq operator: field=eq.value -> field=value
          const eqMatch = part.match(/^([^=]+)=eq\.(.+)$/);
          if (eqMatch) return `${eqMatch[1]}=${eqMatch[2]}`;
          // gte operator: field=gte.value -> field_gte=value (passed as from_date etc)
          const gteMatch = part.match(/^([^=]+)=gte\.(.+)$/);
          if (gteMatch) return `${gteMatch[1]}_gte=${gteMatch[2]}`;
          // lte operator: field=lte.value -> field_lte=value
          const lteMatch = part.match(/^([^=]+)=lte\.(.+)$/);
          if (lteMatch) return `${lteMatch[1]}_lte=${lteMatch[2]}`;
          // order: ignore PostgREST order syntax
          if (part.startsWith('order=')) return '';
          return part;
        })
        .filter(Boolean)
        .join('&');
    }

    // Helper: local REST GET
    const getRecords = async (table, queryStr = '') => {
      const localTable = table.replace(/_/g, '-');
      const translated = translateQuery(queryStr);
      const qs = translated ? `?${translated}` : '';
      const res = await fetch(`/api/${localTable}${qs}`, { headers: baseHeaders });
      if (res.status === 401 && typeof onUnauthorized === 'function') onUnauthorized(res);
      if (!res.ok) return [];
      const data = await res.json().catch(() => []);
      return Array.isArray(data) ? data : [];
    };

    // Helper: local REST POST
    const postRecord = async (table, body) => {
      const localTable = table.replace(/_/g, '-');
      const payload = Array.isArray(body) ? body[0] : body;
      const res = await fetch(`/api/${localTable}`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify(payload)
      });
      if (res.status === 401 && typeof onUnauthorized === 'function') onUnauthorized(res);
      return res;
    };

    // Helper: local REST PATCH
    const patchRecord = async (table, queryStr, body) => {
      const localTable = table.replace(/_/g, '-');
      // Extract id from queryStr: "id=eq.123"
      const idMatch = queryStr.match(/id=eq\.(\d+)/);
      const keyMatch = queryStr.match(/key=eq\.([^&]+)/);
      if (idMatch) {
        const res = await fetch(`/api/${localTable}/${idMatch[1]}`, {
          method: 'PUT',
          headers: baseHeaders,
          body: JSON.stringify(body)
        });
        if (res.status === 401 && typeof onUnauthorized === 'function') onUnauthorized(res);
        return res;
      } else if (keyMatch && localTable === 'settings') {
        const res = await fetch(`/api/settings/${keyMatch[1]}`, {
          method: 'PUT',
          headers: baseHeaders,
          body: JSON.stringify(body)
        });
        if (res.status === 401 && typeof onUnauthorized === 'function') onUnauthorized(res);
        return res;
      }
      return { ok: false, status: 400, json: async () => ({ error: 'Cannot patch without id' }) };
    };

    // Helper: local REST DELETE
    const deleteRecord = async (table, queryStr) => {
      const localTable = table.replace(/_/g, '-');
      const idMatch = queryStr.match(/id=eq\.(\d+)/);
      const keyMatch = queryStr.match(/key=eq\.([^&]+)/);
      if (idMatch) {
        const res = await fetch(`/api/${localTable}/${idMatch[1]}`, {
          method: 'DELETE',
          headers: baseHeaders
        });
        if (res.status === 401 && typeof onUnauthorized === 'function') onUnauthorized(res);
        return res;
      } else if (keyMatch && localTable === 'settings') {
        const res = await fetch(`/api/settings/${keyMatch[1]}`, {
          method: 'DELETE',
          headers: baseHeaders
        });
        if (res.status === 401 && typeof onUnauthorized === 'function') onUnauthorized(res);
        return res;
      }
      return { ok: false, status: 400, json: async () => ({ error: 'Cannot delete without id' }) };
    };

    // Parse path and query
    const [pathPart, queryPart] = url.split('?');
    const pathParts = pathPart.split('/').filter(Boolean); // e.g. ["api", "patients", "123"]
    const queryParams = new URLSearchParams(queryPart || '');

    // Map path segments
    const resource = pathParts[1]; // e.g. "patients", "reports", "settings"
    const subResource = pathParts[2]; // e.g. "dashboard", "123"

    // 1. Intercept Custom Reports
    if (resource === 'reports') {
      if (subResource === 'dashboard') {
        try {
          const today = new Date().toISOString().slice(0, 10);
          const thisMonth = today.slice(0, 7);

          const [apts, patients, invoices, inventory, treatments, payments, expenses] = await Promise.all([
            getRecords('appointments', `appointment_date=eq.${today}`),
            getRecords('patients', 'limit=100000'),
            getRecords('invoices', 'status=eq.Pending&limit=500'),
            getRecords('inventory_items', 'limit=500'),
            getRecords('treatments', 'limit=100'),
            getRecords('payments', 'limit=100000'),
            getRecords('expenses', 'limit=100000')
          ]);

          const sortedTreatments = treatments
            .sort((a, b) => new Date(b.created_at || b.treatment_date) - new Date(a.created_at || a.treatment_date))
            .slice(0, 10);

          const lowStockItems = inventory.filter(i => i.quantity <= i.minimum_stock && i.minimum_stock > 0);

          // Daily revenue
          const dailyRevenue = payments
            .filter(p => p.paid_at && p.paid_at.startsWith(today))
            .reduce((sum, p) => sum + Number(p.amount), 0);

          // Monthly revenue
          const monthlyRevenue = payments
            .filter(p => p.paid_at && p.paid_at.startsWith(thisMonth))
            .reduce((sum, p) => sum + Number(p.amount), 0);

          // Outstanding calculation
          const invoicePayments = {};
          payments.forEach(p => {
            invoicePayments[p.invoice_id] = (invoicePayments[p.invoice_id] || 0) + Number(p.amount);
          });

          const outstandingBalances = [];
          let totalOutstanding = 0;

          invoices.forEach(inv => {
            const total = Number(inv.total_amount) - Number(inv.discount || 0) + Number(inv.tax || 0);
            const paid = invoicePayments[inv.id] || 0;
            const balance = total - paid;
            if (balance > 0) {
              totalOutstanding += balance;
              const patient = patients.find(p => p.id === inv.patient_id);
              outstandingBalances.push({
                invoice_id: inv.id,
                patient_id: inv.patient_id,
                patient_name: patient ? patient.full_name : `Patient #${inv.patient_id}`,
                total,
                paid,
                balance,
                created_at: inv.created_at
              });
            }
          });

          const dashData = {
            today_appointments_count: apts.length,
            today_appointments: apts.slice(0, 5),
            total_patients: patients.length,
            pending_invoices_count: invoices.length,
            low_stock_count: lowStockItems.length,
            low_stock_items: lowStockItems.slice(0, 5),
            recent_treatments: sortedTreatments,
            daily_revenue: dailyRevenue,
            monthly_revenue: monthlyRevenue,
            total_outstanding: totalOutstanding,
            outstanding_balances: outstandingBalances,
            as_of: today,
            month: thisMonth
          };

          return mockResponse(dashData);
        } catch (e) {
          return mockResponse({ error: e.message }, 500);
        }
      }

      if (subResource === 'balance-sheet') {
        try {
          const type = queryParams.get('type') || 'daily';
          const targetDate = queryParams.get('date') || new Date().toISOString().slice(0, 10);

          const [payments, expenses] = await Promise.all([
            getRecords('payments', 'limit=100000'),
            getRecords('expenses', 'limit=100000')
          ]);

          let revenue = 0;
          let expSum = 0;
          let period = '';

          if (type === 'monthly') {
            const month = targetDate.slice(0, 7);
            revenue = payments.filter(p => p.paid_at && p.paid_at.startsWith(month)).reduce((sum, p) => sum + Number(p.amount), 0);
            expSum = expenses.filter(e => e.date && e.date.startsWith(month)).reduce((sum, e) => sum + Number(e.amount), 0);
            period = `Month: ${month}`;
          } else if (type === 'weekly') {
            const d = new Date(targetDate);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const start = new Date(d.setDate(diff)).toISOString().slice(0, 10);
            const end = new Date(d.setDate(diff + 6)).toISOString().slice(0, 10);

            revenue = payments.filter(p => p.paid_at && p.paid_at >= start && p.paid_at <= end + 'T23:59:59Z').reduce((sum, p) => sum + Number(p.amount), 0);
            expSum = expenses.filter(e => e.date && e.date >= start && e.date <= end).reduce((sum, e) => sum + Number(e.amount), 0);
            period = `Week: ${start} to ${end}`;
          } else {
            revenue = payments.filter(p => p.paid_at && p.paid_at.startsWith(targetDate)).reduce((sum, p) => sum + Number(p.amount), 0);
            expSum = expenses.filter(e => e.date === targetDate).reduce((sum, e) => sum + Number(e.amount), 0);
            period = `Date: ${targetDate}`;
          }

          return mockResponse({
            period,
            revenue,
            expenses: expSum,
            balance: revenue - expSum
          });
        } catch (e) {
          return mockResponse({ error: e.message }, 500);
        }
      }

      if (subResource === 'expenses') {
        const fromDate = queryParams.get('fromDate');
        const toDate = queryParams.get('toDate');
        const limit = Number(queryParams.get('limit')) || 100;

        let query = `limit=${limit}&order=date.desc,id.desc`;
        if (fromDate) query += `&date=gte.${fromDate}`;
        if (toDate) query += `&date=lte.${toDate}`;

        const exps = await getRecords('expenses', query);
        return mockResponse(exps);
      }

      if (subResource === 'cashbook') {
        try {
          const fromDate = queryParams.get('from_date');
          const toDate = queryParams.get('to_date');
          const limit = Number(queryParams.get('limit')) || 200;
          const offset = Number(queryParams.get('offset')) || 0;

          const [payments, expenses, patients, invoices] = await Promise.all([
            getRecords('payments', 'limit=100000'),
            getRecords('expenses', 'limit=100000'),
            getRecords('patients', 'limit=100000'),
            getRecords('invoices', 'limit=100000')
          ]);

          const incomeEntries = payments
            .filter(p => {
              if (!p.paid_at) return false;
              const dateStr = p.paid_at.slice(0, 10);
              if (fromDate && dateStr < fromDate) return false;
              if (toDate && dateStr > toDate) return false;
              return true;
            })
            .map(p => {
              const inv = invoices.find(i => i.id === p.invoice_id);
              const pat = inv ? patients.find(pt => pt.id === inv.patient_id) : null;
              return {
                id: p.id,
                date: p.paid_at.slice(0, 10),
                amount: Number(p.amount),
                method: p.payment_method,
                type: 'income',
                description: pat ? pat.full_name : (inv ? `Patient #${inv.patient_id}` : 'Patient'),
                reference: `INV-${p.invoice_id}`
              };
            });

          const expenseEntries = expenses
            .filter(e => {
              if (fromDate && e.date < fromDate) return false;
              if (toDate && e.date > toDate) return false;
              return true;
            })
            .map(e => ({
              id: e.id,
              date: e.date,
              amount: Number(e.amount),
              method: e.category,
              type: 'expense',
              description: e.description,
              reference: `EXP-${e.id}`
            }));

          const combined = [...incomeEntries, ...expenseEntries]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

          const sliced = combined.slice(offset, offset + limit);

          const totalIncome = incomeEntries.reduce((sum, i) => sum + i.amount, 0);
          const totalExpenses = expenseEntries.reduce((sum, e) => sum + e.amount, 0);

          return mockResponse({
            entries: sliced,
            summary: {
              total_income: totalIncome,
              total_expenses: totalExpenses,
              net_balance: totalIncome - totalExpenses
            }
          });
        } catch (e) {
          return mockResponse({ error: e.message }, 500);
        }
      }

      if (subResource === 'profit-loss') {
        try {
          const fromDate = queryParams.get('from_date');
          const toDate = queryParams.get('to_date');

          const [payments, expenses, patients, invoices] = await Promise.all([
            getRecords('payments', 'limit=100000'),
            getRecords('expenses', 'limit=100000'),
            getRecords('patients', 'limit=100000'),
            getRecords('invoices', 'limit=100000')
          ]);

          const filteredPayments = payments.filter(p => {
            if (!p.paid_at) return false;
            const dateStr = p.paid_at.slice(0, 10);
            if (fromDate && dateStr < fromDate) return false;
            if (toDate && dateStr > toDate) return false;
            return true;
          });

          const filteredExpenses = expenses.filter(e => {
            if (fromDate && e.date < fromDate) return false;
            if (toDate && e.date > toDate) return false;
            return true;
          });

          // Income by method
          const incomeByMethodMap = {};
          filteredPayments.forEach(p => {
            incomeByMethodMap[p.payment_method] = (incomeByMethodMap[p.payment_method] || { amount: 0, count: 0 });
            incomeByMethodMap[p.payment_method].amount += Number(p.amount);
            incomeByMethodMap[p.payment_method].count++;
          });
          const incomeByMethod = Object.entries(incomeByMethodMap).map(([label, val]) => ({
            label,
            amount: val.amount,
            count: val.count
          })).sort((a, b) => b.amount - a.amount);

          const totalIncome = filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0);

          // Expenses by category
          const expByCatMap = {};
          filteredExpenses.forEach(e => {
            const cat = e.category || 'General';
            expByCatMap[cat] = (expByCatMap[cat] || { amount: 0, count: 0 });
            expByCatMap[cat].amount += Number(e.amount);
            expByCatMap[cat].count++;
          });
          const expensesByCategory = Object.entries(expByCatMap).map(([label, val]) => ({
            label,
            amount: val.amount,
            count: val.count
          })).sort((a, b) => b.amount - a.amount);

          const totalExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

          // Recent income
          const recentIncome = filteredPayments
            .sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
            .slice(0, 50)
            .map(p => {
              const inv = invoices.find(i => i.id === p.invoice_id);
              const pat = inv ? patients.find(pt => pt.id === inv.patient_id) : null;
              return {
                id: p.id,
                date: p.paid_at.slice(0, 10),
                amount: Number(p.amount),
                payment_method: p.payment_method,
                patient_name: pat ? pat.full_name : (inv ? `Patient #${inv.patient_id}` : 'Patient'),
                reference: `INV-${p.invoice_id}`
              };
            });

          // Recent expenses
          const recentExpenses = filteredExpenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 50)
            .map(e => ({
              id: e.id,
              date: e.date,
              amount: Number(e.amount),
              category: e.category,
              description: e.description
            }));

          return mockResponse({
            income: {
              total: totalIncome,
              by_method: incomeByMethod,
              recent: recentIncome
            },
            expenses: {
              total: totalExpenses,
              by_category: expensesByCategory,
              recent: recentExpenses
            },
            gross_income: totalIncome,
            total_expenses: totalExpenses,
            net_profit: totalIncome - totalExpenses
          });
        } catch (e) {
          return mockResponse({ error: e.message }, 500);
        }
      }
    }

    // 2. Intercept settings
    if (resource === 'settings') {
      try {
        if (!subResource) {
          if (options.method === 'PUT') {
            const settings = options.body ? JSON.parse(options.body) : {};
            const existing = await getRecords('settings');
            const results = [];
            for (const [key, value] of Object.entries(settings)) {
              const ext = existing.find(e => e.key === key);
              if (ext) {
                await patchRecord('settings', `key=eq.${key}`, { value: String(value) });
              } else {
                await postRecord('settings', { key, value: String(value) });
              }
              results.push({ key, value: String(value) });
            }
            return mockResponse({ updated: results.length, settings: results });
          } else {
            const settings = await getRecords('settings');
            const settingsMap = { ...DEFAULT_SETTINGS };
            settings.forEach(s => {
              settingsMap[s.key] = s.value;
            });
            return mockResponse(settingsMap);
          }
        } else {
          // single key
          if (options.method === 'PUT') {
            const { value } = options.body ? JSON.parse(options.body) : {};
            const existing = await getRecords('settings');
            const ext = existing.find(e => e.key === subResource);
            if (ext) {
              await patchRecord('settings', `key=eq.${subResource}`, { value: String(value) });
            } else {
              await postRecord('settings', { key: subResource, value: String(value) });
            }
            return mockResponse({ key: subResource, value: String(value), updated: true });
          } else if (options.method === 'DELETE') {
            await deleteRecord('settings', `key=eq.${subResource}`);
            return mockResponse({ key: subResource, deleted: true });
          } else {
            const settings = await getRecords('settings');
            const ext = settings.find(s => s.key === subResource);
            if (!ext) {
              if (DEFAULT_SETTINGS[subResource] !== undefined) {
                return mockResponse({ key: subResource, value: DEFAULT_SETTINGS[subResource], isDefault: true });
              }
              return mockResponse({ error: 'Setting not found' }, 404);
            }
            return mockResponse({ key: subResource, value: ext.value });
          }
        }
      } catch (e) {
        return mockResponse({ error: e.message }, 500);
      }
    }

    // 3. Intercept communication stats
    if (resource === 'communication-logs' && subResource === 'stats') {
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const logs = await getRecords('communication_logs', 'limit=100000');

        const todayLogs = logs.filter(l => l.sent_at && l.sent_at.slice(0, 10) === todayStr);

        const channelMap = {};
        logs.forEach(l => {
          channelMap[l.channel] = (channelMap[l.channel] || 0) + 1;
        });
        const byChannel = Object.entries(channelMap).map(([channel, count]) => ({ channel, count }));

        const statusMap = {};
        logs.forEach(l => {
          statusMap[l.status] = (statusMap[l.status] || 0) + 1;
        });
        const byStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

        const recent = logs
          .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
          .slice(0, 20);

        return mockResponse({
          today: todayLogs.length,
          total: logs.length,
          byChannel,
          byStatus,
          recent
        });
      } catch (e) {
        return mockResponse({ error: e.message }, 500);
      }
    }

    // 4. Intercept send-reminders
    if (resource === 'send-reminders') {
      try {
        const bodyType = subResource || 'all';
        const fnUrl = `${INSFORGE_URL}/functions/send-reminders`;
        const res = await fetch(fnUrl, {
          method: 'POST',
          headers: baseHeaders,
          body: JSON.stringify({ type: bodyType })
        });
        if (res.status === 401 && typeof onUnauthorized === 'function') {
          onUnauthorized(res);
        }
        const data = await res.json().catch(() => ({}));
        return mockResponse(data, res.status);
      } catch (e) {
        return mockResponse({ error: e.message }, 500);
      }
    }

    // 5. Intercept seed
    if (resource === 'seed') {
      return mockResponse({ success: true, seeded: true });
    }

    // 6. Intercept global search
    if (resource === 'search') {
      try {
        const q = queryParams.get('q') || '';
        const limit = Number(queryParams.get('limit')) || 20;

        if (q.trim().length < 2) {
          return mockResponse({ error: 'Search query must be at least 2 characters' }, 400);
        }

        const [patients, appointments, staff, invoices, treatments] = await Promise.all([
          getRecords('patients', 'limit=500'),
          getRecords('appointments', 'limit=500'),
          getRecords('staff', 'limit=500'),
          getRecords('invoices', 'limit=500'),
          getRecords('treatments', 'limit=500')
        ]);

        const qLower = q.toLowerCase().trim();

        const pFiltered = patients
          .filter(p => (p.full_name || '').toLowerCase().includes(qLower) || (p.phone || '').toLowerCase().includes(qLower) || (p.email || '').toLowerCase().includes(qLower))
          .slice(0, limit)
          .map(p => ({ id: p.id, name: p.full_name, phone: p.phone, email: p.email, type: 'patient' }));

        const aFiltered = appointments
          .filter(a => (a.patient_name || '').toLowerCase().includes(qLower) || (a.patient_phone || '').toLowerCase().includes(qLower) || (a.service || '').toLowerCase().includes(qLower))
          .slice(0, limit)
          .map(a => ({ id: a.id, name: a.patient_name, phone: a.patient_phone, date: a.appointment_date, time: a.appointment_time, status: a.status, type: 'appointment' }));

        const sFiltered = staff
          .filter(s => (s.full_name || '').toLowerCase().includes(qLower) || (s.phone || '').toLowerCase().includes(qLower) || (s.email || '').toLowerCase().includes(qLower) || (s.role || '').toLowerCase().includes(qLower))
          .slice(0, limit)
          .map(s => ({ id: s.id, name: s.full_name, phone: s.phone, email: s.email, role: s.role, type: 'staff' }));

        const iFiltered = invoices
          .filter(i => {
            const pat = patients.find(p => p.id === i.patient_id);
            return pat && pat.full_name.toLowerCase().includes(qLower);
          })
          .slice(0, limit)
          .map(i => {
            const pat = patients.find(p => p.id === i.patient_id);
            return { id: i.id, name: pat ? pat.full_name : `Patient #${i.patient_id}`, total_amount: i.total_amount, status: i.status, date: i.created_at, type: 'invoice' };
          });

        const tFiltered = treatments
          .filter(t => {
            const pat = patients.find(p => p.id === t.patient_id);
            return (pat && pat.full_name.toLowerCase().includes(qLower)) || (t.service_name || '').toLowerCase().includes(qLower);
          })
          .slice(0, limit)
          .map(t => {
            const pat = patients.find(p => p.id === t.patient_id);
            return { id: t.id, name: pat ? pat.full_name : `Patient #${t.patient_id}`, service: t.service_name, date: t.treatment_date, status: t.status, type: 'treatment' };
          });

        return mockResponse({
          patients: pFiltered,
          appointments: aFiltered,
          staff: sFiltered,
          invoices: iFiltered,
          treatments: tFiltered,
          total: pFiltered.length + aFiltered.length + sFiltered.length + iFiltered.length + tFiltered.length
        });
      } catch (e) {
        return mockResponse({ error: e.message }, 500);
      }
    }

    // 7. Standard PostgREST REST Mapper
    // Convert table names if they have dashes (e.g. treatment-plans -> treatment_plans)
    const dbTable = resource.replace(/-/g, '_');
    const method = options.method || 'GET';

    if (method === 'GET') {
      if (!subResource) {
        // GET /api/{resource}
        // Build PostgREST query parameters
        const postgRestParams = [];
        let limit = 100;
        let offset = 0;

        queryParams.forEach((value, key) => {
          if (key === 'limit') {
            limit = Number(value) || 100;
          } else if (key === 'offset') {
            offset = Number(value) || 0;
          } else {
            postgRestParams.push(`${key}=eq.${value}`);
          }
        });

        postgRestParams.push(`limit=${limit}`);
        postgRestParams.push(`offset=${offset}`);

        const records = await getRecords(dbTable, postgRestParams.join('&'));

        // Sort by id or created_at desc by default to match SQLite behavior
        const sorted = records.sort((a, b) => {
          if (b.id && a.id) return b.id - a.id;
          if (b.created_at && a.created_at) return new Date(b.created_at) - new Date(a.created_at);
          return 0;
        });

        return mockResponse(sorted);
      } else {
        // GET /api/{resource}/{id}
        const records = await getRecords(dbTable, `id=eq.${subResource}`);
        if (records && records.length > 0) {
          return mockResponse(records[0]);
        }
        return mockResponse({ error: 'Record not found' }, 404);
      }
    }

    if (method === 'POST') {
      const payload = options.body ? JSON.parse(options.body) : {};
      const res = await postRecord(dbTable, payload);
      const data = await res.json().catch(() => ({}));
      const created = Array.isArray(data) ? data[0] : data;
      return mockResponse(created, res.status);
    }

    if (method === 'PUT' || method === 'PATCH') {
      const payload = options.body ? JSON.parse(options.body) : {};
      const res = await patchRecord(dbTable, `id=eq.${subResource}`, payload);
      const data = await res.json().catch(() => ({}));
      const updated = Array.isArray(data) ? data[0] : data;
      return mockResponse(updated, res.status);
    }

    if (method === 'DELETE') {
      const res = await deleteRecord(dbTable, `id=eq.${subResource}`);
      return mockResponse(null, res.status);
    }

    return mockResponse({ error: 'Method not supported' }, 405);
  };
}

export async function loginAdmin(email, password) {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(email || '').trim().toLowerCase(),
        password,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.token) {
      const mockRes = {
        ok: true,
        status: 200,
        json: async () => ({ success: true, token: data.token })
      };
      return { response: mockRes, data: { success: true, token: data.token } };
    } else {
      const mockRes = {
        ok: false,
        status: res.status,
        json: async () => ({ error: data.error || 'Authentication failed' })
      };
      return { response: mockRes, data: { error: data.error || 'Authentication failed' } };
    }
  } catch (e) {
    const errorData = { error: e.message };
    const mockRes = {
      ok: false,
      status: 500,
      json: async () => errorData
    };
    return { response: mockRes, data: errorData };
  }
}


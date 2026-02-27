import html2pdf from 'html2pdf.js';
import { CLINIC } from './clinic-branding';

const fmt = (n) => Number(n || 0).toLocaleString();

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const HEADER_HTML = `
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:18px;border-bottom:3px solid #7FD856;">
    <div style="flex:1;">
      <img src="${CLINIC.logoUrl}" alt="${CLINIC.name}" style="height:65px;display:block;" crossorigin="anonymous">
      <p style="margin:6px 0 0 0;font-size:11px;color:#6b7280;">${CLINIC.tagline}</p>
    </div>
    <div style="flex:1;text-align:right;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#0F0F0F;">${CLINIC.name}</p>
      <p style="margin:2px 0 0 0;font-size:11px;color:#6b7280;">${CLINIC.address}</p>
      <p style="margin:2px 0 0 0;font-size:11px;color:#6b7280;">Tel: ${CLINIC.phone}</p>
      <p style="margin:2px 0 0 0;font-size:11px;color:#6b7280;">Email: ${CLINIC.email}</p>
    </div>
  </div>
`;

const FOOTER_HTML = `
  <div style="margin-top:40px;padding-top:18px;border-top:2px solid #7FD856;text-align:center;">
    <p style="margin:0 0 4px 0;font-size:13px;font-weight:600;color:#0F0F0F;">Thank you for choosing ${CLINIC.name}!</p>
    <p style="margin:0;font-size:10px;color:#9ca3af;">${CLINIC.address} &bull; Tel: ${CLINIC.phone} &bull; Email: ${CLINIC.email}</p>
  </div>
`;

const WRAPPER_STYLE = `padding:40px;font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:0 auto;background:white;color:#1f2937;`;

function generatePdf(html, filename) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.innerHTML = html;

  const opt = {
    margin: 5,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, allowTaint: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  return html2pdf()
    .set(opt)
    .from(container)
    .save()
    .then(() => document.body.removeChild(container))
    .catch((err) => {
      console.error('PDF generation failed:', err);
      document.body.removeChild(container);
    });
}

// ─── INVOICE PDF ──────────────────────────────────────────────
export function generateInvoicePdf({ invoice, patient, payments = [], treatments = [] }) {
  const totalAmount = Number(invoice.total_amount) || 0;
  const discount = Number(invoice.discount) || 0;
  const tax = Number(invoice.tax) || 0;
  const netTotal = totalAmount - discount + tax;
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const balance = netTotal - totalPaid;

  let itemsHtml = '';
  if (treatments.length > 0) {
    treatments.forEach((t) => {
      itemsHtml += `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${t.treatment_name || 'Treatment'}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${t.quantity || 1}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">UGX ${fmt(t.price || t.cost || 0)}</td>
        </tr>`;
    });
  } else {
    itemsHtml = `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">Dental Services</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">1</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">UGX ${fmt(totalAmount)}</td>
      </tr>`;
  }

  let paymentsHtml = '';
  if (payments.length > 0) {
    payments.forEach((p) => {
      paymentsHtml += `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${formatDate(p.paid_at)}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;">${p.payment_method || '—'}</td>
          <td style="padding:8px;border-bottom:1px solid #f3f4f6;text-align:right;">UGX ${fmt(p.amount)}</td>
        </tr>`;
    });
  }

  const html = `
    <div style="${WRAPPER_STYLE}">
      ${HEADER_HTML}

      <!-- Title -->
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="margin:0 0 4px 0;font-size:26px;font-weight:700;color:#0F0F0F;letter-spacing:2px;">INVOICE</h1>
        <p style="margin:0;font-size:13px;color:#6b7280;">INV-${invoice.id} &bull; ${formatDate(invoice.created_at)}</p>
        <span style="display:inline-block;margin-top:8px;padding:3px 14px;border-radius:20px;font-size:11px;font-weight:600;
          background:${balance <= 0 ? '#dcfce7' : '#fef3c7'};color:${balance <= 0 ? '#15803d' : '#b45309'};">
          ${balance <= 0 ? 'PAID' : invoice.status || 'PENDING'}
        </span>
      </div>

      <!-- Bill To -->
      <div style="background:#f9fafb;padding:16px 20px;border-radius:10px;border-left:4px solid #7FD856;margin-bottom:24px;">
        <p style="margin:0 0 6px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Bill To</p>
        <p style="margin:0 0 3px 0;font-size:15px;font-weight:600;color:#0F0F0F;">${patient?.full_name || 'N/A'}</p>
        ${patient?.phone ? `<p style="margin:0 0 2px 0;font-size:12px;color:#4b5563;">${patient.phone}</p>` : ''}
        ${patient?.email ? `<p style="margin:0;font-size:12px;color:#6b7280;">${patient.email}</p>` : ''}
      </div>

      <!-- Items Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#7FD856;">
            <th style="padding:10px 8px;text-align:left;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
            <th style="padding:10px 8px;text-align:center;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
            <th style="padding:10px 8px;text-align:right;color:#0F0F0F;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Amount (UGX)</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;">
        <div style="width:280px;">
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Subtotal</span>
            <span style="color:#0F0F0F;font-size:12px;font-weight:500;">UGX ${fmt(totalAmount)}</span>
          </div>
          ${discount > 0 ? `
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Discount</span>
            <span style="color:#16a34a;font-size:12px;font-weight:500;">-UGX ${fmt(discount)}</span>
          </div>` : ''}
          ${tax > 0 ? `
          <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Tax</span>
            <span style="color:#0F0F0F;font-size:12px;font-weight:500;">UGX ${fmt(tax)}</span>
          </div>` : ''}
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#7FD856;border-radius:8px;margin-top:8px;">
            <span style="color:#0F0F0F;font-size:13px;font-weight:700;">Total Due</span>
            <span style="color:#0F0F0F;font-size:15px;font-weight:700;">UGX ${fmt(netTotal)}</span>
          </div>
          ${totalPaid > 0 ? `
          <div style="display:flex;justify-content:space-between;padding:7px 0;margin-top:6px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#4b5563;font-size:12px;">Amount Paid</span>
            <span style="color:#16a34a;font-size:12px;font-weight:500;">UGX ${fmt(totalPaid)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:${balance <= 0 ? '#dcfce7' : '#fef3c7'};border-radius:8px;margin-top:6px;">
            <span style="color:#0F0F0F;font-size:13px;font-weight:700;">${balance <= 0 ? 'Paid in Full' : 'Balance Due'}</span>
            <span style="color:${balance <= 0 ? '#15803d' : '#b45309'};font-size:15px;font-weight:700;">UGX ${fmt(Math.abs(balance))}</span>
          </div>` : ''}
        </div>
      </div>

      <!-- Payment History -->
      ${payments.length > 0 ? `
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 10px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Payment History</p>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:7px 8px;text-align:left;font-size:10px;color:#6b7280;text-transform:uppercase;">Date</th>
              <th style="padding:7px 8px;text-align:left;font-size:10px;color:#6b7280;text-transform:uppercase;">Method</th>
              <th style="padding:7px 8px;text-align:right;font-size:10px;color:#6b7280;text-transform:uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>${paymentsHtml}</tbody>
        </table>
      </div>` : ''}

      ${FOOTER_HTML}
    </div>`;

  return generatePdf(html, `Invoice-INV-${invoice.id}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── RECEIPT PDF ──────────────────────────────────────────────
export function generateReceiptPdf({ payment, invoice, patient, allPayments = [] }) {
  const invoiceTotal = invoice
    ? (Number(invoice.total_amount) || 0) - (Number(invoice.discount) || 0) + (Number(invoice.tax) || 0)
    : 0;
  const totalPaid = allPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const balance = invoiceTotal - totalPaid;

  const html = `
    <div style="${WRAPPER_STYLE}">
      ${HEADER_HTML}

      <!-- Title -->
      <div style="text-align:center;margin-bottom:28px;">
        <h1 style="margin:0 0 4px 0;font-size:26px;font-weight:700;color:#0F0F0F;letter-spacing:2px;">RECEIPT</h1>
        <p style="margin:0;font-size:13px;color:#6b7280;">RCP-${payment.id} &bull; ${formatDate(payment.paid_at)}</p>
      </div>

      <!-- Received From -->
      <div style="background:#f9fafb;padding:16px 20px;border-radius:10px;border-left:4px solid #7FD856;margin-bottom:24px;">
        <p style="margin:0 0 6px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Received From</p>
        <p style="margin:0 0 3px 0;font-size:15px;font-weight:600;color:#0F0F0F;">${patient?.full_name || 'N/A'}</p>
        ${patient?.phone ? `<p style="margin:0 0 2px 0;font-size:12px;color:#4b5563;">${patient.phone}</p>` : ''}
        ${patient?.email ? `<p style="margin:0;font-size:12px;color:#6b7280;">${patient.email}</p>` : ''}
      </div>

      <!-- Amount Box -->
      <div style="background:linear-gradient(135deg,#7FD856 0%,#5ab844 100%);padding:28px;border-radius:14px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:1.5px;">Amount Received</p>
        <p style="margin:0;font-size:38px;font-weight:700;color:white;">UGX ${fmt(payment.amount)}</p>
      </div>

      <!-- Payment Details -->
      <div style="background:#f9fafb;padding:18px 20px;border-radius:10px;margin-bottom:24px;">
        <p style="margin:0 0 12px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Payment Details</p>
        <table style="width:100%;">
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280;font-size:12px;">Payment Method</span>
            </td>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
              <span style="color:#0F0F0F;font-size:12px;font-weight:600;">${payment.payment_method || 'N/A'}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280;font-size:12px;">Invoice Reference</span>
            </td>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
              <span style="color:#0F0F0F;font-size:12px;font-weight:600;">INV-${payment.invoice_id}</span>
            </td>
          </tr>
          ${invoice ? `
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280;font-size:12px;">Invoice Total</span>
            </td>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
              <span style="color:#0F0F0F;font-size:12px;font-weight:500;">UGX ${fmt(invoiceTotal)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280;font-size:12px;">Total Paid to Date</span>
            </td>
            <td style="padding:7px 0;border-bottom:1px solid #e5e7eb;text-align:right;">
              <span style="color:#16a34a;font-size:12px;font-weight:600;">UGX ${fmt(totalPaid)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;">
              <span style="color:#0F0F0F;font-size:13px;font-weight:700;">Balance After Payment</span>
            </td>
            <td style="padding:10px 0;text-align:right;">
              <span style="color:${balance <= 0 ? '#15803d' : '#b45309'};font-size:15px;font-weight:700;">
                ${balance <= 0 ? 'PAID IN FULL' : 'UGX ' + fmt(balance)}
              </span>
            </td>
          </tr>` : ''}
        </table>
      </div>

      ${FOOTER_HTML}
    </div>`;

  return generatePdf(html, `Receipt-RCP-${payment.id}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── FINANCIAL REPORT PDF ─────────────────────────────────────
export function generateReportPdf({ title, period, data, columns, summary }) {
  let rowsHtml = '';
  (data || []).forEach((row) => {
    rowsHtml += '<tr>';
    columns.forEach((col) => {
      const val = col.render ? col.render(row) : (row[col.key] ?? '—');
      rowsHtml += `<td style="padding:8px;border-bottom:1px solid #f3f4f6;font-size:12px;color:#374151;text-align:${col.align || 'left'};">${val}</td>`;
    });
    rowsHtml += '</tr>';
  });

  let summaryHtml = '';
  if (summary && summary.length > 0) {
    summary.forEach((item) => {
      summaryHtml += `
        <div style="flex:1;background:${item.bg || '#f9fafb'};padding:14px 18px;border-radius:10px;text-align:center;border:1px solid ${item.border || '#e5e7eb'};">
          <p style="margin:0 0 4px 0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">${item.label}</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:${item.color || '#0F0F0F'};">${item.value}</p>
        </div>`;
    });
  }

  const html = `
    <div style="${WRAPPER_STYLE}">
      ${HEADER_HTML}

      <!-- Title -->
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="margin:0 0 4px 0;font-size:22px;font-weight:700;color:#0F0F0F;">${title}</h1>
        ${period ? `<p style="margin:0;font-size:12px;color:#6b7280;">${period}</p>` : ''}
        <p style="margin:4px 0 0 0;font-size:11px;color:#9ca3af;">Generated: ${formatDate(new Date().toISOString())}</p>
      </div>

      <!-- Summary Cards -->
      ${summaryHtml ? `<div style="display:flex;gap:12px;margin-bottom:24px;">${summaryHtml}</div>` : ''}

      <!-- Data Table -->
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#7FD856;">
            ${columns.map((col) => `<th style="padding:10px 8px;text-align:${col.align || 'left'};color:#0F0F0F;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      ${FOOTER_HTML}
    </div>`;

  const safeName = title.replace(/[^a-zA-Z0-9]/g, '-');
  return generatePdf(html, `${safeName}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

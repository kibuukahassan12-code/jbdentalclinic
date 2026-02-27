import React, { useEffect } from 'react';
import { CLINIC } from '@/lib/clinic-branding';
import { Download } from 'lucide-react';

/**
 * Printable invoice with JB Dental branding.
 * Professional layout optimized for PDF export.
 */
export default function InvoicePrint({ invoice, patient, payments = [], onClose, autoPrint = true }) {
  const netTotal = (Number(invoice?.total_amount) || 0) - (Number(invoice?.discount) || 0) + (Number(invoice?.tax) || 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const balance = netTotal - totalPaid;

  useEffect(() => {
    if (autoPrint) window.print();
  }, [autoPrint]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white text-black p-8 max-w-2xl mx-auto font-sans print:p-4 print:max-w-none">
      {/* Header with Clinic Branding - Centered */}
      <div className="text-center border-b-2 border-[#7FD856] pb-6 mb-8">
        <img
          src={CLINIC.logoUrl}
          alt={CLINIC.name}
          className="h-16 w-auto object-contain mx-auto mb-3"
        />
        <h1 className="text-2xl font-bold text-[#0F0F0F] mb-1">{CLINIC.name}</h1>
        <p className="text-sm text-gray-700 font-medium">{CLINIC.tagline}</p>
        <p className="text-xs text-gray-600 mt-3">{CLINIC.address}</p>
        <p className="text-xs text-gray-600">
          Tel: {CLINIC.phone} • Email: {CLINIC.email}
        </p>
      </div>

      {/* Invoice Title and Details */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-[#0F0F0F] uppercase tracking-wide mb-2">Tax Invoice</h2>
        <div className="flex justify-center gap-8 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Invoice No.</p>
            <p className="font-semibold">INV-{invoice?.id || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Date</p>
            <p className="font-semibold">{formatDate(invoice?.created_at)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Status</p>
            <p className={`font-semibold ${balance <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {balance <= 0 ? 'PAID' : 'PENDING'}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Bill To</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 text-xs">Patient Name</p>
            <p className="font-semibold text-[#0F0F0F]">{patient?.full_name || '—'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Phone</p>
            <p className="font-medium">{patient?.phone || '—'}</p>
          </div>
          {patient?.email && (
            <div className="col-span-2">
              <p className="text-gray-600 text-xs">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Items Table */}
      <table className="w-full text-sm border-collapse mb-6">
        <thead>
          <tr className="bg-[#7FD856]/10">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Description</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Amount (UGX)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-3 px-4">Dental Services</td>
            <td className="text-right py-3 px-4">UGX {(Number(invoice?.total_amount) || 0).toLocaleString()}</td>
          </tr>
          {(Number(invoice?.discount) || 0) > 0 && (
            <tr className="border-b border-gray-100">
              <td className="py-2 px-4 text-gray-600">Discount</td>
              <td className="text-right py-2 px-4 text-green-600">-UGX {(Number(invoice?.discount) || 0).toLocaleString()}</td>
            </tr>
          )}
          {(Number(invoice?.tax) || 0) > 0 && (
            <tr className="border-b border-gray-100">
              <td className="py-2 px-4 text-gray-600">Tax</td>
              <td className="text-right py-2 px-4">UGX {(Number(invoice?.tax) || 0).toLocaleString()}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-b-2 border-[#7FD856]">
            <td className="py-4 px-4 font-bold text-[#0F0F0F]">Total Amount Due</td>
            <td className="text-right py-4 px-4 font-bold text-lg text-[#0F0F0F]">UGX {netTotal.toLocaleString()}</td>
          </tr>
          {totalPaid > 0 && (
            <>
              <tr>
                <td className="py-2 px-4 text-gray-600">Amount Paid</td>
                <td className="text-right py-2 px-4 text-green-600">UGX {totalPaid.toLocaleString()}</td>
              </tr>
              <tr className="border-t-2 border-[#7FD856]">
                <td className="py-3 px-4 font-bold text-[#0F0F0F]">Balance Due</td>
                <td className="text-right py-3 px-4 font-bold text-lg text-orange-600">UGX {balance.toLocaleString()}</td>
              </tr>
            </>
          )}
        </tfoot>
      </table>

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Payment History</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-600 text-xs">Date</th>
                <th className="text-left py-2 px-2 font-medium text-gray-600 text-xs">Method</th>
                <th className="text-right py-2 px-2 font-medium text-gray-600 text-xs">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 px-2 text-gray-600">{formatDate(payment.paid_at || payment.created_at)}</td>
                  <td className="py-2 px-2 text-gray-600">{payment.payment_method || '—'}</td>
                  <td className="text-right py-2 px-2">UGX {Number(payment.amount || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Thank you for choosing {CLINIC.name}!</p>
        <p className="text-xs text-gray-400">{CLINIC.address} • Tel: {CLINIC.phone}</p>
      </div>

      {/* Action Buttons */}
      {onClose && (
        <div className="flex justify-center gap-3 mt-8 print:hidden">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7FD856] text-black rounded-lg text-sm font-semibold hover:bg-[#6FC745] transition-colors"
          >
            <Download size={18} />
            Save as PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

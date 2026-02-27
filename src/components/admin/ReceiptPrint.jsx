import React, { useEffect } from 'react';
import { CLINIC } from '@/lib/clinic-branding';
import { Download } from 'lucide-react';

/**
 * Printable receipt with JB Dental branding.
 * Professional layout optimized for PDF export.
 */
export default function ReceiptPrint({ payment, invoice, patient, onClose, autoPrint = true }) {
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
    <div className="bg-white text-black p-8 max-w-xl mx-auto font-sans print:p-4 print:max-w-none">
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

      {/* Receipt Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-[#0F0F0F] uppercase tracking-wide mb-2">Payment Receipt</h2>
        <div className="flex justify-center gap-8 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Receipt No.</p>
            <p className="font-semibold">RCP-{payment?.id || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Date</p>
            <p className="font-semibold">{formatDate(payment?.paid_at || payment?.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Payment Details Box */}
      <div className="border-2 border-[#7FD856] rounded-lg p-6 mb-6 bg-[#7FD856]/5">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-wide">Invoice Number</p>
            <p className="font-semibold text-[#0F0F0F]">INV-{payment?.invoice_id || invoice?.id || '—'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-wide">Payment Method</p>
            <p className="font-medium text-[#0F0F0F]">{payment?.payment_method || '—'}</p>
          </div>
        </div>

        <div className="border-t border-[#7FD856]/30 pt-4">
          <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Amount Received</p>
          <p className="text-3xl font-bold text-[#0F0F0F]">
            UGX {Number(payment?.amount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">Received From</p>
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

      {/* Balance Info */}
      {invoice && (() => {
        const invoiceTotal = (Number(invoice.total_amount) || 0) - (Number(invoice.discount) || 0) + (Number(invoice.tax) || 0);
        const amountPaid = Number(payment?.amount) || 0;
        const balanceAfter = invoiceTotal - amountPaid;
        return (
          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-6">
            <div>
              <p className="text-gray-600 text-xs">Invoice Total</p>
              <p className="font-semibold">UGX {invoiceTotal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-xs">Balance After Payment</p>
              <p className={`font-semibold ${balanceAfter <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                UGX {balanceAfter.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-[#0F0F0F] mb-2">Thank you for your payment!</p>
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

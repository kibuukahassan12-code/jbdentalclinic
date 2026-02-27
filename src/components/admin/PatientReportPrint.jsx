import React, { useEffect } from 'react';
import { CLINIC } from '@/lib/clinic-branding';

/**
 * Printable patient report with JB Dental branding. Use "Print / Save as PDF" to download as PDF.
 */
export default function PatientReportPrint({ report, patient, doctor, onClose, autoPrint = true }) {
  useEffect(() => {
    if (autoPrint) window.print();
  }, [autoPrint]);

  return (
    <div className="bg-white text-black p-8 max-w-2xl mx-auto font-sans print:p-0">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
        <div>

          <p className="text-sm text-gray-600">{CLINIC.tagline}</p>
          <p className="text-xs text-gray-500 mt-1">{CLINIC.address}</p>
          <p className="text-xs text-gray-500">{CLINIC.phone} · {CLINIC.email}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-[#0F0F0F]">PATIENT REPORT</h1>
          <p className="text-sm text-gray-600">Report #{report?.id}</p>
          <p className="text-xs text-gray-500 mt-2">Date: {(report?.report_date || report?.created_at || '').slice(0, 10)}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Patient</p>
        <p className="font-semibold">{patient?.full_name || '—'}</p>
        {patient?.phone && <p className="text-sm text-gray-600">{patient.phone}</p>}
        {patient?.email && <p className="text-sm text-gray-600">{patient.email}</p>}
        {doctor?.full_name && (
          <p className="text-sm text-gray-600 mt-2">Attending: {doctor.full_name}{doctor.role ? ` (${doctor.role})` : ''}</p>
        )}
      </div>

      <div className="space-y-4 text-sm">
        {report?.chief_complaint && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Chief complaint</p>
            <p className="whitespace-pre-wrap">{report.chief_complaint}</p>
          </div>
        )}
        {report?.clinical_findings && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Clinical findings</p>
            <p className="whitespace-pre-wrap">{report.clinical_findings}</p>
          </div>
        )}
        {report?.diagnosis && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Diagnosis</p>
            <p className="whitespace-pre-wrap">{report.diagnosis}</p>
          </div>
        )}
        {report?.treatment_plan && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Treatment plan</p>
            <p className="whitespace-pre-wrap">{report.treatment_plan}</p>
          </div>
        )}
        {report?.notes && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</p>
            <p className="whitespace-pre-wrap">{report.notes}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-8">Confidential. {CLINIC.name} · {CLINIC.phone}</p>
      {onClose && (
        <button type="button" onClick={onClose} className="mt-6 px-4 py-2 bg-gray-200 rounded-lg text-sm print:hidden">
          Close
        </button>
      )}
    </div>
  );
}

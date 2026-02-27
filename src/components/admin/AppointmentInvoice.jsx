import React, { useEffect } from 'react';
import { CLINIC } from '@/lib/clinic-branding';

/**
 * Appointment Confirmation Invoice/Receipt with JB Dental branding
 * Automatically generated when appointment is created
 */
export default function AppointmentInvoice({
    appointment,
    patient,
    payment = null,
    invoice = null,
    onClose,
    autoPrint = false
}) {
    useEffect(() => {
        if (autoPrint) {
            setTimeout(() => window.print(), 500);
        }
    }, [autoPrint]);

    const appointmentFee = payment?.amount || invoice?.total_amount || 0;
    const isPaid = payment && Number(payment.amount) > 0;

    return (
        <div className="bg-white text-black p-8 max-w-2xl mx-auto font-sans print:p-4">
            {/* Header with Clinic Branding */}
            <div className="text-center border-b-2 border-[#7FD856] pb-6 mb-6">
                <img
                    src={CLINIC.logoUrl}
                    alt={CLINIC.name}
                    className="h-20 w-auto object-contain mx-auto mb-3"
                />
                <h1 className="text-2xl font-bold text-[#0F0F0F] mb-1">{CLINIC.name}</h1>
                <p className="text-sm text-gray-700 font-medium">{CLINIC.tagline}</p>
                <p className="text-xs text-gray-600 mt-2">{CLINIC.address}</p>
                <p className="text-xs text-gray-600">
                    📞 {CLINIC.phone} · 📧 {CLINIC.email}
                </p>
            </div>

            {/* Document Type */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#0F0F0F] uppercase tracking-wide">
                    {isPaid ? 'Appointment Receipt' : 'Appointment Confirmation'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    Document #{appointment?.id || invoice?.id || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                    Date: {new Date().toLocaleDateString('en-GB')}
                </p>
            </div>

            {/* Patient Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Patient Details</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-600 text-xs">Name</p>
                        <p className="font-semibold">{appointment?.patient_name || patient?.full_name || '—'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-xs">Phone</p>
                        <p className="font-medium">{appointment?.patient_phone || patient?.phone || '—'}</p>
                    </div>
                    {patient?.email && (
                        <div className="col-span-2">
                            <p className="text-gray-600 text-xs">Email</p>
                            <p className="font-medium">{patient.email}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Appointment Details */}
            <div className="border-2 border-[#7FD856] rounded-lg p-4 mb-6 bg-[#7FD856]/5">
                <p className="text-xs text-gray-700 uppercase tracking-wide mb-3 font-semibold">
                    🦷 Appointment Details
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600 text-xs mb-1">📅 Date</p>
                        <p className="font-bold text-lg text-[#0F0F0F]">
                            {appointment?.appointment_date || '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-xs mb-1">⏰ Time</p>
                        <p className="font-bold text-lg text-[#0F0F0F]">
                            {appointment?.appointment_time || '—'}
                        </p>
                    </div>
                    {appointment?.service && (
                        <div className="col-span-2">
                            <p className="text-gray-600 text-xs mb-1">Service</p>
                            <p className="font-medium">{appointment.service}</p>
                        </div>
                    )}
                    {appointment?.notes && (
                        <div className="col-span-2">
                            <p className="text-gray-600 text-xs mb-1">Notes</p>
                            <p className="text-sm text-gray-700">{appointment.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Summary */}
            {(isPaid || appointmentFee > 0) && (
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Payment Summary</p>
                    <table className="w-full text-sm">
                        <tbody>
                            {invoice && (
                                <>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-2 text-gray-600">Service Fee</td>
                                        <td className="text-right py-2">
                                            UGX {(Number(invoice.total_amount) || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                    {Number(invoice.discount || 0) > 0 && (
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2 text-gray-600">Discount</td>
                                            <td className="text-right py-2 text-green-600">
                                                -UGX {Number(invoice.discount).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}
                                    {Number(invoice.tax || 0) > 0 && (
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2 text-gray-600">Tax</td>
                                            <td className="text-right py-2">
                                                UGX {Number(invoice.tax).toLocaleString()}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                            {isPaid && (
                                <tr className="border-t-2 border-gray-300">
                                    <td className="py-3 font-bold text-[#0F0F0F]">Amount Paid</td>
                                    <td className="text-right py-3 font-bold text-lg text-[#7FD856]">
                                        UGX {Number(payment.amount).toLocaleString()}
                                    </td>
                                </tr>
                            )}
                            {!isPaid && appointmentFee > 0 && (
                                <tr className="border-t-2 border-gray-300">
                                    <td className="py-3 font-bold text-[#0F0F0F]">Booking Fee</td>
                                    <td className="text-right py-3 font-bold text-lg">
                                        UGX {Number(appointmentFee).toLocaleString()}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {isPaid && payment && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                            <p>Payment Method: <span className="font-medium">{payment.payment_method}</span></p>
                            <p>Payment Date: <span className="font-medium">{payment.paid_at?.slice(0, 10)}</span></p>
                            {payment.id && <p>Receipt #: <span className="font-medium">{payment.id}</span></p>}
                        </div>
                    )}
                </div>
            )}

            {/* Thank You Message */}
            <div className="bg-[#7FD856]/10 border-l-4 border-[#7FD856] rounded p-4 mb-6">
                <p className="text-sm font-semibold text-[#0F0F0F] mb-2">
                    ✨ Thank you for choosing {CLINIC.name}!
                </p>
                <p className="text-xs text-gray-700">
                    We are proud to serve you and look forward to providing excellent dental care.
                    Please arrive 10 minutes before your appointment time.
                </p>
                <p className="text-xs text-gray-700 mt-2">
                    You will receive WhatsApp reminder messages before your appointment.
                </p>
            </div>

            {/* Important Notes */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-xs text-gray-600">
                <p className="font-semibold mb-2">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Please bring this confirmation with you to your appointment</li>
                    <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
                    <li>Cancellation policy: 24 hours notice required</li>
                </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-4 text-center">
                <p className="text-xs text-gray-500">
                    {CLINIC.name} · {CLINIC.address}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Tel: {CLINIC.phone} · Email: {CLINIC.email}
                </p>
                <p className="text-xs text-[#7FD856] font-semibold mt-2">
                    Your smile is our priority! 🦷
                </p>
            </div>

            {/* Print Buttons (hidden when printing) */}
            {onClose && (
                <div className="flex gap-3 justify-center mt-6 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-[#7FD856] text-black font-semibold rounded-lg hover:bg-[#6FC745] transition-colors"
                    >
                        📄 Print / Save PDF
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
